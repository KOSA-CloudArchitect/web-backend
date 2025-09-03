const { cacheService } = require('../cacheService');
const { getRedisClient } = require('../../config/redis');

// Mock Redis client
jest.mock('../../config/redis');
jest.mock('../../config/sentry', () => ({
  Sentry: {
    captureException: jest.fn(),
  },
}));

describe('CacheService', () => {
  let mockRedis;

  beforeEach(() => {
    mockRedis = {
      get: jest.fn(),
      setex: jest.fn(),
      del: jest.fn(),
      ping: jest.fn(),
      info: jest.fn(),
      incr: jest.fn(),
      expire: jest.fn(),
    };
    
    getRedisClient.mockReturnValue(mockRedis);
    
    // Reset console methods
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAnalysisResult', () => {
    it('should return cached result when cache hit', async () => {
      const productId = 'test-product-123';
      const cachedData = {
        productId,
        sentiment: { positive: 70, negative: 20, neutral: 10 },
        summary: 'Test summary',
      };
      
      mockRedis.get.mockResolvedValue(JSON.stringify(cachedData));

      const result = await cacheService.getAnalysisResult(productId);

      expect(mockRedis.get).toHaveBeenCalledWith('analysis:result:test-product-123');
      expect(result).toEqual(cachedData);
      expect(console.log).toHaveBeenCalledWith('✅ Cache hit for analysis result: test-product-123');
    });

    it('should return null when cache miss', async () => {
      const productId = 'test-product-123';
      
      mockRedis.get.mockResolvedValue(null);

      const result = await cacheService.getAnalysisResult(productId);

      expect(mockRedis.get).toHaveBeenCalledWith('analysis:result:test-product-123');
      expect(result).toBeNull();
      expect(console.log).toHaveBeenCalledWith('🔍 Cache miss for analysis result: test-product-123');
    });

    it('should handle Redis errors gracefully', async () => {
      const productId = 'test-product-123';
      const error = new Error('Redis connection failed');
      
      mockRedis.get.mockRejectedValue(error);

      const result = await cacheService.getAnalysisResult(productId);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        '❌ Error getting analysis result from cache for test-product-123:',
        error
      );
    });
  });

  describe('setAnalysisResult', () => {
    it('should cache analysis result with TTL', async () => {
      const productId = 'test-product-123';
      const result = {
        productId,
        sentiment: { positive: 70, negative: 20, neutral: 10 },
        summary: 'Test summary',
      };
      
      mockRedis.setex.mockResolvedValue('OK');

      await cacheService.setAnalysisResult(productId, result);

      expect(mockRedis.setex).toHaveBeenCalledWith(
        'analysis:result:test-product-123',
        3600, // TTL
        JSON.stringify(result)
      );
      expect(console.log).toHaveBeenCalledWith('✅ Cached analysis result for product: test-product-123');
    });

    it('should handle caching errors gracefully', async () => {
      const productId = 'test-product-123';
      const result = { productId };
      const error = new Error('Redis write failed');
      
      mockRedis.setex.mockRejectedValue(error);

      // Should not throw
      await expect(cacheService.setAnalysisResult(productId, result)).resolves.toBeUndefined();
      
      expect(console.error).toHaveBeenCalledWith(
        '❌ Error setting analysis result cache for test-product-123:',
        error
      );
    });
  });

  describe('invalidateAnalysisCache', () => {
    it('should delete cache keys for product', async () => {
      const productId = 'test-product-123';
      const taskId = 'task-456';
      
      mockRedis.del.mockResolvedValue(3);

      await cacheService.invalidateAnalysisCache(productId, taskId);

      expect(mockRedis.del).toHaveBeenCalledWith(
        'analysis:result:test-product-123',
        'analysis:status:test-product-123',
        'analysis:task:task-456'
      );
      expect(console.log).toHaveBeenCalledWith('🗑️ Invalidated 3 cache entries for product: test-product-123');
    });

    it('should delete cache keys without taskId', async () => {
      const productId = 'test-product-123';
      
      mockRedis.del.mockResolvedValue(2);

      await cacheService.invalidateAnalysisCache(productId);

      expect(mockRedis.del).toHaveBeenCalledWith(
        'analysis:result:test-product-123',
        'analysis:status:test-product-123'
      );
      expect(console.log).toHaveBeenCalledWith('🗑️ Invalidated 2 cache entries for product: test-product-123');
    });
  });

  describe('healthCheck', () => {
    it('should return healthy status with latency', async () => {
      mockRedis.ping.mockResolvedValue('PONG');
      
      const start = Date.now();
      const result = await cacheService.healthCheck();
      const end = Date.now();

      expect(mockRedis.ping).toHaveBeenCalled();
      expect(result.status).toBe('healthy');
      expect(result.latency).toBeGreaterThanOrEqual(0);
      expect(result.latency).toBeLessThan(end - start + 10); // Allow some margin
    });

    it('should return unhealthy status on Redis error', async () => {
      mockRedis.ping.mockRejectedValue(new Error('Redis down'));

      const result = await cacheService.healthCheck();

      expect(result.status).toBe('unhealthy');
      expect(result.latency).toBeUndefined();
    });
  });

  describe('batchInvalidateCache', () => {
    it('should invalidate cache for multiple products', async () => {
      const productIds = ['product-1', 'product-2', 'product-3'];
      
      mockRedis.del.mockResolvedValue(6);

      const result = await cacheService.batchInvalidateCache(productIds);

      expect(mockRedis.del).toHaveBeenCalledWith(
        'analysis:result:product-1',
        'analysis:status:product-1',
        'analysis:result:product-2',
        'analysis:status:product-2',
        'analysis:result:product-3',
        'analysis:status:product-3'
      );
      expect(result).toBe(6);
      expect(console.log).toHaveBeenCalledWith('🗑️ Batch invalidated 6 cache entries for 3 products');
    });

    it('should return 0 for empty product list', async () => {
      const result = await cacheService.batchInvalidateCache([]);

      expect(mockRedis.del).not.toHaveBeenCalled();
      expect(result).toBe(0);
    });
  });

  describe('trackCacheHitRate', () => {
    it('should increment hit counter', async () => {
      const productId = 'test-product';
      const today = new Date().toISOString().split('T')[0];
      
      mockRedis.incr.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);

      await cacheService.trackCacheHitRate(productId, true);

      expect(mockRedis.incr).toHaveBeenCalledWith(`cache:hits:${today}`);
      expect(mockRedis.expire).toHaveBeenCalledWith(`cache:hits:${today}`, 86400 * 7);
    });

    it('should increment miss counter', async () => {
      const productId = 'test-product';
      const today = new Date().toISOString().split('T')[0];
      
      mockRedis.incr.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);

      await cacheService.trackCacheHitRate(productId, false);

      expect(mockRedis.incr).toHaveBeenCalledWith(`cache:misses:${today}`);
      expect(mockRedis.expire).toHaveBeenCalledWith(`cache:misses:${today}`, 86400 * 7);
    });

    it('should handle tracking errors gracefully', async () => {
      const productId = 'test-product';
      
      mockRedis.incr.mockRejectedValue(new Error('Redis error'));

      // Should not throw
      await expect(cacheService.trackCacheHitRate(productId, true)).resolves.toBeUndefined();
      
      expect(console.error).toHaveBeenCalledWith('❌ Error tracking cache hit rate:', expect.any(Error));
    });
  });

  describe('getCacheHitRate', () => {
    it('should return hit rate statistics', async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Mock Redis responses for hits and misses
      mockRedis.get
        .mockResolvedValueOnce('80') // hits for today
        .mockResolvedValueOnce('20') // misses for today
        .mockResolvedValueOnce('60') // hits for yesterday
        .mockResolvedValueOnce('40'); // misses for yesterday

      const result = await cacheService.getCacheHitRate(2);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        date: today,
        hits: 80,
        misses: 20,
        total: 100,
        hitRate: 80.00
      });
      expect(result[1].hits).toBe(60);
      expect(result[1].misses).toBe(40);
      expect(result[1].hitRate).toBe(60.00);
    });

    it('should handle missing data gracefully', async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await cacheService.getCacheHitRate(1);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        date: expect.any(String),
        hits: 0,
        misses: 0,
        total: 0,
        hitRate: 0.00
      });
    });
  });
});