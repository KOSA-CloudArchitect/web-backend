// ========================================
// MongoDB Collections - 실시간 분석 데이터 (최종 업데이트 버전)
// 용도: 유연한 스키마, 대용량 데이터, 실시간 업데이트
// ========================================

// 1. 키워드 컬렉션 (새로 추가)
// Collection: keywords
{
  _id: ObjectId("..."),
  keyword: "배송", // 키워드 텍스트
  tag: "delivery", // 태그 분류
  category: "service", // 카테고리
  frequency: 1250, // 전체 언급 빈도
  sentiment_ratio: {
    positive: 0.7,
    negative: 0.2,
    neutral: 0.1
  },
  created_at: ISODate("2024-01-01T00:00:00Z"),
  updated_at: ISODate("2024-01-01T00:00:00Z")
}

// 2. 상품 리뷰 원본 데이터 (업데이트)
// Collection: product_reviews_raw
{
  _id: ObjectId("..."),
  id: "review-12345", // 리뷰 고유 ID
  product_id: "prod-67890", // PostgreSQL products 테이블과 연결
  review_date: ISODate("2024-01-01T09:00:00Z"),
  review_raw: "배송이 정말 빨라요! 포장도 깔끔하고 상품 상태도 완벽합니다.",
  review_summary: "배송 빠름, 포장 좋음, 상품 상태 완벽",
  sentiment: "positive", // positive, negative, neutral
  review_rating: 5.0,
  keywords: ["배송", "빠름", "포장", "완벽"], // JSON 배열
  created_at: ISODate("2024-01-01T10:30:00Z")
}

// 3. 일별 상품 분석 데이터 (업데이트)
// Collection: product_analysis_daily
{
  _id: ObjectId("..."),
  id: "daily-analysis-12345",
  product_id: "prod-67890",
  rating: {
    average: 4.5,
    distribution: {
      "5": 45,
      "4": 30,
      "3": 15,
      "2": 7,
      "1": 3
    },
    total_count: 100
  },
  sentiment: {
    positive: 65,
    negative: 20,
    neutral: 15,
    total_analyzed: 100
  },
  price: {
    current_price: 129000,
    lowest_price: 125000,
    highest_price: 135000,
    price_changes: [
      { time: "09:00", price: 129000 },
      { time: "15:00", price: 125000 },
      { time: "18:00", price: 129000 }
    ]
  },
  ts_day: ISODate("2024-01-01T00:00:00Z"),
  updated_at: ISODate("2024-01-01T23:59:59Z")
}

// 4. 월별 상품 분석 데이터 (업데이트)
// Collection: product_analysis_monthly
{
  _id: ObjectId("..."),
  id: "monthly-analysis-12345",
  product_id: "prod-67890",
  rating: {
    average: 4.3,
    trend: "increasing", // increasing, decreasing, stable
    monthly_distribution: {
      "5": 450,
      "4": 300,
      "3": 150,
      "2": 70,
      "1": 30
    },
    total_count: 1000
  },
  sentiment: {
    positive: 620,
    negative: 230,
    neutral: 150,
    total_analyzed: 1000,
    trend: "positive" // positive, negative, stable
  },
  price: {
    current_price: 129000,
    lowest_price: 119000,
    highest_price: 139000,
    average_price: 127500,
    price_volatility: 0.15, // 가격 변동성
    discount_frequency: 8 // 할인 횟수
  },
  ts_month: ISODate("2024-01-01T00:00:00Z"),
  updated_at: ISODate("2024-01-31T23:59:59Z")
}

