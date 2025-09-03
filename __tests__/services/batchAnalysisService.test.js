const { PrismaClient } = require('@prisma/client');
const batchAnalysisService = require('../../services/batchAnalysisService');

// Prisma 모킹
jest.mock('@prisma/client');
const mockPrisma = {
  $transaction: jest.fn(),
  batchAnalysisRequest: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    deleteMany: jest.fn(),
    groupBy: jest.fn()
  }
};

PrismaClient.mockImplementation(() => mockPrisma);

describe('BatchAnalysisService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBatchAnalysisRequest', () => {
    const mockProductId = 'product-123';
    const mockUserId = 'user-456';
    const mockMetadata = { frequency: 'daily' };

    it('새로운 배치 분석 요청을 성공적으로 생성해야 함', async () => {
      const mockBatchRequest = {
        id: 'batch-request-789',
        productId: mockProductId,
        userId: mockUserId,
        status: 'PENDING',
        scheduledAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: mockMetadata,
        user: { id: mockUserId, email: 'test@example.com' },
        product: { id: mockProductId, name: 'Test Product', url: 'https://example.com' }
      };

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        mockPrisma.batchAnalysisRequest.findFirst.mockResolvedValue(null);
        mockPrisma.batchAnalysisRequest.create.mockResolvedValue(mockBatchRequest);
        return await callback(mockPrisma);
      });

      const result = await batchAnalysisService.createBatchAnalysisRequest(
        mockProductId,
        mockUserId,
        mockMetadata
      );

      expect(result).toEqual(mockBatchRequest);
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
      expect(mockPrisma.batchAnalysisRequest.findFirst).toHaveBeenCalledWith({
        where: {
          productId: mockProductId,
          userId: mockUserId,
          status: 'PENDING'
        }
      });
      expect(mockPrisma.batchAnalysisRequest.create).toHaveBeenCalledWith({
        data: {
          productId: mockProductId,
          userId: mockUserId,
          status: 'PENDING',
          scheduledAt: expect.any(Date),
          metadata: expect.objectContaining({
            ...mockMetadata,
            requestSource: 'interest_product_registration',
            createdBy: 'batchAnalysisService'
          })
        },
        include: {
          user: { select: { id: true, email: true } },
          product: { select: { id: true, name: true, url: true } }
        }
      });
    });

    it('중복 요청이 있을 경우 기존 요청을 반환해야 함', async () => {
      const existingRequest = {
        id: 'existing-request-123',
        productId: mockProductId,
        userId: mockUserId,
        status: 'PENDING'
      };

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        mockPrisma.batchAnalysisRequest.findFirst.mockResolvedValue(existingRequest);
        return await callback(mockPrisma);
      });

      const result = await batchAnalysisService.createBatchAnalysisRequest(
        mockProductId,
        mockUserId,
        mockMetadata
      );

      expect(result).toEqual(existingRequest);
      expect(mockPrisma.batchAnalysisRequest.create).not.toHaveBeenCalled();
    });

    it('데이터베이스 오류 시 에러를 던져야 함', async () => {
      const dbError = new Error('Database connection failed');
      mockPrisma.$transaction.mockRejectedValue(dbError);

      await expect(
        batchAnalysisService.createBatchAnalysisRequest(mockProductId, mockUserId, mockMetadata)
      ).rejects.toThrow('Failed to create batch analysis request: Database connection failed');
    });
  });

  describe('updateBatchAnalysisRequestStatus', () => {
    const mockRequestId = 'request-123';
    const mockCurrentRequest = {
      id: mockRequestId,
      status: 'PENDING',
      metadata: { statusHistory: [] }
    };

    it('유효한 상태 전이로 상태를 업데이트해야 함', async () => {
      const updatedRequest = {
        ...mockCurrentRequest,
        status: 'PROCESSING',
        updatedAt: new Date()
      };

      mockPrisma.batchAnalysisRequest.findUnique.mockResolvedValue(mockCurrentRequest);
      mockPrisma.batchAnalysisRequest.update.mockResolvedValue(updatedRequest);

      const result = await batchAnalysisService.updateBatchAnalysisRequestStatus(
        mockRequestId,
        'PROCESSING'
      );

      expect(result).toEqual(updatedRequest);
      expect(mockPrisma.batchAnalysisRequest.update).toHaveBeenCalledWith({
        where: { id: mockRequestId },
        data: {
          status: 'PROCESSING',
          updatedAt: expect.any(Date),
          metadata: expect.objectContaining({
            statusHistory: expect.arrayContaining([
              expect.objectContaining({
                from: 'PENDING',
                to: 'PROCESSING',
                timestamp: expect.any(String),
                updatedBy: 'batchAnalysisService'
              })
            ])
          })
        },
        include: {
          user: { select: { id: true, email: true } },
          product: { select: { id: true, name: true, url: true } }
        }
      });
    });

    it('유효하지 않은 상태 전이 시 에러를 던져야 함', async () => {
      const completedRequest = { ...mockCurrentRequest, status: 'COMPLETED' };
      mockPrisma.batchAnalysisRequest.findUnique.mockResolvedValue(completedRequest);

      await expect(
        batchAnalysisService.updateBatchAnalysisRequestStatus(mockRequestId, 'PENDING')
      ).rejects.toThrow('Invalid status transition from COMPLETED to PENDING');
    });

    it('존재하지 않는 요청 ID로 에러를 던져야 함', async () => {
      mockPrisma.batchAnalysisRequest.findUnique.mockResolvedValue(null);

      await expect(
        batchAnalysisService.updateBatchAnalysisRequestStatus('non-existent-id', 'PROCESSING')
      ).rejects.toThrow('Batch analysis request not found: non-existent-id');
    });
  });

  describe('getBatchAnalysisRequestsByUser', () => {
    const mockUserId = 'user-123';

    it('사용자의 배치 분석 요청 목록을 반환해야 함', async () => {
      const mockRequests = [
        {
          id: 'request-1',
          userId: mockUserId,
          status: 'PENDING',
          product: { id: 'product-1', name: 'Product 1' }
        },
        {
          id: 'request-2',
          userId: mockUserId,
          status: 'COMPLETED',
          product: { id: 'product-2', name: 'Product 2' }
        }
      ];

      mockPrisma.batchAnalysisRequest.findMany.mockResolvedValue(mockRequests);

      const result = await batchAnalysisService.getBatchAnalysisRequestsByUser(mockUserId);

      expect(result).toEqual(mockRequests);
      expect(mockPrisma.batchAnalysisRequest.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              url: true,
              currentPrice: true,
              averageRating: true,
              totalReviews: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
        skip: 0
      });
    });

    it('상태 필터링이 적용되어야 함', async () => {
      const options = { status: 'PENDING', limit: 10, offset: 5 };
      mockPrisma.batchAnalysisRequest.findMany.mockResolvedValue([]);

      await batchAnalysisService.getBatchAnalysisRequestsByUser(mockUserId, options);

      expect(mockPrisma.batchAnalysisRequest.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, status: 'PENDING' },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
        take: 10,
        skip: 5
      });
    });
  });

  describe('getPendingBatchAnalysisRequests', () => {
    it('대기 중인 배치 분석 요청 목록을 반환해야 함', async () => {
      const mockPendingRequests = [
        {
          id: 'request-1',
          status: 'PENDING',
          scheduledAt: new Date('2025-08-14T10:00:00Z'),
          user: { id: 'user-1', email: 'user1@example.com' },
          product: { id: 'product-1', name: 'Product 1', url: 'https://example.com/1' }
        }
      ];

      mockPrisma.batchAnalysisRequest.findMany.mockResolvedValue(mockPendingRequests);

      const result = await batchAnalysisService.getPendingBatchAnalysisRequests(50);

      expect(result).toEqual(mockPendingRequests);
      expect(mockPrisma.batchAnalysisRequest.findMany).toHaveBeenCalledWith({
        where: { status: 'PENDING' },
        include: {
          user: { select: { id: true, email: true } },
          product: { select: { id: true, name: true, url: true } }
        },
        orderBy: { scheduledAt: 'asc' },
        take: 50
      });
    });
  });

  describe('deleteBatchAnalysisRequest', () => {
    const mockRequestId = 'request-123';
    const mockUserId = 'user-456';

    it('배치 분석 요청을 성공적으로 삭제해야 함', async () => {
      mockPrisma.batchAnalysisRequest.deleteMany.mockResolvedValue({ count: 1 });

      const result = await batchAnalysisService.deleteBatchAnalysisRequest(mockRequestId, mockUserId);

      expect(result).toBe(true);
      expect(mockPrisma.batchAnalysisRequest.deleteMany).toHaveBeenCalledWith({
        where: {
          id: mockRequestId,
          userId: mockUserId,
          status: { in: ['PENDING', 'FAILED'] }
        }
      });
    });

    it('삭제할 요청이 없을 경우 에러를 던져야 함', async () => {
      mockPrisma.batchAnalysisRequest.deleteMany.mockResolvedValue({ count: 0 });

      await expect(
        batchAnalysisService.deleteBatchAnalysisRequest(mockRequestId, mockUserId)
      ).rejects.toThrow('Batch analysis request not found or cannot be deleted');
    });
  });
});

