const express = require('express');
const router = express.Router();
const websocketService = require('../services/websocketService');
const websocketEventHandler = require('../services/websocketEventHandler');
const logger = require('../config/logger');

/**
 * WebSocket 연결 통계 조회
 */
router.get('/stats', (req, res) => {
  try {
    const stats = websocketService.getStats();
    
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('WebSocket 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: 'WebSocket 통계 조회 중 오류가 발생했습니다.'
    });
  }
});

/**
 * 특정 룸의 클라이언트 수 조회
 */
router.get('/rooms/:roomName/clients', (req, res) => {
  try {
    const { roomName } = req.params;
    const clientCount = websocketService.getRoomClientCount(roomName);
    
    res.json({
      success: true,
      data: {
        roomName,
        clientCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('룸 클라이언트 수 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '룸 정보 조회 중 오류가 발생했습니다.'
    });
  }
});

/**
 * 시스템 알림 전송
 */
router.post('/notifications/system', (req, res) => {
  try {
    const { message, type = 'info', priority = 'normal', targetUsers } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: '메시지를 입력해주세요.'
      });
    }

    // WebSocket 이벤트 핸들러를 통해 시스템 알림 전송
    websocketEventHandler.handleEvent('system-notification', {
      message,
      type,
      priority,
      targetUsers
    });

    res.json({
      success: true,
      message: '시스템 알림이 전송되었습니다.',
      data: {
        message,
        type,
        priority,
        targetUsers: targetUsers || 'all'
      }
    });
  } catch (error) {
    logger.error('시스템 알림 전송 오류:', error);
    res.status(500).json({
      success: false,
      error: '시스템 알림 전송 중 오류가 발생했습니다.'
    });
  }
});

/**
 * 유지보수 알림 전송
 */
router.post('/notifications/maintenance', (req, res) => {
  try {
    const { message, startTime, endTime, affectedServices } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: '유지보수 시작 시간과 종료 시간을 입력해주세요.'
      });
    }

    // WebSocket 이벤트 핸들러를 통해 유지보수 알림 전송
    websocketEventHandler.handleEvent('maintenance-alert', {
      message,
      startTime,
      endTime,
      affectedServices
    });

    res.json({
      success: true,
      message: '유지보수 알림이 전송되었습니다.',
      data: {
        message,
        startTime,
        endTime,
        affectedServices
      }
    });
  } catch (error) {
    logger.error('유지보수 알림 전송 오류:', error);
    res.status(500).json({
      success: false,
      error: '유지보수 알림 전송 중 오류가 발생했습니다.'
    });
  }
});

/**
 * 특정 사용자에게 메시지 전송
 */
router.post('/messages/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { event, data } = req.body;

    if (!event || !data) {
      return res.status(400).json({
        success: false,
        error: '이벤트명과 데이터를 입력해주세요.'
      });
    }

    websocketService.sendWatchlistUpdate(userId, {
      ...data,
      type: event
    });

    res.json({
      success: true,
      message: `사용자 ${userId}에게 메시지가 전송되었습니다.`,
      data: { userId, event, data }
    });
  } catch (error) {
    logger.error('사용자 메시지 전송 오류:', error);
    res.status(500).json({
      success: false,
      error: '사용자 메시지 전송 중 오류가 발생했습니다.'
    });
  }
});

/**
 * 특정 룸에 메시지 전송
 */
router.post('/messages/room/:roomName', (req, res) => {
  try {
    const { roomName } = req.params;
    const { event, data } = req.body;

    if (!event || !data) {
      return res.status(400).json({
        success: false,
        error: '이벤트명과 데이터를 입력해주세요.'
      });
    }

    websocketService.emitToRoom(roomName, event, data);

    res.json({
      success: true,
      message: `룸 ${roomName}에 메시지가 전송되었습니다.`,
      data: { roomName, event, data }
    });
  } catch (error) {
    logger.error('룸 메시지 전송 오류:', error);
    res.status(500).json({
      success: false,
      error: '룸 메시지 전송 중 오류가 발생했습니다.'
    });
  }
});

/**
 * 브로드캐스트 메시지 전송
 */
router.post('/messages/broadcast', (req, res) => {
  try {
    const { event, data } = req.body;

    if (!event || !data) {
      return res.status(400).json({
        success: false,
        error: '이벤트명과 데이터를 입력해주세요.'
      });
    }

    websocketService.broadcast(event, data);

    res.json({
      success: true,
      message: '브로드캐스트 메시지가 전송되었습니다.',
      data: { event, data }
    });
  } catch (error) {
    logger.error('브로드캐스트 메시지 전송 오류:', error);
    res.status(500).json({
      success: false,
      error: '브로드캐스트 메시지 전송 중 오류가 발생했습니다.'
    });
  }
});

/**
 * 테스트용 감성 카드 전송
 */
router.post('/test/sentiment-card', (req, res) => {
  try {
    // 개발 환경에서만 허용
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: '프로덕션 환경에서는 사용할 수 없습니다.'
      });
    }

    const { requestId, card } = req.body;

    if (!requestId || !card) {
      return res.status(400).json({
        success: false,
        error: 'requestId와 card 데이터를 입력해주세요.'
      });
    }

    // 테스트용 감성 카드 전송
    websocketEventHandler.handleEvent('sentiment-card-update', {
      requestId,
      card: {
        id: card.id || Date.now().toString(),
        sentiment: card.sentiment || 'neutral',
        text: card.text || '테스트 리뷰입니다.',
        keywords: card.keywords || ['테스트'],
        confidence: card.confidence || 0.8,
        reviewCount: card.reviewCount || 1,
        timestamp: new Date().toISOString()
      }
    });

    res.json({
      success: true,
      message: '테스트 감성 카드가 전송되었습니다.',
      data: { requestId, card }
    });
  } catch (error) {
    logger.error('테스트 감성 카드 전송 오류:', error);
    res.status(500).json({
      success: false,
      error: '테스트 감성 카드 전송 중 오류가 발생했습니다.'
    });
  }
});

/**
 * 테스트용 분석 상태 업데이트 전송
 */
router.post('/test/analysis-status', (req, res) => {
  try {
    // 개발 환경에서만 허용
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: '프로덕션 환경에서는 사용할 수 없습니다.'
      });
    }

    const { requestId, status, progress, message } = req.body;

    if (!requestId) {
      return res.status(400).json({
        success: false,
        error: 'requestId를 입력해주세요.'
      });
    }

    // 테스트용 분석 상태 업데이트 전송
    websocketEventHandler.handleEvent('analysis-status-update', {
      requestId,
      status: status || 'processing',
      progress: progress || 50,
      message: message || '테스트 분석 진행 중...',
      estimatedTime: 60,
      currentStep: 2,
      totalSteps: 4
    });

    res.json({
      success: true,
      message: '테스트 분석 상태가 전송되었습니다.',
      data: { requestId, status, progress, message }
    });
  } catch (error) {
    logger.error('테스트 분석 상태 전송 오류:', error);
    res.status(500).json({
      success: false,
      error: '테스트 분석 상태 전송 중 오류가 발생했습니다.'
    });
  }
});

/**
 * 등록된 이벤트 핸들러 목록 조회
 */
router.get('/handlers', (req, res) => {
  try {
    const handlers = websocketEventHandler.getRegisteredHandlers();
    
    res.json({
      success: true,
      data: {
        handlers,
        count: handlers.length
      }
    });
  } catch (error) {
    logger.error('이벤트 핸들러 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '이벤트 핸들러 목록 조회 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;