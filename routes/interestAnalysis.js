const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const { kafkaProducer } = require('../services/kafkaService');

const prisma = new PrismaClient();

// 관심 상품 분석 데이터 조회
router.get('/:interestId/analysis', authenticateToken, async (req, res) => {
  try {
    const { interestId } = req.params;
    const userId = req.user.id;

    // 관심 상품이 현재 사용자의 것인지 확인
    const interest = await prisma.interestProduct.findFirst({
      where: {
        id: interestId,
        userId: userId,
        isActive: true
      }
    });

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: '관심 상품을 찾을 수 없습니다.'
      });
    }

    // 분석 데이터 조회
    const analysisData = await prisma.interestAnalysis.findFirst({
      where: {
        interestId: interestId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!analysisData) {
      return res.status(404).json({
        success: false,
        message: '분석 데이터가 없습니다.'
      });
    }

    // 감정 추이 데이터 조회
    const sentimentTrend = await prisma.sentimentTrend.findMany({
      where: {
        analysisId: analysisData.id
      },
      orderBy: {
        date: 'asc'
      }
    });

    // 가격 히스토리 데이터 조회
    const priceHistory = await prisma.priceHistory.findMany({
      where: {
        productId: interest.productId
      },
      orderBy: {
        date: 'asc'
      },
      take: 30 // 최근 30일
    });

    const response = {
      id: analysisData.id,
      interestId: analysisData.interestId,
      productId: interest.productId,
      sentiment: {
        positive: analysisData.positiveCount || 0,
        negative: analysisData.negativeCount || 0,
        neutral: analysisData.neutralCount || 0
      },
      summary: analysisData.summary || '',
      keywords: analysisData.keywords ? JSON.parse(analysisData.keywords) : [],
      totalReviews: analysisData.totalReviews || 0,
      ratingDistribution: analysisData.ratingDistribution ? JSON.parse(analysisData.ratingDistribution) : {},
      sentimentTrend: sentimentTrend.map(trend => ({
        date: trend.date.toISOString(),
        positive: trend.positiveCount || 0,
        negative: trend.negativeCount || 0,
        neutral: trend.neutralCount || 0
      })),
      priceHistory: priceHistory.map(price => ({
        date: price.date.toISOString(),
        price: price.price
      })),
      createdAt: analysisData.createdAt.toISOString(),
      updatedAt: analysisData.updatedAt.toISOString()
    };

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Error fetching interest analysis:', error);
    res.status(500).json({
      success: false,
      message: '분석 데이터 조회 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// 관심 상품 분석 요청
router.post('/:interestId/analysis', authenticateToken, async (req, res) => {
  try {
    const { interestId } = req.params;
    const userId = req.user.id;

    // 관심 상품이 현재 사용자의 것인지 확인
    const interest = await prisma.interestProduct.findFirst({
      where: {
        id: interestId,
        userId: userId,
        isActive: true
      }
    });

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: '관심 상품을 찾을 수 없습니다.'
      });
    }

    // 이미 진행 중인 분석이 있는지 확인
    const existingRequest = await prisma.analysisRequest.findFirst({
      where: {
        productId: interest.productId,
        status: {
          in: ['PENDING', 'PROCESSING']
        }
      }
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: '이미 분석이 진행 중입니다.',
        taskId: existingRequest.taskId
      });
    }

    // 새로운 분석 요청 생성
    const taskId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const analysisRequest = await prisma.analysisRequest.create({
      data: {
        taskId: taskId,
        productId: interest.productId,
        productUrl: interest.productUrl,
        requestType: 'INTEREST_ANALYSIS',
        status: 'PENDING',
        userId: userId,
        metadata: JSON.stringify({
          interestId: interestId,
          productName: interest.productName
        })
      }
    });

    // Kafka로 분석 요청 메시지 전송
    try {
      await kafkaProducer.send({
        topic: 'analysis-requests',
        messages: [{
          key: taskId,
          value: JSON.stringify({
            taskId: taskId,
            type: 'INTEREST_ANALYSIS',
            productId: interest.productId,
            productUrl: interest.productUrl,
            productName: interest.productName,
            interestId: interestId,
            userId: userId,
            timestamp: new Date().toISOString()
          })
        }]
      });

      console.log(`Analysis request sent to Kafka: ${taskId}`);
    } catch (kafkaError) {
      console.error('Failed to send message to Kafka:', kafkaError);
      
      // Kafka 전송 실패 시 요청 상태를 FAILED로 업데이트
      await prisma.analysisRequest.update({
        where: { id: analysisRequest.id },
        data: { 
          status: 'FAILED',
          errorMessage: 'Failed to send request to analysis pipeline'
        }
      });

      return res.status(500).json({
        success: false,
        message: '분석 요청 전송에 실패했습니다.'
      });
    }

    res.json({
      success: true,
      taskId: taskId,
      message: '분석 요청이 성공적으로 전송되었습니다.',
      estimatedTime: 120 // 예상 완료 시간 (초)
    });

  } catch (error) {
    console.error('Error requesting interest analysis:', error);
    res.status(500).json({
      success: false,
      message: '분석 요청 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

module.exports = router;