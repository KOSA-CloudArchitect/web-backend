const mongoose = require('mongoose');

/**
 * MongoDB AnalysisResult 스키마
 * 분석 완료된 결과를 영구 저장
 */
const analysisResultSchema = new mongoose.Schema({
  // 기본 식별자
  productId: {
    type: String,
    required: true,
    index: true,
  },
  taskId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  
  // 감성 분석 결과
  sentimentPositive: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  sentimentNegative: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  sentimentNeutral: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  
  // 분석 내용
  summary: {
    type: String,
    required: true,
  },
  totalReviews: {
    type: Number,
    required: true,
    min: 0,
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
  },
  processingTime: {
    type: Number, // 처리 시간 (초)
    min: 0,
  },
  
  // 추가 분석 데이터
  keywords: [{
    keyword: String,
    frequency: Number,
    sentiment: String, // positive, negative, neutral
  }],
  
  // 리뷰 분포 정보
  reviewDistribution: {
    star5: { type: Number, default: 0 },
    star4: { type: Number, default: 0 },
    star3: { type: Number, default: 0 },
    star2: { type: Number, default: 0 },
    star1: { type: Number, default: 0 },
  },
  
  // 메타데이터
  metadata: {
    crawledAt: Date,
    analysisVersion: String,
    sourceUrl: String,
    userId: String,
    requestType: {
      type: String,
      enum: ['realtime', 'batch'],
      default: 'realtime',
    },
  },
  
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
  collection: 'analysis_results',
});

// 인덱스 설정
analysisResultSchema.index({ productId: 1, createdAt: -1 });
analysisResultSchema.index({ 'metadata.userId': 1, createdAt: -1 });
analysisResultSchema.index({ createdAt: -1 }); // 최신 순 정렬용

/**
 * AnalysisResult 모델 클래스
 */
class MongoAnalysisResult {
  constructor() {
    this.model = mongoose.model('AnalysisResult', analysisResultSchema);
  }

