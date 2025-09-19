const express = require('express');
const router = express.Router();
const axios = require('axios');
const { MongoClient } = require('mongodb');
const { cacheService } = require('../services/cacheService');
const { normalizeItem } = require('../utils/normalize');
const { connectMongoDB } = require('../config/mongodb');
const websocketService = require('../services/websocketService');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: 상품 관련 API
 */

// Redis 락 함수 (cacheService를 통해 구현)
async function acquireCrawlLock(keyword) {
  const key = `crawl:${keyword.toLowerCase()}`;
  try {
    const lockAcquired = await cacheService.redis.set(key, '1', 300); // 5분 TTL
    return lockAcquired;
  } catch (err) {
    console.error('Redis 락 획득 실패:', err);
    return false;
  }
}

console.log('✅ Product 라우터가 로드되었습니다.');

// 크롤링 상태를 저장할 Map
const crawlingStatus = new Map();

// 모든 라우트에 대한 로깅 미들웨어
router.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('📝 요청 쿼리:', req.query);
  console.log('📝 요청 바디:', req.body);
  next();
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: 상품 목록 조회
 *     description: 검색어를 통해 상품 목록을 조회합니다. 페이지네이션을 지원합니다.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: 검색어
 *         example: 아이폰
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: 검색어 (q와 동일)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *           default: 20
 *         description: 페이지당 상품 수
 *     responses:
 *       200:
 *         description: 상품 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                   description: 조회된 상품 수
 *                 searchTerm:
 *                   type: string
 *                   description: 검색어
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: 상품 목록 조회
 *     description: 검색어를 통해 상품 목록을 조회합니다. 페이지네이션을 지원합니다.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: 검색어
 *         example: 아이폰
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: 검색어 (q와 동일)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *           default: 20
 *         description: 페이지당 상품 수
 *     responses:
 *       200:
 *         description: 상품 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                   description: 조회된 상품 수
 *                 searchTerm:
 *                   type: string
 *                   description: 검색어
 *                 fromCache:
 *                   type: boolean
 *                   description: 캐시에서 가져온 결과인지 여부
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// MongoDB 연결 보장 미들웨어
router.use(async (_req, _res, next) => {
  const db = await connectMongoDB();
  if (!db) {
    return _res.status(503).json({ error: 'MongoDB 연결 실패' });
  }
  next();
});

