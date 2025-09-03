const { PrismaClient } = require('@prisma/client');
const analysisRequestStatusService = require('../../services/analysisRequestStatusService');

// Prisma 모킹
jest.mock('@prisma/client');
const mockPrisma = {
  analysisRequest: {
    findUnique: jest.fn(),
    update: jest.fn()
  },
  batchAnalysisRequest: {
    findUnique: jest.fn(),
    update: jest.fn(),
    groupBy: jest.fn()
  },
  realtimeAnalysisSession: {
    findUnique: jest.fn(),
    update: jest.fn()
  },
  analysisResult: {
    upsert: jest.fn()
  }
};

PrismaClient.mockImplementation(() => mockPrisma);

describe('AnalysisRequestStatusService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateAnalysisRequestStatus', () => {
    const mockRequestId = 'request-123';
    const mockCurrentRequest = {
      id: mockRequestId,
      status: 'pending',
      updatedAt: new Date('2025-08-14T10:00:00Z')
    };

    it('유효한 상태 전이로 실시간 분석 요청 상태를 업데이트해야 함', async () => {
      const updatedRequest = {
        ...mockCurrentRequest,
        status: 'processing',
        progress: 50,
        updatedAt: new Date()
      };

      mockPrisma.analysisRequest.findUnique.mockResolvedValue(mockCurrentRequest);
      mockPrisma.analysisRequest.update.mockResolvedValue(updatedRequest);

      const result = await analysisRequestStatusService.updateAnalysisRequestStatus(
        mockRequestId,
        'processing'
      );

      expect(result).toEqual(updatedRequest);
      expect(mockPrisma.analysisRequest.update).toHaveBeenCalledWith({
        where: { 
          id: mockRequestId,
          updatedAt: mockCurrentRequest.updatedAt
        },
        data: {
          status: 'processing',
          progress: 50,
          completedAt: null,
          updatedAt: expect.any(Date)
        },
        include: {
          user: { select: { id: true, email: true } },
          product: { select: { id: true, name: true, url: true } }
        }
      });
    });

    it('완료 상태로 업데이트 시 completedAt을 설정해야 함', async () => {
      const updatedRequest = {
        ...mockCurrentRequest,
        status: 'completed',
        progress: 100,
        completedAt: new Date()
      };

      mockPrisma.analysisRequest.findUnique.mockResolvedValue({
        ...mockCurrentRequest,
        status: 'processing'
      });
      mockPrisma.analysisRequest.update.mockResolvedValue(updatedRequest);

      const result = await analysisRequestStatusService.updateAnalysisRequestStatus(
        mockRequestId,
        'completed'
      );

      expect(result.completedAt).toBeDefined();
      expect(mockPrisma.analysisRequest.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'completed',
            progress: 100,
            completedAt: expect.any(Date)
          })
        })
      );
    });

    it('유효하지 않은 상태 전이 시 에러를 던져야 함', async () => {
      const completedRequest = { ...mockCurrentRequest, status: 'completed' };
      mockPrisma.analysisRequest.findUnique.mockResolvedValue(completedRequest);

      await expect(
        analysisRequestStatusService.updateAnalysisRequestStatus(mockRequestId, 'pending')
      ).rejects.toThrow('Invalid status transition from completed to pending');
    });

    it('존재하지 않는 요청 ID로 에러를 던져야 함', async () => {
      mockPrisma.analysisRequest.findUnique.mockResolvedValue(null);

      await expect(
        analysisRequestStatusService.updateAnalysisRequestStatus('non-existent-id', 'processing')
      ).rejects.toThrow('Analysis request not found: non-existent-id');
    });

    it('낙관적 잠금 실패 시 적절한 에러 메시지를 반환해야 함', async () => {
      mockPrisma.analysisRequest.findUnique.mockResolvedValue(mockCurrentRequest);
      
      const lockError = new Error('Record not found');
      lockError.code = 'P2025';
      mockPrisma.analysisRequest.update.mockRejectedValue(lockError);

      await expect(
        analysisRequestStatusService.updateAnalysisRequestStatus(mockRequestId, 'processing')
      ).rejects.toThrow('Request was updated by another process. Please retry.');
    });
  });

  describe('updateBatchAnalysisRequestStatus', () => {
    const mockRequestId = 'batch-request-123';
    const mockCurrentRequest = {
      id: mockRequestId,
      status: 'PENDING',
      updatedAt: new Date('2025-08-14T10:00:00Z'),
      metadata: { statusHistory: [] }
    };

    it('배치 분석 요청 상태를 업데이트하고 상태 이력을 기록해야 함', async () => {
      const updatedRequest = {
        ...mockCurrentRequest,
        status: 'PROCESSING',
        updatedAt: new Date(),
        metadata: {
          statusHistory: [
            {
              from: 'PENDING',
              to: 'PROCESSING',
              timestamp: expect.any(String),
              updatedBy: 'analysisRequestStatusService'
            }
          ]
        }
      };

      mockPrisma.batchAnalysisRequest.findUnique.mockResolvedValue(mockCurrentRequest);
      mockPrisma.batchAnalysisRequest.update.mockResolvedValue(updatedRequest);

      const result = await analysisRequestStatusService.updateBatchAnalysisRequestStatus(
        mockRequestId,
        'PROCESSING'
      );

      expect(result).toEqual(updatedRequest);
      expect(mockPrisma.batchAnalysisRequest.update).toHaveBeenCalledWith({
        where: { 
          id: mockRequestId,
          updatedAt: mockCurrentRequest.updatedAt
        },
        data: {
          status: 'PROCESSING',
          updatedAt: expect.any(Date),
          metadata: expect.objectContaining({
            statusHistory: expect.arrayContaining([
              expect.objectContaining({
                from: 'PENDING',
                to: 'PROCESSING',
                timestamp: expect.any(String),
                updatedBy: 'analysisRequestStatusService'
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

    it('기존 메타데이터를 보존하면서 새 데이터를 추가해야 함', async () => {
      const requestWithMetadata = {
        ...mockCurrentRequest,
        metadata: {
          existingData: 'preserved',
          statusHistory: [
            { from: 'PENDING', to: 'PROCESSING', timestamp: '2025-08-14T09:00:00Z' }
          ]
        }
      };

      mockPrisma.batchAnalysisRequest.findUnique.mockResolvedValue(requestWithMetadata);
      mockPrisma.batchAnalysisRequest.update.mockResolvedValue({});

      const additionalMetadata = { processingStartedAt: '2025-08-14T10:00:00Z' };

      await analysisRequestStatusService.updateBatchAnalysisRequestStatus(
        mockRequestId,
        'PROCESSING',
        additionalMetadata
      );

      expect(mockPrisma.batchAnalysisRequest.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            metadata: expect.objectContaining({
              existingData: 'preserved',
              processingStartedAt: '2025-08-14T10:00:00Z',
              statusHistory: expect.arrayContaining([
                { from: 'PENDING', to: 'PROCESSING', timestamp: '2025-08-14T09:00:00Z' },
                expect.objectContaining({
                  from: 'PENDING',
                  to: 'PROCESSING',
                  timestamp: expect.any(String)
                })
              ])
            })
          })
        })
      );
    });
  });

  describe('updateRealtimeAnalysisSession', () => {
    const mockTaskId = 'task-123';
    const mockCurrentSession = {
      taskId: mockTaskId,
      status: 'processing',
      currentStats: { positive: 10, negative: 5, neutral: 3 },
      emotionCards: [],
      trendingKeywords: []
    };

    it('실시간 분석 세션을 업데이트해야 함', async () => {
      const updateData = {
        emotionCards: [{ emotion: 'positive', text: 'Great product!' }],
        currentStats: { positive: 15, negative: 5, neutral: 3 },
        trendingKeywords: ['quality', 'price', 'delivery']
      };

      const updatedSession = {
        ...mockCurrentSession,
        status: 'processing',
        ...updateData,
        lastUpdatedAt: new Date()
      };

      mockPrisma.realtimeAnalysisSession.findUnique.mockResolvedValue(mockCurrentSession);
      mockPrisma.realtimeAnalysisSession.update.mockResolvedValue(updatedSession);

      const result = await analysisRequestStatusService.updateRealtimeAnalysisSession(
        mockTaskId,
        'processing',
        updateData
      );

      expect(result).toEqual(updatedSession);
      expect(mockPrisma.realtimeAnalysisSession.update).toHaveBeenCalledWith({
        where: { taskId: mockTaskId },
        data: {
          status: 'processing',
          lastUpdatedAt: expect.any(Date),
          emotionCards: updateData.emotionCards,
          currentStats: {
            positive: 15,
            negative: 5,
            neutral: 3
          },
          trendingKeywords: updateData.trendingKeywords
        },
        include: {
          product: { select: { id: true, name: true, url: true } }
        }
      });
    });

    it('존재하지 않는 세션 ID로 에러를 던져야 함', async () => {
      mockPrisma.realtimeAnalysisSession.findUnique.mockResolvedValue(null);

      await expect(
        analysisRequestStatusService.updateRealtimeAnalysisSession('non-existent-task', 'completed')
      ).rejects.toThrow('Realtime analysis session not found: non-existent-task');
    });
  });

  describe('upsertAnalysisResult', () => {
    const mockTaskId = 'task-123';
    const mockResultData = {
      productId: 'product-456',
      status: 'completed',
      sentimentPositive: 0.6,
      sentimentNegative: 0.2,
      sentimentNeutral: 0.2,
      summary: 'Overall positive sentiment',
      finalKeywords: ['quality', 'price'],
      totalReviews: 100,
      averageRating: 4.5,
      ratingDistribution: { 5: 50, 4: 30, 3: 15, 2: 3, 1: 2 },
      processingTime: 120
    };

    it('분석 결과를 생성 또는 업데이트해야 함', async () => {
      const expectedResult = {
        id: 'result-123',
        taskId: mockTaskId,
        ...mockResultData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.analysisResult.upsert.mockResolvedValue(expectedResult);

      const result = await analysisRequestStatusService.upsertAnalysisResult(
        mockTaskId,
        mockResultData
      );

      expect(result).toEqual(expectedResult);
      expect(mockPrisma.analysisResult.upsert).toHaveBeenCalledWith({
        where: { taskId: mockTaskId },
        update: {
          status: mockResultData.status,
          sentimentPositive: mockResultData.sentimentPositive,
          sentimentNegative: mockResultData.sentimentNegative,
          sentimentNeutral: mockResultData.sentimentNeutral,
          summary: mockResultData.summary,
          finalKeywords: mockResultData.finalKeywords,
          totalReviews: mockResultData.totalReviews,
          averageRating: mockResultData.averageRating,
          ratingDistribution: mockResultData.ratingDistribution,
          errorMessage: undefined,
          processingTime: mockResultData.processingTime,
          updatedAt: expect.any(Date)
        },
        create: {
          productId: mockResultData.productId,
          taskId: mockTaskId,
          status: mockResultData.status,
          sentimentPositive: mockResultData.sentimentPositive,
          sentimentNegative: mockResultData.sentimentNegative,
          sentimentNeutral: mockResultData.sentimentNeutral,
          summary: mockResultData.summary,
          finalKeywords: mockResultData.finalKeywords,
          totalReviews: mockResultData.totalReviews,
          averageRating: mockResultData.averageRating,
          ratingDistribution: mockResultData.ratingDistribution,
          errorMessage: undefined,
          processingTime: mockResultData.processingTime
        },
        include: {
          product: { select: { id: true, name: true, url: true } }
        }
      });
    });
  });

  describe('retryFailedRequest', () => {
    const mockRequestId = 'request-123';

    it('실패한 실시간 분석 요청을 재시도해야 함', async () => {
      const mockRequest = {
        id: mockRequestId,
        status: 'failed',
        updatedAt: new Date()
      };

      mockPrisma.analysisRequest.findUnique.mockResolvedValue(mockRequest);
      mockPrisma.analysisRequest.update.mockResolvedValue({
        ...mockRequest,
        status: 'pending'
      });

      const result = await analysisRequestStatusService.retryFailedRequest(mockRequestId, 'realtime');

      expect(result.status).toBe('pending');
      expect(mockPrisma.analysisRequest.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'pending'
          })
        })
      );
    });

    it('실패한 배치 분석 요청을 재시도하고 재시도 횟수를 증가시켜야 함', async () => {
      const mockBatchRequest = {
        id: mockRequestId,
        status: 'FAILED',
        metadata: { retryCount: 1 },
        updatedAt: new Date()
      };

      mockPrisma.batchAnalysisRequest.findUnique.mockResolvedValue(mockBatchRequest);
      mockPrisma.batchAnalysisRequest.update.mockResolvedValue({
        ...mockBatchRequest,
        status: 'PENDING'
      });

      const result = await analysisRequestStatusService.retryFailedRequest(mockRequestId, 'batch');

      expect(result.status).toBe('PENDING');
      expect(mockPrisma.batchAnalysisRequest.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'PENDING',
            metadata: expect.objectContaining({
              retryCount: 2,
              retryAt: expect.any(String)
            })
          })
        })
      );
    });
  });

  describe('getRequestStatusStats', () => {
    it('요청 상태 통계를 반환해야 함', async () => {
      const mockRealtimeStats = [
        { status: 'pending', _count: { status: 5 } },
        { status: 'processing', _count: { status: 3 } },
        { status: 'completed', _count: { status: 10 } }
      ];

      const mockBatchStats = [
        { status: 'PENDING', _count: { status: 8 } },
        { status: 'PROCESSING', _count: { status: 2 } },
        { status: 'COMPLETED', _count: { status: 15 } }
      ];

      mockPrisma.analysisRequest.groupBy.mockResolvedValue(mockRealtimeStats);
      mockPrisma.batchAnalysisRequest.groupBy.mockResolvedValue(mockBatchStats);

      const result = await analysisRequestStatusService.getRequestStatusStats();

      expect(result).toEqual({
        realtime: {
          pending: 5,
          processing: 3,
          completed: 10
        },
        batch: {
          PENDING: 8,
          PROCESSING: 2,
          COMPLETED: 15
        }
      });
    });

    it('필터 조건이 적용되어야 함', async () => {
      const filters = {
        userId: 'user-123',
        productId: 'product-456',
        dateFrom: '2025-08-01',
        dateTo: '2025-08-14'
      };

      mockPrisma.analysisRequest.groupBy.mockResolvedValue([]);
      mockPrisma.batchAnalysisRequest.groupBy.mockResolvedValue([]);

      await analysisRequestStatusService.getRequestStatusStats(filters);

      const expectedWhere = {
        userId: 'user-123',
        productId: 'product-456',
        createdAt: {
          gte: new Date('2025-08-01'),
          lte: new Date('2025-08-14')
        }
      };

      expect(mockPrisma.analysisRequest.groupBy).toHaveBeenCalledWith({
        by: ['status'],
        where: expectedWhere,
        _count: { status: true }
      });

      expect(mockPrisma.batchAnalysisRequest.groupBy).toHaveBeenCalledWith({
        by: ['status'],
        where: expectedWhere,
        _count: { status: true }
      });
    });
  });

  describe('_getProgressByStatus', () => {
    it('상태별 올바른 진행률을 반환해야 함', () => {
      expect(analysisRequestStatusService._getProgressByStatus('pending')).toBe(0);
      expect(analysisRequestStatusService._getProgressByStatus('processing')).toBe(50);
      expect(analysisRequestStatusService._getProgressByStatus('completed')).toBe(100);
      expect(analysisRequestStatusService._getProgressByStatus('failed')).toBe(0);
      expect(analysisRequestStatusService._getProgressByStatus('unknown')).toBe(0);
    });
  });
});

describe('AnalysisRequestStatusService Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('데이터베이스 연결 오류 시 적절한 에러 메시지를 반환해야 함', async () => {
    const dbError = new Error('Database connection lost');
    mockPrisma.analysisRequest.findUnique.mockRejectedValue(dbError);

    await expect(
      analysisRequestStatusService.updateAnalysisRequestStatus('request-123', 'processing')
    ).rejects.toThrow('Failed to update analysis request status: Database connection lost');
  });

  it('트랜잭션 롤백 시 적절한 에러 처리를 해야 함', async () => {
    const transactionError = new Error('Transaction rolled back');
    transactionError.code = 'P2034';
    mockPrisma.batchAnalysisRequest.update.mockRejectedValue(transactionError);

    await expect(
      analysisRequestStatusService.updateBatchAnalysisRequestStatus('request-123', 'PROCESSING')
    ).rejects.toThrow('Failed to update batch analysis request status: Transaction rolled back');
  });
});