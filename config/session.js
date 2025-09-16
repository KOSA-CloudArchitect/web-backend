const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redisService = require('../services/redisService');
const logger = require('./logger');

/**
 * 세션 설정 생성
 */
function createSessionConfig() {
  const sessionConfig = {
    name: process.env.SESSION_NAME || 'kosa.sid',
    secret: process.env.SESSION_SECRET || 'your-super-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    rolling: true, // 요청마다 세션 만료 시간 갱신
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS에서만 쿠키 전송
      httpOnly: true, // XSS 방지
      maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000, // 24시간
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
    }
  };

  // Redis가 연결되어 있으면 Redis Store 사용
  if (redisService.isReady()) {
    sessionConfig.store = new RedisStore({
      client: redisService.client,
      prefix: 'sess:',
      ttl: Math.floor(sessionConfig.cookie.maxAge / 1000), // 초 단위로 변환
      disableTouch: false, // 세션 터치 활성화
      disableTTL: false
    });
    
    logger.info('✅ Redis 세션 스토어 설정 완료');
  } else {
    logger.warn('⚠️ Redis 연결 없음 - 메모리 세션 스토어 사용');
  }

  return sessionConfig;
}

/**
 * 세션 미들웨어 생성
 */
function createSessionMiddleware() {
  const config = createSessionConfig();
  return session(config);
}

/**
 * 세션 정보 조회 헬퍼
 */
function getSessionInfo(req) {
  if (!req.session) {
    return null;
  }

  return {
    id: req.sessionID,
    userId: req.session.userId,
    isAuthenticated: !!req.session.userId,
    createdAt: req.session.createdAt,
    lastAccess: req.session.lastAccess,
    maxAge: req.session.cookie.maxAge,
    expires: req.session.cookie.expires
  };
}

/**
 * 세션 생성 헬퍼
 */
function createUserSession(req, user) {
  if (!req.session) {
    throw new Error('세션이 초기화되지 않음');
  }

  req.session.userId = user.id;
  req.session.userEmail = user.email;
  req.session.userRole = user.role;
  req.session.createdAt = new Date().toISOString();
  req.session.lastAccess = new Date().toISOString();

  logger.info(`사용자 세션 생성: ${user.id} (${user.email})`);
  
  return getSessionInfo(req);
}

/**
 * 세션 업데이트 헬퍼
 */
function updateSessionAccess(req) {
  if (req.session && req.session.userId) {
    req.session.lastAccess = new Date().toISOString();
  }
}

/**
 * 세션 삭제 헬퍼
 */
function destroyUserSession(req) {
  return new Promise((resolve, reject) => {
    if (!req.session) {
      return resolve();
    }

    const userId = req.session.userId;
    
    req.session.destroy((err) => {
      if (err) {
        logger.error(`세션 삭제 실패: ${userId}`, err);
        return reject(err);
      }
      
      logger.info(`사용자 세션 삭제: ${userId}`);
      resolve();
    });
  });
}

/**
 * 세션 검증 미들웨어
 */
function requireSession(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      error: 'SESSION_REQUIRED',
      message: '로그인이 필요합니다.'
    });
  }

  // 세션 접근 시간 업데이트
  updateSessionAccess(req);
  next();
}

/**
 * 세션 통계 조회
 */
async function getSessionStats() {
  try {
    if (!redisService.isReady()) {
      return {
        store: 'memory',
        activeSessions: 'unknown'
      };
    }

    const keys = await redisService.client.keys('sess:*');
    
    return {
      store: 'redis',
      activeSessions: keys.length,
      storeStatus: 'connected'
    };
  } catch (error) {
    logger.error('세션 통계 조회 실패:', error);
    return {
      store: 'redis',
      activeSessions: 'error',
      storeStatus: 'error',
      error: error.message
    };
  }
}

/**
 * 모든 사용자 세션 삭제 (관리자용)
 */
async function destroyAllUserSessions(userId) {
  try {
    if (!redisService.isReady()) {
      logger.warn('Redis 연결 없음 - 세션 삭제 불가');
      return false;
    }

    // 해당 사용자의 모든 세션 키 찾기
    const allSessionKeys = await redisService.client.keys('sess:*');
    let deletedCount = 0;

    for (const key of allSessionKeys) {
      try {
        const sessionData = await redisService.client.get(key);
        if (sessionData) {
          const session = JSON.parse(sessionData);
          if (session.userId === userId) {
            await redisService.client.del(key);
            deletedCount++;
          }
        }
      } catch (parseError) {
        // 개별 세션 파싱 오류는 무시
        continue;
      }
    }

    logger.info(`사용자 ${userId}의 ${deletedCount}개 세션 삭제`);
    return deletedCount;
  } catch (error) {
    logger.error(`사용자 세션 삭제 실패 [${userId}]:`, error);
    return false;
  }
}

/**
 * 만료된 세션 정리 (관리자용)
 */
async function cleanupExpiredSessions() {
  try {
    if (!redisService.isReady()) {
      return 0;
    }

    const allSessionKeys = await redisService.client.keys('sess:*');
    let cleanedCount = 0;
    const now = Date.now();

    for (const key of allSessionKeys) {
      try {
        const ttl = await redisService.client.ttl(key);
        if (ttl === -1) { // TTL이 설정되지 않은 세션
          await redisService.client.del(key);
          cleanedCount++;
        }
      } catch (error) {
        continue;
      }
    }

    if (cleanedCount > 0) {
      logger.info(`만료된 세션 ${cleanedCount}개 정리 완료`);
    }
    
    return cleanedCount;
  } catch (error) {
    logger.error('만료된 세션 정리 실패:', error);
    return 0;
  }
}

module.exports = {
  createSessionConfig,
  createSessionMiddleware,
  getSessionInfo,
  createUserSession,
  updateSessionAccess,
  destroyUserSession,
  requireSession,
  getSessionStats,
  destroyAllUserSessions,
  cleanupExpiredSessions
};