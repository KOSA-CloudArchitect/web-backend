// routes/product.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { MongoClient } = require('mongodb');
const { cacheService } = require('../services/cacheService');
const { normalizeItem } = require('../utils/normalize');
const { connectMongoDB } = require('../config/mongodb');  // DB 연결 보장
const { saveBatchFromCrawler } = require('../services/nosql');  // 배치 저장
const websocketService = require('../services/websocketService');

// =========================
// MongoDB 연결 보장 미들웨어
// =========================
router.use(async (_req, _res, next) => {
  const db = await connectMongoDB(); // DB 연결 보장
  if (!db) {
    return _res.status(503).json({ error: 'MongoDB 연결 실패' });
  }
  next();  // 다음 미들웨어로 진행
});

// =========================
// GET /api/products (기존 데이터 조회 + 필요시 크롤링)
// =========================
router.get('/', async (req, res) => {
  try {
    const { q, query, max_links = 10 } = req.query;
    const searchTerm = (q || query || '').trim();

    console.log('🔍 GET /api/products 요청:', { searchTerm, max_links });

    if (!searchTerm) {
      return res.status(400).json({ error: '검색어가 필요합니다.' });
    }

    // 1. 먼저 Redis 캐시에서 검색 결과 확인
    console.log('🔍 Redis 캐시에서 검색 결과 확인 중...');
    const cachedResults = await cacheService.getSearchResults(searchTerm);
    
    if (cachedResults && cachedResults.results && cachedResults.results.products) {
      console.log(`✅ 캐시에서 검색 결과 발견: ${searchTerm} - ${cachedResults.totalCount}개 상품`);
      
      // 캐시된 결과가 충분하면 바로 반환
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
      } else {
        console.log(`⚠️ 캐시된 결과 부족: ${cachedResults.totalCount}개 < ${max_links}개, DB 및 크롤링 확인`);
      }
    } else {
      console.log('🔍 캐시에 검색 결과 없음, DB 확인');
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

    // 2. 기존 데이터가 충분하지 않으면 크롤링 수행
    if (existingProducts.length < parseInt(max_links)) {
      console.log('📡 기존 데이터 부족, 크롤링 서버에 요청...');

      try {
        // 크롤링 서버에 POST 요청
        const crawlingServerUrl = process.env.CRAWLING_SERVER_URL || 'http://10.128.3.36:30800';
        const crawlingEndpoint = `${crawlingServerUrl}/info_list`;

        console.log(`📡 크롤링 서버 호출: ${crawlingEndpoint}`);

        const response = await axios.post(
          crawlingEndpoint,
          { keyword: searchTerm, max_links: parseInt(max_links) },
          { 
            headers: { 'Content-Type': 'application/json' }, 
            timeout: parseInt(process.env.HTTP_TIMEOUT || '200000'),  // 환경변수에서 타임아웃 설정
            validateStatus: function (status) {
              return status < 600; // 504 Gateway Timeout도 허용
            }
          }
        );

        console.log('📝 크롤링 서버 응답 상태:', response.status);

        // 504 Gateway Timeout 처리
        if (response.status === 504) {
          console.warn('⚠️ 크롤링 서버 Gateway Timeout (504) - 기존 데이터만 사용');
          // 기존 데이터만으로 응답 계속 진행
        } else if (response.data && response.data.info_list) {
          const newProducts = Array.isArray(response.data.info_list) ? response.data.info_list : [];
          console.log(`✅ 크롤링 완료: ${newProducts.length}개 상품 수집`);

          // 3. 새로 수집된 상품을 MongoDB에 저장
          const normalized = newProducts.map(normalizeItem).filter(v => v.product_code && v.url);

          console.log(`💾 ${normalized.length}개 상품을 MongoDB에 저장 중...`);

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
              console.log(`✅ 상품 저장 완료: ${item.title}`);
            } catch (dbError) {
              console.error('❌ DB 저장 오류:', dbError);
            }
          }

          // 4. 저장된 상품들을 기존 데이터와 합쳐서 반환
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

          console.log(`🎉 GET 요청 완료: 총 ${formattedProducts.length}개 상품 (기존: ${existingProducts.length}, 새로 수집: ${normalized.length})`);

          // 5. 검색 결과를 Redis 캐시에 저장
          console.log(`💾 Redis 캐시에 GET 결과 저장 중: ${searchTerm}`);
          try {
            const searchResults = {
              query: searchTerm,
              products: allProducts, // 원본 데이터 저장
              total: allProducts.length,
              timestamp: new Date().toISOString()
            };
            
            await cacheService.setSearchResults(searchTerm, searchResults);
            console.log(`✅ Redis 캐시 저장 완료: ${searchTerm} - ${allProducts.length}개 상품`);
            
            // 인기 검색어에도 추가
            await cacheService.addPopularSearch(searchTerm);
          } catch (cacheError) {
            console.warn('⚠️ Redis 캐시 저장 실패:', cacheError);
          }

          res.json({
            success: true,
            products: formattedProducts,
            message: `"${searchTerm}"에 대한 ${formattedProducts.length}개 상품을 찾았습니다. (기존: ${existingProducts.length}, 새로 수집: ${normalized.length})`,
            fromCache: false
          });
          return;
        }
      } catch (crawlError) {
        console.error('❌ 크롤링 실패:', crawlError);
        console.log('⚠️ 크롤링 실패, 기존 데이터만 반환');
      }
    }

    // 5. 크롤링이 실패했거나 기존 데이터만 사용하는 경우
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

    console.log(`✅ GET 요청 완료: 기존 데이터 ${formattedProducts.length}개 상품 반환`);

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

// =========================
// GET /api/products (상품 검색 + 페이지네이션)
// =========================
router.get('/list', async (req, res) => {
  try {
    let { q, query, page = 1, page_size = 20 } = req.query;
    if (q === 'undefined') q = '';
    if (query === 'undefined') query = '';

    const searchTerm = (q || query || '').trim();
    const pageNum = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(page_size) || 20));
    const rawKey = `${searchTerm}|${pageNum}|${pageSize}`;

    // 캐시 조회
    if (searchTerm) {
      try {
        const cached = await cacheService.getSearchResults(rawKey);
        if (cached) {
          console.log('✅ 캐시에서 검색 결과 반환:', searchTerm);
          return res.json({ ...cached.results, fromCache: true });
        }
      } catch (e) {
        console.warn('[cache] getSearchResults 실패, 캐시 무시:', e?.message || e);
      }
    }

    const db = await connectMongoDB();  // DB 연결 보장
    const queryObj = searchTerm
      ? { title: { $regex: new RegExp(escapeRegex(searchTerm), 'i') } }
      : {};

    const cursor = db.collection('products').find(queryObj).sort({ _id: -1 }).skip((pageNum - 1) * pageSize).limit(pageSize);
    const [docs, total] = await Promise.all([cursor.toArray(), db.collection('products').countDocuments(queryObj)]);

    const responseData = {
      products: docs,
      total,
      searchTerm: searchTerm || null,
      page: pageNum,
      page_size: pageSize,
      fromCache: false,
    };

    // 캐시 저장 & 인기/히스토리
    if (searchTerm && docs.length > 0) {
      try {
        await cacheService.setSearchResults(rawKey, responseData);
      } catch (e) {
        console.warn('[cache] setSearchResults 실패:', e?.message || e);
      }
      try {
        await cacheService.addPopularSearch(searchTerm);
      } catch (e) {
        console.warn('[cache] addPopularSearch 실패:', e?.message || e);
      }
      if (req.session?.userId) {
        try {
          await cacheService.addUserSearchHistory(req.session.userId, searchTerm);
        } catch (e) {
          console.warn('[cache] addUserSearchHistory 실패:', e?.message || e);
        }
      }
    }

    return res.json(responseData);
  } catch (error) {
    console.error('상품 조회 에러:', error);
    return res.status(500).json({ error: '상품 조회 실패' });
  }
});

