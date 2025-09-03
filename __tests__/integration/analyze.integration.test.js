const request = require('supertest');
const app = require('../../index');
const { getPool } = require('../../config/database');

// Mock external services
jest.mock('../../services/airflowClient');
jest.mock('../../services/kafkaProducer');
jest.mock('../../services/cacheService');

const airflowClient = require('../../services/airflowClient');
const kafkaProducer = require('../../services/kafkaProducer');
const cacheService = require('../../services/cacheService');

describe('Analysis API Integration Tests', () => {
  let server;
  let pool;
  let authToken;
  let userId;

  beforeAll(async () => {
    // Start server
    server = app.listen(0);
    pool = getPool();
    
    // Create test user and get auth token
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'analysis@test.com',
        password: 'TestPassword123!',
        name: 'Analysis Test User'
      });

    userId = registerResponse.body.user.id;

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'analysis@test.com',
        password: 'TestPassword123!'
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    // Clean up
    await pool.query('DELETE FROM users WHERE email LIKE %test%');
    await pool.query('DELETE FROM analysis WHERE user_id = ?', [userId]);
    await pool.end();
    server.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/analyze/airflow/single', () => {
    it('should trigger single product analysis successfully', async () => {
      // Mock Airflow client response
      airflowClient.triggerSingleProductAnalysis.mockResolvedValue({
        dagId: 'single_product_analysis',
        dagRunId: 'single_test-product_123456',
        executionDate: '2025-01-01T00:00:00Z',
        state: 'queued'
      });

      // Mock cache miss
      cacheService.get.mockResolvedValue(null);
      cacheService.set.mockResolvedValue(true);

      // Mock Kafka producer
      kafkaProducer.sendMessage.mockResolvedValue(true);

      const analysisData = {
        productId: 'test-product-123',
        productUrl: 'https://www.coupang.com/vp/products/123456',
        userId: userId
      };

      const response = await request(app)
        .post('/api/analyze/airflow/single')
        .set('Authorization', `Bearer ${authToken}`)
        .send(analysisData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.stringContaining('단일 상품 분석이 시작되었습니다'),
        dagRunId: 'single_test-product_123456',
        dagId: 'single_product_analysis',
        status: 'triggered'
      });

      // Verify Airflow client was called
      expect(airflowClient.triggerSingleProductAnalysis).toHaveBeenCalledWith({
        productId: analysisData.productId,
        productUrl: analysisData.productUrl,
        userId: analysisData.userId
      });

      // Verify cache was set
      expect(cacheService.set).toHaveBeenCalled();

      // Verify Kafka message was sent
      expect(kafkaProducer.sendMessage).toHaveBeenCalledWith(
        'analysis-requests',
        expect.objectContaining({
          type: 'single_product_analysis_started',
          productId: analysisData.productId,
          userId: analysisData.userId
        })
      );
    });

    it('should return cached result if analysis is in progress', async () => {
      // Mock cache hit
      cacheService.get.mockResolvedValue({
        dagRunId: 'existing-dag-run',
        status: 'triggered'
      });

      const analysisData = {
        productId: 'cached-product-123',
        productUrl: 'https://www.coupang.com/vp/products/123456',
        userId: userId
      };

      const response = await request(app)
        .post('/api/analyze/airflow/single')
        .set('Authorization', `Bearer ${authToken}`)
        .send(analysisData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.stringContaining('이미 분석이 진행 중입니다'),
        status: 'in_progress',
        cached: true
      });

      // Verify Airflow client was not called
      expect(airflowClient.triggerSingleProductAnalysis).not.toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/analyze/airflow/single')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('Product ID is required')
      });
    });

    it('should validate product URL format', async () => {
      const analysisData = {
        productId: 'test-product-123',
        productUrl: 'invalid-url',
        userId: userId
      };

      const response = await request(app)
        .post('/api/analyze/airflow/single')
        .set('Authorization', `Bearer ${authToken}`)
        .send(analysisData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('Valid product URL is required')
      });
    });

    it('should require authentication', async () => {
      const analysisData = {
        productId: 'test-product-123',
        productUrl: 'https://www.coupang.com/vp/products/123456',
        userId: userId
      };

      const response = await request(app)
        .post('/api/analyze/airflow/single')
        .send(analysisData)
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('인증 토큰이 필요합니다')
      });
    });

    it('should handle Airflow client errors', async () => {
      // Mock Airflow client error
      airflowClient.triggerSingleProductAnalysis.mockRejectedValue(
        new Error('Airflow connection failed')
      );

      cacheService.get.mockResolvedValue(null);

      const analysisData = {
        productId: 'error-product-123',
        productUrl: 'https://www.coupang.com/vp/products/123456',
        userId: userId
      };

      const response = await request(app)
        .post('/api/analyze/airflow/single')
        .set('Authorization', `Bearer ${authToken}`)
        .send(analysisData)
        .expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('단일 상품 분석 요청 중 오류가 발생했습니다')
      });
    });
  });

  describe('POST /api/analyze/airflow/multi', () => {
    it('should trigger multi product analysis successfully', async () => {
      // Mock Airflow client response
      airflowClient.triggerMultiProductAnalysis.mockResolvedValue({
        dagId: 'multi_product_analysis',
        dagRunId: 'multi_smartphone_123456',
        executionDate: '2025-01-01T00:00:00Z',
        state: 'queued'
      });

      cacheService.get.mockResolvedValue(null);
      cacheService.set.mockResolvedValue(true);
      kafkaProducer.sendMessage.mockResolvedValue(true);

      const analysisData = {
        searchQuery: 'smartphone',
        userId: userId,
        maxProducts: 10
      };

      const response = await request(app)
        .post('/api/analyze/airflow/multi')
        .set('Authorization', `Bearer ${authToken}`)
        .send(analysisData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.stringContaining('다중 상품 분석이 시작되었습니다'),
        dagRunId: 'multi_smartphone_123456',
        dagId: 'multi_product_analysis',
        status: 'triggered'
      });

      expect(airflowClient.triggerMultiProductAnalysis).toHaveBeenCalledWith({
        searchQuery: analysisData.searchQuery,
        userId: analysisData.userId,
        maxProducts: analysisData.maxProducts
      });
    });

    it('should use default maxProducts if not provided', async () => {
      airflowClient.triggerMultiProductAnalysis.mockResolvedValue({
        dagId: 'multi_product_analysis',
        dagRunId: 'multi_default_123456',
        executionDate: '2025-01-01T00:00:00Z',
        state: 'queued'
      });

      cacheService.get.mockResolvedValue(null);
      cacheService.set.mockResolvedValue(true);
      kafkaProducer.sendMessage.mockResolvedValue(true);

      const analysisData = {
        searchQuery: 'laptop',
        userId: userId
        // maxProducts not provided
      };

      await request(app)
        .post('/api/analyze/airflow/multi')
        .set('Authorization', `Bearer ${authToken}`)
        .send(analysisData)
        .expect(200);

      expect(airflowClient.triggerMultiProductAnalysis).toHaveBeenCalledWith({
        searchQuery: analysisData.searchQuery,
        userId: analysisData.userId,
        maxProducts: 10 // default value
      });
    });

    it('should validate maxProducts range', async () => {
      const analysisData = {
        searchQuery: 'tablet',
        userId: userId,
        maxProducts: 100 // exceeds maximum
      };

      const response = await request(app)
        .post('/api/analyze/airflow/multi')
        .set('Authorization', `Bearer ${authToken}`)
        .send(analysisData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('Max products must be between 1 and 50')
      });
    });
  });

  describe('POST /api/analyze/airflow/watchlist', () => {
    it('should trigger watchlist analysis successfully', async () => {
      airflowClient.triggerWatchlistAnalysis.mockResolvedValue({
        dagId: 'watchlist_batch_analysis',
        dagRunId: 'watchlist_user123_123456',
        executionDate: '2025-01-01T00:00:00Z',
        state: 'queued'
      });

      cacheService.get.mockResolvedValue(null);
      cacheService.set.mockResolvedValue(true);
      kafkaProducer.sendMessage.mockResolvedValue(true);

      const analysisData = {
        userId: userId,
        productIds: ['product-1', 'product-2', 'product-3']
      };

      const response = await request(app)
        .post('/api/analyze/airflow/watchlist')
        .set('Authorization', `Bearer ${authToken}`)
        .send(analysisData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.stringContaining('관심 상품 배치 분석이 시작되었습니다'),
        dagRunId: 'watchlist_user123_123456',
        dagId: 'watchlist_batch_analysis',
        status: 'triggered'
      });

      expect(airflowClient.triggerWatchlistAnalysis).toHaveBeenCalledWith({
        userId: analysisData.userId,
        productIds: analysisData.productIds
      });
    });

    it('should validate productIds array', async () => {
      const analysisData = {
        userId: userId,
        productIds: [] // empty array
      };

      const response = await request(app)
        .post('/api/analyze/airflow/watchlist')
        .set('Authorization', `Bearer ${authToken}`)
        .send(analysisData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('Product IDs must be an array with 1-100 items')
      });
    });

    it('should validate maximum productIds limit', async () => {
      const analysisData = {
        userId: userId,
        productIds: Array(101).fill().map((_, i) => `product-${i}`) // 101 items
      };

      const response = await request(app)
        .post('/api/analyze/airflow/watchlist')
        .set('Authorization', `Bearer ${authToken}`)
        .send(analysisData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('Product IDs must be an array with 1-100 items')
      });
    });
  });

  describe('GET /api/analyze/airflow/status/:dagId/:dagRunId', () => {
    it('should get DAG run status successfully', async () => {
      // Mock analysis service response
      const mockStatus = {
        dagId: 'test-dag',
        dagRunId: 'test-run-123',
        state: 'running',
        executionDate: '2025-01-01T00:00:00Z',
        startDate: '2025-01-01T00:01:00Z',
        endDate: null,
        tasks: [
          {
            taskId: 'start_task',
            state: 'success',
            startDate: '2025-01-01T00:01:00Z',
            endDate: '2025-01-01T00:02:00Z',
            duration: 60
          }
        ],
        progress: {
          total: 3,
          completed: 1,
          failed: 0,
          running: 1,
          percentage: 33
        }
      };

      // Mock the analysis service method
      const analysisService = require('../../services/analysisService');
      jest.spyOn(analysisService, 'getAnalysisStatus').mockResolvedValue(mockStatus);

      const response = await request(app)
        .get('/api/analyze/airflow/status/test-dag/test-run-123')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        dagId: 'test-dag',
        dagRunId: 'test-run-123',
        state: 'running',
        progress: {
          total: 3,
          completed: 1,
          percentage: 33
        }
      });
    });

    it('should handle DAG run not found', async () => {
      const analysisService = require('../../services/analysisService');
      const error = new Error('DAG run not found');
      error.response = { status: 404 };
      
      jest.spyOn(analysisService, 'getAnalysisStatus').mockRejectedValue(error);

      const response = await request(app)
        .get('/api/analyze/airflow/status/nonexistent-dag/nonexistent-run')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('DAG Run을 찾을 수 없습니다')
      });
    });

    it('should validate DAG ID parameter', async () => {
      const response = await request(app)
        .get('/api/analyze/airflow/status//test-run-123')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('DAG ID is required')
      });
    });
  });

  describe('GET /api/analyze/airflow/active/:userId', () => {
    it('should get active analyses for user', async () => {
      const analysisService = require('../../services/analysisService');
      const mockAnalyses = [
        {
          dagId: 'single_product_analysis',
          dagRunId: 'single_test_123',
          type: 'single',
          status: 'running',
          createdAt: '2025-01-01T00:00:00Z'
        }
      ];

      jest.spyOn(analysisService, 'getActiveAnalyses').mockResolvedValue(mockAnalyses);

      const response = await request(app)
        .get(`/api/analyze/airflow/active/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        analyses: mockAnalyses,
        count: 1
      });
    });

    it('should return empty array for user with no active analyses', async () => {
      const analysisService = require('../../services/analysisService');
      jest.spyOn(analysisService, 'getActiveAnalyses').mockResolvedValue([]);

      const response = await request(app)
        .get(`/api/analyze/airflow/active/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        analyses: [],
        count: 0
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle service unavailable errors', async () => {
      airflowClient.triggerSingleProductAnalysis.mockRejectedValue(
        new Error('Service temporarily unavailable')
      );

      cacheService.get.mockResolvedValue(null);

      const analysisData = {
        productId: 'service-error-123',
        productUrl: 'https://www.coupang.com/vp/products/123456',
        userId: userId
      };

      const response = await request(app)
        .post('/api/analyze/airflow/single')
        .set('Authorization', `Bearer ${authToken}`)
        .send(analysisData)
        .expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('단일 상품 분석 요청 중 오류가 발생했습니다')
      });
    });

    it('should handle cache service errors gracefully', async () => {
      cacheService.get.mockRejectedValue(new Error('Cache connection failed'));

      const analysisData = {
        productId: 'cache-error-123',
        productUrl: 'https://www.coupang.com/vp/products/123456',
        userId: userId
      };

      const response = await request(app)
        .post('/api/analyze/airflow/single')
        .set('Authorization', `Bearer ${authToken}`)
        .send(analysisData)
        .expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.any(String)
      });
    });
  });
});