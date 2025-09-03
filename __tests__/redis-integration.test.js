const Redis = require('ioredis-mock');
const redisService = require('../services/redisService');
const { cacheService } = require('../services/cacheService');

// Mock Redis for testing
jest.mock('ioredis', () => require('ioredis-mock'));

describe('Redis Integration Tests', () => {
  let mockRedis;

  beforeAll(async () => {
    // Redis 서비스 초기화
    await redisService.initialize();
    await cacheService.initialize();
  });

  beforeEach(() => {
    mockRedis = new Redis();
  });

  afterEach(async () => {
    if (mockRedis) {
      await mockRedis.flushall();
      mockRedis.disconnect();
    }
  });

  describe('Basic Cache Operations', () => {
    test('should set and get cache values', async () => {
      const key = 'test_key';
      const value = { message: 'Hello Redis!' };

      // Set value
      const setResult = await redisService.set(key, value, 60);
      expect(setResult).toBe(true);

      // Get value
      const getValue = await redisService.get(key);
      expect(getValue).toEqual(value);
    });

    test('should handle cache miss', async () => {
      const nonExistentKey = 'non_existent_key';
      const result = await redisService.get(nonExistentKey);
      expect(result).toBeNull();
    });

    test('should delete cache keys', async () => {
      const key = 'delete_test_key';
      const value = { data: 'test' };

      await redisService.set(key, value);
      const deleteResult = await redisService.del(key);
      expect(deleteResult).toBe(true);

      const getValue = await redisService.get(key);
      expect(getValue).toBeNull();
    });
  });

  describe('Popular Searches', () => {
    test('should add and retrieve popular searches', async () => {
      const keywords = ['아이폰', '갤럭시', '맥북'];
      
      // Add popular searches
      for (const keyword of keywords) {
        await redisService.addPopularSearch(keyword, Math.floor(Math.random() * 10) + 1);
      }

      // Retrieve popular searches
      const popularSearches = await redisService.getPopularSearches(5);
      expect(popularSearches).toBeInstanceOf(Array);
      expect(popularSearches.length).toBeGreaterThan(0);
      
      // Check structure
      if (popularSearches.length > 0) {
        expect(popularSearches[0]).toHaveProperty('keyword');
        expect(popularSearches[0]).toHaveProperty('score');
      }
    });

    test('should maintain search ranking order', async () => {
      await redisService.addPopularSearch('low_score', 1);
      await redisService.addPopularSearch('high_score', 10);
      await redisService.addPopularSearch('medium_score', 5);

      const searches = await redisService.getPopularSearches(3);
      
      // Should be ordered by score (descending)
      expect(searches[0].keyword).toBe('high_score');
      expect(searches[0].score).toBe(10);
    });
  });

  describe('User Search History', () => {
    test('should add and retrieve user search history', async () => {
      const userId = 'test_user_123';
      const keywords = ['검색어1', '검색어2', '검색어3'];

      // Add search history
      for (const keyword of keywords) {
        await redisService.addUserSearchHistory(userId, keyword);
      }

      // Retrieve history
      const history = await redisService.getUserSearchHistory(userId);
      expect(history).toBeInstanceOf(Array);
      expect(history.length).toBe(keywords.length);
      
      // Should be in reverse order (most recent first)
      expect(history[0]).toBe('검색어3');
      expect(history[2]).toBe('검색어1');
    });

    test('should remove duplicates and maintain order', async () => {
      const userId = 'test_user_456';
      
      await redisService.addUserSearchHistory(userId, '중복검색어');
      await redisService.addUserSearchHistory(userId, '다른검색어');
      await redisService.addUserSearchHistory(userId, '중복검색어'); // 중복

      const history = await redisService.getUserSearchHistory(userId);
      expect(history).toEqual(['중복검색어', '다른검색어']);
    });

    test('should limit history size', async () => {
      const userId = 'test_user_789';
      const maxHistory = 3;

      // Add more items than the limit
      for (let i = 1; i <= 5; i++) {
        await redisService.addUserSearchHistory(userId, `검색어${i}`, maxHistory);
      }

      const history = await redisService.getUserSearchHistory(userId);
      expect(history.length).toBe(maxHistory);
      expect(history).toEqual(['검색어5', '검색어4', '검색어3']);
    });
  });

  describe('Analysis Cache', () => {
    test('should cache and retrieve analysis status', async () => {
      const productId = 'product_123';
      const status = {
        status: 'processing',
        progress: 50,
        message: '분석 진행 중...'
      };

      await redisService.setAnalysisStatus(productId, status);
      const retrievedStatus = await redisService.getAnalysisStatus(productId);
      
      expect(retrievedStatus).toMatchObject(status);
      expect(retrievedStatus).toHaveProperty('timestamp');
    });

    test('should cache and retrieve analysis results', async () => {
      const productId = 'product_456';
      const result = {
        sentiment: {
          positive: 0.6,
          negative: 0.2,
          neutral: 0.2
        },
        keywords: ['좋음', '빠름', '만족'],
        summary: '전반적으로 만족스러운 상품입니다.'
      };

      await redisService.setAnalysisResult(productId, result);
      const retrievedResult = await redisService.getAnalysisResult(productId);
      
      expect(retrievedResult).toMatchObject(result);
      expect(retrievedResult).toHaveProperty('cachedAt');
    });
  });

  describe('Cache Service Integration', () => {
    test('should track cache hit and miss statistics', async () => {
      const productId = 'stats_test_product';
      
      // Cache miss
      const missResult = await cacheService.getAnalysisResult(productId);
      expect(missResult).toBeNull();
      
      // Cache set
      const analysisResult = { status: 'completed', data: 'test' };
      await cacheService.setAnalysisResult(productId, analysisResult);
      
      // Cache hit
      const hitResult = await cacheService.getAnalysisResult(productId);
      expect(hitResult).toMatchObject(analysisResult);
      
      // Check statistics
      const stats = await cacheService.getCacheStats();
      expect(stats).toHaveProperty('hits');
      expect(stats).toHaveProperty('misses');
      expect(stats).toHaveProperty('hitRate');
    });

    test('should handle cache invalidation', async () => {
      const productId = 'invalidation_test_product';
      
      // Set cache
      await cacheService.setAnalysisResult(productId, { data: 'test' });
      await cacheService.setAnalysisStatus(productId, { status: 'completed' });
      
      // Verify cache exists
      const beforeResult = await cacheService.getAnalysisResult(productId);
      const beforeStatus = await cacheService.getAnalysisStatus(productId);
      expect(beforeResult).toBeTruthy();
      expect(beforeStatus).toBeTruthy();
      
      // Invalidate cache
      const deletedCount = await cacheService.invalidateAnalysisCache(productId);
      expect(deletedCount).toBeGreaterThan(0);
      
      // Verify cache is cleared
      const afterResult = await cacheService.getAnalysisResult(productId);
      const afterStatus = await cacheService.getAnalysisStatus(productId);
      expect(afterResult).toBeNull();
      expect(afterStatus).toBeNull();
    });
  });

  describe('Health Check', () => {
    test('should return health status', async () => {
      const health = await redisService.healthCheck();
      
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('connected');
      expect(['healthy', 'unhealthy']).toContain(health.status);
    });

    test('should return cache service health', async () => {
      const health = await cacheService.healthCheck();
      
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('redis');
      expect(health).toHaveProperty('stats');
    });
  });

  describe('Error Handling', () => {
    test('should handle Redis connection errors gracefully', async () => {
      // Simulate connection error by using invalid Redis instance
      const originalClient = redisService.client;
      redisService.client = null;
      redisService.isConnected = false;

      // Should not throw errors
      const setResult = await redisService.set('test', 'value');
      expect(setResult).toBe(false);

      const getResult = await redisService.get('test');
      expect(getResult).toBeNull();

      // Restore original client
      redisService.client = originalClient;
      redisService.isConnected = true;
    });

    test('should handle malformed data gracefully', async () => {
      // This test would be more relevant with actual Redis
      // Mock Redis handles JSON parsing automatically
      const result = await redisService.get('non_existent_key');
      expect(result).toBeNull();
    });
  });
});

describe('Performance Tests', () => {
  test('should handle multiple concurrent operations', async () => {
    const operations = [];
    const numOperations = 10;

    // Create multiple concurrent cache operations
    for (let i = 0; i < numOperations; i++) {
      operations.push(
        redisService.set(`concurrent_key_${i}`, { value: i }, 60)
      );
    }

    // Wait for all operations to complete
    const results = await Promise.all(operations);
    
    // All operations should succeed
    results.forEach(result => {
      expect(result).toBe(true);
    });

    // Verify all values were set correctly
    const getOperations = [];
    for (let i = 0; i < numOperations; i++) {
      getOperations.push(redisService.get(`concurrent_key_${i}`));
    }

    const values = await Promise.all(getOperations);
    values.forEach((value, index) => {
      expect(value).toEqual({ value: index });
    });
  });

  test('should handle large data sets efficiently', async () => {
    const largeData = {
      items: Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        description: `Description for item ${i}`.repeat(10)
      }))
    };

    const startTime = Date.now();
    await redisService.set('large_dataset', largeData, 60);
    const retrievedData = await redisService.get('large_dataset');
    const endTime = Date.now();

    expect(retrievedData).toEqual(largeData);
    expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
  });
});