// 상품 검색 + 크롤링 (MongoDB 기반)
router.get('/', async (req, res) => {
  try {
    const { q, query, max_links = 10 } = req.query;
    const searchTerm = (q || query || '').trim();

    console.log('🔍 GET /api/products 요청:', { searchTerm, max_links });

    if (!searchTerm) {
      return res.status(400).json({ error: '검색어가 필요합니다.' });
    }

    // 1. Redis 캐시 확인
    console.log('🔍 Redis 캐시에서 검색 결과 확인 중...');
    const cachedResults = await cacheService.getSearchResults(searchTerm);
    
    if (cachedResults && cachedResults.results && cachedResults.results.products) {
      console.log(`✅ 캐시에서 검색 결과 발견: ${searchTerm} - ${cachedResults.totalCount}개 상품`);
      
      if (cachedResults.totalCount >= parseInt(max_links)) {
        const slicedProducts = cachedResults.results.products.slice(0, parseInt(max_links));
        
        return res.json({
          success: true,
          products: slicedProducts,
          total: slicedProducts.length,
          cached: true,
          cachedAt: cachedResults.cachedAt,
          source: 'redis_cache'
        });
      }
    }

    const db = await connectMongoDB();

    // 2. MongoDB에서 기존 데이터 확인
    console.log('📋 MongoDB에서 기존 데이터 조회 중...');
    const queryObj = { title: { $regex: new RegExp(escapeRegex(searchTerm), 'i') } };
    const existingProducts = await db.collection('products')
      .find(queryObj)
      .sort({ last_seen_at: -1 })
      .limit(parseInt(max_links))
      .toArray();

    console.log(`📋 기존 데이터: ${existingProducts.length}개 상품 발견`);

    // 3. 기존 데이터가 충분하지 않으면 크롤링 수행
    if (existingProducts.length < parseInt(max_links)) {
      console.log('📡 기존 데이터 부족, 크롤링 서버에 요청...');

      try {
        const crawlingServerUrl = process.env.CRAWLING_SERVER_URL || 'http://10.128.3.36:30800';
        const crawlingEndpoint = `${crawlingServerUrl}/info_list`;

        const response = await axios.post(
          crawlingEndpoint,
          { keyword: searchTerm, max_links: parseInt(max_links) },
          { 
            headers: { 'Content-Type': 'application/json' }, 
            timeout: parseInt(process.env.HTTP_TIMEOUT || '200000'),
            validateStatus: function (status) {
              return status < 600;
            }
          }
        );

        if (response.status === 504) {
          console.warn('⚠️ 크롤링 서버 Gateway Timeout (504) - 기존 데이터만 사용');
        } else if (response.data && response.data.info_list) {
          const newProducts = Array.isArray(response.data.info_list) ? response.data.info_list : [];
          console.log(`✅ 크롤링 완료: ${newProducts.length}개 상품 수집`);

          // 새로 수집된 상품을 MongoDB에 저장
          const normalized = newProducts.map(normalizeItem).filter(v => v.product_code && v.url);

          for (const item of normalized) {
            try {
              await db.collection('products').updateOne(
                { product_code: item.product_code },
                {
                  $set: {
                    title: item.title,
                    url: item.url,
                    image_url: item.image_url,
                    final_price: item.final_price,
                    origin_price: item.origin_price,
                    review_count: item.review_count,
                    review_rating: item.review_rating,
                    last_seen_at: new Date(),
                    updated_at: new Date(),
                  },
                },
                { upsert: true }
              );
            } catch (dbError) {
              console.error('❌ DB 저장 오류:', dbError);
            }
          }

          const allProducts = [...existingProducts, ...normalized];
          const formattedProducts = allProducts.map(product => ({
            id: product._id?.toString() || product.product_code,
            name: product.title || product.product_code,
            url: product.url,
            imageUrl: product.image_url,
            currentPrice: product.final_price ? parseFloat(product.final_price.replace(/[^0-9.]/g, '')) : null,
            originalPrice: product.origin_price ? parseFloat(product.origin_price.replace(/[^0-9.]/g, '')) : null,
            averageRating: product.review_rating ? parseFloat(product.review_rating) : null,
            totalReviews: product.review_count ? parseInt(product.review_count.replace(/[^0-9]/g, '')) : 0,
            productCode: product.product_code || null
          }));

          // Redis 캐시에 저장
          try {
            const searchResults = {
              query: searchTerm,
              products: allProducts,
              total: allProducts.length,
              timestamp: new Date().toISOString()
            };
            
            await cacheService.setSearchResults(searchTerm, searchResults);
            await cacheService.addPopularSearch(searchTerm);
          } catch (cacheError) {
            console.warn('⚠️ Redis 캐시 저장 실패:', cacheError);
          }

          return res.json({
            success: true,
            products: formattedProducts,
            message: `"${searchTerm}"에 대한 ${formattedProducts.length}개 상품을 찾았습니다.`,
            fromCache: false
          });
        }
      } catch (crawlError) {
        console.error('❌ 크롤링 실패:', crawlError);
      }
    }

    // 기존 데이터만 반환
    const formattedProducts = existingProducts.map(product => ({
      id: product._id?.toString() || product.product_code,
      name: product.title || product.product_code,
      url: product.url,
      imageUrl: product.image_url,
      currentPrice: product.final_price ? parseFloat(product.final_price.replace(/[^0-9.]/g, '')) : null,
      originalPrice: product.origin_price ? parseFloat(product.origin_price.replace(/[^0-9.]/g, '')) : null,
      averageRating: product.review_rating ? parseFloat(product.review_rating) : null,
      totalReviews: product.review_count ? parseInt(product.review_count.replace(/[^0-9]/g, '')) : 0,
      productCode: product.product_code || null
    }));

    res.json({
      success: true,
      products: formattedProducts,
      message: `"${searchTerm}"에 대한 ${formattedProducts.length}개 상품을 찾았습니다.`,
      fromCache: true
    });

  } catch (error) {
    console.error('❌ GET /api/products 에러:', error);
    res.status(500).json({ error: '상품 조회 중 오류가 발생했습니다.' });
  }
});

