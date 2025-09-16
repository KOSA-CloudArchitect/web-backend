/**
 * MongoDB 스키마 정의
 * 실시간 감정 분석 결과를 카드 형태로 빠르게 제공하기 위한 NoSQL 스키마
 */

// 실시간 감정 분석 카드 컬렉션
const realtimeSentimentCardSchema = {
  _id: "ObjectId", // MongoDB 기본 ID
  taskId: "String", // 분석 작업 ID (PostgreSQL과 연동)
  productId: "String", // 상품 ID
  cardIndex: "Number", // 카드 순서 (0부터 시작)
  reviewText: "String", // 리뷰 원문 (일부)
  sentiment: {
    type: "String", // 'positive', 'negative', 'neutral'
    confidence: "Number" // 0.0 ~ 1.0
  },
  keywords: ["String"], // 추출된 키워드 배열
  rating: "Number", // 별점 (1-5)
  reviewDate: "Date", // 리뷰 작성일
  cardColor: "String", // UI 카드 색상 ('green', 'red', 'gray')
  processingTime: "Number", // 처리 시간 (ms)
  createdAt: "Date",
  updatedAt: "Date"
};

// 실시간 분석 진행 상태 컬렉션
const realtimeAnalysisProgressSchema = {
  _id: "ObjectId",
  taskId: "String", // 분석 작업 ID (unique)
  productId: "String",
  userId: "String", // 요청한 사용자 ID (nullable)
  status: "String", // 'started', 'crawling', 'processing', 'analyzing', 'completed', 'failed'
  progress: {
    current: "Number", // 현재 진행률 (0-100)
    total: "Number", // 전체 작업량
    stage: "String", // 현재 단계 ('데이터 수집', '텍스트 전처리', '감성 분석')
    message: "String" // 진행 상태 메시지
  },
  estimatedTimeRemaining: "Number", // 예상 남은 시간 (초)
  startedAt: "Date",
  completedAt: "Date",
  errorMessage: "String",
  createdAt: "Date",
  updatedAt: "Date"
};

// 리뷰 원본 데이터 캐시 컬렉션 (임시 저장)
const reviewCacheSchema = {
  _id: "ObjectId",
  taskId: "String",
  productId: "String",
  reviews: [{
    reviewId: "String", // 쿠팡 리뷰 ID
    text: "String", // 리뷰 텍스트
    rating: "Number", // 별점
    date: "Date", // 작성일
    author: "String", // 작성자 (익명화)
    helpful: "Number", // 도움이 됨 수
    verified: "Boolean" // 구매 확인 여부
  }],
  totalCount: "Number", // 전체 리뷰 수
  crawledAt: "Date", // 크롤링 완료 시간
  expiresAt: "Date", // TTL (24시간 후 자동 삭제)
  createdAt: "Date"
};

// 감정 분석 차트 데이터 캐시
const sentimentChartCacheSchema = {
  _id: "ObjectId",
  productId: "String",
  chartType: "String", // 'sentiment_pie', 'rating_distribution', 'time_trend'
  data: "Mixed", // 차트 데이터 (유연한 구조)
  metadata: {
    totalReviews: "Number",
    dateRange: {
      start: "Date",
      end: "Date"
    },
    lastUpdated: "Date"
  },
  expiresAt: "Date", // TTL (1시간 후 자동 삭제)
  createdAt: "Date"
};

// 인기 검색어 캐시
const popularSearchCacheSchema = {
  _id: "ObjectId",
  keyword: "String",
  searchCount: "Number", // 검색 횟수
  category: "String", // 카테고리별 분류
  trending: "Boolean", // 급상승 키워드 여부
  lastSearchedAt: "Date",
  createdAt: "Date",
  updatedAt: "Date"
};

// MongoDB 인덱스 정의
const mongoIndexes = {
  realtimeSentimentCards: [
    { taskId: 1, cardIndex: 1 }, // 작업별 카드 순서 조회
    { productId: 1, createdAt: -1 }, // 상품별 최신 카드 조회
    { sentiment: 1 }, // 감정별 필터링
    { createdAt: 1 }, // TTL 인덱스 (필요시)
  ],
  
  realtimeAnalysisProgress: [
    { taskId: 1 }, // 작업 ID로 진행 상태 조회 (unique)
    { userId: 1, createdAt: -1 }, // 사용자별 분석 이력
    { status: 1 }, // 상태별 필터링
    { completedAt: 1 } // TTL 인덱스 (완료된 작업 자동 삭제)
  ],
  
  reviewCache: [
    { taskId: 1 }, // 작업별 리뷰 캐시 조회
    { productId: 1 }, // 상품별 리뷰 캐시
    { expiresAt: 1 } // TTL 인덱스 (자동 삭제)
  ],
  
  sentimentChartCache: [
    { productId: 1, chartType: 1 }, // 상품별 차트 타입 조회
    { expiresAt: 1 } // TTL 인덱스 (자동 삭제)
  ],
  
  popularSearchCache: [
    { keyword: 1 }, // 키워드별 조회
    { searchCount: -1 }, // 인기순 정렬
    { trending: 1, searchCount: -1 }, // 급상승 키워드
    { category: 1, searchCount: -1 } // 카테고리별 인기 키워드
  ]
};

// MongoDB 연결 설정 예시
const mongoConfig = {
  url: process.env.MONGODB_URL || 'mongodb://localhost:27017/highpipe',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10, // 연결 풀 크기
    serverSelectionTimeoutMS: 5000, // 서버 선택 타임아웃
    socketTimeoutMS: 45000, // 소켓 타임아웃
    bufferMaxEntries: 0, // 버퍼 비활성화
    bufferCommands: false // 명령 버퍼링 비활성화
  }
};

module.exports = {
  schemas: {
    realtimeSentimentCardSchema,
    realtimeAnalysisProgressSchema,
    reviewCacheSchema,
    sentimentChartCacheSchema,
    popularSearchCacheSchema
  },
  indexes: mongoIndexes,
  config: mongoConfig
};