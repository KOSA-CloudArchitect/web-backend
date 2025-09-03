const websocketService = require('./websocketService');
const logger = require('../config/logger');

class WebSocketEventHandler {
  constructor() {
    this.handlers = new Map();
    this.setupDefaultHandlers();
  }

  /**
   * 기본 이벤트 핸들러 설정
   */
  setupDefaultHandlers() {
    // 분석 관련 이벤트
    this.registerHandler('analysis-status-update', this.handleAnalysisStatusUpdate.bind(this));
    this.registerHandler('analysis-completed', this.handleAnalysisCompleted.bind(this));
    this.registerHandler('analysis-error', this.handleAnalysisError.bind(this));
    this.registerHandler('sentiment-card-update', this.handleSentimentCardUpdate.bind(this));

    // 검색 관련 이벤트
    this.registerHandler('search-completed', this.handleSearchCompleted.bind(this));
    this.registerHandler('search-error', this.handleSearchError.bind(this));

    // 관심 상품 관련 이벤트
    this.registerHandler('watchlist-updated', this.handleWatchlistUpdated.bind(this));
    this.registerHandler('price-alert', this.handlePriceAlert.bind(this));

    // 배치 작업 관련 이벤트
    this.registerHandler('batch-job-status-update', this.handleBatchJobStatusUpdate.bind(this));
    this.registerHandler('batch-job-completed', this.handleBatchJobCompleted.bind(this));

    // 시스템 이벤트
    this.registerHandler('system-notification', this.handleSystemNotification.bind(this));
    this.registerHandler('maintenance-alert', this.handleMaintenanceAlert.bind(this));
  }

  /**
   * 이벤트 핸들러 등록
   */
  registerHandler(eventType, handler) {
    this.handlers.set(eventType, handler);
    logger.debug(`이벤트 핸들러 등록: ${eventType}`);
  }

  /**
   * 이벤트 처리
   */
  async handleEvent(eventType, data) {
    const handler = this.handlers.get(eventType);
    
    if (handler) {
      try {
        await handler(data);
        logger.debug(`이벤트 처리 완료: ${eventType}`);
      } catch (error) {
        logger.error(`이벤트 처리 오류 [${eventType}]:`, error);
      }
    } else {
      logger.warn(`등록되지 않은 이벤트 타입: ${eventType}`);
    }
  }

  /**
   * 분석 상태 업데이트 처리
   */
  async handleAnalysisStatusUpdate(data) {
    const { requestId, status, progress, message, estimatedTime, currentStep, totalSteps } = data;

    websocketService.sendAnalysisUpdate(requestId, {
      status,
      progress: Math.min(Math.max(progress || 0, 0), 100),
      message: message || '분석 진행 중...',
      estimatedTime: estimatedTime || null,
      currentStep: currentStep || null,
      totalSteps: totalSteps || null,
      type: 'status-update'
    });

    logger.info(`분석 상태 업데이트 전송 [${requestId}]: ${status} (${progress}%)`);
  }

  /**
   * 분석 완료 처리
   */
  async handleAnalysisCompleted(data) {
    const { requestId, results, productId, completedAt } = data;

    websocketService.sendAnalysisUpdate(requestId, {
      status: 'completed',
      progress: 100,
      message: '분석이 완료되었습니다.',
      results,
      productId,
      completedAt: completedAt || new Date().toISOString(),
      type: 'completion'
    });

    logger.info(`분석 완료 알림 전송 [${requestId}]: ${productId}`);
  }

  /**
   * 분석 오류 처리
   */
  async handleAnalysisError(data) {
    const { requestId, error, errorCode, retryable } = data;

    websocketService.sendError(`analysis:${requestId}`, {
      type: 'analysis-error',
      requestId,
      message: error.message || '분석 중 오류가 발생했습니다.',
      errorCode: errorCode || 'ANALYSIS_ERROR',
      retryable: retryable !== false,
      details: error.details || null
    });

    logger.error(`분석 오류 알림 전송 [${requestId}]:`, error);
  }

  /**
   * 감성 카드 업데이트 처리
   */
  async handleSentimentCardUpdate(data) {
    const { requestId, card } = data;

    // 카드 데이터 검증
    const validatedCard = {
      id: card.id || Date.now().toString(),
      sentiment: card.sentiment || 'neutral',
      text: card.text || '',
      keywords: card.keywords || [],
      confidence: Math.min(Math.max(card.confidence || 0, 0), 1),
      reviewCount: card.reviewCount || 0,
      timestamp: card.timestamp || new Date().toISOString(),
      color: this.getSentimentColor(card.sentiment)
    };

    websocketService.sendSentimentCard(requestId, validatedCard);

    logger.info(`감성 카드 전송 [${requestId}]: ${validatedCard.sentiment} (${validatedCard.confidence})`);
  }

  /**
   * 검색 완료 처리
   */
  async handleSearchCompleted(data) {
    const { messageId, products, totalCount, query, executionTime } = data;

    websocketService.sendSearchResults(messageId, {
      status: 'completed',
      products: products || [],
      totalCount: totalCount || 0,
      query: query || '',
      executionTime: executionTime || null,
      type: 'search-results'
    });

    logger.info(`검색 결과 전송 [${messageId}]: ${totalCount}개 상품 (${query})`);
  }