/**
 * @swagger
 * /api/products/count:
 *   get:
 *     summary: 상품 개수 조회
 *     description: 검색 조건에 맞는 상품의 총 개수를 조회합니다.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: 검색어
 *     responses:
 *       200:
 *         description: 상품 개수 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: 상품 총 개수
 *       500:
 *         description: 서버 오류
 */
// 상품 개수 조회
router.get('/count', async (req, res) => {
  try {
    const { q } = req.query;
    const searchTerm = (q || '').trim();

    let countSql;
    const params = [];

    if (searchTerm) {
      countSql = `SELECT COUNT(*) FROM product WHERE name IS NOT NULL AND LOWER(name) LIKE LOWER($1)`;
      params.push(`%${searchTerm}%`);
    } else {
      countSql = 'SELECT COUNT(*) FROM product';
    }

    const result = await db.query(countSql, params);
    const count = parseInt(result.rows[0].count, 10);

    res.json({ count });
  } catch (error) {
    console.error('상품 개수 조회 에러:', error);
    res.status(500).json({ error: '상품 개수 조회에 실패했습니다.' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: 상품 상세 조회
 *     description: 특정 상품의 상세 정보를 조회합니다.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 상품 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: 상품을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 서버 오류
 */
// 상품 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "product" WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('상품 상세 조회 에러:', error);
    res.status(500).json({ error: '상품 상세 조회 실패' });
  }
});

/**
 * @swagger
 * /api/products/search:
 *   post:
 *     summary: 상품 검색 (크롤링 포함)
 *     description: 키워드로 상품을 검색합니다. DB에 없는 경우 크롤링을 시작합니다.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - keyword
 *             properties:
 *               keyword:
 *                 type: string
 *                 description: 검색할 키워드
 *                 example: 아이폰 15
 *     responses:
 *       200:
 *         description: 검색 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fromCache:
 *                   type: boolean
 *                   description: 캐시에서 가져온 결과인지 여부
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   description: 크롤링 시작 메시지 (캐시에 없는 경우)
 *       400:
 *         description: 잘못된 요청 (검색어 누락)
 *       500:
 *         description: 서버 오류
 */
// 상품 검색 API (Redis 캐시 + 크롤링)
router.post('/search', async (req, res) => {
  try {
    const { keyword } = req.body;
    if (!keyword) {
      return res.status(400).json({ error: '검색어가 필요합니다.' });
    }

    // 1. 먼저 DB에서 검색
    const result = await db.query(
      `SELECT * FROM product WHERE LOWER(name) LIKE LOWER($1) ORDER BY id DESC LIMIT 20`,
      [`%${keyword}%`]
    );

    // 2. 결과가 있으면 즉시 반환
    if (result.rows.length > 0) {
      return res.json({ 
        fromCache: true, 
        products: result.rows 
      });
    }

    // 3. 결과가 없고 락을 획득한 경우에만 크롤링 시작
    const lockAcquired = await acquireCrawlLock(keyword);
    if (lockAcquired) {
      console.log(`[크롤링 시작] ${keyword}`);
      // 비동기로 크롤링 실행 (기존 crawl 엔드포인트 호출)
      try {
        await axios.post(process.env.CRAWLING_SERVER_URL || 'http://localhost:8001/crawl', {
          keyword,
          max_links: 10
        });
      } catch (err) {
        console.error('크롤링 서버 호출 오류:', err);
      }
    }

    res.json({ 
      fromCache: false,
      message: '크롤링이 시작되었습니다. 잠시 후 다시 검색해주세요.'
    });

  } catch (error) {
    console.error('검색 오류:', error);
    res.status(500).json({ error: '검색 중 오류가 발생했습니다.' });
  }
});

// 태그 기반 상품 조회
router.get('/by-tag', async (req, res) => {
  try {
    const { tag } = req.query;
    if (!tag) {
      return res.status(400).json({ error: '태그가 필요합니다.' });
    }

    const result = await db.query(
      `SELECT * FROM product WHERE tag = $1 ORDER BY id DESC LIMIT 50`,
      [tag]
    );

    res.json({ products: result.rows });
  } catch (error) {
    console.error('태그 조회 오류:', error);
    res.status(500).json({ error: '태그 조회 중 오류가 발생했습니다.' });
  }
});

// 기존 크롤링 요청 API (호환성을 위해 유지)
router.post('/crawl', async (req, res) => {
  try {
    const { productName } = req.body;
    if (!productName) {
      return res.status(400).json({ error: '상품명이 필요합니다.' });
    }

    // 크롤링 상태 초기화
    const crawlId = Date.now().toString();
    crawlingStatus.set(crawlId, {
      status: 'processing',
      progress: 0,
      message: '크롤링을 시작합니다...',
      products: []
    });

    // 비동기로 크롤링 실행
    crawlProducts(productName, crawlId);

    res.json({ 
      crawlId,
      message: '크롤링이 시작되었습니다.',
      status: 'processing'
    });
  } catch (error) {
    console.error('크롤링 요청 에러:', error);
    res.status(500).json({ error: '크롤링 요청 실패' });
  }
});

// 크롤링 상태 확인
router.get('/crawl/:crawlId', (req, res) => {
  const { crawlId } = req.params;
  const status = crawlingStatus.get(crawlId);
  
  if (!status) {
    return res.status(404).json({ error: '크롤링 작업을 찾을 수 없습니다.' });
  }

  res.json(status);
});

// 크롤링 실행 함수
async function crawlProducts(productName, crawlId) {
  try {
    console.log('[DEBUG] 크롤링 서버에 요청 전송:', productName);
    // 크롤링 서버에 요청
    const response = await axios.post(process.env.CRAWLING_SERVER_URL || 'http://localhost:8001/crawl', {
      keyword: productName,
      max_links: 10
    });

    console.log('[DEBUG] 크롤링 서버 응답:', response.data);

    // 크롤링된 상품들을 DB에 저장
    const products = response.data.products || [];
    if (products.length === 0) {
      throw new Error('크롤링된 상품이 없습니다.');
    }

    for (const product of products) {
      try {
        await db.query(
          `INSERT INTO "product" (
            name, 
            price, 
            original_price,
            image_url, 
            category_id,
            star_rating,
            review_count,
            product_code
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
          ON CONFLICT (product_code) DO UPDATE SET
            name = EXCLUDED.name,
            price = EXCLUDED.price,
            original_price = EXCLUDED.original_price,
            image_url = EXCLUDED.image_url,
            category_id = EXCLUDED.category_id,
            star_rating = EXCLUDED.star_rating,
            review_count = EXCLUDED.review_count`,
          [
            product.name,
            product.final_price,
            product.sales_price,
            product.image_url,
            product.category_id,
            product.star_rating,
            product.review_count,
            product.product_code
          ]
        );

        // 진행 상태 업데이트
        crawlingStatus.set(crawlId, {
          status: 'processing',
          progress: Math.floor((products.indexOf(product) + 1) / products.length * 100),
          message: `${products.indexOf(product) + 1}개의 상품 처리 중...`,
          products: products.slice(0, products.indexOf(product) + 1).map(p => ({
            id: p.product_code,
            name: p.name,
            price: p.final_price,
            originalPrice: p.sales_price,
            imageUrl: p.image_url,
            starRating: p.star_rating,
            reviewCount: p.review_count
          }))
        });
      } catch (dbError) {
        console.error('[DEBUG] DB 저장 중 오류:', dbError);
      }
    }

    // 크롤링 완료 상태로 업데이트
    crawlingStatus.set(crawlId, {
      status: 'completed',
      progress: 100,
      message: '크롤링이 완료되었습니다.',
      products: products.map(p => ({
        id: p.product_code,
        name: p.name,
        price: p.final_price,
        originalPrice: p.sales_price,
        imageUrl: p.image_url,
        starRating: p.star_rating,
        reviewCount: p.review_count
      }))
    });

    // 1시간 후 상태 정보 삭제
    setTimeout(() => {
      crawlingStatus.delete(crawlId);
    }, 3600000);

  } catch (error) {
    console.error('[DEBUG] 크롤링 실행 에러:', error);
    crawlingStatus.set(crawlId, {
      status: 'failed',
      progress: 0,
      message: `크롤링 중 오류가 발생했습니다: ${error.message}`,
      error: error.message
    });
  }
}

// escapeRegex 함수 추가
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = router; 
/**

 * @swagger
 * /api/products/popular-searches:
 *   get:
 *     summary: 인기 검색어 조회
 *     description: 최근 인기 검색어 목록을 조회합니다.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 조회할 검색어 수
 *     responses:
 *       200:
 *         description: 인기 검색어 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 searches:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       keyword:
 *                         type: string
 *                         description: 검색어
 *                       score:
 *                         type: integer
 *                         description: 검색 빈도
 *                 total:
 *                   type: integer
 *                   description: 총 검색어 수
 */
// 인기 검색어 조회
router.get('/popular-searches', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const searches = await cacheService.getPopularSearches(parseInt(limit));
    
    res.json({
      searches,
      total: searches.length
    });
  } catch (error) {
    console.error('인기 검색어 조회 에러:', error);
    res.status(500).json({ error: '인기 검색어 조회 실패' });
  }
});

