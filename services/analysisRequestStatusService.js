const { PrismaClient } = require('@prisma/client');
const logger = require('../config/logger');

const prisma = new PrismaClient();

/**
 * 분석 요청 상태 관리 서비스
 * Kafka Consumer 또는 Airflow 콜백에서 호출되는 상태 업데이트 핸들러
 */
class AnalysisRequestStatusService {
  /**
   * 분석 요청 상태 업데이트 (실시간 분석용)
   * @param {string} requestId - 요청 ID
   * @param {string} status - 새로운 상태 ('pending', 'processing', 'completed', 'failed')
   * @param {Object} metadata - 추가 메타데이터
   * @returns {Promise<Object>} 업데이트된 요청
   */
  async updateAnalysisRequestStatus(requestId, status, metadata = {}) {
    try {
      // 상태 전이 검증
      const validTransitions = {
        'pending': ['processing', 'failed'],
        'processing': ['completed', 'failed'],
        'completed': [], // 완료된 요청은 변경 불가
        'failed': ['pending'] // 실패한 요청은 재시도 가능
      };

      const currentRequest = await prisma.analysisRequest.findUnique({
        where: { id: requestId }
      });

      if (!currentRequest) {
        throw new Error(`Analysis request not found: ${requestId}`);
      }

      const allowedStatuses = validTransitions[currentRequest.status];
      if (!allowedStatuses.includes(status)) {
        throw new Error(`Invalid status transition from ${currentRequest.status} to ${status}`);
      }

      // 동시성 제어를 위한 낙관적 잠금
      const updatedRequest = await prisma.analysisRequest.update({
        where: { 
          id: requestId,
          updatedAt: currentRequest.updatedAt // 낙관적 잠금
        },
        data: {
          status,
          progress: this._getProgressByStatus(status),
          completedAt: status === 'completed' ? new Date() : null,
          updatedAt: new Date()
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

      logger.info(`Analysis request ${requestId} status updated from ${currentRequest.status} to ${status}`);
      return updatedRequest;
    } catch (error) {
      if (error.code === 'P2025') {
        // 낙관적 잠금 실패 - 동시 업데이트 감지
        logger.warn(`Concurrent update detected for analysis request ${requestId}`);
        throw new Error('Request was updated by another process. Please retry.');
      }
      
      logger.error('Error updating analysis request status:', error);
      throw new Error(`Failed to update analysis request status: ${error.message}`);
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

      // 동시성 제어를 위한 낙관적 잠금
      const updatedRequest = await prisma.batchAnalysisRequest.update({
        where: { 
          id: requestId,
          updatedAt: currentRequest.updatedAt // 낙관적 잠금
        },
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
                updatedBy: 'analysisRequestStatusService'
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
      if (error.code === 'P2025') {
        // 낙관적 잠금 실패 - 동시 업데이트 감지
        logger.warn(`Concurrent update detected for batch analysis request ${requestId}`);
        throw new Error('Request was updated by another process. Please retry.');
      }
      
      logger.error('Error updating batch analysis request status:', error);
      throw new Error(`Failed to update batch analysis request status: ${error.message}`);
    }
  }

  /**
   * 실시간 분석 세션 상태 업데이트
   * @param {string} taskId - 작업 ID
   * @param {string} status - 새로운 상태
   * @param {Object} data - 업데이트할 데이터
   * @returns {Promise<Object>} 업데이트된 세션
   */
  async updateRealtimeAnalysisSession(taskId, status, data = {}) {
    try {
      const currentSession = await prisma.realtimeAnalysisSession.findUnique({
        where: { taskId }
      });

      if (!currentSession) {
        throw new Error(`Realtime analysis session not found: ${taskId}`);
      }

      const updateData = {
        status,
        lastUpdatedAt: new Date()
      };

      // 데이터 타입별 업데이트
      if (data.emotionCards) {
        updateData.emotionCards = data.emotionCards;
      }

      if (data.currentStats) {
        updateData.currentStats = {
          ...currentSession.currentStats,
          ...data.currentStats
        };
      }

      if (data.trendingKeywords) {
        updateData.trendingKeywords = data.trendingKeywords;
      }

      const updatedSession = await prisma.realtimeAnalysisSession.update({
        where: { taskId },
        data: updateData,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              url: true
            }
          }
        }
      });

      logger.info(`Realtime analysis session ${taskId} updated with status ${status}`);
      return updatedSession;
    } catch (error) {
      logger.error('Error updating realtime analysis session:', error);
      throw new Error(`Failed to update realtime analysis session: ${error.message}`);
    }
  }

  /**
   * 분석 결과 생성 또는 업데이트
   * @param {string} taskId - 작업 ID
   * @param {Object} resultData - 분석 결과 데이터
   * @returns {Promise<Object>} 생성/업데이트된 분석 결과
   */
  async upsertAnalysisResult(taskId, resultData) {
    try {
      const {
        productId,
        status = 'completed',
        sentimentPositive,
        sentimentNegative,
        sentimentNeutral,
        summary,
        finalKeywords,
        totalReviews,
        averageRating,
        ratingDistribution,
        errorMessage,
        processingTime
      } = resultData;

      const analysisResult = await prisma.analysisResult.upsert({
        where: { taskId },
        update: {
          status,
          sentimentPositive,
          sentimentNegative,
          sentimentNeutral,
          summary,
          finalKeywords,
          totalReviews,
          averageRating,
          ratingDistribution,
          errorMessage,
          processingTime,
          updatedAt: new Date()
        },
        create: {
          productId,
          taskId,
          status,
          sentimentPositive,
          sentimentNegative,
          sentimentNeutral,
          summary,
          finalKeywords,
          totalReviews,
          averageRating,
          ratingDistribution,
          errorMessage,
          processingTime
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              url: true
            }
          }
        }
      });

      logger.info(`Analysis result upserted for task ${taskId}`);
      return analysisResult;
    } catch (error) {
      logger.error('Error upserting analysis result:', error);
      throw new Error(`Failed to upsert analysis result: ${error.message}`);
    }
  }

