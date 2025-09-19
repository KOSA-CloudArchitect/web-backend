const { PrismaClient } = require('@prisma/client');
const logger = require('../config/logger');

const prisma = new PrismaClient();

/**
 * 배치 분석 요청 서비스
 * 관심 상품 등록 시 배치 분석 요청을 생성하고 관리
 */
class BatchAnalysisService {
  /**
   * 배치 분석 요청 생성
   * @param {string} productId - 상품 ID
   * @param {string} userId - 사용자 ID
   * @param {Object} metadata - 추가 메타데이터
   * @returns {Promise<Object>} 생성된 배치 분석 요청
   */
  async createBatchAnalysisRequest(productId, userId, metadata = {}) {
    try {
      // 트랜잭션으로 원자적 처리
      const result = await prisma.$transaction(async (tx) => {
        // 중복 요청 확인 (같은 사용자, 같은 상품, PENDING 상태)
        const existingRequest = await tx.batchAnalysisRequest.findFirst({
          where: {
            productId,
            userId,
            status: 'PENDING'
          }
        });

        if (existingRequest) {
          logger.info(`Duplicate batch analysis request ignored for user ${userId}, product ${productId}`);
          return existingRequest;
        }

        // 새 배치 분석 요청 생성
        const batchRequest = await tx.batchAnalysisRequest.create({
          data: {
            productId,
            userId,
            status: 'PENDING',
            scheduledAt: new Date(),
            metadata: {
              ...metadata,
              requestSource: 'interest_product_registration',
              createdBy: 'batchAnalysisService'
            }
          },
          include: {
            user: {
              select: {
                id: true,
                email: true
              }
            },
            product: {
              select: {
                id: true,
                name: true,
                url: true
              }
            }
          }
        });

        logger.info(`Batch analysis request created: ${batchRequest.id} for user ${userId}, product ${productId}`);
        return batchRequest;
      });

      return result;
    } catch (error) {
      logger.error('Error creating batch analysis request:', error);
      throw new Error(`Failed to create batch analysis request: ${error.message}`);
    }
  }

  /**
   * 배치 분석 요청 상태 업데이트
   * @param {string} requestId - 요청 ID
   * @param {string} status - 새로운 상태 ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')
   * @param {Object} metadata - 추가 메타데이터
   * @returns {Promise<Object>} 업데이트된 요청
   */
  async updateBatchAnalysisRequestStatus(requestId, status, metadata = {}) {
    try {
      // 상태 전이 검증
      const validTransitions = {
        'PENDING': ['PROCESSING', 'FAILED'],
        'PROCESSING': ['COMPLETED', 'FAILED'],
        'COMPLETED': [], // 완료된 요청은 변경 불가
        'FAILED': ['PENDING'] // 실패한 요청은 재시도 가능
      };

      const currentRequest = await prisma.batchAnalysisRequest.findUnique({
        where: { id: requestId }
      });

      if (!currentRequest) {
        throw new Error(`Batch analysis request not found: ${requestId}`);
      }

      const allowedStatuses = validTransitions[currentRequest.status];
      if (!allowedStatuses.includes(status)) {
        throw new Error(`Invalid status transition from ${currentRequest.status} to ${status}`);
      }

      // 상태 업데이트
      const updatedRequest = await prisma.batchAnalysisRequest.update({
        where: { id: requestId },
        data: {
          status,
          updatedAt: new Date(),
          metadata: {
            ...currentRequest.metadata,
            ...metadata,
            statusHistory: [
              ...(currentRequest.metadata?.statusHistory || []),
              {
                from: currentRequest.status,
                to: status,
                timestamp: new Date().toISOString(),
                updatedBy: 'batchAnalysisService'
              }
            ]
          }
        },
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          },
          product: {
            select: {
              id: true,
              name: true,
              url: true
            }
          }
        }
      });

      logger.info(`Batch analysis request ${requestId} status updated from ${currentRequest.status} to ${status}`);
      return updatedRequest;
    } catch (error) {
      logger.error('Error updating batch analysis request status:', error);
      throw new Error(`Failed to update batch analysis request status: ${error.message}`);
    }
  }

  /**
   * 사용자의 배치 분석 요청 목록 조회
   * @param {string} userId - 사용자 ID
   * @param {Object} options - 조회 옵션 (status, limit, offset)
   * @returns {Promise<Array>} 배치 분석 요청 목록
   */
  async getBatchAnalysisRequestsByUser(userId, options = {}) {
    try {
      const { status, limit = 50, offset = 0 } = options;

      const where = {
        userId,
        ...(status && { status })
      };

      const requests = await prisma.batchAnalysisRequest.findMany({
        where,
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
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: offset
      });

      return requests;
    } catch (error) {
      logger.error('Error fetching batch analysis requests by user:', error);
      throw new Error(`Failed to fetch batch analysis requests: ${error.message}`);
    }
  }

  /**
   * 대기 중인 배치 분석 요청 조회 (스케줄러용)
   * @param {number} limit - 조회할 최대 개수
   * @returns {Promise<Array>} 대기 중인 요청 목록
   */
  async getPendingBatchAnalysisRequests(limit = 100) {
    try {
      const requests = await prisma.batchAnalysisRequest.findMany({
        where: {
          status: 'PENDING'
        },
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          },
          product: {
            select: {
              id: true,
              name: true,
              url: true
            }
          }
        },
        orderBy: {
          scheduledAt: 'asc'
        },
        take: limit
      });

      return requests;
    } catch (error) {
      logger.error('Error fetching pending batch analysis requests:', error);
      throw new Error(`Failed to fetch pending batch analysis requests: ${error.message}`);
    }
  }

  /**
   * 배치 분석 요청 삭제
   * @param {string} requestId - 요청 ID
   * @param {string} userId - 사용자 ID (권한 확인용)
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async deleteBatchAnalysisRequest(requestId, userId) {
    try {
      const deletedRequest = await prisma.batchAnalysisRequest.deleteMany({
        where: {
          id: requestId,
          userId, // 본인의 요청만 삭제 가능
          status: {
            in: ['PENDING', 'FAILED'] // 진행 중이거나 완료된 요청은 삭제 불가
          }
        }
      });

      if (deletedRequest.count === 0) {
        throw new Error('Batch analysis request not found or cannot be deleted');
      }

      logger.info(`Batch analysis request ${requestId} deleted by user ${userId}`);
      return true;
    } catch (error) {
      logger.error('Error deleting batch analysis request:', error);
      throw new Error(`Failed to delete batch analysis request: ${error.message}`);
    }
  }
}

module.exports = new BatchAnalysisService();