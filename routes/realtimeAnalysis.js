const express = require('express');
const { param, query, validationResult } = require('express-validator');
const { 
  asyncHandler, 
  AppError, 
  ValidationError 
} = require('../middleware/errorHandler');
const RealtimeEmotionCard = require('../models/realtimeEmotionCard');
const logger = require('../config/logger');

const router = express.Router();

// MongoDB 연결 체크를 위한 mongoose import
const mongoose = require('mongoose');

// Validation middleware
const validateProductId = [
  param('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isString()
    .withMessage('Product ID must be a string'),
];

const checkValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(`Validation failed: ${errors.array().map(e => e.msg).join(', ')}`);
  }
};

/**
 * @swagger
 * tags:
 *   name: RealtimeAnalysis
 *   description: 실시간 분석 관련 API
 */

/**
 * @swagger
 * /api/realtime/cards/{productId}:
 *   get:
 *     summary: 상품의 실시간 감정 카드 목록 조회
 *     description: 특정 상품에 대한 실시간 감정 카드들을 페이징으로 조회합니다.
 *     tags: [RealtimeAnalysis]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *         description: 페이지당 개수
 *       - in: query
 *         name: sentiment
 *         schema:
 *           type: string
 *           enum: [pos, neg, neu]
 *         description: 감정 필터
 *       - in: query
 *         name: since
 *         schema:
 *           type: string
 *           format: date-time
 *         description: 이 시간 이후의 카드만 조회
 *     responses:
 *       200:
 *         description: 감정 카드 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cards:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *       404:
 *         description: 상품을 찾을 수 없음
 */
