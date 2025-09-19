const express = require('express');
const router = express.Router();
const { cacheService } = require('../services/cacheService');
const { connectMongoDB } = require('../config/mongodb');
const { normalizeItem } = require('../utils/normalize');

// 정규식 이스케이프 함수
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * GET /api/trending/keywords
 * Redis에서 인기 검색어 순위 가져오기
 */
router.get('/keywords', async (req, res) => {
  try {
    console.log('🔥 인기 검색어 랭킹 요청');
    
    // Redis에서 인기 검색어 가져오기
    const popularSearches = await cacheService.getPopularSearches();
    
    console.log('🔥 Redis 인기 검색어:', popularSearches);
    
    if (!popularSearches || popularSearches.length === 0) {
      // 기본 더미 데이터 반환
      const defaultKeywords = [
        { rank: 1, keyword: '햇반', trend: 'up', change: 2, score: 100 },
        { rank: 2, keyword: '도시락', trend: 'up', change: 1, score: 95 },
        { rank: 3, keyword: '마요네즈', trend: 'down', change: 1, score: 90 },
        { rank: 4, keyword: '상추', trend: 'up', change: 3, score: 85 },
        { rank: 5, keyword: '나물', trend: 'down', change: 2, score: 80 }
      ];
      
      return res.json({
        success: true,
        data: defaultKeywords,
        source: 'default'
      });
    }

    // Redis 데이터를 랭킹 형태로 변환
    const keywordsWithRanking = popularSearches.map((item, index) => {
      const keyword = typeof item === 'string' ? item : item.keyword || item;
      const score = typeof item === 'object' ? item.score || 100 - index : 100 - index;
      
      return {
        rank: index + 1,
        keyword: keyword,
        trend: Math.random() > 0.3 ? 'up' : 'down', // 랜덤 트렌드 (실제로는 이전 데이터와 비교)
        change: Math.floor(Math.random() * 5) + 1, // 1-5 랜덤 변동
        score: score
      };
    });

    res.json({
      success: true,
      data: keywordsWithRanking.slice(0, 10), // 상위 10개만
      source: 'redis',
      totalCount: keywordsWithRanking.length
    });

  } catch (error) {
    console.error('❌ 인기 검색어 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '인기 검색어 조회 중 오류가 발생했습니다.'
    });
  }
});

/**
 * GET /api/trending/products/:keyword
 * 특정 키워드에 대한 관련 상품들 가져오기
 */
router.get('/products/:keyword', async (req, res) => {
  try {
    const keyword = decodeURIComponent(req.params.keyword);
    const limit = parseInt(req.query.limit) || 6;
    
    console.log(`🛒 키워드 "${keyword}"에 대한 상품 요청, 제한: ${limit}개`);
    
    if (!keyword || !keyword.trim()) {
      return res.status(400).json({
        success: false,
        message: '키워드가 필요합니다.'
      });
    }

    // MongoDB 연결
    const db = await connectMongoDB();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: 'MongoDB 연결 실패'
      });
    }

    // MongoDB에서 키워드 관련 상품 검색
    const queryObj = { 
      title: { $regex: new RegExp(escapeRegex(keyword.trim()), 'i') }
    };
    
    console.log('🔍 MongoDB 쿼리:', queryObj);
    
    const products = await db.collection('products')
      .find(queryObj)
      .sort({ last_seen_at: -1 }) // 최신 데이터 우선
      .limit(limit)
      .toArray();

    console.log(`✅ 키워드 "${keyword}"에서 ${products.length}개 상품 발견`);

    // 데이터 정규화
    const normalizedProducts = products.map(normalizeItem);

    res.json({
      success: true,
      keyword: keyword,
      data: normalizedProducts,
      count: normalizedProducts.length,
      source: 'mongodb'
    });

  } catch (error) {
    console.error(`❌ 키워드 상품 조회 오류:`, error);
    res.status(500).json({
      success: false,
      message: '키워드 상품 조회 중 오류가 발생했습니다.'
    });
  }
});

/**
 * GET /api/trending/recommendations
 * 추천 상품 (리뷰 많은 순)
 */
router.get('/recommendations', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    console.log(`⭐ 추천 상품 요청, 제한: ${limit}개`);

    // MongoDB 연결
    const db = await connectMongoDB();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: 'MongoDB 연결 실패'
      });
    }

    // 리뷰 수가 많은 상품들 가져오기
    const products = await db.collection('products')
      .find({
        review_count: { $exists: true, $ne: null, $ne: '', $ne: 0 }
      })
      .sort({ 
        review_count: -1, // 리뷰 수 내림차순
        last_seen_at: -1  // 최신 데이터 우선
      })
      .limit(limit)
      .toArray();

    console.log(`✅ 추천 상품 ${products.length}개 발견`);

    // 데이터 정규화
    const normalizedProducts = products.map(normalizeItem);

    res.json({
      success: true,
      data: normalizedProducts,
      count: normalizedProducts.length,
      source: 'mongodb'
    });

  } catch (error) {
    console.error('❌ 추천 상품 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '추천 상품 조회 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;