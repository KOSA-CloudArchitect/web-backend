import request from 'supertest';
import express from 'express';
import analyzeRouter from '../analyze';
import { errorHandler } from '../../middleware/errorHandler';

// Mock httpClient
jest.mock('../../services/httpClient', () => ({
  requestAnalysis: jest.fn(),
  checkAnalysisStatus: jest.fn(),
}));

import httpClient from '../../services/httpClient';

const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('Analyze Router', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/analyze', analyzeRouter);
    app.use(errorHandler);
    
    // Mock io
    app.set('io', {
      emit: jest.fn(),
    });

    jest.clearAllMocks();
  });

  describe('POST /api/analyze', () => {
    it('should start analysis successfully', async () => {
      const mockResponse = {
        taskId: 'task-123',
        status: 'pending',
        estimatedTime: 120,
      };

      mockedHttpClient.requestAnalysis.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/analyze')
        .send({
          productId: 'product-123',
          url: 'https://example.com/product',
          keywords: ['test', 'product'],
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: '분석이 시작되었습니다.',
        taskId: 'task-123',
        estimatedTime: 120,
      });

      expect(mockedHttpClient.requestAnalysis).toHaveBeenCalledWith({
        productId: 'product-123',
        url: 'https://example.com/product',
        keywords: ['test', 'product'],
        callbackUrl: 'http://localhost:3001/api/analyze/callback',
      });
    });

    it('should return validation error for missing productId', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({
          url: 'https://example.com/product',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return validation error for invalid URL', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({
          productId: 'product-123',
          url: 'invalid-url',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should handle external service connection error', async () => {
      const error = new Error('Connection refused');
      (error as any).code = 'ECONNREFUSED';
      
      mockedHttpClient.requestAnalysis.mockRejectedValue(error);

      const response = await request(app)
        .post('/api/analyze')
        .send({
          productId: 'product-123',
        });

      expect(response.status).toBe(502);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('EXTERNAL_SERVICE_ERROR');
    });

    it('should handle timeout error', async () => {
      const error = new Error('Timeout');
      (error as any).code = 'ETIMEDOUT';
      
      mockedHttpClient.requestAnalysis.mockRejectedValue(error);

      const response = await request(app)
        .post('/api/analyze')
        .send({
          productId: 'product-123',
        });

      expect(response.status).toBe(408);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('TIMEOUT_ERROR');
    });

    it('should handle authentication error from external service', async () => {
      const error = new Error('Unauthorized');
      (error as any).response = { status: 401 };
      
      mockedHttpClient.requestAnalysis.mockRejectedValue(error);

      const response = await request(app)
        .post('/api/analyze')
        .send({
          productId: 'product-123',
        });

      expect(response.status).toBe(502);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('EXTERNAL_AUTH_ERROR');
    });
  });

  describe('GET /api/analyze/status/:productId', () => {
    it('should return analysis status successfully', async () => {
      const mockStatus = {
        status: 'processing',
        progress: 50,
        estimatedTime: 60,
      };

      mockedHttpClient.checkAnalysisStatus.mockResolvedValue(mockStatus);

      const response = await request(app)
        .get('/api/analyze/status/product-123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStatus);

      expect(mockedHttpClient.checkAnalysisStatus).toHaveBeenCalledWith('product-123');
    });

    it('should handle not found error', async () => {
      const error = new Error('Not found');
      (error as any).response = { status: 404 };
      
      mockedHttpClient.checkAnalysisStatus.mockRejectedValue(error);

      const response = await request(app)
        .get('/api/analyze/status/product-123');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ANALYSIS_NOT_FOUND');
    });

    it('should return validation error for empty productId', async () => {
      const response = await request(app)
        .get('/api/analyze/status/');

      expect(response.status).toBe(404); // Route not found
    });
  });

  describe('POST /api/analyze/callback', () => {
    it('should process callback successfully', async () => {
      const mockIo = {
        emit: jest.fn(),
      };
      app.set('io', mockIo);

      const response = await request(app)
        .post('/api/analyze/callback')
        .send({
          taskId: 'task-123',
          status: 'completed',
          result: {
            sentiment: { positive: 70, negative: 20, neutral: 10 },
            summary: 'Test summary',
          },
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: '콜백 처리 완료',
      });

      expect(mockIo.emit).toHaveBeenCalledWith('analysis:task-123', {
        status: 'completed',
        result: {
          sentiment: { positive: 70, negative: 20, neutral: 10 },
          summary: 'Test summary',
        },
        error: undefined,
        timestamp: expect.any(String),
      });
    });

    it('should handle callback with error status', async () => {
      const mockIo = {
        emit: jest.fn(),
      };
      app.set('io', mockIo);

      const response = await request(app)
        .post('/api/analyze/callback')
        .send({
          taskId: 'task-123',
          status: 'failed',
          error: 'Analysis failed',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      expect(mockIo.emit).toHaveBeenCalledWith('analysis:task-123', {
        status: 'failed',
        result: undefined,
        error: 'Analysis failed',
        timestamp: expect.any(String),
      });
    });
  });

  describe('GET /api/analyze/result/:productId', () => {
    it('should return analysis result successfully', async () => {
      const response = await request(app)
        .get('/api/analyze/result/product-123');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.status).toBe('completed');
      expect(response.body.result).toEqual({
        productId: 'product-123',
        sentiment: {
          positive: 65,
          negative: 20,
          neutral: 15,
        },
        summary: '이 상품은 전반적으로 긍정적인 평가를 받고 있습니다.',
        keywords: ['가성비', '품질', '배송'],
        totalReviews: 150,
      });
    });

    it('should return validation error for empty productId', async () => {
      const response = await request(app)
        .get('/api/analyze/result/');

      expect(response.status).toBe(404); // Route not found
    });
  });
});