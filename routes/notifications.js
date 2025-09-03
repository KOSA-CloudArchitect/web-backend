const express = require('express');
const { body, query, validationResult } = require('express-validator');
const notificationService = require('../services/notificationService');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * 사용자 알림 설정 조회
 */
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const settings = await notificationService.getUserNotificationSettings(req.user.id);
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    logger.error('Error getting notification settings:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: '알림 설정을 조회하는 중 오류가 발생했습니다.'
    });
  }
});

/**
 * 사용자 알림 설정 업데이트
 */
router.put('/settings', [
  authenticateToken,
  body('emailEnabled').optional().isBoolean(),
  body('pushEnabled').optional().isBoolean(),
  body('webEnabled').optional().isBoolean(),
  body('priceDropEnabled').optional().isBoolean(),
  body('reviewChangeEnabled').optional().isBoolean(),
  body('analysisCompleteEnabled').optional().isBoolean(),
  body('priceDropThreshold').optional().isFloat({ min: 0, max: 100 }),
  body('reviewChangeThreshold').optional().isFloat({ min: 0, max: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: errors.array()
      });
    }

    const settingsData = {};
    const allowedFields = [
      'emailEnabled',
      'pushEnabled', 
      'webEnabled',
      'priceDropEnabled',
      'reviewChangeEnabled',
      'analysisCompleteEnabled',
      'priceDropThreshold',
      'reviewChangeThreshold'
    ];

    // 허용된 필드만 추출
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        settingsData[field] = req.body[field];
      }
    });

    const settings = await notificationService.updateUserNotificationSettings(
      req.user.id,
      settingsData
    );

    res.json({
      success: true,
      data: settings,
      message: '알림 설정이 업데이트되었습니다.'
    });
  } catch (error) {
    logger.error('Error updating notification settings:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: '알림 설정을 업데이트하는 중 오류가 발생했습니다.'
    });
  }
});

/**
 * 알림 기록 조회
 */
router.get('/logs', [
  authenticateToken,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('type').optional().isIn(['PRICE_DROP', 'REVIEW_CHANGE', 'ANALYSIS_COMPLETE']),
  query('channel').optional().isIn(['EMAIL', 'PUSH', 'WEB'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: errors.array()
      });
    }

    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      type: req.query.type,
      channel: req.query.channel
    };

    const result = await notificationService.getNotificationLogs(req.user.id, options);

    res.json({
      success: true,
      data: result.logs,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error('Error getting notification logs:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: '알림 기록을 조회하는 중 오류가 발생했습니다.'
    });
  }
});

/**
 * 테스트 알림 전송
 */
router.post('/test', [
  authenticateToken,
  body('type').isIn(['PRICE_DROP', 'REVIEW_CHANGE', 'ANALYSIS_COMPLETE']),
  body('channel').optional().isIn(['EMAIL', 'PUSH', 'WEB'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: errors.array()
      });
    }

    const { type, channel } = req.body;
    const userId = req.user.id;

    // 테스트 데이터 생성
    const testProductData = {
      id: 'test-product-id',
      name: '테스트 상품',
      url: 'https://example.com/test-product'
    };

    let testData;
    switch (type) {
      case 'PRICE_DROP':
        testData = {
          oldPrice: 100000,
          newPrice: 80000,
          changePercentage: 20
        };
        await notificationService.sendPriceDropNotification(userId, testProductData, testData);
        break;
      
      case 'REVIEW_CHANGE':
        testData = {
          oldRating: 4.0,
          newRating: 4.5,
          oldReviewCount: 100,
          newReviewCount: 120
        };
        await notificationService.sendReviewChangeNotification(userId, testProductData, testData);
        break;
      
      case 'ANALYSIS_COMPLETE':
        testData = {
          id: 'test-analysis-id',
          totalReviews: 150,
          sentimentPositive: 60,
          sentimentNegative: 20,
          sentimentNeutral: 20
        };
        await notificationService.sendAnalysisCompleteNotification(userId, testProductData, testData);
        break;
    }

    res.json({
      success: true,
      message: `테스트 알림이 전송되었습니다. (타입: ${type})`
    });
  } catch (error) {
    logger.error('Error sending test notification:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: '테스트 알림 전송 중 오류가 발생했습니다.'
    });
  }
});

/**
 * 알림 통계 조회
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const stats = await prisma.notificationLog.groupBy({
      by: ['type', 'channel', 'status'],
      where: {
        userId: req.user.id,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 최근 30일
        }
      },
      _count: {
        id: true
      }
    });

    // 통계 데이터 가공
    const processedStats = {
      byType: {},
      byChannel: {},
      byStatus: {},
      total: 0
    };

    stats.forEach(stat => {
      const count = stat._count.id;
      processedStats.total += count;

      if (!processedStats.byType[stat.type]) {
        processedStats.byType[stat.type] = 0;
      }
      processedStats.byType[stat.type] += count;

      if (!processedStats.byChannel[stat.channel]) {
        processedStats.byChannel[stat.channel] = 0;
      }
      processedStats.byChannel[stat.channel] += count;

      if (!processedStats.byStatus[stat.status]) {
        processedStats.byStatus[stat.status] = 0;
      }
      processedStats.byStatus[stat.status] += count;
    });

    res.json({
      success: true,
      data: processedStats
    });
  } catch (error) {
    logger.error('Error getting notification stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: '알림 통계를 조회하는 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;