  /**
   * 상태별 진행률 계산
   * @param {string} status - 상태
   * @returns {number} 진행률 (0-100)
   */
  _getProgressByStatus(status) {
    const progressMap = {
      'pending': 0,
      'processing': 50,
      'completed': 100,
      'failed': 0
    };
    return progressMap[status] || 0;
  }

  /**
   * 실패한 요청 재시도
   * @param {string} requestId - 요청 ID
   * @param {string} requestType - 요청 타입 ('realtime' | 'batch')
   * @returns {Promise<Object>} 재시도된 요청
   */
  async retryFailedRequest(requestId, requestType = 'realtime') {
    try {
      if (requestType === 'batch') {
        return await this.updateBatchAnalysisRequestStatus(requestId, 'PENDING', {
          retryCount: (await prisma.batchAnalysisRequest.findUnique({
            where: { id: requestId }
          }))?.metadata?.retryCount + 1 || 1,
          retryAt: new Date().toISOString()
        });
      } else {
        return await this.updateAnalysisRequestStatus(requestId, 'pending', {
          retryAt: new Date().toISOString()
        });
      }
    } catch (error) {
      logger.error('Error retrying failed request:', error);
      throw new Error(`Failed to retry request: ${error.message}`);
    }
  }

  /**
   * 요청 상태 통계 조회
   * @param {Object} filters - 필터 조건
   * @returns {Promise<Object>} 상태별 통계
   */
  async getRequestStatusStats(filters = {}) {
    try {
      const { userId, productId, dateFrom, dateTo } = filters;

      const where = {
        ...(userId && { userId }),
        ...(productId && { productId }),
        ...(dateFrom && dateTo && {
          createdAt: {
            gte: new Date(dateFrom),
            lte: new Date(dateTo)
          }
        })
      };

      // 실시간 분석 요청 통계
      const realtimeStats = await prisma.analysisRequest.groupBy({
        by: ['status'],
        where,
        _count: {
          status: true
        }
      });

      // 배치 분석 요청 통계
      const batchStats = await prisma.batchAnalysisRequest.groupBy({
        by: ['status'],
        where,
        _count: {
          status: true
        }
      });

      return {
        realtime: realtimeStats.reduce((acc, stat) => {
          acc[stat.status] = stat._count.status;
          return acc;
        }, {}),
        batch: batchStats.reduce((acc, stat) => {
          acc[stat.status] = stat._count.status;
          return acc;
        }, {})
      };
    } catch (error) {
      logger.error('Error getting request status stats:', error);
      throw new Error(`Failed to get request status stats: ${error.message}`);
    }
  }
}

module.exports = new AnalysisRequestStatusService();