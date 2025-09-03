const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const prisma = new PrismaClient();

// 분석 상태 조회
router.get('/:taskId', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    // 분석 요청 조회 (사용자 권한 확인 포함)
    const analysisRequest = await prisma.analysisRequest.findFirst({
      where: {
        taskId: taskId,
        userId: userId
      }
    });

    if (!analysisRequest) {
      return res.status(404).json({
        success: false,
        message: '분석 요청을 찾을 수 없습니다.'
      });
    }

    // 상태에 따른 진행률 계산
    let progress = 0;
    let currentStep = '';

    switch (analysisRequest.status) {
      case 'PENDING':
        progress = 0;
        currentStep = '분석 대기 중...';
        break;
      case 'PROCESSING':
        progress = 50; // 기본값, 실제로는 더 세밀한 진행률 추적 필요
        currentStep = '리뷰 데이터 분석 중...';
        break;
      case 'COMPLETED':
        progress = 100;
        currentStep = '분석 완료';
        break;
      case 'FAILED':
        progress = 0;
        currentStep = '분석 실패';
        break;
      default:
        progress = 0;
        currentStep = '알 수 없는 상태';
    }

    const response = {
      status: analysisRequest.status.toLowerCase(),
      progress: progress,
      currentStep: currentStep,
      estimatedTime: analysisRequest.estimatedTime,
      error: analysisRequest.errorMessage
    };

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Error fetching analysis status:', error);
    res.status(500).json({
      success: false,
      message: '분석 상태 조회 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

module.exports = router;