describe('BatchAnalysisService Integration Tests', () => {
  // 통합 테스트는 실제 데이터베이스 연결이 필요하므로 별도 환경에서 실행
  describe.skip('Database Integration', () => {
    it('실제 데이터베이스와 연동하여 전체 플로우를 테스트해야 함', async () => {
      // 실제 데이터베이스 연결 및 테스트 데이터 설정
      // 배치 분석 요청 생성 → 상태 업데이트 → 조회 → 삭제 플로우 테스트
    });
  });
});

describe('BatchAnalysisService Error Scenarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('네트워크 타임아웃 시 적절한 에러 메시지를 반환해야 함', async () => {
    const timeoutError = new Error('Connection timeout');
    timeoutError.code = 'ETIMEDOUT';
    mockPrisma.$transaction.mockRejectedValue(timeoutError);

    await expect(
      batchAnalysisService.createBatchAnalysisRequest('product-1', 'user-1', {})
    ).rejects.toThrow('Failed to create batch analysis request: Connection timeout');
  });

  it('데이터베이스 제약 조건 위반 시 적절한 에러 메시지를 반환해야 함', async () => {
    const constraintError = new Error('Foreign key constraint failed');
    constraintError.code = 'P2003';
    mockPrisma.$transaction.mockRejectedValue(constraintError);

    await expect(
      batchAnalysisService.createBatchAnalysisRequest('invalid-product', 'user-1', {})
    ).rejects.toThrow('Failed to create batch analysis request: Foreign key constraint failed');
  });
});