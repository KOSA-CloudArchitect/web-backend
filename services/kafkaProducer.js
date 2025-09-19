const kafkaService = require('./kafkaService');
const logger = require('../config/logger');

class KafkaProducer {
  constructor() {
    this.service = kafkaService;
  }

  /**
   * 상품 검색 요청
   */
  async searchProducts(searchQuery, options = {}) {
    try {
      const messageId = await this.service.sendProductSearchRequest(searchQuery, options);
      
      logger.info('상품 검색 요청 전송:', {
        messageId,
        query: searchQuery,
        options
      });

      return {
        success: true,
        messageId,
        message: '상품 검색 요청이 전송되었습니다.'
      };
    } catch (error) {
      logger.error('상품 검색 요청 실패:', error);
      throw new Error('상품 검색 요청 전송에 실패했습니다.');
    }
  }

  /**
   * 실시간 리뷰 분석 요청
   */
  async requestRealtimeAnalysis(productId, options = {}) {
    try {
      const requestId = await this.service.sendAnalysisRequest(productId, 'realtime', options);
      
      logger.info('실시간 분석 요청 전송:', {
        requestId,
        productId,
        options
      });

      return {
        success: true,
        requestId,
        message: '실시간 분석 요청이 전송되었습니다.',
        estimatedTime: 120 // 2분
      };
    } catch (error) {
      logger.error('실시간 분석 요청 실패:', error);
      throw new Error('실시간 분석 요청 전송에 실패했습니다.');
    }
  }

  /**
   * 배치 분석 요청
   */
  async requestBatchAnalysis(productId, options = {}) {
    try {
      const requestId = await this.service.sendAnalysisRequest(productId, 'batch', options);
      
      logger.info('배치 분석 요청 전송:', {
        requestId,
        productId,
        options
      });

      return {
        success: true,
        requestId,
        message: '배치 분석 요청이 전송되었습니다.',
        estimatedTime: 3600 // 1시간
      };
    } catch (error) {
      logger.error('배치 분석 요청 실패:', error);
      throw new Error('배치 분석 요청 전송에 실패했습니다.');
    }
  }

  /**
   * 관심 상품 등록
   */
  async addToWatchlist(productId, userId, options = {}) {
    try {
      const messageId = await this.service.sendWatchlistRequest(productId, userId, options);
      
      logger.info('관심 상품 등록 요청 전송:', {
        messageId,
        productId,
        userId,
        options
      });

      return {
        success: true,
        messageId,
        message: '관심 상품 등록 요청이 전송되었습니다.'
      };
    } catch (error) {
      logger.error('관심 상품 등록 실패:', error);
      throw new Error('관심 상품 등록 요청 전송에 실패했습니다.');
    }
  }

  /**
   * 다중 상품 배치 분석
   */
  async requestMultiProductBatch(productIds, schedule = 'daily', options = {}) {
    try {
      const jobId = await this.service.sendBatchJob(productIds, schedule, options);
      
      logger.info('다중 상품 배치 분석 요청 전송:', {
        jobId,
        productCount: productIds.length,
        schedule,
        options
      });

      return {
        success: true,
        jobId,
        message: `${productIds.length}개 상품의 배치 분석 작업이 등록되었습니다.`,
        productCount: productIds.length
      };
    } catch (error) {
      logger.error('다중 상품 배치 분석 실패:', error);
      throw new Error('다중 상품 배치 분석 요청 전송에 실패했습니다.');
    }
  }

  /**
   * 사용자 정의 메시지 전송
   */
  async sendCustomMessage(topic, message, options = {}) {
    try {
      if (!this.service.producer) {
        throw new Error('Kafka Producer가 초기화되지 않았습니다.');
      }

      const messageData = {
        ...message,
        timestamp: new Date().toISOString(),
        source: 'web_app'
      };

      await this.service.producer.send({
        topic,
        messages: [{
          key: options.key || message.id || Date.now().toString(),
          value: JSON.stringify(messageData),
          headers: options.headers || {}
        }]
      });

      logger.info(`사용자 정의 메시지 전송 [${topic}]:`, messageData);

      return {
        success: true,
        message: '메시지가 성공적으로 전송되었습니다.'
      };
    } catch (error) {
      logger.error('사용자 정의 메시지 전송 실패:', error);
      throw new Error('메시지 전송에 실패했습니다.');
    }
  }

  /**
   * 연결 상태 확인
   */
  isConnected() {
    return this.service.isProducerConnected();
  }
}

module.exports = new KafkaProducer();