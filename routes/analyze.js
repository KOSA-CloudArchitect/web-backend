const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const httpClient = require('../services/httpClient');
const analysisService = require('../services/analysisService');
const { 
  asyncHandler, 
  AppError, 
  ValidationError, 
  TimeoutError,
  ExternalServiceError 
} = require('../middleware/errorHandler');
const { Sentry } = require('../config/sentry');
const { getPool } = require('../config/database');
const { AnalysisModel } = require('../models/analysis');
const { cacheService } = require('../services/cacheService');
const websocketService = require('../services/websocketService');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analysis
 *   description: 리뷰 분석 관련 API
 */

// Validation middleware
const validateAnalysisRequest = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isString()
    .withMessage('Product ID must be a string'),
  body('url')
    .optional()
    .isURL()
    .withMessage('Invalid URL format'),
  body('keywords')
    .optional()
    .isArray()
    .withMessage('Keywords must be an array'),
];

const validateProductId = [
  param('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isString()
    .withMessage('Product ID must be a string'),
];

// Helper function to check validation results
const checkValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(`Validation failed: ${errors.array().map(e => e.msg).join(', ')}`);
  }
};

/**
 * @swagger
 * /api/analyze:
 *   post:
 *     summary: 리뷰 분석 요청
 *     description: 특정 상품에 대한 리뷰 분석을 시작합니다.
 *     tags: [Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnalysisRequest'
 *     responses:
 *       200:
 *         description: 분석 요청 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 분석이 시작되었습니다.
 *                 taskId:
 *                   type: string
 *                   description: 분석 작업 ID
 *                 estimatedTime:
 *                   type: integer
 *                   description: 예상 완료 시간 (초)
 *                 fromCache:
 *                   type: boolean
 *                   description: 캐시된 결과인지 여부
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/**
 * POST /api/analyze
 * 분석 요청 시작
 */