// 1. 실시간 분석 세션
// Collection: realtime_analysis_sessions
{
  _id: ObjectId("..."),
    task_id: "task-12345",
      product_id: "prod-67890",
        status: "processing", // processing, completed, failed

          // 실시간 감정 카드 배열
          emotion_cards: [
            {
              id: "card-001",
              sentiment: "positive", // positive, negative, neutral
              content: "배송이 정말 빨라요! 만족합니다.",
              keywords: ["배송", "빠름", "만족"],
              confidence: 0.95,
              review_source: "coupang",
              timestamp: ISODate("2024-01-01T10:30:00Z")
            },
            {
              id: "card-002",
              sentiment: "negative",
              content: "가격이 너무 비싸네요. 다른 곳이 더 저렴해요.",
              keywords: ["가격", "비쌈", "비교"],
              confidence: 0.87,
              review_source: "coupang",
              timestamp: ISODate("2024-01-01T10:31:00Z")
            }
          ],

            // 실시간 통계
            current_stats: {
    positive: 45,
      negative: 12,
        neutral: 8,
          total_processed: 65,
            progress_percentage: 32.5,
              estimated_total: 200
  },

  // 쿠팡 크롤링 키워드 태그 (구조화된 데이터)
  coupang_keyword_tags: {
    // 사용 목적 카테고리
    usage_purpose: [
      { tag: "그래픽/성능가속", count: 16, percentage: 16 },
      { tag: "학습용", count: 20, percentage: 20 },
      { tag: "사무용", count: 48, percentage: 48 },
      { tag: "기타 용도", count: 16, percentage: 16 }
    ],
      // 무게 관련
      weight: [
        { tag: "가벼워요", count: 61, percentage: 61 },
        { tag: "적당해요", count: 30, percentage: 30 },
        { tag: "생각보다무거워요", count: 9, percentage: 9 }
      ],
        // 성능 관련
        performance: [
          { tag: "기대이상이에요", count: 82, percentage: 82 },
          { tag: "보통이에요", count: 16, percentage: 16 },
          { tag: "기대에못미쳐요", count: 2, percentage: 2 }
        ],
          // 배송 관련
          delivery: [
            { tag: "빨라요", count: 45, percentage: 45 },
            { tag: "보통이에요", count: 35, percentage: 35 },
            { tag: "늦어요", count: 20, percentage: 20 }
          ],
            // 가격 관련
            price: [
              { tag: "저렴해요", count: 25, percentage: 25 },
              { tag: "적당해요", count: 50, percentage: 50 },
              { tag: "비싸요", count: 25, percentage: 25 }
            ]
  },

  // 메타데이터
  started_at: ISODate("2024-01-01T10:00:00Z"),
    last_updated_at: ISODate("2024-01-01T10:31:00Z"),
      expires_at: ISODate("2024-01-01T12:00:00Z"), // 2시간 후 만료

        // 설정
        settings: {
    max_cards: 100,
      update_interval: 5000, // 5초
        auto_summary: true
  }
}

// 인덱스
db.realtime_analysis_sessions.createIndex({ "task_id": 1 }, { unique: true })
db.realtime_analysis_sessions.createIndex({ "product_id": 1 })
db.realtime_analysis_sessions.createIndex({ "status": 1 })
db.realtime_analysis_sessions.createIndex({ "expires_at": 1 }, { expireAfterSeconds: 0 }) // TTL 인덱스

// ========================================

// 2. 리뷰 원본 데이터 (크롤링된 데이터)
// Collection: raw_reviews
{
  _id: ObjectId("..."),
    product_id: "prod-67890",
      review_id: "review-12345",

        // 리뷰 내용
        content: "배송이 정말 빨라요! 포장도 깔끔하고 상품 상태도 완벽합니다.",
          rating: 5,
            author: "구매자123",

              // 메타데이터
              source: "coupang",
                crawled_at: ISODate("2024-01-01T10:30:00Z"),
                  review_date: ISODate("2024-01-01T09:00:00Z"),

                    // 분석 상태
                    analysis_status: "pending", // pending, processing, completed
                      processed_at: null,

                        // 분석 결과 (분석 완료 후 업데이트)
                        analysis_result: {
    sentiment: "positive",
      confidence: 0.95,
        keywords: ["배송", "빠름", "포장", "완벽"],
          emotions: ["만족", "기쁨"]
  }
}

