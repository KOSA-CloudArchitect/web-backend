const express = require('express');
const router = express.Router();
const kafkaProducer = require('../services/kafkaProducer');
const logger = require('../config/logger');

/**
 * 상품 검색 요청
 */
router.post('/search', async (req, res) => {
  try {
    const { query, options = {} } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        error: '검색어를 입력해주세요.'
      });
    }

    // 사용자 ID 추가 (인증된 경우)
    const searchOptions = {
      ...options,
      userId: req.user?.id || 'anonymous'
    };

    const result = await kafkaProducer.searchProducts(query.trim(), searchOptions);

    res.json(result);
  } catch (error) {
    logger.error('상품 검색 요청 처리 오류:', error);
    res.status(500).json({
      success: false,
      error: '상품 검색 요청 처리 중 오류가 발생했습니다.'
    });
  }
});

/**
 * 실시간 분석 요청
 */
router.post('/analysis/realtime', async (req, res) => {
  try {
    const { productId, options = {} } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: '상품 ID를 입력해주세요.'
      });
    }

    // 사용자 ID 추가 (인증된 경우)
    const analysisOptions = {
      ...options,
      userId: req.user?.id || 'anonymous'
    };

    const result = await kafkaProducer.requestRealtimeAnalysis(productId, analysisOptions);

    res.json(result);
  } catch (error) {
    logger.error('실시간 분석 요청 처리 오류:', error);
    res.status(500).json({
      success: false,
      error: '실시간 분석 요청 처리 중 오류가 발생했습니다.'
    });
  }
});

/**
 * 배치 분석 요청
 */
router.post('/analysis/batch', async (req, res) => {
  try {
    const { productId, options = {} } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: '상품 ID를 입력해주세요.'
      });
    }

    // 사용자 ID 추가 (인증된 경우)
    const analysisOptions = {
      ...options,
      userId: req.user?.id || 'anonymous'
    };

    const result = await kafkaProducer.requestBatchAnalysis(productId, analysisOptions);

    res.json(result);
  } catch (error) {
    logger.error('배치 분석 요청 처리 오류:', error);
    res.status(500).json({
      success: false,
      error: '배치 분석 요청 처리 중 오류가 발생했습니다.'
    });
  }
});

/**
 * 관심 상품 등록
 */
router.post('/watchlist/add', async (req, res) => {
  try {
    const { productId, options = {} } = req.body;
    const userId = req.user?.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: '상품 ID를 입력해주세요.'
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: '로그인이 필요합니다.'
      });
    }

    const result = await kafkaProducer.addToWatchlist(productId, userId, options);

    res.json(result);
  } catch (error) {
    logger.error('관심 상품 등록 처리 오류:', error);
    res.status(500).json({
      success: false,
      error: '관심 상품 등록 처리 중 오류가 발생했습니다.'
    });
  }
});

/**
 * 다중 상품 배치 분석
 */
router.post('/analysis/multi-batch', async (req, res) => {
  try {
    const { productIds, schedule = 'daily', options = {} } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: '상품 ID 목록을 입력해주세요.'
      });
    }

    if (productIds.length > 100) {
      return res.status(400).json({
        success: false,
        error: '한 번에 최대 100개의 상품만 처리할 수 있습니다.'
      });
    }

    // 사용자 ID 추가 (인증된 경우)
    const batchOptions = {
      ...options,
      userId: req.user?.id || 'anonymous'
    };

    const result = await kafkaProducer.requestMultiProductBatch(productIds, schedule, batchOptions);

    res.json(result);
  } catch (error) {
    logger.error('다중 상품 배치 분석 처리 오류:', error);
    res.status(500).json({
      success: false,
      error: '다중 상품 배치 분석 처리 중 오류가 발생했습니다.'
    });
  }
});

/**
 * Kafka 연결 상태 확인
 */
router.get('/status', async (req, res) => {
  try {
    const isProducerConnected = kafkaProducer.isConnected();

    res.json({
      success: true,
      status: {
        producer: isProducerConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Kafka 상태 확인 오류:', error);
    res.status(500).json({
      success: false,
      error: 'Kafka 상태 확인 중 오류가 발생했습니다.'
    });
  }
});

/**
 * 사용자 정의 메시지 전송 (개발/테스트용)
 */
router.post('/message/custom', async (req, res) => {
  try {
    // 프로덕션 환경에서는 비활성화
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: '프로덕션 환경에서는 사용할 수 없습니다.'
      });
    }

    const { topic, message, options = {} } = req.body;

    if (!topic || !message) {
      return res.status(400).json({
        success: false,
        error: '토픽과 메시지를 입력해주세요.'
      });
    }

    const result = await kafkaProducer.sendCustomMessage(topic, message, options);

    res.json(result);
  } catch (error) {
    logger.error('사용자 정의 메시지 전송 오류:', error);
    res.status(500).json({
      success: false,
      error: '메시지 전송 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;