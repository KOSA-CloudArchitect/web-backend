const Redis = require('ioredis');

// Redis 클라이언트 설정
let redisClient = null;

try {
  redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: process.env.REDIS_DB || 0,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true
  });

  redisClient.on('error', (err) => {
    console.warn('⚠️  Redis 연결 오류 (Rate Limiter가 메모리 모드로 동작):', err.message);
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis Rate Limiter 연결 성공');
  });
} catch (error) {
  console.warn('⚠️  Redis 초기화 실패, 메모리 기반 Rate Limiter 사용:', error.message);
}

// 메모리 기반 Rate Limiter (Redis 없을 때 사용)
const memoryStore = new Map();

// Rate Limiter 설정
const rateLimiterConfig = {
  // 로그인 시도 제한
  login: {
    windowMs: 15 * 60 * 1000, // 15분
    maxAttempts: 5, // 최대 5회 시도
    blockDuration: 15 * 60 * 1000, // 15분 차단
    message: '로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요.'
  },
  
  // 회원가입 제한
  register: {
    windowMs: 60 * 60 * 1000, // 1시간
    maxAttempts: 3, // 최대 3회 시도
    blockDuration: 60 * 60 * 1000, // 1시간 차단
    message: '회원가입 시도 횟수를 초과했습니다. 1시간 후 다시 시도해주세요.'
  },
  
  // API 일반 요청 제한
  api: {
    windowMs: 60 * 1000, // 1분
    maxAttempts: 100, // 최대 100회 요청
    blockDuration: 60 * 1000, // 1분 차단
    message: 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.'
  },
  
  // 분석 요청 제한
  analysis: {
    windowMs: 60 * 1000, // 1분
    maxAttempts: 10, // 최대 10회 요청
    blockDuration: 5 * 60 * 1000, // 5분 차단
    message: '분석 요청 한도를 초과했습니다. 5분 후 다시 시도해주세요.'
  }
};

// Redis 기반 Rate Limiter
async function checkRateLimitRedis(key, config) {
  try {
    const current = await redisClient.incr(key);
    
    if (current === 1) {
      await redisClient.expire(key, Math.ceil(config.windowMs / 1000));
    }
    
    const ttl = await redisClient.ttl(key);
    
    return {
      current,
      remaining: Math.max(0, config.maxAttempts - current),
      resetTime: Date.now() + (ttl * 1000),
      blocked: current > config.maxAttempts
    };
  } catch (error) {
    console.error('❌ Redis Rate Limiter 오류:', error);
    throw error;
  }
}

// 메모리 기반 Rate Limiter
function checkRateLimitMemory(key, config) {
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  if (!memoryStore.has(key)) {
    memoryStore.set(key, []);
  }
  
  const attempts = memoryStore.get(key);
  
  // 윈도우 밖의 시도들 제거
  const validAttempts = attempts.filter(timestamp => timestamp > windowStart);
  
  // 새로운 시도 추가
  validAttempts.push(now);
  memoryStore.set(key, validAttempts);
  
  // 메모리 정리 (1시간 이상 된 키들 제거)
  if (Math.random() < 0.01) { // 1% 확률로 정리
    for (const [storeKey, timestamps] of memoryStore.entries()) {
      if (timestamps.length === 0 || Math.max(...timestamps) < now - 3600000) {
        memoryStore.delete(storeKey);
      }
    }
  }
  
  return {
    current: validAttempts.length,
    remaining: Math.max(0, config.maxAttempts - validAttempts.length),
    resetTime: windowStart + config.windowMs,
    blocked: validAttempts.length > config.maxAttempts
  };
}

// Rate Limiter 미들웨어 생성 함수
function createRateLimiter(type = 'api') {
  const config = rateLimiterConfig[type] || rateLimiterConfig.api;
  
  return async (req, res, next) => {
    try {
      // 클라이언트 식별 (IP 주소 기반)
      const clientId = req.ip || req.connection.remoteAddress || 'unknown';
      const key = `rate_limit:${type}:${clientId}`;
      
      let result;
      
      // Redis 사용 가능한 경우 Redis 사용, 아니면 메모리 사용
      if (redisClient && redisClient.status === 'ready') {
        result = await checkRateLimitRedis(key, config);
      } else {
        result = checkRateLimitMemory(key, config);
      }
      
      // 응답 헤더 설정
      res.set({
        'X-RateLimit-Limit': config.maxAttempts,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': new Date(result.resetTime).toISOString()
      });
      
      // 제한 초과 확인
      if (result.blocked) {
        const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
        
        res.set('Retry-After', retryAfter);
        
        return res.status(429).json({
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: config.message,
          retryAfter: retryAfter,
          resetTime: new Date(result.resetTime).toISOString()
        });
      }
      
      next();
      
    } catch (error) {
      console.error('❌ Rate Limiter 오류:', error);
      // Rate Limiter 오류 시에도 요청은 통과시킴
      next();
    }
  };
}

// IP 차단 확인 미들웨어
const checkBlockedIPs = async (req, res, next) => {
  try {
    const clientId = req.ip || req.connection.remoteAddress || 'unknown';
    const blockKey = `blocked_ip:${clientId}`;
    
    let isBlocked = false;
    
    if (redisClient && redisClient.status === 'ready') {
      const blockInfo = await redisClient.get(blockKey);
      isBlocked = !!blockInfo;
    }
    
    if (isBlocked) {
      return res.status(403).json({
        success: false,
        error: 'IP_BLOCKED',
        message: '비정상적인 접근으로 인해 차단된 IP입니다.'
      });
    }
    
    next();
    
  } catch (error) {
    console.error('❌ IP 차단 확인 오류:', error);
    next();
  }
};

// IP 차단 함수
const blockIP = async (ip, duration = 24 * 60 * 60 * 1000) => {
  try {
    const blockKey = `blocked_ip:${ip}`;
    
    if (redisClient && redisClient.status === 'ready') {
      await redisClient.setex(blockKey, Math.ceil(duration / 1000), JSON.stringify({
        blockedAt: new Date().toISOString(),
        reason: 'Suspicious activity detected'
      }));
    }
    
    console.log(`🚫 IP 차단: ${ip} (${duration / 1000}초)`);
    
  } catch (error) {
    console.error('❌ IP 차단 실패:', error);
  }
};

module.exports = {
  createRateLimiter,
  checkBlockedIPs,
  blockIP,
  
  // 미리 정의된 Rate Limiter들
  loginLimiter: createRateLimiter('login'),
  registerLimiter: createRateLimiter('register'),
  apiLimiter: createRateLimiter('api'),
  analysisLimiter: createRateLimiter('analysis')
};