  /**
   * 검색 오류 처리
   */
  async handleSearchError(data) {
    const { messageId, error, query } = data;

    websocketService.sendError(`search:${messageId}`, {
      type: 'search-error',
      messageId,
      query,
      message: error.message || '검색 중 오류가 발생했습니다.',
      details: error.details || null
    });

    logger.error(`검색 오류 알림 전송 [${messageId}]:`, error);
  }

  /**
   * 관심 상품 업데이트 처리
   */
  async handleWatchlistUpdated(data) {
    const { userId, productId, updateType, updateData } = data;

    websocketService.sendWatchlistUpdate(userId, {
      productId,
      updateType, // 'added', 'removed', 'price_changed', 'analysis_updated'
      data: updateData,
      type: 'watchlist-update'
    });

    logger.info(`관심 상품 업데이트 전송 [${userId}]: ${productId} (${updateType})`);
  }

  /**
   * 가격 알림 처리
   */
  async handlePriceAlert(data) {
    const { userId, productId, oldPrice, newPrice, discountRate, productName } = data;

    websocketService.sendWatchlistUpdate(userId, {
      productId,
      updateType: 'price_alert',
      data: {
        productName: productName || '상품',
        oldPrice,
        newPrice,
        discountRate: discountRate || 0,
        savings: oldPrice - newPrice
      },
      type: 'price-alert',
      priority: 'high'
    });

    logger.info(`가격 알림 전송 [${userId}]: ${productName} ${oldPrice}원 → ${newPrice}원`);
  }

  /**
   * 배치 작업 상태 업데이트 처리
   */
  async handleBatchJobStatusUpdate(data) {
    const { jobId, status, progress, message, completedTasks, totalTasks } = data;

    websocketService.sendBatchJobUpdate(jobId, {
      status,
      progress: Math.min(Math.max(progress || 0, 0), 100),
      message: message || '배치 작업 진행 중...',
      completedTasks: completedTasks || 0,
      totalTasks: totalTasks || 0,
      type: 'batch-status-update'
    });

    logger.info(`배치 작업 상태 업데이트 전송 [${jobId}]: ${status} (${completedTasks}/${totalTasks})`);
  }

  /**
   * 배치 작업 완료 처리
   */
  async handleBatchJobCompleted(data) {
    const { jobId, results, completedAt, summary } = data;

    websocketService.sendBatchJobUpdate(jobId, {
      status: 'completed',
      progress: 100,
      message: '배치 작업이 완료되었습니다.',
      results,
      completedAt: completedAt || new Date().toISOString(),
      summary,
      type: 'batch-completion'
    });

    logger.info(`배치 작업 완료 알림 전송 [${jobId}]`);
  }

  /**
   * 시스템 알림 처리
   */
  async handleSystemNotification(data) {
    const { message, type, priority, targetUsers } = data;

    const notificationData = {
      message,
      type: type || 'info',
      priority: priority || 'normal',
      timestamp: new Date().toISOString()
    };

    if (targetUsers && targetUsers.length > 0) {
      // 특정 사용자들에게만 전송
      targetUsers.forEach(userId => {
        websocketService.sendWatchlistUpdate(userId, {
          ...notificationData,
          type: 'system-notification'
        });
      });
    } else {
      // 모든 사용자에게 브로드캐스트
      websocketService.broadcast('system-notification', notificationData);
    }

    logger.info(`시스템 알림 전송: ${message} (${type})`);
  }

  /**
   * 유지보수 알림 처리
   */
  async handleMaintenanceAlert(data) {
    const { message, startTime, endTime, affectedServices } = data;

    websocketService.broadcast('maintenance-alert', {
      message: message || '시스템 유지보수가 예정되어 있습니다.',
      startTime,
      endTime,
      affectedServices: affectedServices || [],
      type: 'maintenance',
      priority: 'high'
    });

    logger.info(`유지보수 알림 브로드캐스트: ${startTime} ~ ${endTime}`);
  }

  /**
   * 감성에 따른 색상 반환
   */
  getSentimentColor(sentiment) {
    const colorMap = {
      positive: '#10B981', // 초록색
      negative: '#EF4444', // 빨간색
      neutral: '#6B7280',  // 회색
      mixed: '#F59E0B'     // 주황색
    };

    return colorMap[sentiment] || colorMap.neutral;
  }

  /**
   * 등록된 핸들러 목록 조회
   */
  getRegisteredHandlers() {
    return Array.from(this.handlers.keys());
  }

  /**
   * 핸들러 제거
   */
  removeHandler(eventType) {
    const removed = this.handlers.delete(eventType);
    if (removed) {
      logger.debug(`이벤트 핸들러 제거: ${eventType}`);
    }
    return removed;
  }
}

// 싱글톤 인스턴스
const websocketEventHandler = new WebSocketEventHandler();

module.exports = websocketEventHandler;