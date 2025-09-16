const redisService = require('./redisService');
const { Sentry } = require('../config/sentry');

// 캐시 키 생성 헬퍼
const CacheKeys = {
  analysisResult: (productId) => `analysis_result:${productId}`,
  analysisStatus: (productId) => `analysis_status:${productId}`,
  productInfo: (productId) => `product_info:${productId}`,
  searchResults: (query) => `search_results:${Buffer.from(query).toString('base64')}`,
  userSearchHistory: (userId) => `user_search_history:${userId}`,
  popularSearches: () => 'popular_searches'
};

// 캐시 TTL 설정
const CacheTTL = {
  ANALYSIS_RESULT: 3600, // 1시간
  ANALYSIS_STATUS: 1800, // 30분
  PRODUCT_INFO: 7200, // 2시간
  SEARCH_RESULTS: 1800, // 30분
  USER_SEARCH_HISTORY: 30 * 24 * 3600, // 30일
  POPULAR_SEARCHES: 7 * 24 * 3600 // 7일
};

class CacheService {
  constructor() {
    this.redis = redisService;
    this.hitCount = 0;
    this.missCount = 0;
    this.errorCount = 0;
  }

  /**
   * 캐시 서비스 초기화
   */
  async initialize() {
    try {
      const initialized = await this.redis.initialize();
      if (initialized) {
        console.log('✅ 캐시 서비스 초기화 완료');
      } else {
        console.warn('⚠️ 캐시 서비스 초기화 실패');
      }
      return initialized;
    } catch (error) {
      console.error('캐시 서비스 초기화 오류:', error);
      return false;
    }
  }

  /**
   * 분석 결과를 캐시에서 조회
   */
  async getAnalysisResult(productId) {
    try {
      const result = await this.redis.getAnalysisResult(productId);
      
      if (!result) {
        console.log(`🔍 Cache miss for analysis result: ${productId}`);
        this.missCount++;
        await this.trackCacheHitRate(productId, false);
        return null;
      }

      console.log(`✅ Cache hit for analysis result: ${productId}`);
      this.hitCount++;
      await this.trackCacheHitRate(productId, true);
      return result;
    } catch (error) {
      console.error(`❌ Error getting analysis result from cache for ${productId}:`, error);
      this.errorCount++;
      Sentry.captureException(error);
      return null; // Fail gracefully
    }
  }

  /**
   * 분석 결과를 캐시에 저장
   */
  async setAnalysisResult(productId, result) {
    try {
      const success = await this.redis.setAnalysisResult(productId, result, CacheTTL.ANALYSIS_RESULT);
      if (success) {
        console.log(`✅ Cached analysis result for product: ${productId}`);
      } else {
        console.warn(`⚠️ Failed to cache analysis result for product: ${productId}`);
      }
    } catch (error) {
      console.error(`❌ Error setting analysis result cache for ${productId}:`, error);
      this.errorCount++;
      Sentry.captureException(error);
      // Don't throw - caching failure shouldn't break the main flow
    }
  }

  /**
   * 분석 상태를 캐시에서 조회
   */
  async getAnalysisStatus(productId) {
    try {
      const result = await this.redis.getAnalysisStatus(productId);
      
      if (!result) {
        console.log(`🔍 Cache miss for analysis status: ${productId}`);
        this.missCount++;
        return null;
      }

      console.log(`✅ Cache hit for analysis status: ${productId}`);
      this.hitCount++;
      return result;
    } catch (error) {
      console.error(`❌ Error getting analysis status from cache for ${productId}:`, error);
      this.errorCount++;
      Sentry.captureException(error);
      return null;
    }
  }

  /**
   * 분석 상태를 캐시에 저장
   */
  async setAnalysisStatus(productId, status) {
    try {
      const success = await this.redis.setAnalysisStatus(productId, status, CacheTTL.ANALYSIS_STATUS);
      if (success) {
        console.log(`✅ Cached analysis status for product: ${productId}`);
      } else {
        console.warn(`⚠️ Failed to cache analysis status for product: ${productId}`);
      }
    } catch (error) {
      console.error(`❌ Error setting analysis status cache for ${productId}:`, error);
      this.errorCount++;
      Sentry.captureException(error);
    }
  }

  /**
   * 인기 검색어 추가
   */
  async addPopularSearch(keyword, score = 1) {
    try {
      const success = await this.redis.addPopularSearch(keyword, score);
      if (success) {
        console.log(`✅ Added popular search: ${keyword} (score: ${score})`);
      }
      return success;
    } catch (error) {
      console.error(`❌ Error adding popular search [${keyword}]:`, error);
      this.errorCount++;
      Sentry.captureException(error);
      return false;
    }
  }

