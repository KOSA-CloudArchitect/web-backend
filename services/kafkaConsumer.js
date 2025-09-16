const kafkaService = require('./kafkaService');
const websocketService = require('./websocketService');
const websocketEventHandler = require('./websocketEventHandler');
const logger = require('../config/logger');

class KafkaConsumer {
  constructor() {
    this.service = kafkaService;
    this.eventHandlers = new Map();
    this.websocketService = websocketService;
    this.websocketEventHandler = websocketEventHandler;
  }

  /**
   * 이벤트 핸들러 등록
   */
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
    logger.info(`이벤트 핸들러 등록: ${event}`);
  }

  /**
   * 이벤트 발생
   */
  emit(event, data) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          logger.error(`이벤트 핸들러 실행 오류 [${event}]:`, error);
        }
      });
    }
  }

  /**
   * Consumer 초기화 및 토픽 구독
   */
  async initialize() {
    try {
      // 구독할 토픽 목록
      const topics = [
        'product-search-results',
        'realtime-status',
        'analysis-results',
        'watchlist-updates',
        'batch-job-status',
        'error-notifications',
        'sentiment-cards'
      ];

      // Consumer 연결 및 토픽 구독
      await this.service.connectConsumer(topics);

      // 메시지 핸들러 등록
      this.registerMessageHandlers();

      // Consumer 시작
      await this.service.startConsumer();

      logger.info('✅ Kafka Consumer 초기화 완료');
    } catch (error) {
      logger.error('❌ Kafka Consumer 초기화 실패:', error);
      throw error;
    }
  }

  /**
   * 메시지 핸들러 등록
   */
  registerMessageHandlers() {
    // 상품 검색 결과 처리
    this.service.registerMessageHandler('product-search-results', (data, context) => {
      this.handleProductSearchResults(data, context);
    });

    // 실시간 상태 업데이트 처리
    this.service.registerMessageHandler('realtime-status', (data, context) => {
      this.handleRealtimeStatus(data, context);
    });

    // 분석 결과 처리
    this.service.registerMessageHandler('analysis-results', (data, context) => {
      this.handleAnalysisResults(data, context);
    });

    // 관심 상품 업데이트 처리
    this.service.registerMessageHandler('watchlist-updates', (data, context) => {
      this.handleWatchlistUpdates(data, context);
    });

    // 배치 작업 상태 처리
    this.service.registerMessageHandler('batch-job-status', (data, context) => {
      this.handleBatchJobStatus(data, context);
    });

    // 오류 알림 처리
    this.service.registerMessageHandler('error-notifications', (data, context) => {
      this.handleErrorNotifications(data, context);
    });

    // 감성 카드 처리
    this.service.registerMessageHandler('sentiment-cards', (data, context) => {
      this.handleSentimentCards(data, context);
    });
  }

  /**
   * 상품 검색 결과 처리
   */
  async handleProductSearchResults(data, context) {
    try {
      logger.info('상품 검색 결과 수신:', {
        messageId: data.messageId,
        productCount: data.products?.length || 0
      });

      // WebSocket 이벤트 핸들러를 통해 처리
      await this.websocketEventHandler.handleEvent('search-completed', {
        messageId: data.messageId,
        products: data.products,
        totalCount: data.totalCount,
        query: data.originalQuery,
        executionTime: data.executionTime
      });

      // 이벤트 발생
      this.emit('productSearchCompleted', data);

    } catch (error) {
      logger.error('상품 검색 결과 처리 오류:', error);
      
      // 오류 발생 시 WebSocket으로 오류 전송
      if (data.messageId) {
        await this.websocketEventHandler.handleEvent('search-error', {
          messageId: data.messageId,
          error: { message: error.message, details: error.stack },
          query: data.originalQuery
        });
      }
    }
  }

  /**
   * 실시간 상태 업데이트 처리
   */
  async handleRealtimeStatus(data, context) {
    try {
      logger.info('실시간 상태 업데이트 수신:', {
        requestId: data.requestId,
        stage: data.status?.stage,
        progress: data.status?.progress
      });

      // WebSocket 이벤트 핸들러를 통해 처리
      await this.websocketEventHandler.handleEvent('analysis-status-update', {
        requestId: data.requestId,
        status: data.status.stage,
        progress: data.status.progress,
        message: data.status.message,
        estimatedTime: data.status.estimatedTime,
        currentStep: data.status.currentStep,
        totalSteps: data.status.totalSteps
      });

      // 이벤트 발생
      this.emit('analysisStatusUpdate', data);

    } catch (error) {
      logger.error('실시간 상태 업데이트 처리 오류:', error);
      
      // 오류 발생 시 WebSocket으로 오류 전송
      if (data.requestId) {
        await this.websocketEventHandler.handleEvent('analysis-error', {
          requestId: data.requestId,
          error: { message: error.message, details: error.stack }
        });
      }
    }
  }

  /**
   * 분석 결과 처리
   */
  async handleAnalysisResults(data, context) {
    try {
      logger.info('분석 결과 수신:', {
        requestId: data.requestId,
        productId: data.productId,
        analysisType: data.analysisType
      });

      // WebSocket 이벤트 핸들러를 통해 처리
      await this.websocketEventHandler.handleEvent('analysis-completed', {
        requestId: data.requestId,
        results: data.analysisResults,
        productId: data.productId,
        completedAt: data.completedAt
      });

      // 분석 결과를 DB에 저장하는 이벤트 발생
      this.emit('analysisCompleted', data);

    } catch (error) {
      logger.error('분석 결과 처리 오류:', error);
      
      // 오류 발생 시 WebSocket으로 오류 전송
      if (data.requestId) {
        await this.websocketEventHandler.handleEvent('analysis-error', {
          requestId: data.requestId,
          error: { message: error.message, details: error.stack }
        });
      }
    }
  }

  /**
   * 관심 상품 업데이트 처리
   */
  async handleWatchlistUpdates(data, context) {
    try {
      logger.info('관심 상품 업데이트 수신:', {
        userId: data.userId,
        productId: data.productId,
        updateType: data.updateType
      });

      // 가격 알림인지 확인
      if (data.updateType === 'price_changed' && data.updateData?.priceAlert) {
        await this.websocketEventHandler.handleEvent('price-alert', {
          userId: data.userId,
          productId: data.productId,
          oldPrice: data.updateData.oldPrice,
          newPrice: data.updateData.newPrice,
          discountRate: data.updateData.discountRate,
          productName: data.updateData.productName
        });
      } else {
        // 일반 관심 상품 업데이트
        await this.websocketEventHandler.handleEvent('watchlist-updated', {
          userId: data.userId,
          productId: data.productId,
          updateType: data.updateType,
          updateData: data.updateData
        });
      }

      // 이벤트 발생
      this.emit('watchlistUpdated', data);

    } catch (error) {
      logger.error('관심 상품 업데이트 처리 오류:', error);
    }
  }

  /**
   * 배치 작업 상태 처리
   */
  async handleBatchJobStatus(data, context) {
    try {
      logger.info('배치 작업 상태 수신:', {
        jobId: data.jobId,
        status: data.status,
        progress: data.progress
      });

      // 완료 상태인지 확인
      if (data.status === 'completed') {
        await this.websocketEventHandler.handleEvent('batch-job-completed', {
          jobId: data.jobId,
          results: data.results,
          completedAt: data.completedAt,
          summary: data.summary
        });
      } else {
        // 진행 상태 업데이트
        await this.websocketEventHandler.handleEvent('batch-job-status-update', {
          jobId: data.jobId,
          status: data.status,
          progress: data.progress,
          message: data.message,
          completedTasks: data.completedTasks,
          totalTasks: data.totalTasks
        });
      }

      // 이벤트 발생
      this.emit('batchJobStatusUpdate', data);

    } catch (error) {
      logger.error('배치 작업 상태 처리 오류:', error);
    }
  }

  /**
   * 오류 알림 처리
   */
  async handleErrorNotifications(data, context) {
    try {
      logger.error('오류 알림 수신:', {
        errorType: data.errorType,
        requestId: data.requestId,
        message: data.message
      });

      // 분석 오류인지 검색 오류인지 구분하여 처리
      if (data.errorType === 'analysis_error' && data.requestId) {
        await this.websocketEventHandler.handleEvent('analysis-error', {
          requestId: data.requestId,
          error: {
            message: data.message,
            details: data.details
          },
          errorCode: data.errorCode,
          retryable: data.retryable
        });
      } else if (data.errorType === 'search_error' && data.messageId) {
        await this.websocketEventHandler.handleEvent('search-error', {
          messageId: data.messageId,
          error: {
            message: data.message,
            details: data.details
          },
          query: data.query
        });
      } else {
        // 일반 오류 처리
        this.websocketService.sendError(data.requestId || 'system', {
          type: data.errorType,
          message: data.message,
          details: data.details,
          timestamp: data.timestamp
        });
      }

      // 이벤트 발생
      this.emit('errorReceived', data);

    } catch (error) {
      logger.error('오류 알림 처리 오류:', error);
    }
  }

  /**
   * 감성 카드 처리
   */
  async handleSentimentCards(data, context) {
    try {
      logger.info('감성 카드 수신:', {
        requestId: data.requestId,
        sentiment: data.card?.sentiment,
        confidence: data.card?.confidence
      });

      // WebSocket 이벤트 핸들러를 통해 처리
      await this.websocketEventHandler.handleEvent('sentiment-card-update', {
        requestId: data.requestId,
        card: data.card
      });

      // 이벤트 발생
      this.emit('sentimentCardReceived', data);

    } catch (error) {
      logger.error('감성 카드 처리 오류:', error);
    }
  }

  /**
   * 특정 사용자를 위한 WebSocket 룸 참여
   */
  joinUserRoom(socket, userId) {
    if (socket && userId) {
      socket.join(`user:${userId}`);
      logger.info(`사용자 ${userId}가 WebSocket 룸에 참여`);
    }
  }

  /**
   * 특정 분석 요청을 위한 WebSocket 룸 참여
   */
  joinAnalysisRoom(socket, requestId) {
    if (socket && requestId) {
      socket.join(`analysis:${requestId}`);
      logger.info(`분석 요청 ${requestId}에 대한 WebSocket 룸 참여`);
    }
  }

  /**
   * 연결 상태 확인
   */
  isConnected() {
    return this.service.isConsumerConnected();
  }
}

module.exports = new KafkaConsumer();