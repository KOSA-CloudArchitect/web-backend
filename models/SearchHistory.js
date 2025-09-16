/**
 * SearchHistory Model
 * 검색 기록 관리를 위한 모델
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class SearchHistory {
  /**
   * 검색 기록 추가
   * @param {Object} searchData - 검색 데이터
   * @returns {Promise<Object>} 생성된 검색 기록
   */
  static async create(searchData) {
    const { userId, query, resultCount = 0 } = searchData;
    
    try {
      // 중복 검색어가 있는지 확인 (최근 24시간 내)
      const recentSearch = await this.findRecentByQuery(userId, query, 24);
      
      if (recentSearch) {
        // 기존 검색 기록 업데이트 (최신 시간으로)
        return await prisma.searchHistory.update({
          where: { id: recentSearch.id },
          data: {
            resultCount,
            createdAt: new Date() // 검색 시간 갱신
          }
        });
      } else {
        // 새로운 검색 기록 생성
        return await prisma.searchHistory.create({
          data: {
            userId,
            query: query.trim(),
            resultCount
          }
        });
      }
    } catch (error) {
      throw new Error(`검색 기록 생성 실패: ${error.message}`);
    }
  }

  /**
   * 사용자의 최근 검색어 조회
   * @param {string} userId - 사용자 ID
   * @param {number} limit - 조회 개수 (기본 10개)
   * @returns {Promise<Array>} 최근 검색어 목록
   */
  static async getRecentSearches(userId, limit = 10) {
    return await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        query: true,
        resultCount: true,
        createdAt: true
      }
    });
  }

  /**
   * 특정 검색어의 최근 기록 찾기
   * @param {string} userId - 사용자 ID
   * @param {string} query - 검색어
   * @param {number} hours - 조회 시간 범위 (시간)
   * @returns {Promise<Object|null>} 검색 기록
   */
  static async findRecentByQuery(userId, query, hours = 24) {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hours);

    return await prisma.searchHistory.findFirst({
      where: {
        userId,
        query: query.trim(),
        createdAt: {
          gte: cutoffTime
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * 사용자의 검색 기록 삭제
   * @param {string} userId - 사용자 ID
   * @param {string} searchId - 검색 기록 ID (선택적)
   * @returns {Promise<Object>} 삭제 결과
   */
  static async deleteUserHistory(userId, searchId = null) {
    if (searchId) {
      // 특정 검색 기록 삭제
      return await prisma.searchHistory.delete({
        where: {
          id: searchId,
          userId // 보안을 위해 사용자 ID도 확인
        }
      });
    } else {
      // 사용자의 모든 검색 기록 삭제
      return await prisma.searchHistory.deleteMany({
        where: { userId }
      });
    }
  }

  /**
   * 인기 검색어 조회
   * @param {Object} options - 조회 옵션
   * @returns {Promise<Array>} 인기 검색어 목록
   */
  static async getPopularSearches(options = {}) {
    const { limit = 10, hours = 24 } = options;
    
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hours);

    // 최근 시간 내 검색어별 검색 횟수 집계
    const popularSearches = await prisma.searchHistory.groupBy({
      by: ['query'],
      where: {
        createdAt: {
          gte: cutoffTime
        }
      },
      _count: {
        query: true
      },
      orderBy: {
        _count: {
          query: 'desc'
        }
      },
      take: limit
    });

    return popularSearches.map(item => ({
      query: item.query,
      searchCount: item._count.query
    }));
  }

  /**
   * 검색어 자동완성 제안
   * @param {string} userId - 사용자 ID
   * @param {string} partialQuery - 부분 검색어
   * @param {number} limit - 제안 개수
   * @returns {Promise<Array>} 자동완성 제안 목록
   */
  static async getAutocompleteSuggestions(userId, partialQuery, limit = 5) {
    const trimmedQuery = partialQuery.trim().toLowerCase();
    
    if (trimmedQuery.length < 2) {
      return [];
    }

    // 사용자의 검색 기록에서 부분 일치하는 검색어 찾기
    const userSuggestions = await prisma.searchHistory.findMany({
      where: {
        userId,
        query: {
          contains: trimmedQuery,
          mode: 'insensitive'
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        query: true,
        createdAt: true
      }
    });

    // 중복 제거 및 정렬
    const uniqueSuggestions = Array.from(
      new Set(userSuggestions.map(s => s.query))
    ).slice(0, limit);

    return uniqueSuggestions.map(query => ({ query }));
  }

  /**
   * 검색 통계 조회
   * @param {string} userId - 사용자 ID
   * @param {Object} options - 조회 옵션
   * @returns {Promise<Object>} 검색 통계
   */
  static async getSearchStatistics(userId, options = {}) {
    const { days = 30 } = options;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      totalSearches,
      uniqueQueries,
      dailySearches,
      topQueries
    ] = await Promise.all([
      // 총 검색 횟수
      prisma.searchHistory.count({
        where: {
          userId,
          createdAt: { gte: startDate }
        }
      }),

      // 고유 검색어 수
      prisma.searchHistory.groupBy({
        by: ['query'],
        where: {
          userId,
          createdAt: { gte: startDate }
        }
      }).then(result => result.length),

      // 일별 검색 횟수 (최근 7일)
      this.getDailySearchCounts(userId, 7),

      // 자주 검색한 검색어 (상위 5개)
      prisma.searchHistory.groupBy({
        by: ['query'],
        where: {
          userId,
          createdAt: { gte: startDate }
        },
        _count: {
          query: true
        },
        orderBy: {
          _count: {
            query: 'desc'
          }
        },
        take: 5
      })
    ]);

    return {
      totalSearches,
      uniqueQueries,
      dailySearches,
      topQueries: topQueries.map(item => ({
        query: item.query,
        count: item._count.query
      }))
    };
  }

  /**
   * 일별 검색 횟수 조회
   * @param {string} userId - 사용자 ID
   * @param {number} days - 조회 일수
   * @returns {Promise<Array>} 일별 검색 횟수
   */
  static async getDailySearchCounts(userId, days = 7) {
    const results = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await prisma.searchHistory.count({
        where: {
          userId,
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      });

      results.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }

    return results;
  }

  /**
   * 오래된 검색 기록 정리
   * @param {number} daysOld - 삭제할 기록의 최소 일수
   * @returns {Promise<number>} 삭제된 기록 수
   */
  static async cleanup(daysOld = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.searchHistory.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    });

    return result.count;
  }

  /**
   * 검색어 트렌드 분석
   * @param {Object} options - 분석 옵션
   * @returns {Promise<Array>} 트렌드 분석 결과
   */
  static async getTrendingSearches(options = {}) {
    const { limit = 10, compareHours = 24 } = options;
    
    const now = new Date();
    const recentStart = new Date(now.getTime() - compareHours * 60 * 60 * 1000);
    const previousStart = new Date(recentStart.getTime() - compareHours * 60 * 60 * 1000);

    // 최근 기간과 이전 기간의 검색 횟수 비교
    const [recentSearches, previousSearches] = await Promise.all([
      prisma.searchHistory.groupBy({
        by: ['query'],
        where: {
          createdAt: {
            gte: recentStart,
            lt: now
          }
        },
        _count: { query: true }
      }),
      prisma.searchHistory.groupBy({
        by: ['query'],
        where: {
          createdAt: {
            gte: previousStart,
            lt: recentStart
          }
        },
        _count: { query: true }
      })
    ]);

    // 트렌드 계산
    const previousMap = new Map(
      previousSearches.map(item => [item.query, item._count.query])
    );

    const trending = recentSearches
      .map(item => {
        const recentCount = item._count.query;
        const previousCount = previousMap.get(item.query) || 0;
        const growth = previousCount > 0 
          ? ((recentCount - previousCount) / previousCount) * 100 
          : recentCount > 0 ? 100 : 0;

        return {
          query: item.query,
          recentCount,
          previousCount,
          growth: Math.round(growth * 100) / 100
        };
      })
      .filter(item => item.growth > 0)
      .sort((a, b) => b.growth - a.growth)
      .slice(0, limit);

    return trending;
  }
}

module.exports = SearchHistory;