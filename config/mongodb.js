/**
 * MongoDB / Amazon DocumentDB 연결 설정
 * - TLS 필수
 * - CA 번들 지정 (rds-combined-ca-bundle.pem)
 * - authSource=admin, retryWrites=false
 * - (클래식 DocDB) replicaSet=rs0 권장 / (Elastic) 생략 가능
 */

const { MongoClient } = require('mongodb');
const path = require('path');

// ---- 환경변수 예시 ----
// MONGODB_URL=mongodb://USER:PASS@<endpoint>:27017/highpipe?authSource=admin&tls=true&retryWrites=false
//  (클래식 DocDB라면 위 URL 뒤에 &replicaSet=rs0&readPreference=secondaryPreferred 추가 권장)
// MONGODB_DB_NAME=highpipe
// MONGODB_CA_FILE=/etc/ssl/certs/rds-combined-ca-bundle.pem

const mongoConfig = {
  url:
    process.env.MONGODB_URL ||
    'mongodb://172.16.182.29:27017/highpipe',
  dbName: process.env.MONGODB_DB_NAME || 'highpipe',
  options: {
    maxPoolSize: Number(process.env.MONGODB_MAX_POOL || 10),
    serverSelectionTimeoutMS: 10_000,
    socketTimeoutMS: 45_000,

    // TLS (DocumentDB는 필수)
    tls: /[?&](tls|ssl)=true/i.test(process.env.MONGODB_URL || '')
      ? true
      : false,

    // CA 번들 경로(있으면 사용)
    // Node MongoDB 드라이버는 경로 문자열 옵션 `tlsCAFile`을 지원
    tlsCAFile: process.env.MONGODB_CA_FILE
      ? path.resolve(process.env.MONGODB_CA_FILE)
      : undefined,

    // 개발 편의를 위해 필요시만 사용 (운영에선 권장X)
    tlsAllowInvalidCertificates:
      process.env.MONGODB_TLS_ALLOW_INVALID_CERT === 'true' || false,

    // 드라이버 v4 기준: bufferMaxEntries 제거됨, bufferCommands는 mongoose 전용 옵션이라 무의미
  },
};

let client = null;
let db = null;

/**
 * MongoDB 연결 초기화
 */
async function connectMongoDB() {
  try {
    if (!client) {
      console.log('🔗 MongoDB(DocumentDB) 연결 시도 중...');
      client = new MongoClient(mongoConfig.url, mongoConfig.options);
      await client.connect();
      db = client.db(mongoConfig.dbName);

      // 연결 테스트
      await db.command({ ping: 1 });
      console.log('✅ MongoDB(DocumentDB) 연결 성공');

      // 인덱스 생성
      await createIndexes();
    }
    return db;
  } catch (error) {
    console.warn('⚠️ MongoDB(DocumentDB) 연결 실패:', error.message);
    console.warn('📝 MongoDB 없이 서버를 실행합니다.');
    return null;
  }
}

/**
 * MongoDB 인덱스 생성
 * ⚠️ TTL 인덱스는 단일 필드로만 만들어야 함 (DocumentDB 호환 OK)
 */
async function createIndexes() {
  if (!db) return;

  try {
    console.log('📊 MongoDB 인덱스 생성 중...');

    // 실시간 감정 카드 컬렉션
    await db.collection('realtimeSentimentCards').createIndexes([
      { key: { taskId: 1, cardIndex: 1 } },
      { key: { productId: 1, createdAt: -1 } },
      { key: { 'sentiment.type': 1 } },
      { key: { createdAt: 1 }, expireAfterSeconds: 86400 }, // 24h TTL
    ]);

    // 실시간 분석 진행 상태
    await db.collection('realtimeAnalysisProgress').createIndexes([
      { key: { taskId: 1 }, unique: true },
      { key: { userId: 1, createdAt: -1 } },
      { key: { status: 1 } },
      { key: { completedAt: 1 }, expireAfterSeconds: 3600 }, // 1h TTL
    ]);

    // 리뷰 캐시
    await db.collection('reviewCache').createIndexes([
      { key: { taskId: 1 } },
      { key: { productId: 1 } },
      { key: { expiresAt: 1 }, expireAfterSeconds: 0 }, // TTL by expiration field
    ]);

    // 감정 분석 차트 캐시
    await db.collection('sentimentChartCache').createIndexes([
      { key: { productId: 1, chartType: 1 } },
      { key: { expiresAt: 1 }, expireAfterSeconds: 0 },
    ]);

    // 인기 검색어 캐시
    await db.collection('popularSearchCache').createIndexes([
      { key: { keyword: 1 } },
      { key: { searchCount: -1 } },
      { key: { trending: 1, searchCount: -1 } },
      { key: { category: 1, searchCount: -1 } },
    ]);

    console.log('✅ MongoDB 인덱스 생성 완료');
  } catch (error) {
    console.error('❌ MongoDB 인덱스 생성 실패:', error);
  }
}