// 크롤링 작업 상태 저장소 (메모리 기반)
const crawlJobs = new Map();

// =========================
// POST /api/products (비동기 크롤링 작업 시작)
// =========================
router.post('/', async (req, res) => {
  console.log('🚀 POST /api/products 요청 수신');
  console.log('📝 요청 본문:', req.body);

  try {
    const keyword = (req.body.keyword || '').trim();
    const page = Number(req.body.page || 1);
    const per_page = Number(req.body.per_page || 10);
    const max_links = req.body.max_links ? Number(req.body.max_links) : (page * per_page);
    const forceCrawl = Boolean(req.body.force_crawl || false);

    console.log(`📋 요청 파라미터: keyword="${keyword}", page=${page}, per_page=${per_page}, max_links=${max_links}, force_crawl=${forceCrawl}`);

    if (!keyword) {
      console.log('❌ 검색어가 없음');
      return res.status(400).json({ error: '검색어가 필요합니다.' });
    }

    // 강제 크롤링이 아닌 경우에만 캐시와 DB 확인
    if (!forceCrawl) {
      // 1. 먼저 Redis 캐시에서 검색 결과 확인
      console.log('🔍 Redis 캐시에서 검색 결과 확인 중...');
      const cachedResults = await cacheService.getSearchResults(keyword);
      
      if (cachedResults && cachedResults.results && cachedResults.results.products) {
        console.log(`✅ 캐시에서 검색 결과 발견: ${keyword} - ${cachedResults.totalCount}개 상품`);
        
        // 페이지 기반 캐시 결과 반환
        const startIndex = (page - 1) * per_page;
        const endIndex = startIndex + per_page;
        const pageProducts = cachedResults.results.products.slice(startIndex, endIndex);
        
        if (pageProducts.length > 0) {
          const jobId = `cached_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          return res.json({
            success: true,
            jobId,
            message: `캐시된 결과 페이지 ${page}: ${pageProducts.length}개 상품`,
            status: 'completed',
            products: pageProducts,
            productCount: pageProducts.length,
            cached: true,
            cachedAt: cachedResults.cachedAt,
            pagination: {
              page,
              per_page,
              total: cachedResults.totalCount,
              hasMore: endIndex < cachedResults.totalCount
            }
          });
        } else {
          console.log(`⚠️ 캐시에서 페이지 ${page} 데이터 없음: 총 ${cachedResults.totalCount}개, 요청 범위: ${startIndex}-${endIndex}`);
        }
      } else {
        console.log('🔍 캐시에 검색 결과 없음, DB 확인');
      }

      // 2. MongoDB에서 기존 데이터 확인
      console.log('📋 MongoDB에서 기존 데이터 조회 중...');
      const db = await connectMongoDB();
      const queryObj = { title: { $regex: new RegExp(escapeRegex(keyword), 'i') } };
      
      // 페이지 기반으로 MongoDB 조회
      const totalProducts = await db.collection('products').countDocuments(queryObj);
      const startIndex = (page - 1) * per_page;
      
      const pageProducts = await db.collection('products')
        .find(queryObj)
        .sort({ last_seen_at: -1 })
        .skip(startIndex)
        .limit(per_page)
        .toArray();

      console.log(`📋 MongoDB 총 ${totalProducts}개 상품 중 페이지 ${page}에서 ${pageProducts.length}개 발견`);

      // 3. MongoDB에서 해당 페이지 데이터가 있으면 바로 반환
      if (pageProducts.length > 0) {
        console.log(`✅ MongoDB 페이지 ${page} 데이터 있음: ${pageProducts.length}개 상품`);
        
        const jobId = `db_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const normalized = pageProducts.map(normalizeItem);
        
        // 첫 페이지이거나 전체 데이터가 충분할 때만 캐시에 저장
        if (page === 1 && totalProducts >= 10) {
          console.log(`💾 MongoDB 결과를 Redis 캐시에 저장: ${keyword}`);
          try {
            const allProducts = await db.collection('products')
              .find(queryObj)
              .sort({ last_seen_at: -1 })
              .limit(Math.max(50, totalProducts)) // 최대 50개까지 캐시
              .toArray();
            
            const searchResults = {
              query: keyword,
              products: allProducts.map(normalizeItem),
              total: totalProducts,
              timestamp: new Date().toISOString()
            };
            
            await cacheService.setSearchResults(keyword, searchResults);
            await cacheService.addPopularSearch(keyword);
            console.log(`✅ Redis 캐시 저장 완료: ${keyword} (${allProducts.length}개 상품)`);
          } catch (cacheError) {
            console.warn('⚠️ Redis 캐시 저장 실패:', cacheError);
          }
        }
        
        return res.json({
          success: true,
          jobId,
          message: `DB 페이지 ${page} 결과: ${normalized.length}개 상품`,
          status: 'completed',
          products: normalized,
          productCount: normalized.length,
          cached: false,
          fromDatabase: true,
          pagination: {
            page,
            per_page,
            total: totalProducts,
            hasMore: startIndex + per_page < totalProducts
          },
          timestamp: new Date().toISOString()
        });
      } else {
        console.log(`⚠️ MongoDB 페이지 ${page} 데이터 없음: 총 ${totalProducts}개, 크롤링 수행`);
      }
    } else {
      console.log('🚀 강제 크롤링 요청 - 캐시와 DB 건너뛰고 바로 크롤링 수행');
    }

    // 4. 캐시와 DB에 충분한 데이터가 없으면 크롤링 수행
    // 작업 ID 생성
    const jobId = `crawl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 작업 상태 초기화
    crawlJobs.set(jobId, {
      status: 'started',
      keyword,
      page,
      per_page,
      max_links,
      startTime: new Date(),
      products: [],
      error: null
    });

    console.log(`🔍 크롤링 작업 시작: ${jobId} - ${keyword} (페이지 ${page})`);

    // WebSocket으로 실시간 검색 시작 알림
    try {
      await websocketService.emitToRoom(`search:${jobId}`, 'search-started', {
        jobId,
        status: 'started',
        keyword,
        page,
        per_page,
        max_links,
        timestamp: new Date().toISOString(),
        message: `검색 시작: "${keyword}" 상품을 찾고 있습니다...`
      });
      console.log(`🔔 WebSocket search start notification sent: ${jobId}`);
    } catch (wsError) {
      console.warn('⚠️ WebSocket 시작 알림 전송 실패:', wsError.message);
    }

    // 동기적으로 크롤링 실행 후 결과 반환
    console.log(`📡 크롤링 실행 시작: ${jobId}`);

    // 크롤링 서버 호출 - 페이지 기반 파라미터 추가
    const crawlingServerUrl = process.env.CRAWLING_SERVER_URL || 'http://10.128.3.36:30800';
    const crawlingEndpoint = `${crawlingServerUrl}/info_list`;

    console.log(`📡 크롤링 서버 호출: ${crawlingEndpoint} (페이지 ${page}, ${per_page}개씩)`);

    const response = await axios.post(
      crawlingEndpoint,
      { 
        keyword, 
        max_links,
        page,           // 페이지 번호 전달
        per_page        // 페이지당 개수 전달
      },
      { 
        headers: { 'Content-Type': 'application/json' }, 
        timeout: 30000,  // 30초로 단축
        validateStatus: function (status) {
          return status < 600; // 504도 허용
        }
      }
    );

    console.log(`📝 크롤링 응답 받음: ${jobId} - 상태: ${response.status}`);

    let infoList = [];
    if (response.status === 504) {
      console.warn(`⚠️ 크롤링 서버 Gateway Timeout (504): ${jobId} - 빈 결과 반환`);
      infoList = []; // 빈 배열로 처리
    } else if (response.data && response.data.info_list) {
      infoList = Array.isArray(response.data.info_list) ? response.data.info_list : [];
    } else if (response.data && Array.isArray(response.data)) {
      infoList = response.data;
    }

    console.log(`✅ 크롤링 완료: ${jobId} - ${infoList.length}개 상품`);

    // MongoDB 저장
    const db = await connectMongoDB();
    const normalized = infoList.map(normalizeItem).filter(v => v.product_code && v.url);

    console.log(`💾 MongoDB 저장 시작: ${jobId} - ${normalized.length}개 상품`);

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

    console.log(`✅ 크롤링 작업 완료: ${jobId} - ${normalized.length}개 상품 저장됨`);

    // 3. 크롤링 결과를 Redis 캐시에 저장
    console.log(`💾 Redis 캐시에 검색 결과 저장 중: ${keyword}`);
    try {
      const searchResults = {
        query: keyword,
        products: normalized,
        total: normalized.length,
        timestamp: new Date().toISOString()
      };
      
      await cacheService.setSearchResults(keyword, searchResults);
      console.log(`✅ Redis 캐시 저장 완료: ${keyword} - ${normalized.length}개 상품`);
      
      // 인기 검색어에도 추가
      await cacheService.addPopularSearch(keyword);
    } catch (cacheError) {
      console.warn('⚠️ Redis 캐시 저장 실패:', cacheError);
      // 캐시 실패는 무시하고 계속 진행
    }

    // WebSocket으로 실시간 검색 결과 알림
    try {
      await websocketService.emitToRoom(`search:${jobId}`, 'search-completed', {
        jobId,
        status: 'completed',
        keyword,
        products: normalized,
        productCount: normalized.length,
        cached: false,
        fromCrawling: true,
        forceCrawl: forceCrawl,
        page,
        per_page,
        timestamp: new Date().toISOString(),
        message: `검색 완료: "${keyword}"에 대한 ${normalized.length}개 상품을 찾았습니다.`
      });
      console.log(`🔔 WebSocket search notification sent: ${jobId} - ${normalized.length} products`);
    } catch (wsError) {
      console.warn('⚠️ WebSocket 알림 전송 실패:', wsError.message);
    }

    // 즉시 결과 반환 - 페이지 정보 포함
    res.json({
      success: true,
      jobId,
      message: forceCrawl 
        ? `페이지 ${page} 추가 크롤링 완료: ${normalized.length}개 상품 발견`
        : `페이지 ${page} 크롤링 완료: ${normalized.length}개 상품 저장됨`,
      status: 'completed',
      products: normalized,
      productCount: normalized.length,
      cached: false,
      fromCrawling: true,
      forceCrawl: forceCrawl,
      pagination: {
        page,
        per_page,
        total: normalized.length, // 크롤링 결과는 현재 페이지만 알 수 있음
        hasMore: normalized.length === per_page // 요청한 만큼 결과가 있으면 더 있을 수 있음
      },
      timestamp: new Date().toISOString()
    });

  } catch (e) {
    console.error('❌ POST 크롤링 시작 오류:', e);
    
    // WebSocket으로 실시간 검색 오류 알림
    const errorJobId = `error_${Date.now()}`;
    
    try {
      await websocketService.emitToRoom(`search:${errorJobId}`, 'search-error', {
        jobId: errorJobId,
        status: 'error',
        keyword,
        error: e.message,
        timestamp: new Date().toISOString(),
        message: `검색 오류: "${keyword}" 검색 중 문제가 발생했습니다.`
      });
      console.log(`🔔 WebSocket search error notification sent: ${errorJobId}`);
    } catch (wsError) {
      console.warn('⚠️ WebSocket 오류 알림 전송 실패:', wsError.message);
    }

    // 504 Gateway Timeout이나 네트워크 오류의 경우 더 관대하게 처리
    if (e.response && e.response.status === 504) {
      console.warn('⚠️ 크롤링 서버 Gateway Timeout - 빈 결과로 응답');
      return res.json({
        success: true,
        jobId: `timeout_${Date.now()}`,
        message: '크롤링 서버 응답 시간 초과 - 나중에 다시 시도해주세요',
        status: 'timeout',
        products: [],
        productCount: 0,
        cached: false,
        fromCrawling: false,
        error: 'Gateway Timeout'
      });
    }
    
    if (e.code === 'ECONNRESET' || e.code === 'ETIMEDOUT' || e.code === 'ECONNREFUSED') {
      console.warn(`⚠️ 네트워크 연결 문제: ${e.code} - 빈 결과로 응답`);
      return res.json({
        success: true,
        jobId: `network_error_${Date.now()}`,
        message: '네트워크 연결 문제 - 나중에 다시 시도해주세요',
        status: 'network_error',
        products: [],
        productCount: 0,
        cached: false,
        fromCrawling: false,
        error: e.code
      });
    }
    
    res.status(500).json({ error: '크롤링 작업 시작 실패', details: e.message });
  }
});

// =========================
// GET /api/products/status/:jobId (크롤링 작업 상태 확인)
// =========================
router.get('/status/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = crawlJobs.get(jobId);

    if (!job) {
      return res.status(404).json({ error: '작업을 찾을 수 없습니다.' });
    }

    console.log(`📊 작업 상태 조회: ${jobId} - ${job.status}`);

    res.json({
      success: true,
      jobId,
      status: job.status,
      keyword: job.keyword,
      startTime: job.startTime,
      completedTime: job.completedTime,
      products: job.products,
      productCount: job.products.length,
      error: job.error
    });

  } catch (e) {
    console.error('❌ 작업 상태 조회 오류:', e);
    res.status(500).json({ error: '작업 상태 조회 실패' });
  }
});

// =========================
// GET /api/products/debug/redis (Redis 상태 디버깅)
// =========================
router.get('/debug/redis', async (req, res) => {
  try {
    console.log('🔍 Redis 상태 디버깅 요청');
    
    const healthCheck = await cacheService.healthCheck();
    const cacheStats = await cacheService.getCacheStats();
    
    // 테스트 캐시 설정/조회
    const testKey = 'debug_test';
    const testValue = { message: 'Redis is working', timestamp: new Date().toISOString() };
    
    console.log('🧪 Redis 테스트 시작...');
    const setResult = await cacheService.setSearchResults(testKey, testValue);
    const getResult = await cacheService.getSearchResults(testKey);
    
    const debugInfo = {
      health: healthCheck,
      stats: cacheStats,
      test: {
        setResult,
        getResult,
        testSuccessful: !!(setResult && getResult && getResult.results)
      },
      redis: {
        connected: cacheService.redis?.isReady() || false,
        clientStatus: cacheService.redis?.client?.status || 'unknown'
      },
      environment: {
        REDIS_HOST: process.env.REDIS_HOST || 'localhost',
        REDIS_PORT: process.env.REDIS_PORT || '6379',
        REDIS_DB: process.env.REDIS_DB || '0'
      }
    };
    
    console.log('✅ Redis 디버그 정보:', JSON.stringify(debugInfo, null, 2));
    
    res.json({
      success: true,
      debug: debugInfo,
      message: debugInfo.test.testSuccessful ? 'Redis 정상 작동' : 'Redis 문제 감지'
    });
    
  } catch (error) {
    console.error('❌ Redis 디버깅 중 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Redis 디버깅 실패'
    });
  }
});

// =========================
// 비동기 크롤링 실행 함수
// =========================
async function performCrawling(jobId, keyword, max_links) {
  try {
    console.log(`📡 크롤링 실행 시작: ${jobId}`);

    // 작업 상태 업데이트
    const job = crawlJobs.get(jobId);
    job.status = 'crawling';
    crawlJobs.set(jobId, job);

    // 크롤링 서버 호출
    const crawlingServerUrl = process.env.CRAWLING_SERVER_URL || 'http://10.128.3.36:30800';
    const crawlingEndpoint = `${crawlingServerUrl}/info_list`;

    console.log(`📡 크롤링 서버 호출: ${crawlingEndpoint}`);

    const response = await axios.post(
      crawlingEndpoint,
      { keyword, max_links },
      { headers: { 'Content-Type': 'application/json' }, timeout: parseInt(process.env.HTTP_TIMEOUT || '200000') }
    );

    console.log(`📝 크롤링 응답 받음: ${jobId} - 상태: ${response.status}`);

    let infoList = [];
    if (response.data && response.data.info_list) {
      infoList = Array.isArray(response.data.info_list) ? response.data.info_list : [];
    } else if (response.data && Array.isArray(response.data)) {
      infoList = response.data;
    }

    console.log(`✅ 크롤링 완료: ${jobId} - ${infoList.length}개 상품`);

    // 작업 상태 업데이트
    job.status = 'saving';
    crawlJobs.set(jobId, job);

    // MongoDB 저장
    const db = await connectMongoDB();
    const normalized = infoList.map(normalizeItem).filter(v => v.product_code && v.url);

    console.log(`💾 MongoDB 저장 시작: ${jobId} - ${normalized.length}개 상품`);

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

    // 작업 완료
    job.status = 'completed';
    job.products = normalized;
    job.completedTime = new Date();
    crawlJobs.set(jobId, job);

    console.log(`✅ 크롤링 작업 완료: ${jobId} - ${normalized.length}개 상품 저장됨`);

    // 10분 후 작업 정보 삭제 (메모리 정리)
    setTimeout(() => {
      crawlJobs.delete(jobId);
      console.log(`🗑️ 작업 정보 삭제: ${jobId}`);
    }, 10 * 60 * 1000);

  } catch (error) {
    console.error(`❌ 크롤링 작업 실패: ${jobId}`, error);

    // 작업 실패
    const job = crawlJobs.get(jobId);
    if (job) {
      job.status = 'failed';
      job.error = error.message;
      job.completedTime = new Date();
      crawlJobs.set(jobId, job);
    }
  }
}

// escapeRegex 함수 추가 (필요한 경우)
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = router;