router.get('/cards/:productId', validateProductId, asyncHandler(async (req, res) => {
  checkValidation(req);

  const { productId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  const sentiment = req.query.sentiment || null;
  const since = req.query.since ? new Date(req.query.since) : null;

  console.log(`🔍 Fetching emotion cards for product: ${productId}, page: ${page}, limit: ${limit}`);

  try {
    const emotionCardModel = new RealtimeEmotionCard();
    
    const result = await emotionCardModel.findByProductId(productId, {
      page,
      limit,
      sentiment,
      since,
    });

    console.log(`✅ Found ${result.cards.length} emotion cards for product: ${productId}`);

    res.json({
      success: true,
      productId,
      ...result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error(`❌ Failed to fetch emotion cards for product ${productId}:`, error);
    throw new AppError('감정 카드 조회 중 오류가 발생했습니다.', 500, 'EMOTION_CARDS_FETCH_ERROR');
  }
}));

/**
 * @swagger
 * /api/realtime/cards/{productId}/new:
 *   get:
 *     summary: 새로운 감정 카드 조회 (폴링용)
 *     description: 지정된 시간 이후에 생성된 새로운 감정 카드들을 조회합니다.
 *     tags: [RealtimeAnalysis]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *       - in: query
 *         name: since
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: 이 시간 이후의 새 카드들만 조회
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *           default: 10
 *         description: 최대 조회 개수
 *     responses:
 *       200:
 *         description: 새로운 감정 카드 목록
 */
router.get('/cards/:productId/new', validateProductId, asyncHandler(async (req, res) => {
  checkValidation(req);

  const { productId } = req.params;
  const since = req.query.since;
  const limit = Math.min(parseInt(req.query.limit) || 10, 20);

  if (!since) {
    throw new ValidationError('since 파라미터가 필요합니다.');
  }

  console.log(`🔍 Fetching new emotion cards since: ${since} for product: ${productId}`);

  try {
    const emotionCardModel = new RealtimeEmotionCard();
    
    const newCards = await emotionCardModel.findNewCardsSince(productId, since, limit);

    console.log(`✅ Found ${newCards.length} new emotion cards for product: ${productId}`);

    res.json({
      success: true,
      productId,
      cards: newCards,
      count: newCards.length,
      since,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error(`❌ Failed to fetch new emotion cards for product ${productId}:`, error);
    throw new AppError('새로운 감정 카드 조회 중 오류가 발생했습니다.', 500, 'NEW_EMOTION_CARDS_FETCH_ERROR');
  }
}));

/**
 * @swagger
 * /api/realtime/progress/{productId}:
 *   get:
 *     summary: 실시간 분석 진행 상황 조회
 *     description: 특정 상품의 실시간 분석 진행 상황과 통계를 조회합니다.
 *     tags: [RealtimeAnalysis]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 분석 진행 상황 조회 성공
 */
router.get('/progress/:productId', validateProductId, asyncHandler(async (req, res) => {
  checkValidation(req);

  const { productId } = req.params;

  console.log(`🔍 Fetching analysis progress for product: ${productId}`);

  try {
    const emotionCardModel = new RealtimeEmotionCard();
    
    const progress = await emotionCardModel.getAnalysisProgress(productId);

    console.log(`✅ Analysis progress for product ${productId}:`, {
      totalCards: progress.totalCards,
      isActive: progress.isActive
    });

    res.json({
      success: true,
      productId,
      ...progress,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error(`❌ Failed to fetch analysis progress for product ${productId}:`, error);
    throw new AppError('분석 진행 상황 조회 중 오류가 발생했습니다.', 500, 'PROGRESS_FETCH_ERROR');
  }
}));

/**
 * @swagger
 * /api/realtime/sentiment/{productId}:
 *   get:
 *     summary: 감정별 통계 조회
 *     description: 특정 상품의 감정별 카드 통계를 조회합니다.
 *     tags: [RealtimeAnalysis]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *       - in: query
 *         name: taskId
 *         schema:
 *           type: string
 *         description: 특정 작업의 통계만 조회 (선택적)
 *     responses:
 *       200:
 *         description: 감정 통계 조회 성공
 */
router.get('/sentiment/:productId', validateProductId, asyncHandler(async (req, res) => {
  checkValidation(req);

  const { productId } = req.params;
  const { taskId } = req.query;

  console.log(`🔍 Fetching sentiment stats for product: ${productId}${taskId ? `, task: ${taskId}` : ''}`);

  try {
    const emotionCardModel = new RealtimeEmotionCard();
    
    const sentimentStats = await emotionCardModel.getSentimentStats(productId, taskId);

    console.log(`✅ Sentiment stats for product ${productId}:`, sentimentStats.percentages);

    res.json({
      success: true,
      productId,
      taskId,
      stats: sentimentStats,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error(`❌ Failed to fetch sentiment stats for product ${productId}:`, error);
    throw new AppError('감정 통계 조회 중 오류가 발생했습니다.', 500, 'SENTIMENT_STATS_FETCH_ERROR');
  }
}));

/**
 * @swagger
 * /api/realtime/health:
 *   get:
 *     summary: 실시간 분석 시스템 상태 확인
 *     description: MongoDB 연결 상태와 시스템 상태를 확인합니다.
 *     tags: [RealtimeAnalysis]
 *     responses:
 *       200:
 *         description: 시스템 상태 정상
 *       503:
 *         description: 시스템 상태 이상
 */
router.get('/health', asyncHandler(async (req, res) => {
  try {
    // MongoDB 연결 상태 확인
    const mongoStatus = mongoose.connection.readyState;
    const mongoStatusText = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoStatus];
    
    // 최근 카드 수 확인
    const emotionCardModel = new RealtimeEmotionCard();
    const recentCount = await emotionCardModel.model.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 300000) } // 최근 5분
    });

    const isHealthy = mongoStatus === 1; // 1 = connected

    res.status(isHealthy ? 200 : 503).json({
      success: isHealthy,
      status: isHealthy ? 'healthy' : 'unhealthy',
      mongodb: {
        status: mongoStatusText,
        connected: mongoStatus === 1,
      },
      recentActivity: {
        cardsLast5Min: recentCount,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Health check failed:', error);
    res.status(503).json({
      success: false,
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}));

/**
 * POST /api/realtime/cards (Spark에서 호출)
 * Spark에서 감정 카드를 저장하기 위한 엔드포인트
 */
router.post('/cards', asyncHandler(async (req, res) => {
  const {
    productId,
    taskId,
    cardId,
    sentiment,
    score,
    summary,
    keywords,
    refs,
    sparkJobId,
    processingTimeMs,
  } = req.body;

  if (!productId || !taskId || !cardId || !sentiment || !summary) {
    throw new ValidationError('필수 필드가 누락되었습니다: productId, taskId, cardId, sentiment, summary');
  }

  console.log(`💾 Storing emotion card from Spark: ${cardId} for product: ${productId}`);

  try {
    const emotionCardModel = new RealtimeEmotionCard();
    
    const savedCard = await emotionCardModel.create({
      productId,
      taskId,
      cardId,
      sentiment,
      score: score || 0.5,
      summary,
      keywords: keywords || [],
      refs: refs || {},
      sparkJobId,
      processingTimeMs,
    });

    console.log(`✅ Emotion card saved: ${savedCard._id}`);

    res.status(201).json({
      success: true,
      message: '감정 카드가 성공적으로 저장되었습니다.',
      cardId: savedCard._id,
      productId,
      taskId,
    });

  } catch (error) {
    console.error(`❌ Failed to save emotion card ${cardId}:`, error);
    throw new AppError('감정 카드 저장 중 오류가 발생했습니다.', 500, 'EMOTION_CARD_SAVE_ERROR');
  }
}));

module.exports = router;