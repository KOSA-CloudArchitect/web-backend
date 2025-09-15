const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const nosqlService = require('../services/nosql');

const prisma = new PrismaClient();

class WatchListService {
  /**
   * 상품 URL로 productKey 생성 (NoSQL과 동일한 방식)
   */
  static makeProductKey(url) {
    const hash = crypto.createHash('sha1').update(String(url || '')).digest('hex');
    return `URL#${hash}`;
  }

  /**
   * 관심 상품 등록
   * @param {string} userId - 사용자 ID  
   * @param {string} productUrl - 상품 URL
   * @param {string} productName - 상품명 (선택)
   * @param {Object} options - 추가 옵션
   */
  static async addToWatchList(userId, productUrl, productName = '', options = {}) {
    console.log('🟡 WatchListService.addToWatchList 시작:', { userId, productUrl, productName });
    
    const {
      priceAlert = true,
      targetPrice = null,
      analysisFrequency = 'daily'
    } = options;

    try {
      // 1. productKey 생성 (NoSQL과 동일한 방식)
      const productKey = this.makeProductKey(productUrl);
      console.log('🟡 생성된 productKey:', productKey);

      // 2. 이미 관심상품에 등록되어 있는지 확인
      const existingWatch = await prisma.watchList.findUnique({
        where: {
          userId_productId: {
            userId,
            productId: productKey
          }
        }
      });

      if (existingWatch) {
        if (existingWatch.isActive) {
          throw new Error('이미 관심 상품으로 등록된 상품입니다.');
        } else {
          // 비활성화된 항목 재활성화
          console.log('🟡 비활성 관심상품 재활성화');
          return await prisma.watchList.update({
            where: { id: existingWatch.id },
            data: {
              isActive: true,
              priceAlert,
              targetPrice,
              analysisFrequency,
              updatedAt: new Date()
            }
          });
        }
      }

      // 3. 새로운 관심상품 등록
      console.log('🟡 새 관심상품 등록');
      const watchItem = await prisma.watchList.create({
        data: {
          userId,
          productId: productKey, // NoSQL의 productKey를 사용
          priceAlert,
          targetPrice,
          analysisFrequency
        }
      });

      console.log('🟡 관심상품 등록 성공:', watchItem);
      return watchItem;
    } catch (error) {
      console.error('🔴 WatchListService.addToWatchList 에러:', error);
      throw error;
    }
  }

