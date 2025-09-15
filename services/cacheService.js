const { getRedisClient, CacheKeys, CacheTTL } = require('../config/redis');
const { Sentry } = require('../config/sentry');

class CacheService {
  constructor() {
    this.redis = getRedisClient();
  }

  /**
   * 분석 결과를 캐시에서 조회
   */
  async getAnalysisResult(productId) {
    try {
      const key = CacheKeys.analysisResult(productId);
      const cached = await this.redis.get(key);
      
      if (!cached) {
        console.log(`🔍 Cache miss for analysis result: ${productId}`);
        await this.trackCacheHitRate(productId, false);
        return null;
      }

      console.log(`✅ Cache hit for analysis result: ${productId}`);
      await this.trackCacheHitRate(productId, true);
      return JSON.parse(cached);
    } catch (error) {
      console.error(`❌ Error getting analysis result from cache for ${productId}:`, error);
      Sentry.captureException(error);
      return null; // Fail gracefully
    }
  }

  /**
   * 분석 결과를 캐시에 저장
   */
  async setAnalysisResult(productId, result) {
    try {
      const key = CacheKeys.analysisResult(productId);
      const value = JSON.stringify(result);
      
      await this.redis.setex(key, CacheTTL.ANALYSIS_RESULT, value);
      console.log(`✅ Cached analysis result for product: ${productId}`);
    } catch (error) {
      console.error(`❌ Error setting analysis result cache for ${productId}:`, error);
      Sentry.captureException(error);
      // Don't throw - caching failure shouldn't break the main flow
    }
  }

  /**
   * 분석 상태를 캐시에서 조회
   */
  async getAnalysisStatus(productId) {
    try {
      const key = CacheKeys.analysisStatus(productId);
      const cached = await this.redis.get(key);
      
      if (!cached) {
        console.log(`🔍 Cache miss for analysis status: ${productId}`);
        return null;
      }

      console.log(`✅ Cache hit for analysis status: ${productId}`);
      return JSON.parse(cached);
    } catch (error) {
      console.error(`❌ Error getting analysis status from cache for ${productId}:`, error);
      Sentry.captureException(error);
      return null;
    }
  }

  /**
   * 분석 상태를 캐시에 저장
   */
  async setAnalysisStatus(productId, status) {
    try {
      const key = CacheKeys.analysisStatus(productId);
      const value = JSON.stringify(status);
      
      await this.redis.setex(key, CacheTTL.ANALYSIS_STATUS, value);
      console.log(`✅ Cached analysis status for product: ${productId}`);
    } catch (error) {
      console.error(`❌ Error setting analysis status cache for ${productId}:`, error);
      Sentry.captureException(error);
    }
  }

  /**
   * Task ID로 분석 정보를 캐시에서 조회
   */
  async getAnalysisByTaskId(taskId) {
    try {
      const key = CacheKeys.analysisTask(taskId);
      const cached = await this.redis.get(key);
      
      if (!cached) {
        console.log(`🔍 Cache miss for analysis task: ${taskId}`);
        return null;
      }

      console.log(`✅ Cache hit for analysis task: ${taskId}`);
      return JSON.parse(cached);
    } catch (error) {
      console.error(`❌ Error getting analysis by task ID from cache for ${taskId}:`, error);
      Sentry.captureException(error);
      return null;
    }
  }

  /**
   * Task ID로 분석 정보를 캐시에 저장
   */
  async setAnalysisByTaskId(taskId, result) {
    try {
      const key = CacheKeys.analysisTask(taskId);
      const value = JSON.stringify(result);
      
      await this.redis.setex(key, CacheTTL.ANALYSIS_TASK, value);
      console.log(`✅ Cached analysis for task: ${taskId}`);
    } catch (error) {
      console.error(`❌ Error setting analysis cache for task ${taskId}:`, error);
      Sentry.captureException(error);
    }
  }

  /**
   * 특정 상품의 모든 캐시 무효화
   */
  async invalidateAnalysisCache(productId, taskId) {
    try {
      const keys = [
        CacheKeys.analysisResult(productId),
        CacheKeys.analysisStatus(productId),
      ];

      if (taskId) {
        keys.push(CacheKeys.analysisTask(taskId));
      }

      const deletedCount = await this.redis.del(...keys);
      console.log(`🗑️ Invalidated ${deletedCount} cache entries for product: ${productId}`);
    } catch (error) {
      console.error(`❌ Error invalidating cache for ${productId}:`, error);
      Sentry.captureException(error);
    }
  }

