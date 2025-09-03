const { PrismaClient } = require('@prisma/client');
const batchAnalysisService = require('../services/batchAnalysisService');

const prisma = new PrismaClient();

class InterestProduct {
  /**
   * 관심 상품 등록
   * @param {string} userId - 사용자 ID
   * @param {string} productUrl - 상품 URL
   * @param {Object} options - 추가 옵션
   * @returns {Promise<Object>} 등록된 관심 상품 정보
   */
  static async register(userId, productUrl, options = {}) {
    console.log('🟠 InterestProduct.register 시작:', { userId, productUrl, options });
    
    const {
      priceAlert = true,
      targetPrice = null,
      analysisFrequency = 'daily'
    } = options;

    try {
      console.log('🟠 상품 URL로 기존 상품 검색:', productUrl);
      // 상품이 이미 존재하는지 확인
      let product = await prisma.product.findUnique({
        where: { url: productUrl }
      });
      console.log('🟠 기존 상품 검색 결과:', product ? `ID: ${product.id}` : '없음');

      // 상품이 없으면 새로 생성
      if (!product) {
        console.log('🟠 새 상품 생성 중...');
        product = await prisma.product.create({
          data: {
            name: 'Unknown Product', // 크롤링으로 나중에 업데이트
            url: productUrl,
            isActive: true
          }
        });
        console.log('🟠 새 상품 생성 완료:', product.id);
      }

      // 이미 관심 상품으로 등록되어 있는지 확인
      console.log('🟠 기존 관심 상품 여부 확인:', { userId, productId: product.id });
      const existingWatchItem = await prisma.watchList.findUnique({
        where: {
          userId_productId: {
            userId,
            productId: product.id
          }
        }
      });
      console.log('🟠 기존 관심 상품 검색 결과:', existingWatchItem ? `ID: ${existingWatchItem.id}, 활성: ${existingWatchItem.isActive}` : '없음');

      if (existingWatchItem) {
        if (existingWatchItem.isActive) {
          console.log('🟠 이미 활성 관심 상품 존재');
          throw new Error('이미 관심 상품으로 등록된 상품입니다.');
        } else {
          console.log('🟠 비활성 관심 상품 재활성화');
          // 비활성화된 항목을 다시 활성화
          return await prisma.watchList.update({
            where: { id: existingWatchItem.id },
            data: {
              isActive: true,
              priceAlert,
              targetPrice,
              analysisFrequency,
              updatedAt: new Date()
            },
            include: {
              product: true
            }
          });
        }
      }

      // 트랜잭션으로 관심 상품 등록과 배치 분석 요청을 원자적으로 처리
      console.log('🟠 새 관심 상품 등록 트랜잭션 시작');
      const result = await prisma.$transaction(async (tx) => {
        // 새로운 관심 상품 등록
        console.log('🟠 새 관심 상품 생성 중...');
        const watchItem = await tx.watchList.create({
          data: {
            userId,
            productId: product.id,
            priceAlert,
            targetPrice,
            analysisFrequency
          },
          include: {
            product: true
          }
        });
        console.log('🟠 새 관심 상품 생성 완료:', watchItem.id);

        // 배치 분석 요청 생성
        try {
          console.log('🟠 배치 분석 요청 생성 시도');
          await batchAnalysisService.createBatchAnalysisRequest(product.id, userId, {
            frequency: analysisFrequency,
            notifications: priceAlert,
            priceAlerts: priceAlert,
            targetPrice: targetPrice,
            watchItemId: watchItem.id
          });
          console.log('🟠 배치 분석 요청 생성 성공');
        } catch (batchError) {
          console.warn('⚠️ 배치 분석 요청 생성 실패 (관심 상품 등록은 완료됨):', batchError.message);
        }

        return watchItem;
      });

      console.log('🟠 관심 상품 등록 완료:', result);
      return result;
    } catch (error) {
      console.error('🔴 InterestProduct.register 에러:', error);
      throw error;
    }
  }

