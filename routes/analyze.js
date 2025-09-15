const express = require('express');
const { body, param, validationResult } = require('express-validator');
const httpClient = require('../services/httpClient');
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

const router = express.Router();

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
    const io = req.app.get('io');
    if (io) {
      io.emit(`analysis:${taskId}`, {
        status,
        result,
        error,
        timestamp: new Date().toISOString(),
      });
    }

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

module.exports = router;