const request = require('supertest');
const express = require('express');
const kafkaRouter = require('../routes/kafka');
const kafkaProducer = require('../services/kafkaProducer');
const kafkaService = require('../services/kafkaService');

// Mock Kafka 서비스
jest.mock('../services/kafkaProducer');
jest.mock('../services/kafkaService');
jest.mock('../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

describe('Kafka Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/kafka', kafkaRouter);
    
    // Mock 초기화
    jest.clearAllMocks();
  });

  describe('POST /api/kafka/search', () => {
    it('should handle product search request successfully', async () => {
      const mockResult = {
        success: true,
        messageId: 'search_123456_abcd1234',
        message: '상품 검색 요청이 전송되었습니다.'
      };

      kafkaProducer.searchProducts.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/kafka/search')
        .send({
          query: '아이폰 15',
          options: { limit: 10 }
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(kafkaProducer.searchProducts).toHaveBeenCalledWith('아이폰 15', {
        limit: 10,
        userId: 'anonymous'
      });
    });

    it('should return 400 for empty search query', async () => {
      const response = await request(app)
        .post('/api/kafka/search')
        .send({
          query: '',
          options: {}
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('검색어를 입력해주세요.');
    });

    it('should handle Kafka producer errors', async () => {
      kafkaProducer.searchProducts.mockRejectedValue(new Error('Kafka connection failed'));

      const response = await request(app)
        .post('/api/kafka/search')
        .send({
          query: '테스트 상품'
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('상품 검색 요청 처리 중 오류가 발생했습니다.');
    });
  });

  describe('POST /api/kafka/analysis/realtime', () => {
    it('should handle realtime analysis request successfully', async () => {
      const mockResult = {
        success: true,
        requestId: 'req_123456_abcd1234',
        message: '실시간 분석 요청이 전송되었습니다.',
        estimatedTime: 120
      };

      kafkaProducer.requestRealtimeAnalysis.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/kafka/analysis/realtime')
        .send({
          productId: 'product_123',
          options: { includeKeywords: true }
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(kafkaProducer.requestRealtimeAnalysis).toHaveBeenCalledWith('product_123', {
        includeKeywords: true,
        userId: 'anonymous'
      });
    });

    it('should return 400 for missing productId', async () => {
      const response = await request(app)
        .post('/api/kafka/analysis/realtime')
        .send({
          options: {}
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('상품 ID를 입력해주세요.');
    });
  });

  describe('POST /api/kafka/analysis/batch', () => {
    it('should handle batch analysis request successfully', async () => {
      const mockResult = {
        success: true,
        requestId: 'batch_123456_abcd1234',
        message: '배치 분석 요청이 전송되었습니다.',
        estimatedTime: 3600
      };

      kafkaProducer.requestBatchAnalysis.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/kafka/analysis/batch')
        .send({
          productId: 'product_123',
          options: { includeTrends: true }
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(kafkaProducer.requestBatchAnalysis).toHaveBeenCalledWith('product_123', {
        includeTrends: true,
        userId: 'anonymous'
      });
    });
  });

  describe('POST /api/kafka/watchlist/add', () => {
    it('should return 401 for unauthenticated user', async () => {
      const response = await request(app)
        .post('/api/kafka/watchlist/add')
        .send({
          productId: 'product_123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('로그인이 필요합니다.');
    });

    it('should handle watchlist add request for authenticated user', async () => {
      const mockResult = {
        success: true,
        messageId: 'watchlist_123456_abcd1234',
        message: '관심 상품 등록 요청이 전송되었습니다.'
      };

      kafkaProducer.addToWatchlist.mockResolvedValue(mockResult);

      // Mock authenticated user
      const authenticatedApp = express();
      authenticatedApp.use(express.json());
      authenticatedApp.use((req, res, next) => {
        req.user = { id: 'user_123' };
        next();
      });
      authenticatedApp.use('/api/kafka', kafkaRouter);

      const response = await request(authenticatedApp)
        .post('/api/kafka/watchlist/add')
        .send({
          productId: 'product_123',
          options: { frequency: 'daily' }
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(kafkaProducer.addToWatchlist).toHaveBeenCalledWith('product_123', 'user_123', {
        frequency: 'daily'
      });
    });
  });

  describe('POST /api/kafka/analysis/multi-batch', () => {
    it('should handle multi-product batch analysis successfully', async () => {
      const mockResult = {
        success: true,
        jobId: 'batch_123456_abcd1234',
        message: '3개 상품의 배치 분석 작업이 등록되었습니다.',
        productCount: 3
      };

      kafkaProducer.requestMultiProductBatch.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/kafka/analysis/multi-batch')
        .send({
          productIds: ['product_1', 'product_2', 'product_3'],
          schedule: 'daily',
          options: { notifications: true }
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(kafkaProducer.requestMultiProductBatch).toHaveBeenCalledWith(
        ['product_1', 'product_2', 'product_3'],
        'daily',
        { notifications: true, userId: 'anonymous' }
      );
    });

    it('should return 400 for empty productIds array', async () => {
      const response = await request(app)
        .post('/api/kafka/analysis/multi-batch')
        .send({
          productIds: [],
          schedule: 'daily'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('상품 ID 목록을 입력해주세요.');
    });

    it('should return 400 for too many products', async () => {
      const productIds = Array.from({ length: 101 }, (_, i) => `product_${i}`);

      const response = await request(app)
        .post('/api/kafka/analysis/multi-batch')
        .send({
          productIds,
          schedule: 'daily'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('한 번에 최대 100개의 상품만 처리할 수 있습니다.');
    });
  });

  describe('GET /api/kafka/status', () => {
    it('should return Kafka connection status', async () => {
      kafkaProducer.isConnected.mockReturnValue(true);

      const response = await request(app)
        .get('/api/kafka/status');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.status.producer).toBe('connected');
      expect(response.body.status.timestamp).toBeDefined();
    });

    it('should return disconnected status when Kafka is not connected', async () => {
      kafkaProducer.isConnected.mockReturnValue(false);

      const response = await request(app)
        .get('/api/kafka/status');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.status.producer).toBe('disconnected');
    });
  });

  describe('POST /api/kafka/message/custom', () => {
    beforeEach(() => {
      // 테스트 환경으로 설정
      process.env.NODE_ENV = 'test';
    });

    afterEach(() => {
      // 환경 변수 복원
      delete process.env.NODE_ENV;
    });

    it('should send custom message in non-production environment', async () => {
      const mockResult = {
        success: true,
        message: '메시지가 성공적으로 전송되었습니다.'
      };

      kafkaProducer.sendCustomMessage.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/kafka/message/custom')
        .send({
          topic: 'test-topic',
          message: { test: 'data' },
          options: { key: 'test-key' }
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(kafkaProducer.sendCustomMessage).toHaveBeenCalledWith(
        'test-topic',
        { test: 'data' },
        { key: 'test-key' }
      );
    });

    it('should return 403 in production environment', async () => {
      process.env.NODE_ENV = 'production';

      const response = await request(app)
        .post('/api/kafka/message/custom')
        .send({
          topic: 'test-topic',
          message: { test: 'data' }
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('프로덕션 환경에서는 사용할 수 없습니다.');
    });

    it('should return 400 for missing topic or message', async () => {
      const response = await request(app)
        .post('/api/kafka/message/custom')
        .send({
          topic: 'test-topic'
          // message 누락
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('토픽과 메시지를 입력해주세요.');
    });
  });
});