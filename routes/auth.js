const express = require('express');
const { body, validationResult } = require('express-validator');
const AuthService = require('../services/authService');
const { authenticateToken, authorize } = require('../middleware/auth');
const { loginLimiter, registerLimiter, checkBlockedIPs } = require('../middleware/rateLimiter');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: 사용자 인증 관련 API
 */

// 입력 검증 규칙
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('비밀번호 확인이 일치하지 않습니다.');
      }
      return true;
    }),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('유효하지 않은 역할입니다.')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요.'),
  body('password')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요.')
];

// 검증 오류 처리 미들웨어
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: '입력 데이터가 유효하지 않습니다.',
      details: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 회원가입
 *     description: 새로운 사용자 계정을 생성합니다.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 사용자 이메일
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: 비밀번호 (대문자, 소문자, 숫자, 특수문자 포함)
 *                 example: Password123!
 *               confirmPassword:
 *                 type: string
 *                 description: 비밀번호 확인
 *                 example: Password123!
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *                 description: 사용자 역할
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AuthResponse'
 *                 message:
 *                   type: string
 *                   example: 회원가입이 완료되었습니다.
 *       400:
 *         description: 입력 데이터 검증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: 이메일 중복
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
// 회원가입
router.post('/register', 
  checkBlockedIPs,
  registerLimiter,
  registerValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password, role } = req.body;
      
      const result = await AuthService.register({
        email,
        password,
        role
      });

      res.status(201).json({
        success: true,
        data: result,
        message: '회원가입이 완료되었습니다.'
      });

    } catch (error) {
      console.error('❌ 회원가입 오류:', error);
      
      // 중복 이메일 오류
      if (error.message.includes('이미 존재하는')) {
        return res.status(409).json({
          success: false,
          error: 'EMAIL_ALREADY_EXISTS',
          message: error.message
        });
      }
      
      // 비밀번호 검증 오류
      if (error.message.includes('비밀번호는')) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_PASSWORD',
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'REGISTRATION_FAILED',
        message: '회원가입 처리 중 오류가 발생했습니다.'
      });
    }
  }
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인
 *     description: 사용자 인증을 수행하고 JWT 토큰을 발급합니다.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 사용자 이메일
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     accessToken:
 *                       type: string
 *                       description: JWT 액세스 토큰
 *                     tokenType:
 *                       type: string
 *                       example: Bearer
 *                     expiresIn:
 *                       type: integer
 *                       description: 토큰 만료 시간 (초)
 *                       example: 3600
 *                 message:
 *                   type: string
 *                   example: 로그인 성공
 *       401:
 *         description: 인증 실패
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
// 로그인
router.post('/login',
  checkBlockedIPs,
  loginLimiter,
  loginValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const result = await AuthService.login({
        email,
        password
      });

      // Refresh Token을 HttpOnly 쿠키로 설정
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
      });

      // Access Token은 응답 본문으로 전송
      res.json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
          tokenType: result.tokens.tokenType,
          expiresIn: result.tokens.expiresIn
        },
        message: result.message
      });

    } catch (error) {
      console.error('❌ 로그인 오류:', error);
      
      // 로그인 실패 (인증 오류)
      if (error.message.includes('이메일 또는 비밀번호') ||
          error.message.includes('비활성화된') ||
          error.message.includes('로그인 시도 횟수')) {
        return res.status(401).json({
          success: false,
          error: 'AUTHENTICATION_FAILED',
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'LOGIN_FAILED',
        message: '로그인 처리 중 오류가 발생했습니다.'
      });
    }
  }
);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: 토큰 갱신
 *     description: Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.
 *     tags: [Authentication]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh Token (쿠키로도 전송 가능)
 *     responses:
 *       200:
 *         description: 토큰 갱신 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     accessToken:
 *                       type: string
 *                       description: 새로운 JWT 액세스 토큰
 *                     tokenType:
 *                       type: string
 *                       example: Bearer
 *                     expiresIn:
 *                       type: integer
 *                       example: 3600
 *                 message:
 *                   type: string
 *                   example: 토큰 갱신 성공
 *       401:
 *         description: 유효하지 않은 Refresh Token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// 토큰 갱신
