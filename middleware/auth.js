const User = require('../models/user');
const { getPool } = require('../config/database');

// JWT 토큰 검증 미들웨어
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_REQUIRED',
        message: '인증 토큰이 필요합니다.'
      });
    }

    // 토큰 검증
    const decoded = User.verifyAccessToken(token);
    
    // 사용자 정보 조회 (DB 연결이 있는 경우)
    try {
      const pool = getPool();
      const result = await pool.query(
        'SELECT id, email, role, is_active FROM users WHERE id = $1',
        [decoded.id]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'USER_NOT_FOUND',
          message: '사용자를 찾을 수 없습니다.'
        });
      }

      const userData = result.rows[0];
      
      if (!userData.is_active) {
        return res.status(401).json({
          success: false,
          error: 'ACCOUNT_DISABLED',
          message: '비활성화된 계정입니다.'
        });
      }

      req.user = new User({
        id: userData.id,
        email: userData.email,
        role: userData.role,
        isActive: userData.is_active
      });

    } catch (dbError) {
      console.warn('⚠️  DB 연결 없음, 토큰 정보만 사용:', dbError.message);
      // DB 연결이 없는 경우 토큰의 정보만 사용
      req.user = new User({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      });
    }

    next();

  } catch (error) {
    console.error('❌ 토큰 검증 실패:', error);
    
    if (error.message.includes('expired')) {
      return res.status(401).json({
        success: false,
        error: 'TOKEN_EXPIRED',
        message: '토큰이 만료되었습니다. 다시 로그인해주세요.'
      });
    }

    return res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: '유효하지 않은 토큰입니다.'
    });
  }
};

// 권한 확인 미들웨어
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_REQUIRED',
        message: '인증이 필요합니다.'
      });
    }

    // roles가 배열이 아닌 경우 배열로 변환
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    // 역할이 지정되지 않은 경우 모든 인증된 사용자 허용
    if (allowedRoles.length === 0) {
      return next();
    }

    // 사용자 역할 확인
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'INSUFFICIENT_PERMISSIONS',
        message: '권한이 부족합니다.'
      });
    }

    next();
  };
};

// 선택적 인증 미들웨어 (토큰이 있으면 검증, 없어도 통과)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    // 토큰이 있는 경우 검증
    const decoded = User.verifyAccessToken(token);
    
    try {
      const pool = getPool();
      const result = await pool.query(
        'SELECT id, email, role, is_active FROM users WHERE id = $1',
        [decoded.id]
      );

      if (result.rows.length > 0 && result.rows[0].is_active) {
        const userData = result.rows[0];
        req.user = new User({
          id: userData.id,
          email: userData.email,
          role: userData.role,
          isActive: userData.is_active
        });
      } else {
        req.user = null;
      }
    } catch (dbError) {
      console.warn('⚠️  DB 연결 없음, 토큰 정보만 사용:', dbError.message);
      req.user = new User({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      });
    }

    next();

  } catch (error) {
    // 토큰이 유효하지 않은 경우에도 통과 (선택적 인증)
    req.user = null;
    next();
  }
};

module.exports = {
  authenticateToken,
  authorize,
  optionalAuth
};