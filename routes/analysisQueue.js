const express = require('express');
const AnalysisQueueManager = require('../services/analysisQueueManager');
const router = express.Router();

const queueManager = new AnalysisQueueManager();

/**
 * 분석 요청 API
 * POST /api/analysis/request
 */
router.post('/request', async (req, res) => {
  try {
    const { product_id, type = 'realtime' } = req.body;
    const user_id = req.user?.id || 'anonymous'; // 인증 미들웨어에서 설정
    
    // 입력 검증
    if (!product_id) {
      return res.status(400).json({
        error: 'product_id is required'
      });
    }
    
    if (!['realtime', 'batch'].includes(type)) {
      return res.status(400).json({
        error: 'type must be either "realtime" or "batch"'
      });
    }
    
    // 분석 요청 처리
    const result = await queueManager.requestAnalysis(product_id, user_id, type);
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('분석 요청 API 오류:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * 분석 진행률 조회 API
 * GET /api/analysis/progress/:taskId
 */
router.get('/progress/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const progress = await queueManager.getAnalysisProgress(taskId);
    
    res.json({
      success: true,
      data: progress
    });
    
  } catch (error) {
    console.error('진행률 조회 API 오류:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * 대기열 상태 조회 API
 * GET /api/analysis/queue/:productId
 */
router.get('/queue/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    const queueStatus = await queueManager.getQueueStatus(productId);
    
    res.json({
      success: true,
      data: queueStatus
    });
    
  } catch (error) {
    console.error('대기열 상태 조회 API 오류:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * 분석 완료 콜백 API (내부 서버용)
 * POST /api/analysis/complete
 */
router.post('/complete', async (req, res) => {
  try {
    const { task_id, product_id, results, status = 'completed' } = req.body;
    
    // API 키 검증 (내부 서버만 호출 가능)
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.INTERNAL_API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (status === 'completed') {
      // 성공적으로 완료
      const nextTask = await queueManager.onAnalysisComplete(product_id, task_id, results);
      
      res.json({
        success: true,
        message: 'Analysis completed successfully',
        next_task: nextTask
      });
    } else {
      // 실패 처리
      await queueManager.onAnalysisComplete(product_id, task_id, null);
      
      res.json({
        success: true,
        message: 'Analysis failed, queue processed'
      });
    }
    
  } catch (error) {
    console.error('분석 완료 콜백 API 오류:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * 분석 취소 API (관리자용)
 * POST /api/analysis/cancel/:productId
 */
router.post('/cancel/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { reason = 'manual_cancel' } = req.body;
    
    // 관리자 권한 확인
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const cancelled = await queueManager.cancelAnalysis(productId, reason);
    
    if (cancelled) {
      res.json({
        success: true,
        message: 'Analysis cancelled successfully'
      });
    } else {
      res.status(404).json({
        error: 'No active analysis found for this product'
      });
    }
    
  } catch (error) {
    console.error('분석 취소 API 오류:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * 사용자별 분석 요청 이력 조회
 * GET /api/analysis/history
 */
router.get('/history', async (req, res) => {
  try {
    const user_id = req.user?.id;
    const { page = 1, limit = 10 } = req.query;
    
    if (!user_id) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // PostgreSQL에서 사용자 분석 이력 조회
    // const history = await prisma.analysisRequest.findMany({
    //   where: { user_id },
    //   orderBy: { created_at: 'desc' },
    //   take: parseInt(limit),
    //   skip: (parseInt(page) - 1) * parseInt(limit),
    //   include: {
    //     product: {
    //       select: { id: true, name: true, image_url: true }
    //     }
    //   }
    // });
    
    // 임시 응답
    const history = [];
    
    res.json({
      success: true,
      data: {
        history,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: history.length
        }
      }
    });
    
  } catch (error) {
    console.error('분석 이력 조회 API 오류:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;