router.post('/refresh', async (req, res) => {
  try {
    // 쿠키에서 Refresh Token 가져오기
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'REFRESH_TOKEN_REQUIRED',
        message: 'Refresh Token이 필요합니다.'
      });
    }

    const result = await AuthService.refreshToken(refreshToken);

    // 새로운 Refresh Token을 쿠키로 설정
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
    });

    res.json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
        tokenType: result.tokens.tokenType,
        expiresIn: result.tokens.expiresIn
      },
      message: result.message
    });

  } catch (error) {
    console.error('❌ 토큰 갱신 오류:', error);
    
    // Refresh Token 관련 오류
    if (error.message.includes('토큰') || error.message.includes('Token')) {
      // 쿠키 삭제
      res.clearCookie('refreshToken');
      
      return res.status(401).json({
        success: false,
        error: 'INVALID_REFRESH_TOKEN',
        message: '유효하지 않은 Refresh Token입니다. 다시 로그인해주세요.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'TOKEN_REFRESH_FAILED',
      message: '토큰 갱신 중 오류가 발생했습니다.'
    });
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 로그아웃
 *     description: 현재 세션을 종료합니다.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 로그아웃 성공
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
 *                   example: 로그아웃되었습니다.
 */
// 로그아웃
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    await AuthService.logout(req.user.id, refreshToken);
    
    // 쿠키 삭제
    res.clearCookie('refreshToken');
    
    res.json({
      success: true,
      message: '로그아웃되었습니다.'
    });

  } catch (error) {
    console.error('❌ 로그아웃 오류:', error);
    
    // 쿠키 삭제 (오류가 있어도)
    res.clearCookie('refreshToken');
    
    res.json({
      success: true,
      message: '로그아웃되었습니다.'
    });
  }
});

// 모든 세션 로그아웃
router.post('/logout-all', authenticateToken, async (req, res) => {
  try {
    await AuthService.logoutAll(req.user.id);
    
    // 쿠키 삭제
    res.clearCookie('refreshToken');
    
    res.json({
      success: true,
      message: '모든 세션에서 로그아웃되었습니다.'
    });

  } catch (error) {
    console.error('❌ 전체 로그아웃 오류:', error);
    
    res.clearCookie('refreshToken');
    
    res.json({
      success: true,
      message: '모든 세션에서 로그아웃되었습니다.'
    });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: 현재 사용자 정보 조회
 *     description: 인증된 사용자의 정보를 조회합니다.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// 현재 사용자 정보 조회
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.toSafeObject()
    }
  });
});

// 비밀번호 변경
router.put('/change-password',
  authenticateToken,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('현재 비밀번호를 입력해주세요.'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('새 비밀번호는 최소 8자 이상이어야 합니다.')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('새 비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.'),
    body('confirmNewPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('새 비밀번호 확인이 일치하지 않습니다.');
        }
        return true;
      })
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      // 현재 비밀번호 검증은 실제 구현에서 추가
      // 여기서는 기본 응답만 제공
      
      res.json({
        success: true,
        message: '비밀번호가 변경되었습니다.'
      });

    } catch (error) {
      console.error('❌ 비밀번호 변경 오류:', error);
      
      res.status(500).json({
        success: false,
        error: 'PASSWORD_CHANGE_FAILED',
        message: '비밀번호 변경 중 오류가 발생했습니다.'
      });
    }
  }
);

// 관리자 전용 엔드포인트 예시
router.get('/admin/users', 
  authenticateToken, 
  authorize(['admin']), 
  async (req, res) => {
    try {
      // 실제 구현에서는 사용자 목록 조회
      res.json({
        success: true,
        data: {
          users: [],
          total: 0
        },
        message: '사용자 목록 조회 성공'
      });

    } catch (error) {
      console.error('❌ 사용자 목록 조회 오류:', error);
      
      res.status(500).json({
        success: false,
        error: 'USER_LIST_FAILED',
        message: '사용자 목록 조회 중 오류가 발생했습니다.'
      });
    }
  }
);

module.exports = router;