  /**
   * 캐시 상태 확인 (헬스체크용)
   */
  async healthCheck() {
    try {
      const start = Date.now();
      await this.redis.ping();
      const latency = Date.now() - start;
      
      return { status: 'healthy', latency };
    } catch (error) {
      console.error('❌ Redis health check failed:', error);
      return { status: 'unhealthy' };
    }
  }

  /**
   * 캐시 통계 조회
   */
  async getCacheStats() {
    try {
      const info = await this.redis.info('memory');
      const keyspace = await this.redis.info('keyspace');
      
      return {
        memory: info,
        keyspace: keyspace,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ Error getting cache stats:', error);
      Sentry.captureException(error);
      return null;
    }
  }

  /**
   * 캐시 워밍업 - 자주 요청되는 상품들을 미리 캐시에 로드
   */
  async warmupCache(productIds) {
    try {
      console.log(`🔥 Starting cache warmup for ${productIds.length} products`);
      const { AnalysisModel } = require('../models/analysis');
      const { getPool } = require('../config/database');
      
      const pool = getPool();
      const analysisModel = new AnalysisModel(pool);
      
      let warmedCount = 0;
      
      for (const productId of productIds) {
        try {
          const analysis = await analysisModel.findByProductId(productId);
          if (analysis && analysis.status === 'completed') {
            await this.setAnalysisResult(productId, analysis);
            warmedCount++;
          }
        } catch (error) {
          console.warn(`⚠️ Failed to warm cache for product ${productId}:`, error.message);
        }
      }
      
      console.log(`✅ Cache warmup completed: ${warmedCount}/${productIds.length} products cached`);
      return { warmedCount, totalRequested: productIds.length };
    } catch (error) {
      console.error('❌ Cache warmup failed:', error);
      Sentry.captureException(error);
      throw error;
    }
  }

  /**
   * 배치 캐시 무효화 - 여러 상품의 캐시를 한번에 무효화
   */
  async batchInvalidateCache(productIds) {
    try {
      const keys = [];
      
      for (const productId of productIds) {
        keys.push(
          CacheKeys.analysisResult(productId),
          CacheKeys.analysisStatus(productId)
        );
      }
      
      if (keys.length > 0) {
        const deletedCount = await this.redis.del(...keys);
        console.log(`🗑️ Batch invalidated ${deletedCount} cache entries for ${productIds.length} products`);
        return deletedCount;
      }
      
      return 0;
    } catch (error) {
      console.error('❌ Batch cache invalidation failed:', error);
      Sentry.captureException(error);
      throw error;
    }
  }

  /**
   * 캐시 히트율 추적
   */
  async trackCacheHitRate(productId, isHit) {
    try {
      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const hitKey = `cache:hits:${date}`;
      const missKey = `cache:misses:${date}`;
      
      if (isHit) {
        await this.redis.incr(hitKey);
        await this.redis.expire(hitKey, 86400 * 7); // 7일 보관
      } else {
        await this.redis.incr(missKey);
        await this.redis.expire(missKey, 86400 * 7); // 7일 보관
      }
    } catch (error) {
      console.error('❌ Error tracking cache hit rate:', error);
      // 히트율 추적 실패는 메인 로직에 영향을 주지 않음
    }
  }

  /**
   * 캐시 히트율 조회
   */
  async getCacheHitRate(days = 7) {
    try {
      const stats = [];
      
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const hitKey = `cache:hits:${dateStr}`;
        const missKey = `cache:misses:${dateStr}`;
        
        const [hits, misses] = await Promise.all([
          this.redis.get(hitKey),
          this.redis.get(missKey)
        ]);
        
        const hitCount = parseInt(hits || '0');
        const missCount = parseInt(misses || '0');
        const total = hitCount + missCount;
        const hitRate = total > 0 ? (hitCount / total * 100).toFixed(2) : '0.00';
        
        stats.push({
          date: dateStr,
          hits: hitCount,
          misses: missCount,
          total,
          hitRate: parseFloat(hitRate)
        });
      }
      
      return stats;
    } catch (error) {
      console.error('❌ Error getting cache hit rate:', error);
      Sentry.captureException(error);
      return [];
    }
  }
}

// Singleton instance
const cacheService = new CacheService();

module.exports = {
  cacheService
};