// 인덱스
db.raw_reviews.createIndex({ "product_id": 1, "crawled_at": -1 })
db.raw_reviews.createIndex({ "analysis_status": 1 })
db.raw_reviews.createIndex({ "review_id": 1 }, { unique: true })

// ========================================

// 3. 분석 작업 큐
// Collection: analysis_queue
{
  _id: ObjectId("..."),
    task_id: "task-12345",
      task_type: "realtime_analysis", // realtime_analysis, batch_analysis

        // 작업 정보
        product_id: "prod-67890",
          user_id: "user-123", // null이면 익명
            priority: 5, // 1(높음) ~ 10(낮음)

              // 상태
              status: "queued", // queued, processing, completed, failed
                assigned_worker: null,

                  // 설정
                  config: {
    max_reviews: 1000,
      analysis_depth: "standard", // basic, standard, deep
        include_summary: true,
          real_time_updates: true
  },

  // 진행 상황
  progress: {
    total_steps: 5,
      current_step: 2,
        step_name: "sentiment_analysis",
          percentage: 40
  },

  // 타임스탬프
  created_at: ISODate("2024-01-01T10:00:00Z"),
    started_at: ISODate("2024-01-01T10:01:00Z"),
      completed_at: null,

        // 결과 (완료 후)
        result: {
    total_reviews_processed: 150,
      processing_time_seconds: 45,
        error_message: null
  }
}

// 인덱스
db.analysis_queue.createIndex({ "status": 1, "priority": 1, "created_at": 1 })
db.analysis_queue.createIndex({ "task_id": 1 }, { unique: true })
db.analysis_queue.createIndex({ "product_id": 1 })

// ========================================

// 4. 키워드 분석 상세 데이터
// Collection: keyword_analysis
{
  _id: ObjectId("..."),
    product_id: "prod-67890",
      analysis_date: ISODate("2024-01-01T00:00:00Z"),

        // 키워드별 상세 분석
        keywords: [
          {
            keyword: "배송",
            total_mentions: 45,
            sentiment_breakdown: {
              positive: 35,
              negative: 5,
              neutral: 5
            },
            context_examples: [
              "배송이 정말 빨라요",
              "배송 포장이 깔끔해요",
              "배송이 좀 늦었어요"
            ],
            trend_score: 8.5, // 1-10
            importance_score: 9.2
          }
        ],

          // 감정 변화 추이 (시간별)
          sentiment_timeline: [
            {
              hour: 0,
              positive: 12,
              negative: 3,
              neutral: 2
            },
            {
              hour: 1,
              positive: 15,
              negative: 2,
              neutral: 3
            }
          ],

            // 메타데이터
            total_reviews_analyzed: 150,
              analysis_version: "v2.1",
                created_at: ISODate("2024-01-01T10:30:00Z")
}

// 인덱스
db.keyword_analysis.createIndex({ "product_id": 1, "analysis_date": -1 })
db.keyword_analysis.createIndex({ "keywords.keyword": 1 })

// ========================================

// MongoDB 컬렉션 설정
// 1. Capped Collection (로그용)
db.createCollection("analysis_logs", {
  capped: true,
  size: 100000000, // 100MB
  max: 1000000     // 최대 100만 문서
})

// 2. TTL 설정 (자동 삭제)
db.realtime_analysis_sessions.createIndex(
  { "expires_at": 1 },
  { expireAfterSeconds: 0 }
)

