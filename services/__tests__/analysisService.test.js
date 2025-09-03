// Mock dependencies first
jest.mock('../airflowClient', () => ({
  triggerSingleProductAnalysis: jest.fn(),
  triggerMultiProductAnalysis: jest.fn(),
  triggerWatchlistAnalysis: jest.fn(),
  getDagRunStatus: jest.fn(),
  getDagRunTasks: jest.fn(),
}));

jest.mock('../kafkaProducer', () => ({
  sendMessage: jest.fn(),
}));

jest.mock('../cacheService', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

const analysisService = require('../analysisService');
const airflowClient = require('../airflowClient');
const kafkaProducer = require('../kafkaProducer');
const cacheService = require('../cacheService');

describe('AnalysisService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestSingleProductAnalysis', () => {
    it('should successfully request single product analysis', async () => {
      const mockDagRun = {
        dagId: 'single_product_analysis',
        dagRunId: 'single_test-product_1234567890',
        executionDate: '2025-01-01T00:00:00Z',
        state: 'queued',
      };

      // Mock cache miss
      cacheService.get.mockResolvedValue(null);
      
      // Mock Airflow client
      airflowClient.triggerSingleProductAnalysis.mockResolvedValue(mockDagRun);
      
      // Mock cache set
      cacheService.set.mockResolvedValue(true);
      
      // Mock Kafka producer
      kafkaProducer.sendMessage.mockResolvedValue(true);

      const params = {
        productId: 'test-product',
        productUrl: 'https://example.com/product/123',
        userId: 'user-123',
      };

      const result = await analysisService.requestSingleProductAnalysis(params);

      expect(result).toEqual({
        status: 'triggered',
        dagRunId: 'single_test-product_1234567890',
        dagId: 'single_product_analysis',
        executionDate: '2025-01-01T00:00:00Z',
        message: 'Analysis started successfully',
      });

      // Verify cache was checked
      expect(cacheService.get).toHaveBeenCalledWith('analysis:single:test-product:user-123');
      
      // Verify Airflow was called
      expect(airflowClient.triggerSingleProductAnalysis).toHaveBeenCalledWith(params);
      
      // Verify cache was set
      expect(cacheService.set).toHaveBeenCalledWith(
        'analysis:single:test-product:user-123',
        expect.objectContaining({
          dagRunId: 'single_test-product_1234567890',
          productId: 'test-product',
          userId: 'user-123',
          status: 'triggered',
        }),
        1800
      );
      
      // Verify Kafka message was sent
      expect(kafkaProducer.sendMessage).toHaveBeenCalledWith(
        'analysis-requests',
        expect.objectContaining({
          type: 'single_product_analysis_started',
          dagRunId: 'single_test-product_1234567890',
          productId: 'test-product',
          userId: 'user-123',
        })
      );
    });

    it('should return cached result if analysis is already in progress', async () => {
      const cachedRequest = {
        dagRunId: 'existing-dag-run',
        productId: 'test-product',
        userId: 'user-123',
        status: 'triggered',
      };

      cacheService.get.mockResolvedValue(cachedRequest);

      const params = {
        productId: 'test-product',
        productUrl: 'https://example.com/product/123',
        userId: 'user-123',
      };

      const result = await analysisService.requestSingleProductAnalysis(params);

      expect(result).toEqual({
        status: 'in_progress',
        dagRunId: 'existing-dag-run',
        message: 'Analysis already in progress',
        cached: true,
      });

      // Verify Airflow was not called
      expect(airflowClient.triggerSingleProductAnalysis).not.toHaveBeenCalled();
    });

    it('should handle Airflow client errors', async () => {
      cacheService.get.mockResolvedValue(null);
      airflowClient.triggerSingleProductAnalysis.mockRejectedValue(new Error('Airflow error'));

      const params = {
        productId: 'test-product',
        productUrl: 'https://example.com/product/123',
        userId: 'user-123',
      };

      await expect(analysisService.requestSingleProductAnalysis(params))
        .rejects.toThrow('Airflow error');
    });
  });

  describe('requestMultiProductAnalysis', () => {
    it('should successfully request multi product analysis', async () => {
      const mockDagRun = {
        dagId: 'multi_product_analysis',
        dagRunId: 'multi_smartphone_1234567890',
        executionDate: '2025-01-01T00:00:00Z',
        state: 'queued',
      };

      cacheService.get.mockResolvedValue(null);
      airflowClient.triggerMultiProductAnalysis.mockResolvedValue(mockDagRun);
      cacheService.set.mockResolvedValue(true);
      kafkaProducer.sendMessage.mockResolvedValue(true);

      const params = {
        searchQuery: 'smartphone',
        userId: 'user-123',
        maxProducts: 10,
      };

      const result = await analysisService.requestMultiProductAnalysis(params);

      expect(result).toEqual({
        status: 'triggered',
        dagRunId: 'multi_smartphone_1234567890',
        dagId: 'multi_product_analysis',
        executionDate: '2025-01-01T00:00:00Z',
        message: 'Analysis started successfully',
      });

      expect(airflowClient.triggerMultiProductAnalysis).toHaveBeenCalledWith(params);
    });

    it('should use default maxProducts if not provided', async () => {
      const mockDagRun = {
        dagId: 'multi_product_analysis',
        dagRunId: 'multi_smartphone_1234567890',
        executionDate: '2025-01-01T00:00:00Z',
        state: 'queued',
      };

      cacheService.get.mockResolvedValue(null);
      airflowClient.triggerMultiProductAnalysis.mockResolvedValue(mockDagRun);
      cacheService.set.mockResolvedValue(true);
      kafkaProducer.sendMessage.mockResolvedValue(true);

      const params = {
        searchQuery: 'smartphone',
        userId: 'user-123',
        // maxProducts not provided
      };

      await analysisService.requestMultiProductAnalysis(params);

      expect(airflowClient.triggerMultiProductAnalysis).toHaveBeenCalledWith({
        ...params,
        maxProducts: 10, // default value
      });
    });
  });

  describe('requestWatchlistAnalysis', () => {
    it('should successfully request watchlist analysis', async () => {
      const mockDagRun = {
        dagId: 'watchlist_batch_analysis',
        dagRunId: 'watchlist_user-123_1234567890',
        executionDate: '2025-01-01T00:00:00Z',
        state: 'queued',
      };

      cacheService.get.mockResolvedValue(null);
      airflowClient.triggerWatchlistAnalysis.mockResolvedValue(mockDagRun);
      cacheService.set.mockResolvedValue(true);
      kafkaProducer.sendMessage.mockResolvedValue(true);

      const params = {
        userId: 'user-123',
        productIds: ['product-1', 'product-2', 'product-3'],
      };

      const result = await analysisService.requestWatchlistAnalysis(params);

      expect(result).toEqual({
        status: 'triggered',
        dagRunId: 'watchlist_user-123_1234567890',
        dagId: 'watchlist_batch_analysis',
        executionDate: '2025-01-01T00:00:00Z',
        message: 'Watchlist analysis started successfully',
      });

      expect(airflowClient.triggerWatchlistAnalysis).toHaveBeenCalledWith(params);
      
      // Verify cache TTL is 1 hour for watchlist
      expect(cacheService.set).toHaveBeenCalledWith(
        'analysis:watchlist:user-123',
        expect.any(Object),
        3600 // 1 hour
      );
    });
  });

  describe('getAnalysisStatus', () => {
    it('should successfully get analysis status', async () => {
      const mockDagRunStatus = {
        state: 'running',
        executionDate: '2025-01-01T00:00:00Z',
        startDate: '2025-01-01T00:01:00Z',
        endDate: null,
      };

      const mockTasks = [
        {
          taskId: 'start_task',
          state: 'success',
          startDate: '2025-01-01T00:01:00Z',
          endDate: '2025-01-01T00:02:00Z',
          duration: 60,
          tryNumber: 1,
        },
        {
          taskId: 'processing_task',
          state: 'running',
          startDate: '2025-01-01T00:02:00Z',
          endDate: null,
          duration: null,
          tryNumber: 1,
        },
        {
          taskId: 'end_task',
          state: 'queued',
          startDate: null,
          endDate: null,
          duration: null,
          tryNumber: 0,
        },
      ];

      cacheService.get.mockResolvedValue(null);
      airflowClient.getDagRunStatus.mockResolvedValue(mockDagRunStatus);
      airflowClient.getDagRunTasks.mockResolvedValue(mockTasks);
      cacheService.set.mockResolvedValue(true);

      const result = await analysisService.getAnalysisStatus('test-dag', 'test-dag-run');

      expect(result).toEqual({
        dagId: 'test-dag',
        dagRunId: 'test-dag-run',
        state: 'running',
        executionDate: '2025-01-01T00:00:00Z',
        startDate: '2025-01-01T00:01:00Z',
        endDate: null,
        tasks: mockTasks,
        progress: {
          total: 3,
          completed: 1,
          failed: 0,
          running: 1,
          percentage: 33, // 1/3 * 100, rounded
        },
        cached: false,
      });

      expect(airflowClient.getDagRunStatus).toHaveBeenCalledWith('test-dag', 'test-dag-run');
      expect(airflowClient.getDagRunTasks).toHaveBeenCalledWith('test-dag', 'test-dag-run');
    });

    it('should calculate progress correctly', async () => {
      const service = analysisService;
      
      const tasks = [
        { state: 'success' },
        { state: 'success' },
        { state: 'failed' },
        { state: 'running' },
        { state: 'queued' },
      ];

      const progress = service.calculateProgress(tasks);

      expect(progress).toEqual({
        total: 5,
        completed: 2,
        failed: 1,
        running: 1,
        percentage: 40, // 2/5 * 100
      });
    });

    it('should handle empty task list', async () => {
      const service = analysisService;
      const progress = service.calculateProgress([]);

      expect(progress).toEqual({
        total: 0,
        completed: 0,
        failed: 0,
        running: 0,
        percentage: 0,
      });
    });
  });

  describe('getActiveAnalyses', () => {
    it('should return empty array for user with no active analyses', async () => {
      const result = await analysisService.getActiveAnalyses('user-123');

      expect(result).toEqual([]);
    });

    it('should handle errors gracefully', async () => {
      // Mock an error scenario if needed
      const result = await analysisService.getActiveAnalyses('user-123');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle cache service errors in single product analysis', async () => {
      cacheService.get.mockRejectedValue(new Error('Cache error'));

      const params = {
        productId: 'test-product',
        productUrl: 'https://example.com/product/123',
        userId: 'user-123',
      };

      await expect(analysisService.requestSingleProductAnalysis(params))
        .rejects.toThrow('Cache error');
    });

    it('should handle Kafka producer errors', async () => {
      const mockDagRun = {
        dagId: 'single_product_analysis',
        dagRunId: 'single_test-product_1234567890',
        executionDate: '2025-01-01T00:00:00Z',
        state: 'queued',
      };

      cacheService.get.mockResolvedValue(null);
      airflowClient.triggerSingleProductAnalysis.mockResolvedValue(mockDagRun);
      cacheService.set.mockResolvedValue(true);
      kafkaProducer.sendMessage.mockRejectedValue(new Error('Kafka error'));

      const params = {
        productId: 'test-product',
        productUrl: 'https://example.com/product/123',
        userId: 'user-123',
      };

      await expect(analysisService.requestSingleProductAnalysis(params))
        .rejects.toThrow('Kafka error');
    });
  });
});