const request = require('supertest');
const express = require('express');

// Mock Prisma Client first
const mockPrisma = {
  product: {
    findUnique: jest.fn(),
    create: jest.fn()
  },
  watchList: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn()
  }
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma)
}));

jest.mock('../services/kafkaService', () => ({
  sendWatchlistRequest: jest.fn().mockResolvedValue('message-id')
}));

jest.mock('../middleware/auth');

const InterestProduct = require('../models/interestProduct');
const interestsRouter = require('../routes/interests');
const { authenticateToken } = require('../middleware/auth');

// Mock auth middleware
authenticateToken.mockImplementation((req, res, next) => {
  req.user = {
    id: 'test-user-id',
    email: 'test@example.com',
    role: 'user'
  };
  next();
});

const app = express();
app.use(express.json());
app.use('/api/interests', interestsRouter);

describe('InterestProduct Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('새로운 관심 상품을 등록해야 함', async () => {
      const userId = 'test-user-id';
      const productUrl = 'https://www.coupang.com/vp/products/123456';
      
      // Mock product not found, then created
      mockPrisma.product.findUnique.mockResolvedValueOnce(null);
      mockPrisma.product.create.mockResolvedValueOnce({
        id: 'product-id',
        name: 'Unknown Product',
        url: productUrl,
        isActive: true
      });

      // Mock watchlist item not found, then created
      mockPrisma.watchList.findUnique.mockResolvedValueOnce(null);
      mockPrisma.watchList.create.mockResolvedValueOnce({
        id: 'watch-item-id',
        userId,
        productId: 'product-id',
        priceAlert: true,
        targetPrice: null,
        analysisFrequency: 'daily',
        product: {
          id: 'product-id',
          name: 'Unknown Product',
          url: productUrl
        }
      });

      const result = await InterestProduct.register(userId, productUrl);

      expect(result).toHaveProperty('id', 'watch-item-id');
      expect(result).toHaveProperty('userId', userId);
      expect(result).toHaveProperty('productId', 'product-id');
      expect(mockPrisma.product.create).toHaveBeenCalledWith({
        data: {
          name: 'Unknown Product',
          url: productUrl,
          isActive: true
        }
      });
    });

    it('이미 등록된 상품에 대해 오류를 발생시켜야 함', async () => {
      const userId = 'test-user-id';
      const productUrl = 'https://www.coupang.com/vp/products/123456';

      // Mock existing product
      mockPrisma.product.findUnique.mockResolvedValueOnce({
        id: 'product-id',
        url: productUrl
      });

      // Mock existing active watchlist item
      mockPrisma.watchList.findUnique.mockResolvedValueOnce({
        id: 'watch-item-id',
        userId,
        productId: 'product-id',
        isActive: true
      });

      await expect(InterestProduct.register(userId, productUrl))
        .rejects.toThrow('이미 관심 상품으로 등록된 상품입니다.');
    });
  });

  describe('getByUserId', () => {
    it('사용자의 관심 상품 목록을 반환해야 함', async () => {
      const userId = 'test-user-id';
      const mockWatchList = [
        {
          id: 'watch-item-1',
          userId,
          productId: 'product-1',
          product: {
            id: 'product-1',
            name: 'Product 1',
            url: 'https://www.coupang.com/vp/products/1'
          }
        }
      ];

      mockPrisma.watchList.findMany.mockResolvedValueOnce(mockWatchList);
      mockPrisma.watchList.count.mockResolvedValueOnce(1);

      const result = await InterestProduct.getByUserId(userId);

      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('pagination');
      expect(result.items).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });
  });

  describe('remove', () => {
    it('관심 상품을 비활성화해야 함', async () => {
      const userId = 'test-user-id';
      const watchItemId = 'watch-item-id';

      mockPrisma.watchList.findFirst.mockResolvedValueOnce({
        id: watchItemId,
        userId,
        isActive: true
      });

      mockPrisma.watchList.update.mockResolvedValueOnce({
        id: watchItemId,
        userId,
        isActive: false,
        product: { id: 'product-id', name: 'Test Product' }
      });

      const result = await InterestProduct.remove(userId, watchItemId);

      expect(result.isActive).toBe(false);
      expect(mockPrisma.watchList.update).toHaveBeenCalledWith({
        where: { id: watchItemId },
        data: {
          isActive: false,
          updatedAt: expect.any(Date)
        },
        include: {
          product: true
        }
      });
    });

    it('존재하지 않는 관심 상품에 대해 오류를 발생시켜야 함', async () => {
      const userId = 'test-user-id';
      const watchItemId = 'non-existent-id';

      mockPrisma.watchList.findFirst.mockResolvedValueOnce(null);

      await expect(InterestProduct.remove(userId, watchItemId))
        .rejects.toThrow('관심 상품을 찾을 수 없습니다.');
    });
  });
});

