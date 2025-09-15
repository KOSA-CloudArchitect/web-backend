const mongoose = require('mongoose');

/**
 * MongoDB RealtimeEmotionCard 스키마
 * Spark에서 실시간으로 생성되는 감정 카드 저장
 */
const realtimeEmotionCardSchema = new mongoose.Schema({
  // 기본 식별자
  productId: {
    type: String,
    required: true,
    index: true,
  },
  taskId: {
    type: String,
    required: true,
    index: true,
  },
  cardId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  
  // 감정 분석 정보
  sentiment: {
    type: String,
    required: true,
    enum: ['pos', 'neg', 'neu'],
    index: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  
  // 카드 내용
  summary: {
    type: String,
    required: true,
    maxLength: 500,
  },
  
  // 키워드 정보
  keywords: [{
    key: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
      min: 1,
    },
    _id: false,
  }],
  
  // 참조 정보
  refs: {
    reviewId: String,
    index: Number,
    batchIndex: Number,
  },
  
  // 메타데이터
  metadata: {
    processedAt: {
      type: Date,
      default: Date.now,
    },
    sparkJobId: String,
    version: {
      type: String,
      default: '1.0.0',
    },
    processingTimeMs: Number,
  },
  
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
  collection: 'realtime_emotion_cards',
});

// 인덱스 설정
realtimeEmotionCardSchema.index({ productId: 1, createdAt: -1 });
realtimeEmotionCardSchema.index({ taskId: 1, createdAt: 1 });
realtimeEmotionCardSchema.index({ createdAt: -1 }); // 최신 순 정렬용
realtimeEmotionCardSchema.index({ productId: 1, sentiment: 1, createdAt: -1 });

/**
 * RealtimeEmotionCard 모델 클래스
 */
class RealtimeEmotionCard {
  constructor() {
    this.model = mongoose.model('RealtimeEmotionCard', realtimeEmotionCardSchema);
  }

  /**
   * 감정 카드 생성 (Spark에서 호출)
   * @param {Object} data - 감정 카드 데이터
   * @returns {Promise<Object>} 저장된 감정 카드
   */
  async create(data) {
    try {
      console.log(`💾 Saving emotion card to MongoDB: ${data.cardId}`);
      
      const emotionCard = new this.model({
        productId: data.productId,
        taskId: data.taskId,
        cardId: data.cardId,
        sentiment: data.sentiment,
        score: data.score,
        summary: data.summary,
        keywords: data.keywords || [],
        refs: data.refs || {},
        metadata: {
          processedAt: data.processedAt ? new Date(data.processedAt) : new Date(),
          sparkJobId: data.sparkJobId,
          version: data.version || '1.0.0',
          processingTimeMs: data.processingTimeMs,
        },
      });

      const savedCard = await emotionCard.save();
      console.log(`✅ Emotion card saved to MongoDB: ${savedCard._id}`);
      
      return savedCard;
      
    } catch (error) {
      console.error('❌ Failed to save emotion card to MongoDB:', error);
      throw error;
    }
  }

  /**
   * 상품의 실시간 감정 카드 목록 조회 (최신순, 페이징)
   * @param {string} productId - 상품 ID
   * @param {Object} options - 조회 옵션
   * @returns {Promise<Object>} 감정 카드 목록과 페이징 정보
   */
  async findByProductId(productId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        sentiment = null, // 'pos', 'neg', 'neu' 또는 null (전체)
        since = null, // Date 객체 또는 null
      } = options;

      const query = { productId };
      
      if (sentiment) {
        query.sentiment = sentiment;
      }
      
      if (since) {
        query.createdAt = { $gte: new Date(since) };
      }

      const skip = (page - 1) * limit;
      
      const [cards, total] = await Promise.all([
        this.model
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.model.countDocuments(query)
      ]);
      