/**
 * @swagger
 * /api/products/search-history:
 *   get:
 *     summary: 사용자 검색 기록 조회
 *     description: 로그인한 사용자의 최근 검색 기록을 조회합니다.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 조회할 검색 기록 수
 *     responses:
 *       200:
 *         description: 검색 기록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history:
 *                   type: array
 *                   items:
 *                     type: string
 *                 total:
 *                   type: integer
 *                   description: 총 검색 기록 수
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// 사용자 검색 기록 조회
router.get('/search-history', async (req, res) => {
  try {
    // 세션 확인
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ 
        error: '로그인이 필요합니다.',
        history: [],
        total: 0
      });
    }

    const { limit = 10 } = req.query;
    const history = await cacheService.getUserSearchHistory(req.session.userId, parseInt(limit));
    
    res.json({
      history,
      total: history.length
    });
  } catch (error) {
    console.error('검색 기록 조회 에러:', error);
    res.status(500).json({ error: '검색 기록 조회 실패' });
  }
});

/**
 * @swagger
 * /api/products/search-suggestions:
 *   get:
 *     summary: 검색 자동완성 제안
 *     description: 검색어 자동완성을 위한 제안 목록을 조회합니다.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: 검색어 일부
 *         example: 아이폰
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: 제안할 검색어 수
 *     responses:
 *       200:
 *         description: 검색 제안 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       keyword:
 *                         type: string
 *                         description: 제안 검색어
 *                       type:
 *                         type: string
 *                         enum: [popular, history]
 *                         description: 제안 유형
 *                       score:
 *                         type: integer
 *                         description: 관련도 점수
 *                 total:
 *                   type: integer
 */