router.post('/', validateAnalysisRequest, asyncHandler(async (req, res) => {
  checkValidation(req);

  const { productId, url, keywords } = req.body;
  
  console.log(`🔄 Analysis request received for product: ${productId}`);

  try {
    // 1. 캐시에서 기존 분석 결과 확인
    const cachedResult = await cacheService.getAnalysisResult(productId);
    if (cachedResult && cachedResult.status === 'completed') {
      console.log(`✅ Returning cached result for product: ${productId}`);
      return res.json({
        success: true,
        message: '캐시된 분석 결과를 반환합니다.',
        taskId: cachedResult.taskId,
        status: 'completed',
        fromCache: true,
      });
    }

    // 2. DB에서 기존 분석 상태 확인
    const pool = getPool();
    const analysisModel = new AnalysisModel(pool);
    
    const existingAnalysis = await analysisModel.findByProductId(productId);
    
    // 이미 진행 중인 분석이 있는지 확인
    if (existingAnalysis && ['pending', 'processing'].includes(existingAnalysis.status)) {
      return res.json({
        success: true,
        message: '이미 분석이 진행 중입니다.',
        taskId: existingAnalysis.taskId,
        status: existingAnalysis.status,
      });
    }
    
    // 3. 외부 분석 서버에 요청
    const analysisRequest = {
      productId,
      url,
      keywords,
      callbackUrl: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/analyze/callback`,
    };

    const analysisResponse = await httpClient.requestAnalysis(analysisRequest);

    console.log(`✅ Analysis request sent successfully: ${analysisResponse.taskId}`);

    // 4. DB에 상태 저장
    const newAnalysis = {
      productId,
      taskId: analysisResponse.taskId,
      status: 'pending',
    };
    
    await analysisModel.create(newAnalysis);
    console.log(`✅ Analysis record created in database for task: ${analysisResponse.taskId}`);

    // 5. 캐시에 상태 저장
    await cacheService.setAnalysisStatus(productId, {
      status: 'pending',
      taskId: analysisResponse.taskId,
      estimatedTime: analysisResponse.estimatedTime,
    });

    // Sentry에 성공 이벤트 기록
    Sentry.addBreadcrumb({
      message: 'Analysis request initiated',
      category: 'analysis',
      level: 'info',
      data: {
        productId,
        taskId: analysisResponse.taskId,
        hasUrl: !!url,
        keywordCount: keywords?.length || 0,
      },
    });

    res.json({
      success: true,
      message: '분석이 시작되었습니다.',
      taskId: analysisResponse.taskId,
      estimatedTime: analysisResponse.estimatedTime,
    });

  } catch (error) {
    console.error(`❌ Analysis request failed for product ${productId}:`, error);

    // 에러 타입에 따른 적절한 처리
    if (error.code === 'ECONNREFUSED') {
      throw new ExternalServiceError('분석 서버에 연결할 수 없습니다.');
    } else if (error.code === 'ETIMEDOUT') {
      throw new TimeoutError('분석 서버 응답 시간이 초과되었습니다.');
    } else if (error.response?.status === 401) {
      throw new AppError('분석 서버 인증에 실패했습니다.', 502, 'EXTERNAL_AUTH_ERROR');
    } else if (error.response?.status >= 400 && error.response?.status < 500) {
      throw new AppError(`분석 요청이 거부되었습니다: ${error.response.data?.message || error.message}`, 400, 'ANALYSIS_REQUEST_REJECTED');
    }

    throw new ExternalServiceError('분석 요청 처리 중 오류가 발생했습니다.');
  }
}));

/**
 * @swagger
 * /api/analyze/status/{productId}:
 *   get:
 *     summary: 분석 상태 확인
 *     description: 특정 상품의 분석 진행 상태를 확인합니다.
 *     tags: [Analysis]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 분석 상태 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [pending, processing, completed, failed]
 *                   description: 분석 상태
 *                 progress:
 *                   type: integer
 *                   minimum: 0
 *                   maximum: 100
 *                   description: 진행률 (%)
 *                 estimatedTime:
 *                   type: integer
 *                   description: 예상 완료 시간 (초)
 *                 error:
 *                   type: string
 *                   description: 오류 메시지 (실패 시)
 *                 fromCache:
 *                   type: boolean
 *                   description: 캐시된 결과인지 여부
 *       404:
 *         description: 분석 정보를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 서버 오류
 */
/**
 * GET /api/analyze/status/:productId
 * 분석 상태 확인
 */
router.get('/status/:productId', validateProductId, asyncHandler(async (req, res) => {
  checkValidation(req);

  const { productId } = req.params;

  console.log(`🔍 Status check requested for product: ${productId}`);

  try {
    // 1. 캐시에서 상태 확인
    const cachedStatus = await cacheService.getAnalysisStatus(productId);
    if (cachedStatus) {
      console.log(`✅ Returning cached status for product: ${productId}`);
      return res.json({
        ...cachedStatus,
        fromCache: true,
      });
    }

    // 2. DB에서 분석 정보 조회
    const pool = getPool();
    const analysisModel = new AnalysisModel(pool);
    
    const analysis = await analysisModel.findByProductId(productId);
    
    if (!analysis) {
      throw new AppError('해당 상품에 대한 분석 정보가 없습니다.', 404, 'ANALYSIS_NOT_FOUND');
    }
    
    // 3. 이미 완료된 분석이면 DB에서 결과 반환
    if (analysis.status === 'completed' || analysis.status === 'failed') {
      const analysisStatus = {
        status: analysis.status,
        progress: 100,
        error: analysis.error,
      };
      
      // 캐시에 저장
      await cacheService.setAnalysisStatus(productId, analysisStatus);
      
      return res.json(analysisStatus);
    }
    
    // 4. 진행 중인 분석이면 외부 서버에 상태 확인
    const taskId = analysis.taskId;
    const statusResponse = await httpClient.checkAnalysisStatus(taskId);

    console.log(`✅ Status retrieved for product ${productId}:`, statusResponse.status);
    
    // 5. DB에 상태 업데이트
    if (statusResponse.status !== analysis.status) {
      await analysisModel.updateStatus(taskId, statusResponse.status, statusResponse.error);
    }

    const analysisStatus = {
      status: statusResponse.status,
      progress: statusResponse.progress || 0,
      estimatedTime: statusResponse.estimatedTime,
      error: statusResponse.error,
    };

    // 6. 캐시에 상태 저장
    await cacheService.setAnalysisStatus(productId, analysisStatus);

    res.json(analysisStatus);

  } catch (error) {
    console.error(`❌ Status check failed for product ${productId}:`, error);

    if (error.response?.status === 404) {
      throw new AppError('분석 작업을 찾을 수 없습니다.', 404, 'ANALYSIS_NOT_FOUND');
    } else if (error.code === 'ECONNREFUSED') {
      throw new ExternalServiceError('분석 서버에 연결할 수 없습니다.');
    } else if (error.code === 'ETIMEDOUT') {
      throw new TimeoutError('분석 서버 응답 시간이 초과되었습니다.');
    }

    throw new ExternalServiceError('분석 상태 확인 중 오류가 발생했습니다.');
  }
}));

/**
 * POST /api/analyze/callback
 * 분석 서버로부터의 콜백 처리
 */
router.post('/callback', asyncHandler(async (req, res) => {
  const { taskId, status, result, error } = req.body;

  console.log(`📨 Callback received for task: ${taskId}, status: ${status}`);

  try {
    // 1. DB에서 분석 정보 조회 및 결과 저장
    const pool = getPool();
    const analysisModel = new AnalysisModel(pool);
    
    const analysis = await analysisModel.findByTaskId(taskId);
    
    if (!analysis) {
      throw new AppError(`Task ID ${taskId}에 해당하는 분석 정보를 찾을 수 없습니다.`, 404, 'ANALYSIS_NOT_FOUND');
    }
    
    let updatedAnalysis = null;
    
    // 2. 상태에 따른 DB 업데이트
    if (status === 'completed' && result) {
      // 분석 결과 저장
      updatedAnalysis = await analysisModel.updateResults(taskId, {
        status: 'completed',
        sentiment: result.sentiment,
        summary: result.summary,
        keywords: result.keywords,
        totalReviews: result.totalReviews,
      });
      console.log(`✅ Analysis results saved to database for task: ${taskId}`);
      
      // 완료된 결과를 캐시에 저장
      if (updatedAnalysis) {
        await cacheService.setAnalysisResult(analysis.productId, updatedAnalysis);
      }
    } else if (status === 'failed') {
      // 실패 상태 저장
      updatedAnalysis = await analysisModel.updateStatus(taskId, 'failed', error);
      console.log(`❌ Analysis failed for task: ${taskId}, error: ${error}`);
    } else {
      // 기타 상태 업데이트
      updatedAnalysis = await analysisModel.updateStatus(taskId, status);
      console.log(`ℹ️ Analysis status updated for task: ${taskId}, status: ${status}`);
    }

    // 3. 캐시 무효화 (상태가 변경되었으므로)
    await cacheService.invalidateAnalysisCache(analysis.productId, taskId);
    
    // 4. 새로운 상태를 캐시에 저장
    if (updatedAnalysis) {
      await cacheService.setAnalysisStatus(analysis.productId, {
        status: updatedAnalysis.status,
        progress: status === 'completed' ? 100 : (status === 'failed' ? 0 : 50),
        error: updatedAnalysis.error,
      });
    }

    // 5. WebSocket으로 상태 업데이트 알림
    websocketService.sendAnalysisUpdate(taskId, {
      status,
      result,
      error,
      type: 'callback_received',
      message: status === 'completed' ? '분석이 완료되었습니다.' : 
               status === 'failed' ? '분석이 실패했습니다.' : '분석 상태가 업데이트되었습니다.'
    });

    // Sentry에 콜백 이벤트 기록
    Sentry.addBreadcrumb({
      message: 'Analysis callback received',
      category: 'analysis',
      level: status === 'completed' ? 'info' : 'warning',
      data: {
        taskId,
        status,
        hasResult: !!result,
        hasError: !!error,
      },
    });

    console.log(`✅ Callback processed successfully for task: ${taskId}`);

    res.json({ 
      success: true, 
      message: '콜백 처리 완료' 
    });

  } catch (error) {
    console.error(`❌ Callback processing failed for task ${taskId}:`, error);

    Sentry.withScope((scope) => {
      scope.setTag('callback_processing_failed', true);
      scope.setContext('callback', { taskId, status });
      Sentry.captureException(error);
    });

    throw new AppError('콜백 처리 중 오류가 발생했습니다.', 500, 'CALLBACK_PROCESSING_ERROR');
  }
}));

/**
 * @swagger
 * /api/analyze/result/{productId}:
 *   get:
 *     summary: 분석 결과 조회
 *     description: 완료된 분석의 결과를 조회합니다.
 *     tags: [Analysis]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 분석 결과 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: string
 *                   example: completed
 *                 result:
 *                   $ref: '#/components/schemas/AnalysisResult'
 *                 fromCache:
 *                   type: boolean
 *                   description: 캐시된 결과인지 여부
 *       404:
 *         description: 분석 정보를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 서버 오류
 */
/**
 * GET /api/analyze/result/:productId
 * 분석 결과 조회
 */
router.get('/result/:productId', validateProductId, asyncHandler(async (req, res) => {
  checkValidation(req);

  const { productId } = req.params;

  console.log(`📊 Result requested for product: ${productId}`);

  try {
    // 1. 캐시에서 분석 결과 확인
    const cachedResult = await cacheService.getAnalysisResult(productId);
    if (cachedResult && cachedResult.status === 'completed') {
      console.log(`✅ Returning cached result for product: ${productId}`);
      return res.json({
        success: true,
        status: 'completed',
        result: {
          productId: cachedResult.productId,
          sentiment: cachedResult.sentiment,
          summary: cachedResult.summary,
          keywords: cachedResult.keywords,
          totalReviews: cachedResult.totalReviews,
          createdAt: cachedResult.createdAt,
          updatedAt: cachedResult.updatedAt,
        },
        fromCache: true,
      });
    }

    // 2. DB에서 분석 결과 조회
    const pool = getPool();
    const analysisModel = new AnalysisModel(pool);
    
    const analysis = await analysisModel.findByProductId(productId);
    
    if (!analysis) {
      throw new AppError('해당 상품에 대한 분석 정보가 없습니다.', 404, 'ANALYSIS_NOT_FOUND');
    }
    
    if (analysis.status !== 'completed') {
      return res.json({
        success: false,
        status: analysis.status,
        message: '분석이 아직 완료되지 않았습니다.',
        error: analysis.error,
      });
    }

    console.log(`✅ Result retrieved for product: ${productId}`);

    const result = {
      productId: analysis.productId,
      sentiment: analysis.sentiment,
      summary: analysis.summary,
      keywords: analysis.keywords,
      totalReviews: analysis.totalReviews,
      createdAt: analysis.createdAt,
      updatedAt: analysis.updatedAt,
    };

    // 3. 결과를 캐시에 저장
    await cacheService.setAnalysisResult(productId, analysis);

    res.json({
      success: true,
      status: 'completed',
      result,
    });

  } catch (error) {
    console.error(`❌ Result retrieval failed for product ${productId}:`, error);

    if (error.code === 'ANALYSIS_NOT_FOUND') {
      throw error; // Pass through the not found error
    }

    throw new AppError('분석 결과 조회 중 오류가 발생했습니다.', 500, 'RESULT_RETRIEVAL_ERROR');
  }
}));

/**
 * GET /api/analyze/cache/health
 * 캐시 시스템 헬스체크
 */
router.get('/cache/health', asyncHandler(async (req, res) => {
  try {
    const healthStatus = await cacheService.healthCheck();
    
    res.json({
      success: true,
      cache: healthStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Cache health check failed:', error);
    
    res.status(503).json({
      success: false,
      cache: { status: 'unhealthy' },
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}));

/**
 * GET /api/analyze/cache/stats
 * 캐시 통계 조회 (관리자용)
 */
router.get('/cache/stats', asyncHandler(async (req, res) => {
  try {
    const stats = await cacheService.getCacheStats();
    
    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Cache stats retrieval failed:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}));

/**
 * DELETE /api/analyze/cache/:productId
 * 특정 상품의 캐시 무효화 (관리자용)
 */
router.delete('/cache/:productId', validateProductId, asyncHandler(async (req, res) => {
  checkValidation(req);

  const { productId } = req.params;

  try {
    await cacheService.invalidateAnalysisCache(productId);
    
    console.log(`✅ Cache invalidated for product: ${productId}`);
    
    res.json({
      success: true,
      message: `상품 ${productId}의 캐시가 무효화되었습니다.`,
    });
  } catch (error) {
    console.error(`❌ Cache invalidation failed for product ${productId}:`, error);
    
    throw new AppError('캐시 무효화 중 오류가 발생했습니다.', 500, 'CACHE_INVALIDATION_ERROR');
  }
}));

/**
 * POST /api/analyze/cache/warmup
 * 캐시 워밍업 (관리자용)
 */
router.post('/cache/warmup', asyncHandler(async (req, res) => {
  const { productIds } = req.body;

  if (!productIds || !Array.isArray(productIds)) {
    throw new ValidationError('productIds 배열이 필요합니다.');
  }

  try {
    const result = await cacheService.warmupCache(productIds);
    
    res.json({
      success: true,
      message: `캐시 워밍업이 완료되었습니다.`,
      ...result,
    });
  } catch (error) {
    console.error('❌ Cache warmup failed:', error);
    
    throw new AppError('캐시 워밍업 중 오류가 발생했습니다.', 500, 'CACHE_WARMUP_ERROR');
  }
}));

/**
 * DELETE /api/analyze/cache/batch
 * 배치 캐시 무효화 (관리자용)
 */
router.delete('/cache/batch', asyncHandler(async (req, res) => {
  const { productIds } = req.body;

  if (!productIds || !Array.isArray(productIds)) {
    throw new ValidationError('productIds 배열이 필요합니다.');
  }

  try {
    const deletedCount = await cacheService.batchInvalidateCache(productIds);
    
    res.json({
      success: true,
      message: `${productIds.length}개 상품의 캐시가 무효화되었습니다.`,
      deletedCount,
    });
  } catch (error) {
    console.error('❌ Batch cache invalidation failed:', error);
    
    throw new AppError('배치 캐시 무효화 중 오류가 발생했습니다.', 500, 'BATCH_CACHE_INVALIDATION_ERROR');
  }
}));

/**
 * GET /api/analyze/cache/hitrate
 * 캐시 히트율 조회 (관리자용)
 */
router.get('/cache/hitrate', asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 7;

  try {
    const hitRateStats = await cacheService.getCacheHitRate(days);
    
    res.json({
      success: true,
      stats: hitRateStats,
      period: `${days} days`,
    });
  } catch (error) {
    console.error('❌ Cache hit rate retrieval failed:', error);
    
    throw new AppError('캐시 히트율 조회 중 오류가 발생했습니다.', 500, 'CACHE_HITRATE_ERROR');
  }
}));

// ===== Airflow 연동 엔드포인트 =====

/**
 * @swagger
 * /api/analyze/airflow/single:
 *   post:
 *     summary: 단일 상품 분석 DAG 트리거
 *     description: Airflow를 통해 단일 상품 리뷰 분석을 시작합니다.
 *     tags: [Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - productUrl
 *               - userId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: 상품 ID
 *               productUrl:
 *                 type: string
 *                 format: uri
 *                 description: 상품 URL
 *               userId:
 *                 type: string
 *                 description: 사용자 ID
 *     responses:
 *       200:
 *         description: DAG 트리거 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 단일 상품 분석이 시작되었습니다.
 *                 dagRunId:
 *                   type: string
 *                   description: DAG Run ID
 *                 dagId:
 *                   type: string
 *                   description: DAG ID
 *                 status:
 *                   type: string
 *                   example: triggered
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.post('/airflow/single', [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('productUrl').isURL().withMessage('Valid product URL is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
], asyncHandler(async (req, res) => {
  checkValidation(req);

  const { productId, productUrl, userId } = req.body;

  console.log(`🚀 Single product analysis request via Airflow:`, {
    productId,
    userId,
  });

  try {
    const result = await analysisService.requestSingleProductAnalysis({
      productId,
      productUrl,
      userId,
    });

    let message = '단일 상품 분석이 시작되었습니다.';
    if (result.status === 'queued') {
      message = `분석 대기열에 추가되었습니다. (대기 순서: ${result.queuePosition}번째)`;
    } else if (result.cached) {
      message = '이미 분석이 진행 중입니다.';
    }

    res.json({
      success: true,
      message,
      ...result,
    });

  } catch (error) {
    console.error('❌ Single product analysis request failed:', error);
    
    Sentry.withScope((scope) => {
      scope.setTag('airflow_single_analysis_failed', true);
      scope.setContext('analysis_request', { productId, userId });
      Sentry.captureException(error);
    });

    throw new ExternalServiceError('단일 상품 분석 요청 중 오류가 발생했습니다.');
  }
}));

/**
 * @swagger
 * /api/analyze/airflow/multi:
 *   post:
 *     summary: 다중 상품 분석 DAG 트리거
 *     description: Airflow를 통해 검색어 기반 다중 상품 리뷰 분석을 시작합니다.
 *     tags: [Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - searchQuery
 *               - userId
 *             properties:
 *               searchQuery:
 *                 type: string
 *                 description: 검색어
 *               userId:
 *                 type: string
 *                 description: 사용자 ID
 *               maxProducts:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 50
 *                 default: 10
 *                 description: 최대 상품 수
 *     responses:
 *       200:
 *         description: DAG 트리거 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 다중 상품 분석이 시작되었습니다.
 *                 dagRunId:
 *                   type: string
 *                   description: DAG Run ID
 *                 dagId:
 *                   type: string
 *                   description: DAG ID
 *                 status:
 *                   type: string
 *                   example: triggered
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.post('/airflow/multi', [
  body('searchQuery').notEmpty().withMessage('Search query is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
  body('maxProducts').optional().isInt({ min: 1, max: 50 }).withMessage('Max products must be between 1 and 50'),
], asyncHandler(async (req, res) => {
  checkValidation(req);

  const { searchQuery, userId, maxProducts = 10 } = req.body;

  console.log(`🚀 Multi product analysis request via Airflow:`, {
    searchQuery,
    userId,
    maxProducts,
  });

  try {
    const result = await analysisService.requestMultiProductAnalysis({
      searchQuery,
      userId,
      maxProducts,
    });

    res.json({
      success: true,
      message: result.cached ? 
        '이미 분석이 진행 중입니다.' : 
        '다중 상품 분석이 시작되었습니다.',
      ...result,
    });

  } catch (error) {
    console.error('❌ Multi product analysis request failed:', error);
    
    Sentry.withScope((scope) => {
      scope.setTag('airflow_multi_analysis_failed', true);
      scope.setContext('analysis_request', { searchQuery, userId, maxProducts });
      Sentry.captureException(error);
    });

    throw new ExternalServiceError('다중 상품 분석 요청 중 오류가 발생했습니다.');
  }
}));

/**
 * @swagger
 * /api/analyze/airflow/watchlist:
 *   post:
 *     summary: 관심 상품 배치 분석 DAG 트리거
 *     description: Airflow를 통해 관심 상품 배치 분석을 시작합니다.
 *     tags: [Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productIds
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 사용자 ID
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 관심 상품 ID 목록
 *                 minItems: 1
 *                 maxItems: 100
 *     responses:
 *       200:
 *         description: DAG 트리거 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 관심 상품 배치 분석이 시작되었습니다.
 *                 dagRunId:
 *                   type: string
 *                   description: DAG Run ID
 *                 dagId:
 *                   type: string
 *                   description: DAG ID
 *                 status:
 *                   type: string
 *                   example: triggered
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.post('/airflow/watchlist', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('productIds').isArray({ min: 1, max: 100 }).withMessage('Product IDs must be an array with 1-100 items'),
], asyncHandler(async (req, res) => {
  checkValidation(req);

  const { userId, productIds } = req.body;

  console.log(`🚀 Watchlist analysis request via Airflow:`, {
    userId,
    productCount: productIds.length,
  });

  try {
    const result = await analysisService.requestWatchlistAnalysis({
      userId,
      productIds,
    });

    res.json({
      success: true,
      message: result.cached ? 
        '이미 관심 상품 분석이 진행 중입니다.' : 
        '관심 상품 배치 분석이 시작되었습니다.',
      ...result,
    });

  } catch (error) {
    console.error('❌ Watchlist analysis request failed:', error);
    
    Sentry.withScope((scope) => {
      scope.setTag('airflow_watchlist_analysis_failed', true);
      scope.setContext('analysis_request', { userId, productCount: productIds.length });
      Sentry.captureException(error);
    });

    throw new ExternalServiceError('관심 상품 분석 요청 중 오류가 발생했습니다.');
  }
}));

/**
 * @swagger
 * /api/analyze/airflow/status/{dagId}/{dagRunId}:
 *   get:
 *     summary: Airflow DAG 실행 상태 조회
 *     description: 특정 DAG Run의 실행 상태를 조회합니다.
 *     tags: [Analysis]
 *     parameters:
 *       - in: path
 *         name: dagId
 *         required: true
 *         schema:
 *           type: string
 *         description: DAG ID
 *       - in: path
 *         name: dagRunId
 *         required: true
 *         schema:
 *           type: string
 *         description: DAG Run ID
 *     responses:
 *       200:
 *         description: DAG 상태 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 dagId:
 *                   type: string
 *                   description: DAG ID
 *                 dagRunId:
 *                   type: string
 *                   description: DAG Run ID
 *                 state:
 *                   type: string
 *                   enum: [queued, running, success, failed]
 *                   description: DAG 실행 상태
 *                 progress:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     completed:
 *                       type: integer
 *                     failed:
 *                       type: integer
 *                     running:
 *                       type: integer
 *                     percentage:
 *                       type: integer
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       taskId:
 *                         type: string
 *                       state:
 *                         type: string
 *                       startDate:
 *                         type: string
 *                       endDate:
 *                         type: string
 *                       duration:
 *                         type: number
 *       404:
 *         description: DAG Run을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/airflow/status/:dagId/:dagRunId', [
  param('dagId').notEmpty().withMessage('DAG ID is required'),
  param('dagRunId').notEmpty().withMessage('DAG Run ID is required'),
], asyncHandler(async (req, res) => {
  checkValidation(req);

  const { dagId, dagRunId } = req.params;

  console.log(`🔍 Airflow DAG status check:`, { dagId, dagRunId });

  try {
    const result = await analysisService.getAnalysisStatus(dagId, dagRunId);

    res.json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.error('❌ Airflow DAG status check failed:', error);
    
    if (error.response?.status === 404) {
      throw new AppError('DAG Run을 찾을 수 없습니다.', 404, 'DAG_RUN_NOT_FOUND');
    }

    Sentry.withScope((scope) => {
      scope.setTag('airflow_status_check_failed', true);
      scope.setContext('dag_status_check', { dagId, dagRunId });
      Sentry.captureException(error);
    });

    throw new ExternalServiceError('DAG 상태 조회 중 오류가 발생했습니다.');
  }
}));

/**
 * @swagger
 * /api/analyze/airflow/active/{userId}:
 *   get:
 *     summary: 사용자의 활성 분석 목록 조회
 *     description: 특정 사용자의 진행 중인 분석 목록을 조회합니다.
 *     tags: [Analysis]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 활성 분석 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 analyses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       dagId:
 *                         type: string
 *                       dagRunId:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [single, multi, watchlist]
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: 서버 오류
 */
router.get('/airflow/active/:userId', [
  param('userId').notEmpty().withMessage('User ID is required'),
], asyncHandler(async (req, res) => {
  checkValidation(req);

  const { userId } = req.params;

  console.log(`🔍 Active analyses check for user:`, { userId });

  try {
    const analyses = await analysisService.getActiveAnalyses(userId);

    res.json({
      success: true,
      analyses,
      count: analyses.length,
    });

  } catch (error) {
    console.error('❌ Active analyses check failed:', error);
    
    Sentry.withScope((scope) => {
      scope.setTag('active_analyses_check_failed', true);
      scope.setContext('active_analyses_check', { userId });
      Sentry.captureException(error);
    });

    throw new ExternalServiceError('활성 분석 목록 조회 중 오류가 발생했습니다.');
  }
}));

/**
 * @swagger
 * /api/analyze/redis/status/{taskId}:
 *   get:
 *     summary: Redis 기반 분석 상태 조회
 *     description: Task ID를 이용하여 Redis에서 분석 상태를 조회합니다.
 *     tags: [Analysis]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: 작업 ID
 *     responses:
 *       200:
 *         description: 분석 상태 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: string
 *                   enum: [pending, processing, completed, failed, queued]
 *                 progress:
 *                   type: integer
 *                   minimum: 0
 *                   maximum: 100
 *                 queueInfo:
 *                   type: object
 *                   properties:
 *                     position:
 *                       type: integer
 *                     totalUsers:
 *                       type: integer
 *                     estimatedCompletion:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: 분석 요청을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/redis/status/:taskId', [
  param('taskId').notEmpty().withMessage('Task ID is required'),
], asyncHandler(async (req, res) => {
  checkValidation(req);

  const { taskId } = req.params;

  console.log(`🔍 Redis analysis status check for task: ${taskId}`);

  try {
    const status = await analysisService.getAnalysisStatusByTaskId(taskId);

    res.json({
      success: true,
      ...status,
    });

  } catch (error) {
    console.error('❌ Redis analysis status check failed:', error);
    
    if (error.message === 'Analysis request not found') {
      throw new AppError('분석 요청을 찾을 수 없습니다.', 404, 'ANALYSIS_NOT_FOUND');
    }

    Sentry.withScope((scope) => {
      scope.setTag('redis_status_check_failed', true);
      scope.setContext('redis_status_check', { taskId });
      Sentry.captureException(error);
    });

    throw new ExternalServiceError('분석 상태 조회 중 오류가 발생했습니다.');
  }
}));

/**
 * @swagger
 * /api/analyze/redis/product/{productId}/status:
 *   get:
 *     summary: 상품 기반 분석 상태 조회
 *     description: 상품 ID와 사용자 ID를 이용하여 분석 상태를 조회합니다.
 *     tags: [Analysis]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 분석 상태 조회 성공
 *       404:
 *         description: 분석 요청을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/redis/product/:productId/status', [
  param('productId').notEmpty().withMessage('Product ID is required'),
  query('userId').notEmpty().withMessage('User ID is required'),
], asyncHandler(async (req, res) => {
  checkValidation(req);

  const { productId } = req.params;
  const { userId } = req.query;

  console.log(`🔍 Product analysis status check:`, { productId, userId });

  try {
    const status = await analysisService.getAnalysisStatusByProduct(productId, userId);

    if (!status) {
      return res.json({
        success: true,
        status: null,
        message: '진행 중인 분석이 없습니다.',
      });
    }

    res.json({
      success: true,
      ...status,
    });

  } catch (error) {
    console.error('❌ Product analysis status check failed:', error);
    
    Sentry.withScope((scope) => {
      scope.setTag('product_status_check_failed', true);
      scope.setContext('product_status_check', { productId, userId });
      Sentry.captureException(error);
    });

    throw new ExternalServiceError('상품 분석 상태 조회 중 오류가 발생했습니다.');
  }
}));

/**
 * @swagger
 * /api/analyze/result/mongo/{productId}:
 *   get:
 *     summary: MongoDB에서 분석 결과 조회
 *     description: 상품 ID를 이용하여 MongoDB에서 최신 분석 결과를 조회합니다.
 *     tags: [Analysis]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 분석 결과 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 result:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     sentiment:
 *                       type: object
 *                       properties:
 *                         positive:
 *                           type: number
 *                         negative:
 *                           type: number
 *                         neutral:
 *                           type: number
 *                     summary:
 *                       type: string
 *                     keywords:
 *                       type: array
 *                       items:
 *                         type: string
 *                     totalReviews:
 *                       type: integer
 *                     averageRating:
 *                       type: number
 *       404:
 *         description: 분석 결과를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/result/mongo/:productId', [
  param('productId').notEmpty().withMessage('Product ID is required'),
], asyncHandler(async (req, res) => {
  checkValidation(req);

  const { productId } = req.params;

  console.log(`🔍 MongoDB analysis result request for product: ${productId}`);

  try {
    const result = await analysisService.getAnalysisResult(productId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: '해당 상품의 분석 결과를 찾을 수 없습니다.',
      });
    }

    res.json({
      success: true,
      result,
    });

  } catch (error) {
    console.error('❌ MongoDB analysis result retrieval failed:', error);
    
    Sentry.withScope((scope) => {
      scope.setTag('mongodb_result_retrieval_failed', true);
      scope.setContext('mongodb_result_retrieval', { productId });
      Sentry.captureException(error);
    });

    throw new ExternalServiceError('분석 결과 조회 중 오류가 발생했습니다.');
  }
}));

/**
 * @swagger
 * /api/analyze/results/user/{userId}:
 *   get:
 *     summary: 사용자의 분석 결과 목록 조회
 *     description: 특정 사용자의 분석 결과 목록을 페이징으로 조회합니다.
 *     tags: [Analysis]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 ID
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
 *           default: 10
 *         description: 페이지당 개수
 *     responses:
 *       200:
 *         description: 분석 결과 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       500:
 *         description: 서버 오류
 */
router.get('/results/user/:userId', [
  param('userId').notEmpty().withMessage('User ID is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
], asyncHandler(async (req, res) => {
  checkValidation(req);

  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  console.log(`🔍 User analysis results request:`, { userId, page, limit });

  try {
    const results = await analysisService.getUserAnalysisResults(userId, page, limit);

    res.json({
      success: true,
      ...results,
    });

  } catch (error) {
    console.error('❌ User analysis results retrieval failed:', error);
    
    Sentry.withScope((scope) => {
      scope.setTag('user_results_retrieval_failed', true);
      scope.setContext('user_results_retrieval', { userId, page, limit });
      Sentry.captureException(error);
    });

    throw new ExternalServiceError('사용자 분석 결과 조회 중 오류가 발생했습니다.');
  }
}));

/**
 * @swagger
 * /api/analyze/result/process:
 *   post:
 *     summary: 분석 결과 처리 (Airflow 콜백용)
 *     description: Airflow에서 분석 완료 시 호출하는 콜백 엔드포인트입니다.
 *     tags: [Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskId
 *               - result
 *             properties:
 *               taskId:
 *                 type: string
 *                 description: 작업 ID
 *               result:
 *                 type: object
 *                 properties:
 *                   sentiment:
 *                     type: object
 *                     properties:
 *                       positive:
 *                         type: number
 *                       negative:
 *                         type: number
 *                       neutral:
 *                         type: number
 *                   summary:
 *                     type: string
 *                   totalReviews:
 *                     type: integer
 *                   averageRating:
 *                     type: number
 *                   keywords:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       200:
 *         description: 분석 결과 처리 성공
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.post('/result/process', [
  body('taskId').notEmpty().withMessage('Task ID is required'),
  body('result').isObject().withMessage('Result object is required'),
], asyncHandler(async (req, res) => {
  checkValidation(req);

  const { taskId, result } = req.body;

  console.log(`📊 Processing analysis result callback for task: ${taskId}`);

  try {
    const savedResult = await analysisService.processAnalysisResult(taskId, result);

    res.json({
      success: true,
      message: '분석 결과가 성공적으로 처리되었습니다.',
      mongoId: savedResult._id,
    });

  } catch (error) {
    console.error('❌ Analysis result processing failed:', error);
    
    Sentry.withScope((scope) => {
      scope.setTag('analysis_result_processing_failed', true);
      scope.setContext('analysis_result_processing', { taskId });
      Sentry.captureException(error);
    });

    throw new ExternalServiceError('분석 결과 처리 중 오류가 발생했습니다.');
  }
}));

module.exports = router;