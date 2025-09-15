const mongoose = require('mongoose');
const logger = require('../config/logger');
const websocketService = require('./websocketService');

class MongoChangeStreamService {
  constructor() {
    this.changeStreams = new Map();
    this.isInitialized = false;
  }

  /**
   * MongoDB Change Stream 서비스 초기화
   */
  async initialize() {
    if (this.isInitialized) {
      logger.warn('⚠️ MongoDB Change Stream Service already initialized');
      return;
    }

    try {
      // MongoDB 연결이 준비될 때까지 대기
      if (mongoose.connection.readyState !== 1) {
        logger.info('🔄 Waiting for MongoDB connection...');
        await new Promise((resolve) => {
          mongoose.connection.once('connected', resolve);
        });
      }

      logger.info('🚀 Initializing MongoDB Change Stream Service...');
      
      // 실시간 감정 카드 변경 감지
      await this.watchRealtimeEmotionCards();
      
      // 분석 결과 변경 감지
      await this.watchAnalysisResults();

      this.isInitialized = true;
      logger.info('✅ MongoDB Change Stream Service initialized successfully');

    } catch (error) {
      logger.error('❌ Failed to initialize MongoDB Change Stream Service:', error);
      throw error;
    }
  }

  /**
   * 실시간 분석 집계 결과 컬렉션의 변경 사항 감시
   */
  async watchRealtimeEmotionCards() {
    try {
      const db = mongoose.connection.db;
      // Spark에서 저장하는 실시간 집계 컬렉션 감시 (컬렉션명은 실제 환경에 맞게 수정)
      const collection = db.collection('realtime_analysis_aggregates');

      // Change Stream 생성 (insert와 update 이벤트 감시)
      const changeStream = collection.watch([
        {
          $match: {
            'operationType': { $in: ['insert', 'update', 'replace'] }
          }
        }
      ], {
        fullDocument: 'updateLookup'
      });

      changeStream.on('change', (change) => {
        this.handleRealtimeAggregateChange(change);
      });

      changeStream.on('error', (error) => {
        logger.error('❌ Realtime aggregates change stream error:', error);
        // 재연결 시도
        setTimeout(() => {
          this.watchRealtimeEmotionCards();
        }, 5000);
      });

      changeStream.on('close', () => {
        logger.warn('🔴 Realtime aggregates change stream closed');
      });

      this.changeStreams.set('realtimeAggregates', changeStream);
      logger.info('👀 Started watching realtime analysis aggregates collection');

    } catch (error) {
      logger.error('❌ Failed to watch realtime aggregates collection:', error);
    }
  }

  /**
   * 분석 결과 컬렉션의 변경 사항 감시
   */
  async watchAnalysisResults() {
    try {
      const db = mongoose.connection.db;
      const collection = db.collection('analysis_results');

      // Change Stream 생성 (insert와 update 이벤트 감시)
      const changeStream = collection.watch([
        {
          $match: {
            'operationType': { $in: ['insert', 'update'] }
          }
        }
      ], {
        fullDocument: 'updateLookup'
      });

      changeStream.on('change', (change) => {
        this.handleAnalysisResultChange(change);
      });

      changeStream.on('error', (error) => {
        logger.error('❌ Analysis results change stream error:', error);
        // 재연결 시도
        setTimeout(() => {
          this.watchAnalysisResults();
        }, 5000);
      });

      changeStream.on('close', () => {
        logger.warn('🔴 Analysis results change stream closed');
      });

      this.changeStreams.set('analysisResults', changeStream);
      logger.info('👀 Started watching analysis results collection');

    } catch (error) {
      logger.error('❌ Failed to watch analysis results collection:', error);
    }
  }

