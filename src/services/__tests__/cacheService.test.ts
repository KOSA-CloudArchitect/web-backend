import { CacheService } from '../cacheService';
import { AnalysisResult } from '../../models/analysis';

// Mock ioredis
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    ping: jest.fn(),
    info: jest.fn(),
    on: jest.fn(),
    quit: jest.fn(),
  }));
});

// Mock Redis config
jest.mock('../../config/redis', () => ({
  getRedisClient: jest.fn(() => mockRedis),
  CacheKeys: {
    analysisResult: (productId: string) => `analysis:result:${productId}`,
    analysisStatus: (productId: string) => `analysis:status:${productId}`,
    analysisTask: (taskId: string) => `analysis:task:${taskId}`,
  },
  CacheTTL: {
    ANALYSIS_RESULT: 3600,
    ANALYSIS_STATUS: 300,
    ANALYSIS_TASK: 1800,
  },
}));

const mockRedis = {
  get: jest.fn(),
  setex: jest.fn(),
  del: jest.fn(),
  ping: jest.fn(),
  info: jest.fn(),
  on: jest.fn(),
  quit: jest.fn(),
};

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    cacheService = new CacheService();
    jest.clearAllMocks();
  });

  describe('getAnalysisResult', () => {
    it('should return cached analysis result when cache hit', async () => {
      const mockResult: AnalysisResult = {
        id: 'test-id',
        productId: 'product-123',
        taskId: 'task-123',
        status: 'completed',
        sentiment: { positive: 70, negative: 20, neutral: 10 },
        summary: 'Test summary',
        keywords: ['quality', 'price'],
        totalReviews: 100,
      };

      mockRedis.get.mockResolvedValue(JSON.stringify(mockResult));

      const result = await cacheService.getAnalysisResult('product-123');

      expect(mockRedis.get).toHaveBeenCalledWith('analysis:result:product-123');
      expect(result).toEqual(mockResult);
    });

    it('should return null when cache miss', async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await cacheService.getAnalysisResult('product-123');

      expect(mockRedis.get).toHaveBeenCalledWith('analysis:result:product-123');
      expect(result).toBeNull();
    });

    it('should return null when Redis error occurs', async () => {
      mockRedis.get.mockRejectedValue(new Error('Redis connection error'));

      const result = await cacheService.getAnalysisResult('product-123');

      expect(result).toBeNull();
    });
  });

  describe('setAnalysisResult', () => {
    it('should cache analysis result with correct TTL', async () => {
      const mockResult: AnalysisResult = {
        id: 'test-id',
        productId: 'product-123',
        taskId: 'task-123',
        status: 'completed',
        sentiment: { positive: 70, negative: 20, neutral: 10 },
        summary: 'Test summary',
        keywords: ['quality', 'price'],
        totalReviews: 100,
      };

      mockRedis.setex.mockResolvedValue('OK');

      await cacheService.setAnalysisResult('product-123', mockResult);

      expect(mockRedis.setex).toHaveBeenCalledWith(
        'analysis:result:product-123',
        3600,
        JSON.stringify(mockResult)
      );
    });

    it('should handle Redis errors gracefully', async () => {
      const mockResult: AnalysisResult = {
        id: 'test-id',
        productId: 'product-123',
        taskId: 'task-123',
        status: 'completed',
      };

      mockRedis.setex.mockRejectedValue(new Error('Redis connection error'));

      // Should not throw error
      await expect(cacheService.setAnalysisResult('product-123', mockResult)).resolves.toBeUndefined();
    });
  });

  describe('getAnalysisStatus', () => {
    it('should return cached status when cache hit', async () => {
      const mockStatus = {
        status: 'processing',
        progress: 50,
        estimatedTime: 120,
      };

      mockRedis.get.mockResolvedValue(JSON.stringify(mockStatus));

      const result = await cacheService.getAnalysisStatus('product-123');

      expect(mockRedis.get).toHaveBeenCalledWith('analysis:status:product-123');
      expect(result).toEqual(mockStatus);
    });

    it('should return null when cache miss', async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await cacheService.getAnalysisStatus('product-123');

      expect(result).toBeNull();
    });
  });

  describe('setAnalysisStatus', () => {
    it('should cache analysis status with correct TTL', async () => {
      const mockStatus = {
        status: 'processing',
        progress: 50,
        estimatedTime: 120,
      };

      mockRedis.setex.mockResolvedValue('OK');

      await cacheService.setAnalysisStatus('product-123', mockStatus);

      expect(mockRedis.setex).toHaveBeenCalledWith(
        'analysis:status:product-123',
        300,
        JSON.stringify(mockStatus)
      );
    });
  });

  describe('invalidateAnalysisCache', () => {
    it('should delete all related cache keys', async () => {
      mockRedis.del.mockResolvedValue(2);

      await cacheService.invalidateAnalysisCache('product-123', 'task-123');

      expect(mockRedis.del).toHaveBeenCalledWith(
        'analysis:result:product-123',
        'analysis:status:product-123',
        'analysis:task:task-123'
      );
    });

    it('should delete only product-related keys when taskId not provided', async () => {
      mockRedis.del.mockResolvedValue(2);

      await cacheService.invalidateAnalysisCache('product-123');

      expect(mockRedis.del).toHaveBeenCalledWith(
        'analysis:result:product-123',
        'analysis:status:product-123'
      );
    });
  });

  describe('healthCheck', () => {
    it('should return healthy status when Redis is responsive', async () => {
      mockRedis.ping.mockResolvedValue('PONG');

      const result = await cacheService.healthCheck();

      expect(result.status).toBe('healthy');
      expect(result.latency).toBeGreaterThanOrEqual(0);
    });

    it('should return unhealthy status when Redis is not responsive', async () => {
      mockRedis.ping.mockRejectedValue(new Error('Connection failed'));

      const result = await cacheService.healthCheck();

      expect(result.status).toBe('unhealthy');
      expect(result.latency).toBeUndefined();
    });
  });

  describe('getCacheStats', () => {
    it('should return cache statistics', async () => {
      const mockMemoryInfo = 'used_memory:1024\\r\\nused_memory_human:1K\\r\\n';
      const mockKeyspaceInfo = 'db0:keys=10,expires=5,avg_ttl=3600\\r\\n';

      mockRedis.info.mockImplementation((section: string) => {
        if (section === 'memory') return Promise.resolve(mockMemoryInfo);
        if (section === 'keyspace') return Promise.resolve(mockKeyspaceInfo);
        return Promise.resolve('');
      });

      const result = await cacheService.getCacheStats();

      expect(result).toEqual({
        memory: mockMemoryInfo,
        keyspace: mockKeyspaceInfo,
        timestamp: expect.any(String),
      });
    });

    it('should return null when Redis error occurs', async () => {
      mockRedis.info.mockRejectedValue(new Error('Redis connection error'));

      const result = await cacheService.getCacheStats();

      expect(result).toBeNull();
    });
  });
});