  /**
   * 인기 검색어 조회
   */
  async getPopularSearches(limit = 10) {
    try {
      const searches = await this.redis.getPopularSearches(limit);
      console.log(`✅ Retrieved ${searches.length} popular searches`);
      return searches;
    } catch (error) {
      console.error('❌ Error getting popular searches:', error);
      this.errorCount++;
      Sentry.captureException(error);
      return [];
    }
  }

  /**
   * 사용자 검색 기록 추가
   */
  async addUserSearchHistory(userId, keyword, maxHistory = 10) {
    try {
      const success = await this.redis.addUserSearchHistory(userId, keyword, maxHistory);
      if (success) {
        console.log(`✅ Added user search history: ${userId} -> ${keyword}`);
      }
      return success;
    } catch (error) {
      console.error(`❌ Error adding user search history [${userId}]:`, error);
      this.errorCount++;
      Sentry.captureException(error);
      return false;
    }
  }

  /**
   * 사용자 검색 기록 조회
   */
  async getUserSearchHistory(userId, limit = 10) {
    try {
      const history = await this.redis.getUserSearchHistory(userId, limit);
      console.log(`✅ Retrieved ${history.length} search history items for user: ${userId}`);
      return history;
    } catch (error) {
      console.error(`❌ Error getting user search history [${userId}]:`, error);
      this.errorCount++;
      Sentry.captureException(error);
      return [];
    }
  }

  /**
   * 상품 정보 캐싱
   */
  async setProductInfo(productId, productInfo) {
    try {
      const success = await this.redis.setProductInfo(productId, productInfo, CacheTTL.PRODUCT_INFO);
      if (success) {
        console.log(`✅ Cached product info for: ${productId}`);
      }
      return success;
    } catch (error) {
      console.error(`❌ Error caching product info [${productId}]:`, error);
      this.errorCount++;
      Sentry.captureException(error);
      return false;
    }
  }

  /**
   * 상품 정보 조회
   */
  async getProductInfo(productId) {
    try {
      const result = await this.redis.getProductInfo(productId);
      
      if (!result) {
        console.log(`🔍 Cache miss for product info: ${productId}`);
        this.missCount++;
        return null;
      }

      console.log(`✅ Cache hit for product info: ${productId}`);
      this.hitCount++;
      return result;
    } catch (error) {
      console.error(`❌ Error getting product info from cache [${productId}]:`, error);
      this.errorCount++;
      Sentry.captureException(error);
      return null;
    }
  }

  /**
   * 검색 결과 캐싱
   */
  async setSearchResults(query, results) {
    try {
      const success = await this.redis.setSearchResults(query, results, CacheTTL.SEARCH_RESULTS);
      if (success) {
        console.log(`✅ Cached search results for query: ${query} (${results.length} items)`);
      }
      return success;
    } catch (error) {
      console.error(`❌ Error caching search results [${query}]:`, error);
      this.errorCount++;
      Sentry.captureException(error);
      return false;
    }
  }

  /**
   * 검색 결과 조회
   */
  async getSearchResults(query) {
    try {
      const result = await this.redis.getSearchResults(query);
      
      if (!result) {
        console.log(`🔍 Cache miss for search results: ${query}`);
        this.missCount++;
        return null;
      }

      console.log(`✅ Cache hit for search results: ${query} (${result.results.length} items)`);
      this.hitCount++;
      return result;
    } catch (error) {
      console.error(`❌ Error getting search results from cache [${query}]:`, error);
      this.errorCount++;
      Sentry.captureException(error);
      return null;
    }
  }

  /**
   * 캐시 무효화
   */
  async invalidateAnalysisCache(productId, taskId = null) {
    try {
      const keys = [
        CacheKeys.analysisResult(productId),
        CacheKeys.analysisStatus(productId)
      ];

      if (taskId) {
        keys.push(`analysis_task:${taskId}`);
      }

      const deletedCount = await this.redis.batchInvalidate(keys);
      console.log(`✅ Invalidated ${deletedCount} cache keys for product: ${productId}`);
      return deletedCount;
    } catch (error) {
      console.error(`❌ Error invalidating analysis cache [${productId}]:`, error);
      this.errorCount++;
      Sentry.captureException(error);
      return 0;
    }
  }

  /**
   * 배치 캐시 무효화
   */
  async batchInvalidateCache(productIds) {
    try {
      const keys = [];
      
      for (const productId of productIds) {
        keys.push(
          CacheKeys.analysisResult(productId),
          CacheKeys.analysisStatus(productId),
          CacheKeys.productInfo(productId)
        );
      }

      const deletedCount = await this.redis.batchInvalidate(keys);
      console.log(`✅ Batch invalidated ${deletedCount} cache keys for ${productIds.length} products`);
      return deletedCount;
    } catch (error) {
      console.error('❌ Error in batch cache invalidation:', error);
      this.errorCount++;
      Sentry.captureException(error);
      return 0;
    }
  }