  /**
   * 실시간 집계 데이터 변경 이벤트 처리 (Spark 집계 결과)
   */
  async handleRealtimeAggregateChange(change) {
    try {
      const aggregateData = change.fullDocument;
      
      if (!aggregateData || !aggregateData.product_id) {
        logger.warn('⚠️ Invalid aggregate data received');
        return;
      }

      const productId = aggregateData.product_id;
      const jobId = aggregateData.job_id;
      logger.info(`📊 Realtime aggregate update for product: ${productId}, job: ${jobId}, operation: ${change.operationType}`);

      // 집계 데이터에서 감정 카드 생성 (시각화용)
      const emotionCards = await this.generateEmotionCardsFromAggregate(aggregateData);
      
      // 각 감정 카드를 WebSocket으로 전송
      for (const card of emotionCards) {
        await websocketService.sendRealtimeEmotionCard(productId, card);
        // 카드 간 간격을 위해 짧은 딜레이
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // 진행률 계산 (리뷰 수에 기반)
      const progress = this.calculateProgressFromReviewCount(aggregateData.review_cnt);
      await websocketService.sendRealtimeProgress(productId, progress);

      // 일정 리뷰 수에 도달하면 최종 결과로 처리
      if (aggregateData.review_cnt >= 100) { // 100개 이상일 때 완료로 간주
        const finalSummary = this.createFinalSummaryFromAggregate(aggregateData);
        await websocketService.sendRealtimeFinalSummary(productId, finalSummary);
      }

    } catch (error) {
      logger.error('❌ Failed to handle realtime aggregate change:', error);
    }
  }

  /**
   * 집계 데이터에서 감정 카드 생성
   */
  async generateEmotionCardsFromAggregate(aggregateData) {
    const cards = [];
    const { sentiment_counts, keyword_counts, avg_stars } = aggregateData;
    
    // 감정별로 카드 생성
    if (sentiment_counts.POS > 0) {
      cards.push({
        id: `${aggregateData.job_id}_pos_${Date.now()}`,
        timestamp: aggregateData.updated_at || new Date().toISOString(),
        sentiment: 'pos',
        score: Math.min(aggregateData.sentiment_ratios.POS + 0.2, 1.0), // 약간 부스트
        summary: this.generatePositiveSummary(keyword_counts, avg_stars),
        keywords: this.extractTopKeywords(keyword_counts, 'positive'),
        refs: { 
          jobId: aggregateData.job_id,
          productId: aggregateData.product_id,
          url: aggregateData.url
        }
      });
    }

    if (sentiment_counts.NEG > 0) {
      cards.push({
        id: `${aggregateData.job_id}_neg_${Date.now()}`,
        timestamp: aggregateData.updated_at || new Date().toISOString(),
        sentiment: 'neg',
        score: Math.min(aggregateData.sentiment_ratios.NEG + 0.15, 1.0),
        summary: this.generateNegativeSummary(keyword_counts, avg_stars),
        keywords: this.extractTopKeywords(keyword_counts, 'negative'),
        refs: { 
          jobId: aggregateData.job_id,
          productId: aggregateData.product_id,
          url: aggregateData.url
        }
      });
    }

    if (sentiment_counts.NEU > 0) {
      cards.push({
        id: `${aggregateData.job_id}_neu_${Date.now()}`,
        timestamp: aggregateData.updated_at || new Date().toISOString(),
        sentiment: 'neu',
        score: 0.5,
        summary: this.generateNeutralSummary(keyword_counts, avg_stars),
        keywords: this.extractTopKeywords(keyword_counts, 'neutral'),
        refs: { 
          jobId: aggregateData.job_id,
          productId: aggregateData.product_id,
          url: aggregateData.url
        }
      });
    }

    return cards;
  }

  /**
   * 긍정적인 요약 생성
   */
  generatePositiveSummary(keyword_counts, avg_stars) {
    const summaries = [
      `평점 ${avg_stars.toFixed(1)}점으로 만족도가 높습니다`,
      `빠른 배송과 좋은 품질로 인기가 높아요`,
      `사용자들이 전반적으로 만족하고 있습니다`,
      `가격 대비 성능이 우수하다는 평가입니다`
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  /**
   * 부정적인 요약 생성
   */
  generateNegativeSummary(keyword_counts, avg_stars) {
    const summaries = [
      `일부 사용자들이 아쉬움을 표현했습니다`,
      `배송이나 포장에 대한 불만이 있어요`,
      `가격 대비 기대에 못 미친다는 의견이 있습니다`,
      `품질 개선이 필요해 보입니다`
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  /**
   * 중립적인 요약 생성
   */
  generateNeutralSummary(keyword_counts, avg_stars) {
    const summaries = [
      `평균적인 수준의 상품으로 평가됩니다`,
      `장단점이 고루 언급되고 있어요`,
      `무난한 선택지로 여겨집니다`,
      `추가 검토가 필요한 상품입니다`
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  /**
   * 키워드 추출
   */
  extractTopKeywords(keyword_counts, sentiment_type) {
    const keywords = [];
    
    // keyword_counts에서 상위 키워드 추출
    for (const [category, subcategories] of Object.entries(keyword_counts)) {
      for (const [keyword, count] of Object.entries(subcategories)) {
        keywords.push({ key: keyword, count });
      }
    }

    // count 기준으로 정렬하고 상위 3개 반환
    return keywords
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(k => ({ key: k.key, count: k.count }));
  }

  /**
   * 리뷰 수에 기반한 진행률 계산
   */
  calculateProgressFromReviewCount(reviewCount) {
    // 일반적으로 100-200개 리뷰를 목표로 함
    const targetReviews = 150;
    const progress = Math.min(Math.floor((reviewCount / targetReviews) * 100), 95);
    return Math.max(progress, 5); // 최소 5%
  }

  /**
   * 집계 데이터에서 최종 요약 생성
   */
  createFinalSummaryFromAggregate(aggregateData) {
    const { sentiment_ratios, keyword_counts, review_cnt, avg_stars } = aggregateData;
    
    return {
      productId: aggregateData.product_id,
      jobId: aggregateData.job_id,
      overall: {
        pos: Math.round(sentiment_ratios.POS * 100),
        neg: Math.round(sentiment_ratios.NEG * 100),
        neu: Math.round(sentiment_ratios.NEU * 100),
      },
      topKeywords: this.extractTopKeywords(keyword_counts, 'all'),
      highlights: [
        `총 ${review_cnt}개의 리뷰를 분석했습니다.`,
        `평균 평점: ${avg_stars.toFixed(1)}점`,
        `긍정 의견 ${Math.round(sentiment_ratios.POS * 100)}%, 부정 의견 ${Math.round(sentiment_ratios.NEG * 100)}%`,
        `실시간 분석이 완료되었습니다.`
      ],
      insights: `이 상품은 ${review_cnt}개의 리뷰를 바탕으로 분석한 결과, 평균 ${avg_stars.toFixed(1)}점의 평점을 받았습니다. 전체적으로 ${sentiment_ratios.POS > 0.5 ? '긍정적인' : sentiment_ratios.NEG > 0.4 ? '부정적인' : '중립적인'} 반응을 보이고 있습니다.`,
      rawCount: review_cnt,
      generatedAt: aggregateData.updated_at || new Date().toISOString()
    };
  }

  /**
   * 분석 결과 변경 이벤트 처리
   */
  async handleAnalysisResultChange(change) {
    try {
      const analysisResult = change.fullDocument;
      
      if (!analysisResult || !analysisResult.productId) {
        logger.warn('⚠️ Invalid analysis result data received');
        return;
      }

      logger.info(`✅ Analysis result change detected for product: ${analysisResult.productId}, operation: ${change.operationType}`);

      // 최종 분석 결과 전송
      const finalSummary = {
        productId: analysisResult.productId,
        overall: {
          pos: Math.round(analysisResult.sentimentPositive * 100),
          neg: Math.round(analysisResult.sentimentNegative * 100),
          neu: Math.round(analysisResult.sentimentNeutral * 100),
        },
        topKeywords: analysisResult.keywords?.map(k => ({
          key: k.keyword,
          count: k.frequency
        })) || [],
        highlights: [
          `총 ${analysisResult.totalReviews}개의 리뷰를 분석했습니다.`,
          `평균 평점: ${analysisResult.averageRating?.toFixed(1)}점`,
          analysisResult.summary || '상세한 분석 결과를 확인해보세요.'
        ],
        insights: analysisResult.summary,
        rawCount: analysisResult.totalReviews,
        generatedAt: analysisResult.createdAt || new Date().toISOString()
      };

      await websocketService.sendRealtimeFinalSummary(analysisResult.productId, finalSummary);
      
      // 진행률을 100%로 업데이트
      await websocketService.sendRealtimeProgress(analysisResult.productId, 100);

    } catch (error) {
      logger.error('❌ Failed to handle analysis result change:', error);
    }
  }

  /**
   * 특정 상품의 감정 카드 개수 조회
   */
  async getEmotionCardCount(productId) {
    try {
      const db = mongoose.connection.db;
      const collection = db.collection('realtime_emotion_cards');
      const count = await collection.countDocuments({ productId });
      return count;
    } catch (error) {
      logger.error(`❌ Failed to get emotion card count for product ${productId}:`, error);
      return 0;
    }
  }

  /**
   * 특정 상품에 대한 진행률 계산
   */
  async calculateProgress(productId) {
    try {
      const cardCount = await this.getEmotionCardCount(productId);
      
      // 카드 수에 기반한 진행률 추정
      // 일반적으로 100-200개의 카드가 생성된다고 가정
      const estimatedTotal = 150;
      const progress = Math.min(Math.floor((cardCount / estimatedTotal) * 100), 95);
      
      return progress;
    } catch (error) {
      logger.error(`❌ Failed to calculate progress for product ${productId}:`, error);
      return 0;
    }
  }

  /**
   * Change Stream 서비스 정리
   */
  async cleanup() {
    try {
      logger.info('🧹 Cleaning up MongoDB Change Stream Service...');
      
      for (const [name, stream] of this.changeStreams) {
        if (stream && !stream.isClosed()) {
          await stream.close();
          logger.info(`✅ Closed change stream: ${name}`);
        }
      }
      
      this.changeStreams.clear();
      this.isInitialized = false;
      
      logger.info('✅ MongoDB Change Stream Service cleanup completed');
    } catch (error) {
      logger.error('❌ Failed to cleanup MongoDB Change Stream Service:', error);
    }
  }

  /**
   * 서비스 상태 조회
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      activeStreams: Array.from(this.changeStreams.keys()),
      streamCount: this.changeStreams.size,
      mongodbConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };
  }
}

// 싱글톤 인스턴스
const mongoChangeStreamService = new MongoChangeStreamService();

module.exports = mongoChangeStreamService;