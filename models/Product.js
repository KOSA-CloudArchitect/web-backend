/**
 * Product Model
 * 상품 정보 관리를 위한 모델
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class Product {
  /**
   * 상품 생성 또는 업데이트
   * @param {Object} productData - 상품 데이터
   * @returns {Promise<Object>} 생성/업데이트된 상품 정보
   */
  static async upsert(productData) {
    const { url, name, categoryId, currentPrice, averageRating, totalReviews, imageUrl } = productData;
    
    try {
      const product = await prisma.product.upsert({
        where: { url },
        update: {
          name,
          categoryId,
          currentPrice,
          averageRating,
          totalReviews,
          imageUrl,
          lastCrawledAt: new Date(),
          updatedAt: new Date()
        },
        create: {
          url,
          name,
          categoryId,
          currentPrice,
          averageRating,
          totalReviews,
          imageUrl,
          lastCrawledAt: new Date()
        },
        include: {
          category: true,
          priceHistory: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });

      // 가격 이력 저장 (가격이 변경된 경우)
      if (currentPrice && product.currentPrice !== currentPrice) {
        await this.addPriceHistory(product.id, currentPrice);
      }

      return product;
    } catch (error) {
      throw new Error(`상품 생성/업데이트 실패: ${error.message}`);
    }
  }

  /**
   * URL로 상품 찾기
   * @param {string} url - 상품 URL
   * @returns {Promise<Object|null>} 상품 정보
   */
  static async findByUrl(url) {
    return await prisma.product.findUnique({
      where: { url },
      include: {
        category: true,
        analysisResults: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        priceHistory: {
          orderBy: { createdAt: 'desc' },
          take: 30 // 최근 30개 가격 이력
        }
      }
    });
  }

  /**
   * ID로 상품 찾기
   * @param {string} id - 상품 ID
   * @returns {Promise<Object|null>} 상품 정보
   */
  static async findById(id) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        analysisResults: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        priceHistory: {
          orderBy: { createdAt: 'desc' },
          take: 30
        }
      }
    });
  }

  /**
   * 상품 검색
   * @param {string} query - 검색어
   * @param {Object} options - 검색 옵션
   * @returns {Promise<Array>} 검색 결과
   */
  static async search(query, options = {}) {
    const { categoryId, minPrice, maxPrice, minRating, limit = 20, offset = 0 } = options;
    
    const where = {
      isActive: true,
      AND: [
        {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { category: { name: { contains: query, mode: 'insensitive' } } }
          ]
        }
      ]
    };

    // 필터 조건 추가
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (minPrice || maxPrice) {
      where.currentPrice = {};
      if (minPrice) where.currentPrice.gte = minPrice;
      if (maxPrice) where.currentPrice.lte = maxPrice;
    }
    
    if (minRating) {
      where.averageRating = { gte: minRating };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          analysisResults: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: [
          { totalReviews: 'desc' },
          { averageRating: 'desc' }
        ],
        take: limit,
        skip: offset
      }),
      prisma.product.count({ where })
    ]);

    return { products, total, hasMore: offset + limit < total };
  }

  /**
   * 인기 상품 조회
   * @param {Object} options - 조회 옵션
   * @returns {Promise<Array>} 인기 상품 목록
   */
  static async getPopular(options = {}) {
    const { categoryId, limit = 10 } = options;
    
    const where = {
      isActive: true,
      totalReviews: { gt: 10 }, // 최소 리뷰 수
      averageRating: { gte: 4.0 } // 최소 평점
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    return await prisma.product.findMany({
      where,
      include: {
        category: true,
        analysisResults: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: [
        { totalReviews: 'desc' },
        { averageRating: 'desc' }
      ],
      take: limit
    });
  }

  /**
   * 최근 분석된 상품 조회
   * @param {number} limit - 조회 개수
   * @returns {Promise<Array>} 최근 분석된 상품 목록
   */
  static async getRecentlyAnalyzed(limit = 10) {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        analysisResults: {
          some: {
            status: 'completed'
          }
        }
      },
      include: {
        category: true,
        analysisResults: {
          where: { status: 'completed' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: {
        analysisResults: {
          _max: {
            createdAt: 'desc'
          }
        }
      },
      take: limit
    });
  }

  /**
   * 가격 이력 추가
   * @param {string} productId - 상품 ID
   * @param {number} price - 가격
   * @returns {Promise<Object>} 생성된 가격 이력
   */
  static async addPriceHistory(productId, price) {
    return await prisma.priceHistory.create({
      data: {
        productId,
        price
      }
    });
  }

  /**
   * 상품 가격 이력 조회
   * @param {string} productId - 상품 ID
   * @param {number} days - 조회 기간 (일)
   * @returns {Promise<Array>} 가격 이력
   */
  static async getPriceHistory(productId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await prisma.priceHistory.findMany({
      where: {
        productId,
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  /**
   * 상품 통계 정보 조회
   * @param {string} productId - 상품 ID
   * @returns {Promise<Object>} 통계 정보
   */
  static async getStatistics(productId) {
    const product = await this.findById(productId);
    if (!product) return null;

    const priceHistory = await this.getPriceHistory(productId, 90); // 90일 가격 이력
    
    let minPrice = null;
    let maxPrice = null;
    let avgPrice = null;

    if (priceHistory.length > 0) {
      const prices = priceHistory.map(p => parseFloat(p.price));
      minPrice = Math.min(...prices);
      maxPrice = Math.max(...prices);
      avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    }

    const analysisCount = await prisma.analysisResult.count({
      where: { productId, status: 'completed' }
    });

    return {
      product,
      priceStatistics: {
        current: product.currentPrice ? parseFloat(product.currentPrice) : null,
        min: minPrice,
        max: maxPrice,
        average: avgPrice,
        history: priceHistory
      },
      analysisCount,
      lastAnalyzedAt: product.analysisResults[0]?.createdAt || null
    };
  }

  /**
   * 상품 비활성화
   * @param {string} id - 상품 ID
   * @returns {Promise<Object>} 업데이트된 상품 정보
   */
  static async deactivate(id) {
    return await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });
  }

  /**
   * 크롤링 시간 업데이트
   * @param {string} id - 상품 ID
   * @returns {Promise<Object>} 업데이트된 상품 정보
   */
  static async updateCrawledAt(id) {
    return await prisma.product.update({
      where: { id },
      data: { lastCrawledAt: new Date() }
    });
  }

  /**
   * 카테고리별 상품 수 조회
   * @returns {Promise<Array>} 카테고리별 상품 수
   */
  static async getCategoryStats() {
    return await prisma.product.groupBy({
      by: ['categoryId'],
      where: { isActive: true },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    });
  }
}

module.exports = Product;