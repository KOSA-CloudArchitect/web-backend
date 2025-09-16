/**
 * AnalysisRequest Model
 * 분석 요청 기록 관리를 위한 모델
 */

const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

class AnalysisRequest {
  /**
   * 분석 요청 생성
   * @param {Object} requestData - 요청 데이터
   * @returns {Promise<Object>} 생성된 분석 요청
   */
  static async create(requestData) {
    const { 
      userId, 
      productId, 
      requestType = 'realtime', 
      priority = 5 
    } = requestData;
    
    const taskId = uuidv4();
    
    try {
      const analysisRequest = await prisma.analysisRequest.create({
        data: {
          userId,
          productId,
          taskId,
          requestType,
          priority,
          status: 'pending'
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              profile: true
            }
          },
          product: {
            include: {
              category: true
            }
          }
        }
      });

      return analysisRequest;
    } catch (error) {
      throw new Error(`분석 요청 생성 실패: ${error.message}`);
    }
  }

  /**
   * Task ID로 분석 요청 찾기
   * @param {string} taskId - Task ID
   * @returns {Promise<Object|null>} 분석 요청 정보
   */
  static async findByTaskId(taskId) {
    return await prisma.analysisRequest.findUnique({
      where: { taskId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true
          }
        },
        product: {
          include: {
            category: true
          }
        }
      }
    });
  }

  /**
   * 사용자별 분석 요청 조회
   * @param {string} userId - 사용자 ID
   * @param {Object} options - 조회 옵션
   * @returns {Promise<Object>} 분석 요청 목록과 총 개수
   */
  static async findByUserId(userId, options = {}) {
    const { status, limit = 20, offset = 0 } = options;
    
    const where = { userId };
    if (status) {
      where.status = status;
    }

    const [requests, total] = await Promise.all([
      prisma.analysisRequest.findMany({
        where,
        include: {
          product: {
            include: {
              category: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.analysisRequest.count({ where })
    ]);

    return { requests, total, hasMore: offset + limit < total };
  }

  /**
   * 상품별 분석 요청 조회
   * @param {string} productId - 상품 ID
   * @param {Object} options - 조회 옵션
   * @returns {Promise<Array>} 분석 요청 목록
   */
  static async findByProductId(productId, options = {}) {
    const { status, limit = 10 } = options;
    
    const where = { productId };
    if (status) {
      where.status = status;
    }

    return await prisma.analysisRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  /**
   * 분석 요청 상태 업데이트
   * @param {string} taskId - Task ID
   * @param {string} status - 새로운 상태
   * @param {number} progress - 진행률 (0-100)
   * @returns {Promise<Object>} 업데이트된 분석 요청
   */
  static async updateStatus(taskId, status, progress = null) {
    const updateData = { status };
    
    if (progress !== null) {
      updateData.progress = progress;
    }
    
    if (status === 'completed' || status === 'failed') {
      updateData.completedAt = new Date();
    }

    try {
      return await prisma.analysisRequest.update({
        where: { taskId },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              profile: true
            }
          },
          product: {
            include: {
              category: true
            }
          }
        }
      });
    } catch (error) {
      throw new Error(`분석 요청 상태 업데이트 실패: ${error.message}`);
    }
  }

  /**
   * 진행 중인 분석 요청 조회
   * @param {Object} options - 조회 옵션
   * @returns {Promise<Array>} 진행 중인 분석 요청 목록
   */
  static async getInProgress(options = {}) {
    const { limit = 50 } = options;
    
    return await prisma.analysisRequest.findMany({
      where: {
        status: {
          in: ['pending', 'processing']
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
          include: {
            category: true
          }
        }
      },
      orderBy: [
        { priority: 'asc' }, // 우선순위 높은 것부터
        { createdAt: 'asc' }  // 오래된 것부터
      ],
      take: limit
    });
  }

  /**
   * 대기 중인 분석 요청 조회 (우선순위 순)
   * @param {number} limit - 조회 개수
   * @returns {Promise<Array>} 대기 중인 분석 요청 목록
   */
  static async getPending(limit = 10) {
    return await prisma.analysisRequest.findMany({
      where: { status: 'pending' },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        },
        product: {
          include: {
            category: true
          }
        }
      },
      orderBy: [
        { priority: 'asc' },
        { createdAt: 'asc' }
      ],
      take: limit
    });
  }

  /**
   * 분석 요청 통계 조회
   * @param {Object} options - 조회 옵션
   * @returns {Promise<Object>} 통계 정보
   */
  static async getStatistics(options = {}) {
    const { userId, startDate, endDate } = options;
    
    const where = {};
    if (userId) where.userId = userId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [
      totalRequests,
      statusCounts,
      requestTypeCounts,
      avgProcessingTime
    ] = await Promise.all([
      // 총 요청 수
      prisma.analysisRequest.count({ where }),
      
      // 상태별 요청 수
      prisma.analysisRequest.groupBy({
        by: ['status'],
        where,
        _count: { id: true }
      }),
      
      // 요청 타입별 수
      prisma.analysisRequest.groupBy({
        by: ['requestType'],
        where,
        _count: { id: true }
      }),
      
      // 평균 처리 시간 (완료된 요청만)
      prisma.analysisRequest.aggregate({
        where: {
          ...where,
          status: 'completed',
          completedAt: { not: null }
        },
        _avg: {
          // 처리 시간 계산을 위한 SQL 함수 사용 필요
          // 여기서는 간단히 null로 처리
        }
      })
    ]);

    return {
      totalRequests,
      statusDistribution: statusCounts.reduce((acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      }, {}),
      requestTypeDistribution: requestTypeCounts.reduce((acc, item) => {
        acc[item.requestType] = item._count.id;
        return acc;
      }, {}),
      averageProcessingTime: null // 추후 구현
    };
  }

  /**
   * 오래된 완료/실패 요청 정리
   * @param {number} daysOld - 삭제할 요청의 최소 일수
   * @returns {Promise<number>} 삭제된 요청 수
   */
  static async cleanup(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.analysisRequest.deleteMany({
      where: {
        status: {
          in: ['completed', 'failed']
        },
        completedAt: {
          lt: cutoffDate
        }
      }
    });

    return result.count;
  }

  /**
   * 중복 요청 확인
   * @param {string} productId - 상품 ID
   * @param {string} userId - 사용자 ID (선택적)
   * @param {number} minutes - 중복 확인 시간 (분)
   * @returns {Promise<Object|null>} 중복 요청 정보
   */
  static async findDuplicateRequest(productId, userId = null, minutes = 5) {
    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - minutes);

    const where = {
      productId,
      status: {
        in: ['pending', 'processing']
      },
      createdAt: {
        gte: cutoffTime
      }
    };

    if (userId) {
      where.userId = userId;
    }

    return await prisma.analysisRequest.findFirst({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * 분석 요청 삭제
   * @param {string} taskId - Task ID
   * @returns {Promise<Object>} 삭제된 분석 요청
   */
  static async delete(taskId) {
    return await prisma.analysisRequest.delete({
      where: { taskId }
    });
  }
}

module.exports = AnalysisRequest;