  /**
   * 분석 결과 저장
   * @param {Object} data - 분석 결과 데이터
   * @returns {Promise<Object>} 저장된 분석 결과
   */
  async create(data) {
    try {
      console.log(`💾 Saving analysis result to MongoDB: ${data.taskId}`);
      
      const analysisResult = new this.model({
        productId: data.productId,
        taskId: data.taskId,
        sentimentPositive: data.sentiment?.positive || 0,
        sentimentNegative: data.sentiment?.negative || 0,
        sentimentNeutral: data.sentiment?.neutral || 0,
        summary: data.summary || '',
        totalReviews: data.totalReviews || 0,
        averageRating: data.averageRating,
        processingTime: data.processingTime,
        keywords: data.keywords || [],
        reviewDistribution: data.reviewDistribution || {},
        metadata: {
          crawledAt: data.crawledAt ? new Date(data.crawledAt) : new Date(),
          analysisVersion: data.analysisVersion || '1.0.0',
          sourceUrl: data.sourceUrl,
          userId: data.userId,
          requestType: data.requestType || 'realtime',
        },
      });

      const savedResult = await analysisResult.save();
      console.log(`✅ Analysis result saved to MongoDB: ${savedResult._id}`);
      
      return savedResult;
      
    } catch (error) {
      console.error('❌ Failed to save analysis result to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Task ID로 분석 결과 조회
   * @param {string} taskId - 작업 ID
   * @returns {Promise<Object|null>} 분석 결과
   */
  async findByTaskId(taskId) {
    try {
      const result = await this.model.findOne({ taskId }).lean();
      return result;
    } catch (error) {
      console.error(`❌ Failed to find analysis result by taskId ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * 상품 ID로 분석 결과 조회 (최신 순)
   * @param {string} productId - 상품 ID
   * @param {number} limit - 조회 개수 제한
   * @returns {Promise<Array>} 분석 결과 목록
   */
  async findByProductId(productId, limit = 1) {
    try {
      const results = await this.model
        .find({ productId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
      
      return results;
    } catch (error) {
      console.error(`❌ Failed to find analysis results by productId ${productId}:`, error);
      throw error;
    }
  }

  /**
   * 상품의 최신 분석 결과 조회
   * @param {string} productId - 상품 ID
   * @returns {Promise<Object|null>} 최신 분석 결과
   */
  async findLatestByProductId(productId) {
    try {
      const result = await this.model
        .findOne({ productId })
        .sort({ createdAt: -1 })
        .lean();
      
      return result;
    } catch (error) {
      console.error(`❌ Failed to find latest analysis result by productId ${productId}:`, error);
      throw error;
    }
  }

  /**
   * 사용자의 분석 결과 조회
   * @param {string} userId - 사용자 ID
   * @param {number} page - 페이지 번호 (1부터 시작)
   * @param {number} limit - 페이지당 개수
   * @returns {Promise<Object>} 분석 결과 목록과 페이징 정보
   */
  async findByUserId(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [results, total] = await Promise.all([
        this.model
          .find({ 'metadata.userId': userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.model.countDocuments({ 'metadata.userId': userId })
      ]);
      
      return {
        results,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error(`❌ Failed to find analysis results by userId ${userId}:`, error);
      throw error;
    }
  }

  /**
   * 분석 결과 업데이트
   * @param {string} taskId - 작업 ID
   * @param {Object} updates - 업데이트할 데이터
   * @returns {Promise<Object|null>} 업데이트된 분석 결과
   */
  async updateByTaskId(taskId, updates) {
    try {
      const result = await this.model
        .findOneAndUpdate(
          { taskId },
          { $set: updates },
          { new: true, lean: true }
        );
      
      if (result) {
        console.log(`✅ Analysis result updated in MongoDB: ${taskId}`);
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Failed to update analysis result ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * 분석 결과 삭제
   * @param {string} taskId - 작업 ID
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async deleteByTaskId(taskId) {
    try {
      const result = await this.model.deleteOne({ taskId });
      const deleted = result.deletedCount > 0;
      
      if (deleted) {
        console.log(`🗑️ Analysis result deleted from MongoDB: ${taskId}`);
      }
      
      return deleted;
    } catch (error) {
      console.error(`❌ Failed to delete analysis result ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * 분석 통계 조회
   * @param {Object} filters - 필터 조건
   * @returns {Promise<Object>} 통계 정보
   */
  async getStats(filters = {}) {
    try {
      const matchStage = {};
      
      if (filters.productId) {
        matchStage.productId = filters.productId;
      }
      
      if (filters.userId) {
        matchStage['metadata.userId'] = filters.userId;
      }
      
      if (filters.dateFrom || filters.dateTo) {
        matchStage.createdAt = {};
        if (filters.dateFrom) {
          matchStage.createdAt.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          matchStage.createdAt.$lte = new Date(filters.dateTo);
        }
      }

      const stats = await this.model.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalAnalyses: { $sum: 1 },
            avgPositiveSentiment: { $avg: '$sentimentPositive' },
            avgNegativeSentiment: { $avg: '$sentimentNegative' },
            avgNeutralSentiment: { $avg: '$sentimentNeutral' },
            avgTotalReviews: { $avg: '$totalReviews' },
            avgRating: { $avg: '$averageRating' },
            avgProcessingTime: { $avg: '$processingTime' },
          }
        }
      ]);

      return stats.length > 0 ? stats[0] : {
        totalAnalyses: 0,
        avgPositiveSentiment: 0,
        avgNegativeSentiment: 0,
        avgNeutralSentiment: 0,
        avgTotalReviews: 0,
        avgRating: 0,
        avgProcessingTime: 0,
      };
    } catch (error) {
      console.error('❌ Failed to get analysis stats:', error);
      throw error;
    }
  }

  /**
   * 오래된 분석 결과 정리
   * @param {number} daysOld - 삭제할 데이터의 기준 일수
   * @returns {Promise<number>} 삭제된 개수
   */
  async cleanup(daysOld = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const result = await this.model.deleteMany({
        createdAt: { $lt: cutoffDate }
      });
      
      if (result.deletedCount > 0) {
        console.log(`🧹 Cleaned up ${result.deletedCount} old analysis results (older than ${daysOld} days)`);
      }
      
      return result.deletedCount;
    } catch (error) {
      console.error('❌ Failed to cleanup old analysis results:', error);
      throw error;
    }
  }
}

module.exports = MongoAnalysisResult;

