// ========================================
// 쿠팡 키워드 태그 MongoDB 저장 구조
// ========================================

// Collection: coupang_keyword_tags
const keywordDocument = {
  _id: ObjectId("65a1b2c3d4e5f6789abcdef0"),
  
  // 기본 정보
  product_id: "prod-123",
  crawl_session_id: "crawl-20240108-103045",
  
  // 크롤링된 키워드 카테고리 데이터 (그대로 저장)
  keyword_categories: {
    "사용 목적": [
      { tag: "그래픽/전문가용", percentage: 16, width: 16, color: "green" },
      { tag: "학습용", percentage: 20, width: 20, color: "green" },
      { tag: "사무용", percentage: 48, width: 48, color: "green" },
      { tag: "기타 용도", percentage: 16, width: 16, color: "green" }
    ],
    "무게": [
      { tag: "가벼워요", percentage: 61, width: 61, color: "blue" },
      { tag: "적당해요", percentage: 30, width: 30, color: "blue" },
      { tag: "생각보다무거워요", percentage: 9, width: 9, color: "blue" }
    ]
  },
  
  // 메타데이터
  crawled_at: ISODate("2024-01-08T10:30:45Z"),
  source: "coupang",
  product_url: "https://www.coupang.com/vp/products/123456789",
  
  // 자동 계산된 통계
  stats: {
    total_categories: 2,
    total_tags: 7,
    category_with_most_tags: "사용 목적",
    highest_percentage: { category: "무게", tag: "가벼워요", percentage: 61 },
    color_distribution: {
      green: 4,  // 사용 목적 카테고리
      blue: 3    // 무게 카테고리
    }
  },
  
  // TTL (30일 후 자동 삭제)
  expires_at: ISODate("2024-02-07T10:30:45Z")
};

// ========================================
// MongoDB 저장 함수 예시
// ========================================

class CoupangKeywordStorage {
  constructor(mongoClient) {
    this.db = mongoClient.db('coupang_analysis');
    this.collection = this.db.collection('coupang_keyword_tags');
  }

  /**
   * 크롤링된 키워드 데이터 저장
   */
  async saveKeywordTags(crawledData) {
    const document = {
      product_id: crawledData.product_id,
      crawl_session_id: `crawl-${Date.now()}`,
      
      // 크롤링된 데이터 그대로 저장
      keyword_categories: crawledData.keyword_categories,
      
      // 메타데이터 추가
      crawled_at: new Date(),
      source: "coupang",
      
      // 자동 계산된 통계
      stats: this.calculateStats(crawledData.keyword_categories),
      
      // 30일 후 자동 삭제
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    // MongoDB에 저장 (upsert: 같은 product_id면 업데이트)
    const result = await this.collection.replaceOne(
      { product_id: crawledData.product_id },
      document,
      { upsert: true }
    );

    console.log(`키워드 태그 저장 완료: ${crawledData.product_id}`);
    return result;
  }

  /**
   * 통계 자동 계산
   */
  calculateStats(keywordCategories) {
    let totalTags = 0;
    let highestPercentage = { category: '', tag: '', percentage: 0 };
    const colorDistribution = {};

    Object.entries(keywordCategories).forEach(([categoryName, tags]) => {
      totalTags += tags.length;
      
      tags.forEach(tag => {
        // 가장 높은 퍼센티지 찾기
        if (tag.percentage > highestPercentage.percentage) {
          highestPercentage = {
            category: categoryName,
            tag: tag.tag,
            percentage: tag.percentage
          };
        }
        
        // 색상 분포 계산
        colorDistribution[tag.color] = (colorDistribution[tag.color] || 0) + 1;
      });
    });

    return {
      total_categories: Object.keys(keywordCategories).length,
      total_tags: totalTags,
      category_with_most_tags: this.findCategoryWithMostTags(keywordCategories),
      highest_percentage: highestPercentage,
      color_distribution: colorDistribution
    };
  }

  /**
   * 가장 많은 태그를 가진 카테고리 찾기
   */
  findCategoryWithMostTags(keywordCategories) {
    let maxTags = 0;
    let topCategory = '';
    
    Object.entries(keywordCategories).forEach(([categoryName, tags]) => {
      if (tags.length > maxTags) {
        maxTags = tags.length;
        topCategory = categoryName;
      }
    });
    
    return topCategory;
  }

  /**
   * 상품별 키워드 태그 조회
   */
  async getKeywordTags(productId) {
    const result = await this.collection.findOne(
      { product_id: productId },
      { 
        projection: { 
          keyword_categories: 1, 
          stats: 1, 
          crawled_at: 1 
        } 
      }
    );
    
    return result;
  }

  /**
   * 카테고리별 키워드 태그 조회
   */
  async getKeywordsByCategory(productId, categoryName) {
    const result = await this.collection.findOne(
      { product_id: productId },
      { 
        projection: { 
          [`keyword_categories.${categoryName}`]: 1 
        } 
      }
    );
    
    return result?.keyword_categories?.[categoryName] || [];
  }
}

// ========================================
// 인덱스 설정
// ========================================

// 1. 기본 인덱스
db.coupang_keyword_tags.createIndex({ "product_id": 1 }, { unique: true });

// 2. 크롤링 시간 인덱스
db.coupang_keyword_tags.createIndex({ "crawled_at": -1 });

// 3. TTL 인덱스 (자동 삭제)
db.coupang_keyword_tags.createIndex({ "expires_at": 1 }, { expireAfterSeconds: 0 });

// 4. 복합 인덱스 (상품 + 크롤링 시간)
db.coupang_keyword_tags.createIndex({ "product_id": 1, "crawled_at": -1 });

// ========================================
// 사용 예시
// ========================================

// 크롤링된 데이터 저장
const crawledData = {
  product_id: "prod-123",
  keyword_categories: {
    "사용 목적": [
      { tag: "그래픽/전문가용", percentage: 16, width: 16, color: "green" },
      { tag: "학습용", percentage: 20, width: 20, color: "green" },
      { tag: "사무용", percentage: 48, width: 48, color: "green" },
      { tag: "기타 용도", percentage: 16, width: 16, color: "green" }
    ],
    "무게": [
      { tag: "가벼워요", percentage: 61, width: 61, color: "blue" },
      { tag: "적당해요", percentage: 30, width: 30, color: "blue" },
      { tag: "생각보다무거워요", percentage: 9, width: 9, color: "blue" }
    ]
  }
};

// 저장
const storage = new CoupangKeywordStorage(mongoClient);
await storage.saveKeywordTags(crawledData);

// 조회
const keywordTags = await storage.getKeywordTags("prod-123");
console.log(keywordTags.keyword_categories);

module.exports = CoupangKeywordStorage;