// 검색 자동완성 제안
router.get('/search-suggestions', async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.json({ suggestions: [], total: 0 });
    }

    const searchTerm = q.trim().toLowerCase();
    const suggestions = [];

    // 1. 인기 검색어에서 매칭되는 항목 찾기
    const popularSearches = await cacheService.getPopularSearches(20);
    const popularMatches = popularSearches
      .filter(search => search.keyword.toLowerCase().includes(searchTerm))
      .slice(0, Math.floor(limit / 2))
      .map(search => ({
        keyword: search.keyword,
        type: 'popular',
        score: search.score
      }));

    suggestions.push(...popularMatches);

    // 2. 사용자 검색 기록에서 매칭되는 항목 찾기 (로그인한 경우)
    if (req.session && req.session.userId) {
      const userHistory = await cacheService.getUserSearchHistory(req.session.userId, 20);
      const historyMatches = userHistory
        .filter(keyword => keyword.toLowerCase().includes(searchTerm))
        .filter(keyword => !suggestions.some(s => s.keyword === keyword)) // 중복 제거
        .slice(0, limit - suggestions.length)
        .map(keyword => ({
          keyword,
          type: 'history',
          score: 1
        }));

      suggestions.push(...historyMatches);
    }

    // 3. 관련도 순으로 정렬
    suggestions.sort((a, b) => {
      // 정확히 시작하는 것을 우선
      const aStartsWith = a.keyword.toLowerCase().startsWith(searchTerm);
      const bStartsWith = b.keyword.toLowerCase().startsWith(searchTerm);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      // 그 다음은 점수 순
      return b.score - a.score;
    });

    res.json({
      suggestions: suggestions.slice(0, limit),
      total: suggestions.length
    });
  } catch (error) {
    console.error('검색 제안 조회 에러:', error);
    res.status(500).json({ error: '검색 제안 조회 실패' });
  }
});