  /**
   * 캐시 워밍업
   */
  async warmupCache(productIds) {
    try {
      let successCount = 0;
      let failureCount = 0;

      for (const productId of productIds) {
        try {
          // 여기서는 기본 상품 정보만 미리 로드
          // 실제 구현에서는 DB에서 데이터를 가져와서 캐시에 저장
          const productInfo = { id: productId, warmedUp: true, timestamp: new Date().toISOString() };
          const success = await this.setProductInfo(productId, productInfo);
          
          if (success) {
            successCount++;
          } else {
            failureCount++;
          }
        } catch (error) {
          failureCount++;
          console.error(`❌ Error warming up cache for product ${productId}:`, error);
        }
      }

      console.log(`✅ Cache warmup completed: ${successCount} success, ${failureCount} failures`);
      return { successCount, failureCount, total: productIds.length };
    } catch (error) {
      console.error('❌ Error in cache warmup:', error);
      this.errorCount++;
      Sentry.captureException(error);
      return { successCount: 0, failureCount: productIds.length, total: productIds.length };
    }
  }

  /**
   * 캐시 통계 조회
   */
  async getCacheStats() {
    try {
      const redisStats = await this.redis.getCacheStats();
      
      return {
        redis: redisStats,
        hitRate: this.hitCount + this.missCount > 0 ? 
          (this.hitCount / (this.hitCount + this.missCount) * 100).toFixed(2) + '%' : '0%',
        hits: this.hitCount,
        misses: this.missCount,
        errors: this.errorCount,
        connected: this.redis.isReady()
      };
    } catch (error) {
      console.error('❌ Error getting cache stats:', error);
      this.errorCount++;
      return {
        redis: null,
        hitRate: '0%',
        hits: this.hitCount,
        misses: this.missCount,
        errors: this.errorCount,
        connected: false
      };
    }
  }

  /**
   * 캐시 히트율 조회
   */
  async getCacheHitRate(days = 7) {
    try {
      // 간단한 히트율 계산 (실제 구현에서는 더 정교한 통계 필요)
      const totalRequests = this.hitCount + this.missCount;
      const hitRate = totalRequests > 0 ? (this.hitCount / totalRequests * 100).toFixed(2) : 0;
      
      return {
        period: `${days} days`,
        hitRate: `${hitRate}%`,
        totalHits: this.hitCount,
        totalMisses: this.missCount,
        totalRequests,
        errorRate: totalRequests > 0 ? (this.errorCount / totalRequests * 100).toFixed(2) + '%' : '0%'
      };
    } catch (error) {
      console.error('❌ Error getting cache hit rate:', error);
      this.errorCount++;
      return {
        period: `${days} days`,
        hitRate: '0%',
        totalHits: 0,
        totalMisses: 0,
        totalRequests: 0,
        errorRate: '100%'
      };
    }
  }

  /**
   * 헬스 체크
   */
  async healthCheck() {
    try {
      const redisHealth = await this.redis.healthCheck();
      
      return {
        status: redisHealth.status,
        redis: redisHealth,
        stats: {
          hits: this.hitCount,
          misses: this.missCount,
          errors: this.errorCount
        }
      };
    } catch (error) {
      console.error('❌ Cache health check failed:', error);
      this.errorCount++;
      return {
        status: 'unhealthy',
        redis: { status: 'error', message: error.message },
        stats: {
          hits: this.hitCount,
          misses: this.missCount,
          errors: this.errorCount
        }
      };
    }
  }

  /**
   * 캐시 히트율 추적 (내부 메서드)
   */
  async trackCacheHitRate(key, isHit) {
    try {
      // 간단한 통계 추적 (실제 구현에서는 더 정교한 메트릭 수집 필요)
      const statsKey = `cache_stats:${new Date().toISOString().split('T')[0]}`;
      const field = isHit ? 'hits' : 'misses';
      
      if (this.redis.isReady()) {
        await this.redis.client.hincrby(statsKey, field, 1);
        await this.redis.client.expire(statsKey, 30 * 24 * 3600); // 30일 보관
      }
    } catch (error) {
      // 통계 추적 실패는 무시 (메인 기능에 영향 없음)
      console.debug('Cache hit rate tracking failed:', error);
    }
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const cacheService = new CacheService();

module.exports = { cacheService, CacheKeys, CacheTTL };