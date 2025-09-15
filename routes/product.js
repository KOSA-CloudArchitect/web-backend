const express = require('express');
const router = express.Router();
const db = require('../db');
const axios = require('axios');
const Redis = require('ioredis');

// Redis 클라이언트 초기화
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

// Redis 연결 이벤트 핸들러
redis.on('connect', () => {
  console.log('Redis 연결 성공');});

redis.on('error', (err) => {
  console.error('Redis 연결 오류:', err);
});

// Redis 락 함수
async function acquireCrawlLock(keyword) {
  const key = `crawl:${keyword.toLowerCase()}`;
  try {
    const result = await redis.set(key, '1', 'NX', 'EX', 300); // 5분 동안 락 유지
    return result === 'OK';
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

// 상품 리스트 조회 (카테고리/검색어/페이지네이션)
// 상품 검색
router.get('/', async (req, res) => {
  try {
    let { q, query, page = 1, page_size = 20 } = req.query;
    
    // 디버깅을 위한 로그
    console.log('원본 쿼리 파라미터:', { q, query, page, page_size });
    
    if (q === 'undefined') q = '';
    if (query === 'undefined') query = '';
    
    const searchTerm = (q || query || '').trim();
    console.log('정규화된 검색어:', searchTerm);
    

    
    let sql;
    let params = [];
    
    if (searchTerm) {
      // name 컬럼에만 검색어가 포함된 상품만 조회
      sql = `
        SELECT * FROM product
        WHERE name IS NOT NULL AND LOWER(name) LIKE LOWER($1)
      `;
      params.push(`%${searchTerm}%`);
    } else {
      sql = 'SELECT * FROM product';
    }
    
    sql += ' ORDER BY id DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(Number(page_size), (Number(page) - 1) * Number(page_size));
    
    console.log('최종 SQL:', sql);
    console.log('파라미터:', params);
    
    const result = await db.query(sql, params);
    console.log('조회된 상품 수:', result.rows.length);
    
    res.json({ 
      products: result.rows,
      total: result.rows.length,
      searchTerm: searchTerm || null
    });
  } catch (error) {
    console.error('상품 조회 에러:', error);
    res.status(500).json({ error: '상품 조회 실패' });
  }
});

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

module.exports = router; 