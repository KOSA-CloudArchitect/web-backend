const express = require('express');
const router = express.Router();
const InterestProduct = require('../models/interestProduct');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { body, param, query } = require('express-validator');

// 분석 관련 라우트 추가
const interestAnalysisRouter = require('./interestAnalysis');
router.use('/', interestAnalysisRouter);

// JWT 인증 미들웨어 적용
router.use(authenticateToken);

/**
 * @route POST /api/interests
 * @desc 관심 상품 등록
 * @access Private
 */
router.post('/',
  [
    body('productUrl')
      .isURL()
      .withMessage('유효한 상품 URL을 입력해주세요.')
      .matches(/coupang\.com/)
      .withMessage('쿠팡 상품 URL만 지원됩니다.'),
    body('priceAlert')
      .optional()
      .isBoolean()
      .withMessage('가격 알림 설정은 true 또는 false여야 합니다.'),
    body('targetPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('목표 가격은 0 이상의 숫자여야 합니다.'),
    body('analysisFrequency')
      .optional()
      .isIn(['daily', 'weekly', 'monthly'])
      .withMessage('분석 주기는 daily, weekly, monthly 중 하나여야 합니다.')
  ],
  validateRequest,
  async (req, res) => {
    try {
      console.log('🟢 관심 상품 등록 API 호출 시작');
      console.log('🟢 요청 바디:', req.body);
      console.log('🟢 사용자 ID:', req.user?.id);
      
      const { productUrl, priceAlert, targetPrice, analysisFrequency } = req.body;
      const userId = req.user.id;

      const watchItem = await InterestProduct.register(userId, productUrl, {
        priceAlert,
        targetPrice,
        analysisFrequency
      });

      console.log('🟢 관심 상품 등록 성공:', watchItem);

      res.status(201).json({
        success: true,
        message: '관심 상품이 등록되었습니다.',
        data: watchItem
      });
    } catch (error) {
      console.error('🔴 관심 상품 등록 오류:', error);
      console.error('🔴 오류 메시지:', error.message);
      console.error('🔴 오류 스택:', error.stack);
      
      if (error.message.includes('이미 관심 상품으로 등록된')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: '관심 상품 등록 중 오류가 발생했습니다.'
      });
    }
  }
);

/**
 * @route GET /api/interests
 * @desc 사용자의 관심 상품 목록 조회
 * @access Private
 */
router.get('/',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('페이지는 1 이상의 정수여야 합니다.'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('한 페이지당 항목 수는 1~100 사이여야 합니다.'),
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'updatedAt', 'name'])
      .withMessage('정렬 기준은 createdAt, updatedAt, name 중 하나여야 합니다.'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('정렬 순서는 asc 또는 desc여야 합니다.')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const {
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const result = await InterestProduct.getByUserId(userId, {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
      });

      res.json({
        success: true,
        data: result.items,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('관심 상품 목록 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '관심 상품 목록 조회 중 오류가 발생했습니다.'
      });
    }
  }
);

/**
 * @route DELETE /api/interests/:id
 * @desc 관심 상품 삭제
 * @access Private
 */
router.delete('/:id',
  [
    param('id')
      .isString()
      .notEmpty()
      .withMessage('관심 상품 ID가 필요합니다.')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const watchItemId = req.params.id;

      const deletedItem = await InterestProduct.remove(userId, watchItemId);

      res.json({
        success: true,
        message: '관심 상품이 삭제되었습니다.',
        data: deletedItem
      });
    } catch (error) {
      console.error('관심 상품 삭제 오류:', error);
      
      if (error.message.includes('찾을 수 없습니다')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: '관심 상품 삭제 중 오류가 발생했습니다.'
      });
    }
  }
);

/**
 * @route PUT /api/interests/:id
 * @desc 관심 상품 설정 업데이트
 * @access Private
 */