// 3. 샤딩 키 설정 (대용량 처리용)
sh.shardCollection("mydb.raw_reviews", { "product_id": 1, "crawled_at": 1 })
sh.shardCollection("mydb.realtime_analysis_sessions", { "product_id": 1 })
// =
=======================================
// 5. 쿠팡 키워드 태그 전용 컬렉션
// Collection: coupang_keyword_tags
{
  _id: ObjectId("..."),
  product_id: "prod-67890",
  crawl_session_id: "crawl-12345",

  // 크롤링된 키워드 태그 카테고리별 데이터
  keyword_categories: {
    // 사용 목적
    "사용 목적": [
      { tag: "그래픽/성능가속", count: 16, percentage: 16, color: "green" },
      { tag: "학습용", count: 20, percentage: 20, color: "green" },
      { tag: "사무용", count: 48, percentage: 48, color: "green" },
      { tag: "기타 용도", count: 16, percentage: 16, color: "green" }
    ],

    // 무게
    "무게": [
      { tag: "가벼워요", count: 61, percentage: 61, color: "blue" },
      { tag: "적당해요", count: 30, percentage: 30, color: "blue" },
      { tag: "생각보다무거워요", count: 9, percentage: 9, color: "blue" }
    ],

    // 성능
    "성능": [
      { tag: "기대이상이에요", count: 82, percentage: 82, color: "gray" },
      { tag: "보통이에요", count: 16, percentage: 16, color: "gray" },
      { tag: "기대에못미쳐요", count: 2, percentage: 2, color: "gray" }
    ],

    // 배송
    "배송": [
      { tag: "빨라요", count: 45, percentage: 45, color: "purple" },
      { tag: "보통이에요", count: 35, percentage: 35, color: "purple" },
      { tag: "늦어요", count: 20, percentage: 20, color: "purple" }
    ],

    // 디자인
    "디자인": [
      { tag: "예뻐요", count: 55, percentage: 55, color: "pink" },
      { tag: "보통이에요", count: 30, percentage: 30, color: "pink" },
      { tag: "별로에요", count: 15, percentage: 15, color: "pink" }
    ],

    // 가격
    "가격": [
      { tag: "저렴해요", count: 25, percentage: 25, color: "orange" },
      { tag: "적당해요", count: 50, percentage: 50, color: "orange" },
      { tag: "비싸요", count: 25, percentage: 25, color: "orange" }
    ]
  },

  // 메타데이터
  total_reviews_with_tags: 150,
  crawled_at: ISODate("2024-01-01T10:30:00Z"),
  source: "coupang",

  // 통계
  stats: {
    total_categories: 6,
    total_unique_tags: 18,
    most_mentioned_category: "성능",
    least_mentioned_category: "가격"
  }
}

// 인덱스
db.coupang_keyword_tags.createIndex({ "product_id": 1, "crawled_at": -1 })
db.coupang_keyword_tags.createIndex({ "crawl_session_id": 1 })

// ========================================
// 6. 키워드 태그 실시간 업데이트 컬렉션
// Collection: realtime_keyword_updates
{
  _id: ObjectId("..."),
  product_id: "prod-67890",
  task_id: "task-12345",

  // 실시간으로 업데이트되는 키워드 태그
  live_keyword_stats: {
    "사용 목적": {
      "그래픽/성능가속": { count: 16, percentage: 16, trend: "up" },
      "학습용": { count: 20, percentage: 20, trend: "stable" },
      "사무용": { count: 48, percentage: 48, trend: "down" },
      "기타 용도": { count: 16, percentage: 16, trend: "up" }
    },
    "무게": {
      "가벼워요": { count: 61, percentage: 61, trend: "up" },
      "적당해요": { count: 30, percentage: 30, trend: "stable" },
      "생각보다무거워요": { count: 9, percentage: 9, trend: "down" }
    }
  },

  // 업데이트 히스토리
  update_history: [
    {
      timestamp: ISODate("2024-01-01T10:30:00Z"),
      category: "성능",
      tag: "기대이상이에요",
      old_count: 81,
      new_count: 82,
      change: +1
    }
  ],

  last_updated: ISODate("2024-01-01T10:31:00Z"),
  expires_at: ISODate("2024-01-01T12:31:00Z") // 2시간 TTL
}

// TTL 인덱스
db.realtime_keyword_updates.createIndex({ "expires_at": 1 }, { expireAfterSeconds: 0 })