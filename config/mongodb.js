/**
 * MongoDB 연결 설정
 * 실시간 감정 분석 카드 및 캐시 데이터 저장용
 */

const { MongoClient } = require('mongodb');

// MongoDB 연결 설정
const mongoConfig = {
  url: process.env.MONGODB_URL || 'mongodb://localhost:27017/highpipe',
  dbName: process.env.MONGODB_DB_NAME || 'highpipe',
  options: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferMaxEntries: 0,
    bufferCommands: false
  }
};

let client = null;
let db = null;

/**
 * MongoDB 연결 초기화
 */
async function connectMongoDB() {
  try {
    if (!client) {
      console.log('🔗 MongoDB 연결 시도 중...');
      client = new MongoClient(mongoConfig.url, mongoConfig.options);
      await client.connect();
      db = client.db(mongoConfig.dbName);
      
      // 연결 테스트
      await db.admin().ping();
      console.log('✅ MongoDB 연결 성공');
      
      // 인덱스 생성
      await createIndexes();
    }
    return db;
  } catch (error) {
    console.warn('⚠️ MongoDB 연결 실패:', error.message);
    console.warn('📝 MongoDB 없이 서버를 실행합니다.');
    return null;
  }
}

/**
 * MongoDB 인덱스 생성
 */
async function createIndexes() {
  if (!db) return;

  try {
    console.log('📊 MongoDB 인덱스 생성 중...');

    // 실시간 감정 카드 컬렉션 인덱스
    await db.collection('realtimeSentimentCards').createIndexes([
      { key: { taskId: 1, cardIndex: 1 } },
      { key: { productId: 1, createdAt: -1 } },
      { key: { 'sentiment.type': 1 } },
      { key: { createdAt: 1 }, expireAfterSeconds: 86400 } // 24시간 TTL
    ]);

    // 실시간 분석 진행 상태 컬렉션 인덱스
    await db.collection('realtimeAnalysisProgress').createIndexes([
      { key: { taskId: 1 }, unique: true },
      { key: { userId: 1, createdAt: -1 } },
      { key: { status: 1 } },
      { key: { completedAt: 1 }, expireAfterSeconds: 3600 } // 1시간 TTL
    ]);

    // 리뷰 캐시 컬렉션 인덱스
    await db.collection('reviewCache').createIndexes([
      { key: { taskId: 1 } },
      { key: { productId: 1 } },
      { key: { expiresAt: 1 }, expireAfterSeconds: 0 } // TTL 인덱스
    ]);

    // 감정 분석 차트 캐시 인덱스
    await db.collection('sentimentChartCache').createIndexes([
      { key: { productId: 1, chartType: 1 } },
      { key: { expiresAt: 1 }, expireAfterSeconds: 0 } // TTL 인덱스
    ]);

    // 인기 검색어 캐시 인덱스
    await db.collection('popularSearchCache').createIndexes([
      { key: { keyword: 1 } },
      { key: { searchCount: -1 } },
      { key: { trending: 1, searchCount: -1 } },
      { key: { category: 1, searchCount: -1 } }
    ]);

    console.log('✅ MongoDB 인덱스 생성 완료');
  } catch (error) {
    console.error('❌ MongoDB 인덱스 생성 실패:', error);
  }
}

/**
 * 컬렉션 가져오기
 */
function getCollection(collectionName) {
  if (!db) {
    console.warn('⚠️ MongoDB가 연결되지 않았습니다.');
    return null;
  }
  return db.collection(collectionName);
}

/**
 * 실시간 감정 카드 저장
 */
async function saveRealtimeSentimentCard(cardData) {
  const collection = getCollection('realtimeSentimentCards');
  if (!collection) return null;

  try {
    const result = await collection.insertOne({
      ...cardData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result;
  } catch (error) {
    console.error('❌ 실시간 감정 카드 저장 실패:', error);
    return null;
  }
}

/**
 * 실시간 분석 진행 상태 업데이트
 */
async function updateAnalysisProgress(taskId, progressData) {
  const collection = getCollection('realtimeAnalysisProgress');
  if (!collection) return null;

  try {
    const result = await collection.updateOne(
      { taskId },
      {
        $set: {
          ...progressData,
          updatedAt: new Date()
        },
        $setOnInsert: {
          taskId,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    return result;
  } catch (error) {
    console.error('❌ 분석 진행 상태 업데이트 실패:', error);
    return null;
  }
}

/**
 * 리뷰 캐시 저장
 */
async function saveReviewCache(taskId, productId, reviews, ttlHours = 24) {
  const collection = getCollection('reviewCache');
  if (!collection) return null;

  try {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + ttlHours);

    const result = await collection.updateOne(
      { taskId },
      {
        $set: {
          productId,
          reviews,
          totalCount: reviews.length,
          crawledAt: new Date(),
          expiresAt,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    return result;
  } catch (error) {
    console.error('❌ 리뷰 캐시 저장 실패:', error);
    return null;
  }
}

/**
 * 차트 데이터 캐시 저장
 */
async function saveChartCache(productId, chartType, data, ttlMinutes = 60) {
  const collection = getCollection('sentimentChartCache');
  if (!collection) return null;

  try {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + ttlMinutes);

    const result = await collection.updateOne(
      { productId, chartType },
      {
        $set: {
          data,
          metadata: {
            totalReviews: data.totalReviews || 0,
            dateRange: data.dateRange || null,
            lastUpdated: new Date()
          },
          expiresAt,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    return result;
  } catch (error) {
    console.error('❌ 차트 캐시 저장 실패:', error);
    return null;
  }
}

/**
 * 인기 검색어 업데이트
 */
async function updatePopularSearch(keyword, category = null) {
  const collection = getCollection('popularSearchCache');
  if (!collection) return null;

  try {
    const result = await collection.updateOne(
      { keyword },
      {
        $inc: { searchCount: 1 },
        $set: {
          category,
          lastSearchedAt: new Date(),
          updatedAt: new Date()
        },
        $setOnInsert: {
          trending: false,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    return result;
  } catch (error) {
    console.error('❌ 인기 검색어 업데이트 실패:', error);
    return null;
  }
}

/**
 * 데이터 조회 헬퍼 함수들
 */
const queries = {
  // 실시간 감정 카드 조회
  async getRealtimeSentimentCards(taskId, limit = 50) {
    const collection = getCollection('realtimeSentimentCards');
    if (!collection) return [];

    return await collection
      .find({ taskId })
      .sort({ cardIndex: 1 })
      .limit(limit)
      .toArray();
  },

  // 분석 진행 상태 조회
  async getAnalysisProgress(taskId) {
    const collection = getCollection('realtimeAnalysisProgress');
    if (!collection) return null;

    return await collection.findOne({ taskId });
  },

  // 리뷰 캐시 조회
  async getReviewCache(taskId) {
    const collection = getCollection('reviewCache');
    if (!collection) return null;

    return await collection.findOne({ taskId });
  },

  // 차트 캐시 조회
  async getChartCache(productId, chartType) {
    const collection = getCollection('sentimentChartCache');
    if (!collection) return null;

    return await collection.findOne({ productId, chartType });
  },

  // 인기 검색어 조회
  async getPopularSearches(limit = 10) {
    const collection = getCollection('popularSearchCache');
    if (!collection) return [];

    return await collection
      .find({})
      .sort({ searchCount: -1 })
      .limit(limit)
      .toArray();
  }
};

/**
 * MongoDB 연결 종료
 */
async function closeMongoDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('🔌 MongoDB 연결 종료');
  }
}

// 프로세스 종료 시 연결 정리
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
  closeMongoDB
};