/** 컬렉션 핸들러 */
function getCollection(collectionName) {
  if (!db) {
    console.warn('⚠️ MongoDB가 연결되지 않았습니다.');
    return null;
  }
  return db.collection(collectionName);
}

/** 실시간 감정 카드 저장 */
async function saveRealtimeSentimentCard(cardData) {
  const collection = getCollection('realtimeSentimentCards');
  if (!collection) return null;

  try {
    const now = new Date();
    const result = await collection.insertOne({
      ...cardData,
      createdAt: now,
      updatedAt: now,
    });
    return result;
  } catch (error) {
    console.error('❌ 실시간 감정 카드 저장 실패:', error);
    return null;
  }
}

/** 실시간 분석 진행 상태 업데이트 (upsert) */
async function updateAnalysisProgress(taskId, progressData) {
  const collection = getCollection('realtimeAnalysisProgress');
  if (!collection) return null;

  try {
    const result = await collection.updateOne(
      { taskId },
      {
        $set: { ...progressData, updatedAt: new Date() },
        $setOnInsert: { taskId, createdAt: new Date() },
      },
      { upsert: true }
    );
    return result;
  } catch (error) {
    console.error('❌ 분석 진행 상태 업데이트 실패:', error);
    return null;
  }
}

/** 리뷰 캐시 저장 (TTL 필드: expiresAt) */
async function saveReviewCache(taskId, productId, reviews, ttlHours = 24) {
  const collection = getCollection('reviewCache');
  if (!collection) return null;

  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlHours * 3600 * 1000);

    const result = await collection.updateOne(
      { taskId },
      {
        $set: {
          productId,
          reviews,
          totalCount: reviews.length,
          crawledAt: now,
          expiresAt,
          createdAt: now,
        },
      },
      { upsert: true }
    );
    return result;
  } catch (error) {
    console.error('❌ 리뷰 캐시 저장 실패:', error);
    return null;
  }
}

/** 차트 데이터 캐시 저장 (TTL 필드: expiresAt) */
async function saveChartCache(productId, chartType, data, ttlMinutes = 60) {
  const collection = getCollection('sentimentChartCache');
  if (!collection) return null;

  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000);

    const result = await collection.updateOne(
      { productId, chartType },
      {
        $set: {
          data,
          metadata: {
            totalReviews: data?.totalReviews || 0,
            dateRange: data?.dateRange || null,
            lastUpdated: now,
          },
          expiresAt,
          createdAt: now,
        },
      },
      { upsert: true }
    );
    return result;
  } catch (error) {
    console.error('❌ 차트 캐시 저장 실패:', error);
    return null;
  }
}

/** 인기 검색어 업데이트 */
async function updatePopularSearch(keyword, category = null) {
  const collection = getCollection('popularSearchCache');
  if (!collection) return null;

  try {
    const result = await collection.updateOne(
      { keyword },
      {
        $inc: { searchCount: 1 },
        $set: { category, lastSearchedAt: new Date(), updatedAt: new Date() },
        $setOnInsert: { trending: false, createdAt: new Date() },
      },
      { upsert: true }
    );
    return result;
  } catch (error) {
    console.error('❌ 인기 검색어 업데이트 실패:', error);
    return null;
  }
}

/** 조회 헬퍼 */
const queries = {
  async getRealtimeSentimentCards(taskId, limit = 50) {
    const c = getCollection('realtimeSentimentCards');
    if (!c) return [];
    return c.find({ taskId }).sort({ cardIndex: 1 }).limit(limit).toArray();
  },

  async getAnalysisProgress(taskId) {
    const c = getCollection('realtimeAnalysisProgress');
    if (!c) return null;
    return c.findOne({ taskId });
  },

  async getReviewCache(taskId) {
    const c = getCollection('reviewCache');
    if (!c) return null;
    return c.findOne({ taskId });
  },

  async getChartCache(productId, chartType) {
    const c = getCollection('sentimentChartCache');
    if (!c) return null;
    return c.findOne({ productId, chartType });
  },

  async getPopularSearches(limit = 10) {
    const c = getCollection('popularSearchCache');
    if (!c) return [];
    return c.find({}).sort({ searchCount: -1 }).limit(limit).toArray();
  },
};

/** 종료 처리 */
async function closeMongoDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('🔌 MongoDB 연결 종료');
  }
}
process.on('SIGINT', closeMongoDB);
process.on('SIGTERM', closeMongoDB);

module.exports = {
  connectMongoDB,
  getCollection,
  saveRealtimeSentimentCard,
  updateAnalysisProgress,
  saveReviewCache,
  saveChartCache,
  updatePopularSearch,
  queries,
  closeMongoDB,
};
