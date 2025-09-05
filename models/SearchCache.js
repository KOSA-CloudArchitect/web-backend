// 검색 캐시 관리 모델
class SearchCache {
  constructor() {
    this.searches = new Map(); // keyword -> search info
    this.CACHE_DURATION = 30 * 60 * 1000; // 30분
    this.cleanupInterval = null;
    this.startCleanup();
  }

  /**
   * 검색 캐시 저장
   */
  saveSearch(keyword, products, metadata = {}) {
    const searchInfo = {
      keyword: keyword.toLowerCase().trim(),
      products,
      searchTime: new Date(),
      productCount: products.length,
      metadata: {
        page: metadata.page || 1,
        per_page: metadata.per_page || 20,
        max_links: metadata.max_links || 10,
        ...metadata
      },
      expiresAt: new Date(Date.now() + this.CACHE_DURATION)
    };

    this.searches.set(searchInfo.keyword, searchInfo);
    console.log(`💾 검색 캐시 저장: "${keyword}" (${products.length}개 상품, 30분 유효)`);
    
    return searchInfo;
  }

  /**
   * 검색 캐시 조회 (30분 이내)
   */
  getSearch(keyword) {
    const normalizedKeyword = keyword.toLowerCase().trim();
    const searchInfo = this.searches.get(normalizedKeyword);
    
    if (!searchInfo) {
      console.log(`📭 검색 캐시 없음: "${keyword}"`);
      return null;
    }

    const now = new Date();
    const timeElapsed = now - searchInfo.searchTime;
    const remainingTime = this.CACHE_DURATION - timeElapsed;

    if (remainingTime <= 0) {
      // 만료된 캐시 제거
      this.searches.delete(normalizedKeyword);
      console.log(`⏰ 검색 캐시 만료: "${keyword}" (${Math.round(timeElapsed/1000/60)}분 경과)`);
      return null;
    }

    console.log(`✅ 검색 캐시 히트: "${keyword}" (${Math.round(remainingTime/1000/60)}분 남음, ${searchInfo.productCount}개 상품)`);
    return searchInfo;
  }

  /**
   * 캐시가 유효한지 확인
   */
  isCacheValid(keyword) {
    return this.getSearch(keyword) !== null;
  }

  /**
   * 특정 검색어 캐시 제거
   */
  invalidateSearch(keyword) {
    const normalizedKeyword = keyword.toLowerCase().trim();
    const existed = this.searches.delete(normalizedKeyword);
    if (existed) {
      console.log(`🗑️ 검색 캐시 무효화: "${keyword}"`);
    }
    return existed;
  }

  /**
   * 만료된 캐시들 정리
   */
  cleanup() {
    const now = new Date();
    let cleanedCount = 0;

    for (const [keyword, searchInfo] of this.searches.entries()) {
      if (now >= searchInfo.expiresAt) {
        this.searches.delete(keyword);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 만료된 검색 캐시 정리: ${cleanedCount}개 제거`);
    }

    return cleanedCount;
  }

  /**
   * 정기 정리 시작
   */
  startCleanup() {
    // 5분마다 만료된 캐시 정리
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);

    console.log('🔄 검색 캐시 정리 스케줄러 시작 (5분마다)');
  }

  /**
   * 정리 중단
   */
  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('⏹️ 검색 캐시 정리 스케줄러 중단');
    }
  }

  /**
   * 현재 캐시 상태 조회
   */
  getStats() {
    const now = new Date();
    const active = [];
    const expired = [];

    for (const [keyword, searchInfo] of this.searches.entries()) {
      const remainingTime = searchInfo.expiresAt - now;
      if (remainingTime > 0) {
        active.push({
          keyword,
          productCount: searchInfo.productCount,
          remainingMinutes: Math.round(remainingTime / 1000 / 60),
          searchTime: searchInfo.searchTime
        });
      } else {
        expired.push(keyword);
      }
    }

    return {
      activeSearches: active.length,
      expiredSearches: expired.length,
      totalMemoryUsage: this.searches.size,
      searches: active,
      expiredKeywords: expired
    };
  }

  /**
   * 모든 캐시 제거
   */
  clear() {
    const count = this.searches.size;
    this.searches.clear();
    console.log(`🗑️ 모든 검색 캐시 제거: ${count}개`);
    return count;
  }
}

// 싱글톤 인스턴스
const searchCache = new SearchCache();

module.exports = searchCache;