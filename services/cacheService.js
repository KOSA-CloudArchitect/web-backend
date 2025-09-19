const redisService = require('./redisService');
const { Sentry } = require('../config/sentry');

const CacheKeys = {
  analysisResult: (productId) => `analysis_result:${productId}`,
  analysisStatus: (productId) => `analysis_status:${productId}`,
  productInfo: (productId) => `product_info:${productId}`,
  searchResults: (raw) => `search_results:${Buffer.from(String(raw)).toString('base64')}`,
  userSearchHistory: (userId) => `user_search_history:${userId}`,
  popularSearches: () => 'popular_searches',
  crawlLock: (kw) => `crawl:${String(kw || '').toLowerCase().trim()}`
};

const CacheTTL = {
  ANALYSIS_RESULT: 3600,
  ANALYSIS_STATUS: 1800,
  PRODUCT_INFO: 7200,
  SEARCH_RESULTS: 1800,
  USER_SEARCH_HISTORY: 30 * 24 * 3600,
  POPULAR_SEARCHES: 7 * 24 * 3600,
  CRAWL_LOCK: Number(process.env.CRAWLING_LOCK_TTL || 300)
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

  // ---------- 🔒 크롤링 락 ----------
  async acquireCrawlLock(keyword) {
    try {
      const key = CacheKeys.crawlLock(keyword);
      const ok = await this.redis.acquireLock(key, CacheTTL.CRAWL_LOCK);
      return ok;
    } catch (e) {
      console.warn('[cache] acquireCrawlLock 실패:', e?.message || e);
      return false;
    }
  }
  async releaseCrawlLock(keyword) {
    try {
      const key = CacheKeys.crawlLock(keyword);
      await this.redis.releaseLock(key);
    } catch (_) {}
  }
  // ---------------------------------

  // ✅ 검색 결과 캐싱: total/구조 버그 수정 + 키 통일
  async setSearchResults(rawKey, resultObj) {
    try {
      const key = CacheKeys.searchResults(rawKey);
      const totalCount = Array.isArray(resultObj?.products) ? resultObj.products.length : (resultObj?.total ?? 0);

      const envelope = {
        query: rawKey,
        results: resultObj,
        totalCount,
        cachedAt: new Date().toISOString()
      };

      const ok = await this.redis.set(key, envelope, CacheTTL.SEARCH_RESULTS);
      if (ok) {
        console.log(`✅ Cached search results for query: ${rawKey} (${totalCount} items)`);
      } else {
        console.warn(`⚠️ Failed to cache search results for query: ${rawKey}`);
      }
      return ok;
    } catch (error) {
      console.error(`❌ Error caching search results [${rawKey}]:`, error);
      this.errorCount++;
      Sentry.captureException(error);
      return false;
    }
  }

  async getSearchResults(rawKey) {
    try {
      const key = CacheKeys.searchResults(rawKey);
      const payload = await this.redis.get(key);
      if (!payload) {
        console.log(`🔍 Cache miss for search results: ${rawKey}`);
        this.missCount++;
        return null;
      }
      console.log(`✅ Cache hit for search results: ${rawKey} (${payload.totalCount} items)`);
      this.hitCount++;
      return payload;
    } catch (error) {
      console.error(`❌ Error getting search results from cache [${rawKey}]:`, error);
      this.errorCount++;
      Sentry.captureException(error);
      return null;
    }
  }

  // 분석 결과 캐싱
  async setAnalysisResult(productId, result) {
    try {
      const key = CacheKeys.analysisResult(productId);
      const resultData = {
        ...result,
        cachedAt: new Date().toISOString()
      };
      return await this.redis.set(key, resultData, CacheTTL.ANALYSIS_RESULT);
    } catch (error) {
      this.errorCount++;
      Sentry.captureException(error);
      return false;
    }
  }

  async getAnalysisResult(productId) {
    try {
      const key = CacheKeys.analysisResult(productId);
      return await this.redis.get(key);
    } catch (error) {
      this.errorCount++;
      Sentry.captureException(error);
      return null;
    }
  }

  // 분석 상태 캐싱
  async setAnalysisStatus(productId, status) {
    try {
      const key = CacheKeys.analysisStatus(productId);
      const statusData = {
        ...status,
        timestamp: new Date().toISOString()
      };
      return await this.redis.set(key, statusData, CacheTTL.ANALYSIS_STATUS);
    } catch (error) {
      this.errorCount++;
      Sentry.captureException(error);
      return false;
    }
  }

  async getAnalysisStatus(productId) {
    try {
      const key = CacheKeys.analysisStatus(productId);
      return await this.redis.get(key);
    } catch (error) {
      this.errorCount++;
      Sentry.captureException(error);
      return null;
    }
  }

  // 상품 정보 캐싱
  async setProductInfo(productId, productInfo) {
    try {
      const key = CacheKeys.productInfo(productId);
      return await this.redis.set(key, productInfo, CacheTTL.PRODUCT_INFO);
    } catch (error) {
      this.errorCount++;
      Sentry.captureException(error);
      return false;
    }
  }

  async getProductInfo(productId) {
    try {
      const key = CacheKeys.productInfo(productId);
      return await this.redis.get(key);
    } catch (error) {
      this.errorCount++;
      Sentry.captureException(error);
      return null;
    }
  }

  // 인기 검색어
  async addPopularSearch(keyword, score = 1) {
    try {
      const key = CacheKeys.popularSearches();
      await this.redis.client.zincrby(this.redis.k(key), score, keyword);
      await this.redis.client.zremrangebyrank(this.redis.k(key), 0, -101);
      console.log(`✅ Added popular search: ${keyword} (score: ${score})`);
      return true;
    } catch (error) {
      console.error(`❌ Error adding popular search [${keyword}]:`, error);
      this.errorCount++;
      Sentry.captureException(error);
      return false;
    }
  }

  async getPopularSearches(limit = 10) {
    try {
      const key = CacheKeys.popularSearches();
      const searches = await this.redis.client.zrevrange(this.redis.k(key), 0, limit - 1);
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