  /**
   * 사용자의 관심상품 목록 조회 (NoSQL 상품 정보와 조합)
   * @param {string} userId - 사용자 ID
   * @param {Object} options - 조회 옵션
   */
  static async getUserWatchList(userId, options = {}) {
    console.log('🟡 WatchListService.getUserWatchList 시작:', { userId, options });
    
    const {
      page = 1,
      limit = 20,
      isActive = true,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    try {
      // 1. RDS에서 사용자의 WatchList 조회
      const watchList = await prisma.watchList.findMany({
        where: {
          userId,
          isActive
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip: (page - 1) * limit,
        take: limit
      });

      console.log('🟡 RDS WatchList 조회 결과:', watchList.length, '개');

      if (watchList.length === 0) {
        return {
          items: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0
          }
        };
      }

      // 2. productKey들로 NoSQL에서 상품 정보 조회
      const productKeys = watchList.map(w => w.productId);
      console.log('🟡 조회할 productKeys:', productKeys);

      const productInfoPromises = productKeys.map(async (productKey) => {
        try {
          const product = await nosqlService.getLatestByKey(productKey);
          return { productKey, product };
        } catch (error) {
          console.warn(`🟠 상품 정보 조회 실패 (${productKey}):`, error.message);
          return { productKey, product: null };
        }
      });

      const productResults = await Promise.all(productInfoPromises);
      const productMap = new Map();
      productResults.forEach(({ productKey, product }) => {
        productMap.set(productKey, product);
      });

      console.log('🟡 NoSQL에서 조회된 상품 수:', productMap.size);

      // 3. WatchList와 상품 정보 조합
      const combinedItems = watchList.map(watchItem => {
        const product = productMap.get(watchItem.productId);
        
        return {
          id: watchItem.id,
          userId: watchItem.userId,
          productId: watchItem.productId,
          priceAlert: watchItem.priceAlert,
          targetPrice: watchItem.targetPrice,
          analysisFrequency: watchItem.analysisFrequency,
          isActive: watchItem.isActive,
          createdAt: watchItem.createdAt,
          updatedAt: watchItem.updatedAt,
          lastNotifiedAt: watchItem.lastNotifiedAt,
          // NoSQL 상품 정보
          product: product ? {
            productKey: product.productKey,
            title: product.title,
            url: product.url,
            imageUrl: product.imageUrl,
            currentPrice: product.finalPriceNumber,
            originalPrice: product.originPriceNumber,
            rating: product.review_rating,
            reviewCount: product.review_count,
            source: product.source,
            crawledAt: product.crawledAt
          } : null
        };
      });

      // 4. 전체 개수 조회
      const total = await prisma.watchList.count({
        where: {
          userId,
          isActive
        }
      });

      console.log('🟡 최종 조합 결과:', combinedItems.length, '개');

      return {
        items: combinedItems,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('🔴 WatchListService.getUserWatchList 에러:', error);
      throw error;
    }
  }

  /**
   * 관심상품 삭제 (비활성화)
   * @param {string} userId - 사용자 ID
   * @param {string} watchItemId - WatchList ID
   */
  static async removeFromWatchList(userId, watchItemId) {
    console.log('🟡 WatchListService.removeFromWatchList 시작:', { userId, watchItemId });
    
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

      const updatedItem = await prisma.watchList.update({
        where: { id: watchItemId },
        data: {
          isActive: false,
          updatedAt: new Date()
        }
      });

      console.log('🟡 관심상품 삭제(비활성화) 성공:', updatedItem.id);
      return updatedItem;
    } catch (error) {
      console.error('🔴 WatchListService.removeFromWatchList 에러:', error);
      throw error;
    }
  }

  /**
   * 관심상품 설정 업데이트
   * @param {string} userId - 사용자 ID
   * @param {string} watchItemId - WatchList ID
   * @param {Object} updateData - 업데이트할 데이터
   */
  static async updateWatchListSettings(userId, watchItemId, updateData) {
    console.log('🟡 WatchListService.updateWatchListSettings 시작:', { userId, watchItemId, updateData });
    
    const allowedFields = ['priceAlert', 'targetPrice', 'analysisFrequency'];
    const filteredData = {};

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

      const updatedItem = await prisma.watchList.update({
        where: { id: watchItemId },
        data: {
          ...filteredData,
          updatedAt: new Date()
        }
      });

      console.log('🟡 관심상품 설정 업데이트 성공:', updatedItem.id);
      return updatedItem;
    } catch (error) {
      console.error('🔴 WatchListService.updateWatchListSettings 에러:', error);
      throw error;
    }
  }

  /**
   * 여러 관심상품 삭제
   * @param {string} userId - 사용자 ID
   * @param {string[]} watchItemIds - WatchList ID 배열
   */
  static async removeMultipleFromWatchList(userId, watchItemIds) {
    console.log('🟡 WatchListService.removeMultipleFromWatchList 시작:', { userId, count: watchItemIds.length });
    
    try {
      const result = await prisma.watchList.updateMany({
        where: {
          id: { in: watchItemIds },
          userId,
          isActive: true
        },
        data: {
          isActive: false,
          updatedAt: new Date()
        }
      });

      console.log('🟡 다중 관심상품 삭제 성공:', result.count, '개');
      return { count: result.count };
    } catch (error) {
      console.error('🔴 WatchListService.removeMultipleFromWatchList 에러:', error);
      throw error;
    }
  }
}

module.exports = WatchListService;