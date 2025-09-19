const express = require('express');
const { cacheService } = require('../services/cacheService');
const { getSessionStats } = require('../config/session');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cache
 *   description: 캐시 관리 API
 */

/**
 * @swagger
 * /api/cache/health:
 *   get:
 *     summary: 캐시 시스템 상태 확인
 *     description: Redis 캐시 시스템의 상태를 확인합니다.
 *     tags: [Cache]
 *     responses:
 *       200:
 *         description: 캐시 시스템 상태 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [healthy, unhealthy]
 *                 redis:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                     responseTime:
 *                       type: string
 *                     connected:
 *                       type: boolean
 *                 stats:
 *                   type: object
 *                   properties:
 *                     hits:
 *                       type: integer
 *                     misses:
 *                       type: integer
 *                     errors:
 *                       type: integer
 *       503:
 *         description: 캐시 시스템 비정상 상태
 */
router.get('/health', async (req, res) => {
  try {
    const health = await cacheService.healthCheck();
    
    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    console.error('캐시 헬스 체크 실패:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/cache/stats:
 *   get:
 *     summary: 캐시 통계 조회
 *     description: 캐시 히트율, 메모리 사용량 등 통계 정보를 조회합니다.
 *     tags: [Cache]
 *     responses:
 *       200:
 *         description: 캐시 통계 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cache:
 *                   type: object
 *                   properties:
 *                     hitRate:
 *                       type: string
 *                       description: 캐시 히트율
 *                     hits:
 *                       type: integer
 *                     misses:
 *                       type: integer
 *                     errors:
 *                       type: integer
 *                     connected:
 *                       type: boolean
 *                 session:
 *                   type: object
 *                   properties:
 *                     store:
 *                       type: string
 *                     activeSessions:
 *                       type: integer
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/stats', async (req, res) => {
  try {
    const [cacheStats, sessionStats] = await Promise.all([
      cacheService.getCacheStats(),
      getSessionStats()
    ]);

    res.json({
      cache: cacheStats,
      session: sessionStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('캐시 통계 조회 실패:', error);
    res.status(500).json({
      error: '캐시 통계 조회 실패',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/cache/hit-rate:
 *   get:
 *     summary: 캐시 히트율 조회
 *     description: 지정된 기간 동안의 캐시 히트율을 조회합니다.
 *     tags: [Cache]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *         description: 조회할 기간 (일)
 *     responses:
 *       200:
 *         description: 캐시 히트율 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: string
 *                 hitRate:
 *                   type: string
 *                 totalHits:
 *                   type: integer
 *                 totalMisses:
 *                   type: integer
 *                 totalRequests:
 *                   type: integer
 *                 errorRate:
 *                   type: string
 */
router.get('/hit-rate', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const hitRateStats = await cacheService.getCacheHitRate(parseInt(days));
    
    res.json(hitRateStats);
  } catch (error) {
    console.error('캐시 히트율 조회 실패:', error);
    res.status(500).json({
      error: '캐시 히트율 조회 실패',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/cache/invalidate/{productId}:
 *   delete:
 *     summary: 특정 상품 캐시 무효화
 *     description: 특정 상품의 모든 캐시를 무효화합니다.
 *     tags: [Cache]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 캐시 무효화 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 deletedCount:
 *                   type: integer
 *                 message:
 *                   type: string
 *       401:
 *         description: 인증 필요
 *       500:
 *         description: 서버 오류
 */
router.delete('/invalidate/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedCount = await cacheService.invalidateAnalysisCache(productId);
    
    res.json({
      success: true,
      deletedCount,
      message: `상품 ${productId}의 캐시 ${deletedCount}개가 무효화되었습니다.`
    });
  } catch (error) {
    console.error(`캐시 무효화 실패 [${req.params.productId}]:`, error);
    res.status(500).json({
      success: false,
      error: '캐시 무효화 실패',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/cache/invalidate/batch:
 *   delete:
 *     summary: 배치 캐시 무효화
 *     description: 여러 상품의 캐시를 한 번에 무효화합니다.
 *     tags: [Cache]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productIds
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 상품 ID 목록
 *                 example: ["product1", "product2", "product3"]
 *     responses:
 *       200:
 *         description: 배치 캐시 무효화 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 deletedCount:
 *                   type: integer
 *                 totalProducts:
 *                   type: integer
 *                 message:
 *                   type: string
 */
router.delete('/invalidate/batch', authenticateToken, async (req, res) => {
  try {
    const { productIds } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'productIds 배열이 필요합니다.'
      });
    }

    const deletedCount = await cacheService.batchInvalidateCache(productIds);
    
    res.json({
      success: true,
      deletedCount,
      totalProducts: productIds.length,
      message: `${productIds.length}개 상품의 캐시 ${deletedCount}개가 무효화되었습니다.`
    });
  } catch (error) {
    console.error('배치 캐시 무효화 실패:', error);
    res.status(500).json({
      success: false,
      error: '배치 캐시 무효화 실패',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/cache/warmup:
 *   post:
 *     summary: 캐시 워밍업
 *     description: 지정된 상품들의 캐시를 미리 로드합니다.
 *     tags: [Cache]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productIds
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 워밍업할 상품 ID 목록
 *                 example: ["product1", "product2", "product3"]
 *     responses:
 *       200:
 *         description: 캐시 워밍업 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 successCount:
 *                   type: integer
 *                 failureCount:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 message:
 *                   type: string
 */
router.post('/warmup', authenticateToken, async (req, res) => {
  try {
    const { productIds } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'productIds 배열이 필요합니다.'
      });
    }

    const result = await cacheService.warmupCache(productIds);
    
    res.json({
      success: true,
      ...result,
      message: `캐시 워밍업 완료: ${result.successCount}개 성공, ${result.failureCount}개 실패`
    });
  } catch (error) {
    console.error('캐시 워밍업 실패:', error);
    res.status(500).json({
      success: false,
      error: '캐시 워밍업 실패',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/cache/clear-search-history:
 *   delete:
 *     summary: 사용자 검색 기록 삭제
 *     description: 현재 로그인한 사용자의 검색 기록을 삭제합니다.
 *     tags: [Cache]
 *     responses:
 *       200:
 *         description: 검색 기록 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: 인증 필요
 */
router.delete('/clear-search-history', async (req, res) => {
  try {
    // 세션 확인
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        success: false,
        error: 'SESSION_REQUIRED',
        message: '로그인이 필요합니다.'
      });
    }

    const key = `user_search_history:${req.session.userId}`;
    const deleted = await cacheService.redis.del(key);
    
    res.json({
      success: true,
      message: '검색 기록이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('검색 기록 삭제 실패:', error);
    res.status(500).json({
      success: false,
      error: '검색 기록 삭제 실패',
      message: error.message
    });
  }
});

module.exports = router;