      return {
        cards,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error(`❌ Failed to find emotion cards by productId ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Task ID로 실시간 감정 카드 목록 조회
   * @param {string} taskId - 작업 ID
   * @param {Object} options - 조회 옵션
   * @returns {Promise<Object>} 감정 카드 목록
   */
  async findByTaskId(taskId, options = {}) {
    try {
      const {
        limit = 50,
        sentiment = null,
        since = null,
      } = options;

      const query = { taskId };
      
      if (sentiment) {
        query.sentiment = sentiment;
      }
      
      if (since) {
        query.createdAt = { $gte: new Date(since) };
      }

      const cards = await this.model
        .find(query)
        .sort({ createdAt: 1 }) // 시간순 정렬 (오래된 것부터)
        .limit(limit)
        .lean();
      
      return cards;
    } catch (error) {
      console.error(`❌ Failed to find emotion cards by taskId ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * 상품의 최신 감정 카드들 조회 (실시간 폴링용)
   * @param {string} productId - 상품 ID
   * @param {Date} since - 이 시간 이후의 카드들만 조회
   * @param {number} limit - 최대 조회 개수
   * @returns {Promise<Array>} 감정 카드 목록
   */
  async findNewCardsSince(productId, since, limit = 10) {
    try {
      const query = { 
        productId,
        createdAt: { $gt: new Date(since) }
      };

      const newCards = await this.model
        .find(query)
        .sort({ createdAt: 1 }) // 시간순 정렬
        .limit(limit)
        .lean();
      
      return newCards;
    } catch (error) {
      console.error(`❌ Failed to find new emotion cards since ${since}:`, error);
      throw error;
    }
  }

  /**
   * 감정별 카드 통계 조회
   * @param {string} productId - 상품 ID
   * @param {string} taskId - 작업 ID (선택적)
   * @returns {Promise<Object>} 감정별 통계
   */
  async getSentimentStats(productId, taskId = null) {
    try {
      const matchStage = { productId };
      if (taskId) {
        matchStage.taskId = taskId;
      }

      const stats = await this.model.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$sentiment',
            count: { $sum: 1 },
            avgScore: { $avg: '$score' },
            maxScore: { $max: '$score' },
            minScore: { $min: '$score' },
          }
        }
      ]);

      // 결과를 더 사용하기 쉬운 형태로 변환
      const result = {
        pos: { count: 0, avgScore: 0, maxScore: 0, minScore: 1 },
        neg: { count: 0, avgScore: 0, maxScore: 0, minScore: 1 },
        neu: { count: 0, avgScore: 0, maxScore: 0, minScore: 1 },
        total: 0,
      };

      stats.forEach(stat => {
        result[stat._id] = {
          count: stat.count,
          avgScore: stat.avgScore,
          maxScore: stat.maxScore,
          minScore: stat.minScore,
        };
        result.total += stat.count;
      });

      // 백분율 계산
      if (result.total > 0) {
        result.percentages = {
          pos: Math.round((result.pos.count / result.total) * 100),
          neg: Math.round((result.neg.count / result.total) * 100),
          neu: Math.round((result.neu.count / result.total) * 100),
        };
      } else {
        result.percentages = { pos: 0, neg: 0, neu: 0 };
      }

      return result;
    } catch (error) {
      console.error(`❌ Failed to get sentiment stats for product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * 상품의 실시간 분석 진행 상황 조회
   * @param {string} productId - 상품 ID
   * @returns {Promise<Object>} 분석 진행 상황
   */
  async getAnalysisProgress(productId) {
    try {
      const [totalCards, recentCards, sentimentStats] = await Promise.all([
        this.model.countDocuments({ productId }),
        this.model.countDocuments({ 
          productId, 
          createdAt: { $gte: new Date(Date.now() - 60000) } // 최근 1분
        }),
        this.getSentimentStats(productId)
      ]);

      const latestCard = await this.model
        .findOne({ productId })
        .sort({ createdAt: -1 })
        .lean();

      return {
        totalCards,
        recentCards,
        sentimentStats,
        latestCard,
        lastUpdated: latestCard ? latestCard.createdAt : null,
        isActive: recentCards > 0,
      };
    } catch (error) {
      console.error(`❌ Failed to get analysis progress for product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * 오래된 감정 카드 정리
   * @param {number} hoursOld - 삭제할 데이터의 기준 시간(시간)
   * @returns {Promise<number>} 삭제된 개수
   */
  async cleanup(hoursOld = 24) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setHours(cutoffDate.getHours() - hoursOld);
      
      const result = await this.model.deleteMany({
        createdAt: { $lt: cutoffDate }
      });
      
      if (result.deletedCount > 0) {
        console.log(`🧹 Cleaned up ${result.deletedCount} old emotion cards (older than ${hoursOld} hours)`);
      }
      
      return result.deletedCount;
    } catch (error) {
      console.error('❌ Failed to cleanup old emotion cards:', error);
      throw error;
    }
  }
}

module.exports = RealtimeEmotionCard;