  /**
   * 사용자의 관심 상품 목록 조회
   * @param {string} userId - 사용자 ID
   * @param {Object} options - 조회 옵션
   * @returns {Promise<Array>} 관심 상품 목록
   */
  static async getByUserId(userId, options = {}) {
    const {
      page = 1,
      limit = 20,
      isActive = true,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const skip = (page - 1) * limit;

    try {
      const watchList = await prisma.watchList.findMany({
        where: {
          userId,
          isActive
        },
        include: {
          product: {
            include: {
              priceHistory: {
                orderBy: { createdAt: 'desc' },
                take: 1
              },
              analysisResults: {
                where: { status: 'completed' },
                orderBy: { createdAt: 'desc' },
                take: 1
              }
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limit
      });

      const total = await prisma.watchList.count({
        where: {
          userId,
          isActive
        }
      });

      return {
        items: watchList,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 관심 상품 삭제 (비활성화)
   * @param {string} userId - 사용자 ID
   * @param {string} watchItemId - 관심 상품 ID
   * @returns {Promise<Object>} 삭제된 관심 상품 정보
   */
  static async remove(userId, watchItemId) {
    try {
      const watchItem = await prisma.watchList.findFirst({
        where: {
          id: watchItemId,
          userId,
          isActive: true
        }
      });

      if (!watchItem) {
        throw new Error('관심 상품을 찾을 수 없습니다.');
      }

      return await prisma.watchList.update({
        where: { id: watchItemId },
        data: {
          isActive: false,
          updatedAt: new Date()
        },
        include: {
          product: true
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * 관심 상품 설정 업데이트
   * @param {string} userId - 사용자 ID
   * @param {string} watchItemId - 관심 상품 ID
   * @param {Object} updateData - 업데이트할 데이터
   * @returns {Promise<Object>} 업데이트된 관심 상품 정보
   */
  static async updateSettings(userId, watchItemId, updateData) {
    const allowedFields = ['priceAlert', 'targetPrice', 'analysisFrequency'];
    const filteredData = {};

    // 허용된 필드만 필터링
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    if (Object.keys(filteredData).length === 0) {
      throw new Error('업데이트할 유효한 데이터가 없습니다.');
    }

    try {
      const watchItem = await prisma.watchList.findFirst({
        where: {
          id: watchItemId,
          userId,
          isActive: true
        }
      });

      if (!watchItem) {
        throw new Error('관심 상품을 찾을 수 없습니다.');
      }

      return await prisma.watchList.update({
        where: { id: watchItemId },
        data: {
          ...filteredData,
          updatedAt: new Date()
        },
        include: {
          product: true
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * 관심 상품 비교 데이터 조회
   * @param {string} userId - 사용자 ID
   * @param {Array} watchItemIds - 비교할 관심 상품 ID 배열
   * @returns {Promise<Array>} 비교 데이터
   */
  static async getComparisonData(userId, watchItemIds) {
    if (!Array.isArray(watchItemIds) || watchItemIds.length === 0) {
      throw new Error('비교할 상품을 선택해주세요.');
    }

    if (watchItemIds.length > 5) {
      throw new Error('최대 5개 상품까지 비교할 수 있습니다.');
    }

    try {
      const watchItems = await prisma.watchList.findMany({
        where: {
          id: { in: watchItemIds },
          userId,
          isActive: true
        },
        include: {
          product: {
            include: {
              priceHistory: {
                orderBy: { createdAt: 'desc' },
                take: 30 // 최근 30개 가격 이력
              },
              analysisResults: {
                where: { status: 'completed' },
                orderBy: { createdAt: 'desc' },
                take: 1
              }
            }
          }
        }
      });

      if (watchItems.length !== watchItemIds.length) {
        throw new Error('일부 관심 상품을 찾을 수 없습니다.');
      }

      // 비교 데이터 가공
      const comparisonData = watchItems.map(item => ({
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          url: item.product.url,
          currentPrice: item.product.currentPrice,
          averageRating: item.product.averageRating,
          totalReviews: item.product.totalReviews,
          imageUrl: item.product.imageUrl
        },
        priceHistory: item.product.priceHistory,
        latestAnalysis: item.product.analysisResults[0] || null,
        settings: {
          priceAlert: item.priceAlert,
          targetPrice: item.targetPrice,
          analysisFrequency: item.analysisFrequency
        }
      }));

      return comparisonData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 가격 알림이 필요한 관심 상품 조회
   * @returns {Promise<Array>} 가격 알림 대상 상품 목록
   */
  static async getPriceAlertTargets() {
    try {
      const targets = await prisma.watchList.findMany({
        where: {
          isActive: true,
          priceAlert: true,
          targetPrice: { not: null }
        },
        include: {
          user: {
            include: {
              profile: true
            }
          },
          product: {
            include: {
              priceHistory: {
                orderBy: { createdAt: 'desc' },
                take: 1
              }
            }
          }
        }
      });

      // 목표 가격 이하로 떨어진 상품만 필터링
      const alertTargets = targets.filter(item => {
        const currentPrice = item.product.currentPrice;
        const targetPrice = item.targetPrice;
        
        if (!currentPrice || !targetPrice) return false;
        
        return parseFloat(currentPrice) <= parseFloat(targetPrice);
      });

      return alertTargets;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 정기 분석이 필요한 관심 상품 조회
   * @param {string} frequency - 분석 주기 ('daily', 'weekly', 'monthly')
   * @returns {Promise<Array>} 정기 분석 대상 상품 목록
   */
  static async getScheduledAnalysisTargets(frequency = 'daily') {
    try {
      const watchItems = await prisma.watchList.findMany({
        where: {
          isActive: true,
          analysisFrequency: frequency
        },
        include: {
          product: {
            include: {
              analysisResults: {
                where: { status: 'completed' },
                orderBy: { createdAt: 'desc' },
                take: 1
              }
            }
          }
        }
      });

      // 마지막 분석 시점을 기준으로 필터링
      const now = new Date();
      const cutoffTime = new Date();
      
      switch (frequency) {
        case 'daily':
          cutoffTime.setDate(now.getDate() - 1);
          break;
        case 'weekly':
          cutoffTime.setDate(now.getDate() - 7);
          break;
        case 'monthly':
          cutoffTime.setMonth(now.getMonth() - 1);
          break;
      }

      const analysisTargets = watchItems.filter(item => {
        const lastAnalysis = item.product.analysisResults[0];
        if (!lastAnalysis) return true; // 분석된 적이 없으면 분석 필요
        
        return new Date(lastAnalysis.createdAt) < cutoffTime;
      });

      return analysisTargets;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = InterestProduct;