router.put('/:id',
  [
    param('id')
      .isString()
      .notEmpty()
      .withMessage('관심 상품 ID가 필요합니다.'),
    body('priceAlert')
      .optional()
      .isBoolean()
      .withMessage('가격 알림 설정은 true 또는 false여야 합니다.'),
    body('targetPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('목표 가격은 0 이상의 숫자여야 합니다.'),
    body('analysisFrequency')
      .optional()
      .isIn(['daily', 'weekly', 'monthly'])
      .withMessage('분석 주기는 daily, weekly, monthly 중 하나여야 합니다.')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const watchItemId = req.params.id;
      const updateData = req.body;

      const updatedItem = await InterestProduct.updateSettings(userId, watchItemId, updateData);

      res.json({
        success: true,
        message: '관심 상품 설정이 업데이트되었습니다.',
        data: updatedItem
      });
    } catch (error) {
      console.error('관심 상품 설정 업데이트 오류:', error);
      
      if (error.message.includes('찾을 수 없습니다')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('유효한 데이터가 없습니다')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: '관심 상품 설정 업데이트 중 오류가 발생했습니다.'
      });
    }
  }
);

/**
 * @route GET /api/interests/compare
 * @desc 관심 상품 비교 데이터 조회
 * @access Private
 */
router.get('/compare',
  [
    query('ids')
      .isString()
      .notEmpty()
      .withMessage('비교할 관심 상품 ID들이 필요합니다.')
      .custom((value) => {
        const ids = value.split(',');
        if (ids.length < 2) {
          throw new Error('최소 2개 이상의 상품을 선택해주세요.');
        }
        if (ids.length > 5) {
          throw new Error('최대 5개까지 비교할 수 있습니다.');
        }
        return true;
      })
  ],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const watchItemIds = req.query.ids.split(',').map(id => id.trim());

      const comparisonData = await InterestProduct.getComparisonData(userId, watchItemIds);

      res.json({
        success: true,
        data: comparisonData
      });
    } catch (error) {
      console.error('관심 상품 비교 데이터 조회 오류:', error);
      
      if (error.message.includes('찾을 수 없습니다') || 
          error.message.includes('선택해주세요') ||
          error.message.includes('비교할 수 있습니다')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: '관심 상품 비교 데이터 조회 중 오류가 발생했습니다.'
      });
    }
  }
);

/**
 * @route POST /api/interests/bulk-register
 * @desc 여러 관심 상품 일괄 등록
 * @access Private
 */
router.post('/bulk-register',
  [
    body('products')
      .isArray({ min: 1, max: 10 })
      .withMessage('1~10개의 상품을 등록할 수 있습니다.'),
    body('products.*.productUrl')
      .isURL()
      .withMessage('유효한 상품 URL을 입력해주세요.')
      .matches(/coupang\.com/)
      .withMessage('쿠팡 상품 URL만 지원됩니다.'),
    body('products.*.priceAlert')
      .optional()
      .isBoolean(),
    body('products.*.targetPrice')
      .optional()
      .isFloat({ min: 0 }),
    body('products.*.analysisFrequency')
      .optional()
      .isIn(['daily', 'weekly', 'monthly'])
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { products } = req.body;
      const userId = req.user.id;

      const results = [];
      const errors = [];

      for (let i = 0; i < products.length; i++) {
        try {
          const product = products[i];
          const watchItem = await InterestProduct.register(userId, product.productUrl, {
            priceAlert: product.priceAlert,
            targetPrice: product.targetPrice,
            analysisFrequency: product.analysisFrequency
          });
          results.push(watchItem);
        } catch (error) {
          errors.push({
            index: i,
            productUrl: products[i].productUrl,
            error: error.message
          });
        }
      }

      res.status(201).json({
        success: true,
        message: `${results.length}개의 관심 상품이 등록되었습니다.`,
        data: {
          registered: results,
          errors: errors
        }
      });
    } catch (error) {
      console.error('관심 상품 일괄 등록 오류:', error);
      res.status(500).json({
        success: false,
        message: '관심 상품 일괄 등록 중 오류가 발생했습니다.'
      });
    }
  }
);

module.exports = router;