describe('Interest Products API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/interests', () => {
    it('관심 상품을 등록해야 함', async () => {
      const productUrl = 'https://www.coupang.com/vp/products/123456';

      // Mock successful registration
      mockPrisma.product.findUnique.mockResolvedValueOnce(null);
      mockPrisma.product.create.mockResolvedValueOnce({
        id: 'product-id',
        name: 'Unknown Product',
        url: productUrl,
        isActive: true
      });
      mockPrisma.watchList.findUnique.mockResolvedValueOnce(null);
      mockPrisma.watchList.create.mockResolvedValueOnce({
        id: 'watch-item-id',
        userId: 'test-user-id',
        productId: 'product-id',
        priceAlert: true,
        product: {
          id: 'product-id',
          name: 'Unknown Product',
          url: productUrl
        }
      });

      const response = await request(app)
        .post('/api/interests')
        .send({
          productUrl,
          priceAlert: true,
          analysisFrequency: 'daily'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('관심 상품이 등록되었습니다.');
      expect(response.body.data).toHaveProperty('id', 'watch-item-id');
    });

    it('유효하지 않은 URL에 대해 400 오류를 반환해야 함', async () => {
      const response = await request(app)
        .post('/api/interests')
        .send({
          productUrl: 'invalid-url'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('쿠팡이 아닌 URL에 대해 400 오류를 반환해야 함', async () => {
      const response = await request(app)
        .post('/api/interests')
        .send({
          productUrl: 'https://www.amazon.com/product/123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/interests', () => {
    it('사용자의 관심 상품 목록을 반환해야 함', async () => {
      const mockWatchList = [
        {
          id: 'watch-item-1',
          userId: 'test-user-id',
          productId: 'product-1',
          product: {
            id: 'product-1',
            name: 'Product 1',
            url: 'https://www.coupang.com/vp/products/1',
            priceHistory: [],
            analysisResults: []
          }
        }
      ];

      mockPrisma.watchList.findMany.mockResolvedValueOnce(mockWatchList);
      mockPrisma.watchList.count.mockResolvedValueOnce(1);

      const response = await request(app)
        .get('/api/interests');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination.total).toBe(1);
    });
  });

  describe('DELETE /api/interests/:id', () => {
    it('관심 상품을 삭제해야 함', async () => {
      const watchItemId = 'watch-item-id';

      mockPrisma.watchList.findFirst.mockResolvedValueOnce({
        id: watchItemId,
        userId: 'test-user-id',
        isActive: true
      });

      mockPrisma.watchList.update.mockResolvedValueOnce({
        id: watchItemId,
        userId: 'test-user-id',
        isActive: false,
        product: { id: 'product-id', name: 'Test Product' }
      });

      const response = await request(app)
        .delete(`/api/interests/${watchItemId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('관심 상품이 삭제되었습니다.');
    });

    it('존재하지 않는 관심 상품에 대해 404 오류를 반환해야 함', async () => {
      const watchItemId = 'non-existent-id';

      mockPrisma.watchList.findFirst.mockResolvedValueOnce(null);

      const response = await request(app)
        .delete(`/api/interests/${watchItemId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});