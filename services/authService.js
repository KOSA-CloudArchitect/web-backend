const User = require('../models/user');
const { getPool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const Redis = require('ioredis');

// Redis 클라이언트 설정 (Refresh Token 저장용)
let redisClient = null;

try {
  redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: process.env.REDIS_DB || 1, // 인증용 별도 DB 사용
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true
  });

  redisClient.on('error', (err) => {
    console.warn('⚠️  Redis Auth 연결 오류:', err.message);
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis Auth 연결 성공');
  });
} catch (error) {
  console.warn('⚠️  Redis Auth 초기화 실패:', error.message);
}

// 메모리 기반 저장소 (Redis 없을 때 사용)
const memoryRefreshTokens = new Map();
const memoryFailedAttempts = new Map();

class AuthService {
  // 회원가입
  static async register(userData) {
    const { email, password, role = 'user' } = userData;

    // 입력 검증
    if (!email || !password) {
      throw new Error('이메일과 비밀번호는 필수입니다.');
    }

    if (!User.validateEmail(email)) {
      throw new Error('유효하지 않은 이메일 형식입니다.');
    }

    const passwordValidation = User.validatePassword(password);
    if (!passwordValidation.isValid) {
      const missingRequirements = [];
      if (!passwordValidation.requirements.minLength) missingRequirements.push('최소 8자');
      if (!passwordValidation.requirements.hasLowercase) missingRequirements.push('소문자');
      if (!passwordValidation.requirements.hasUppercase) missingRequirements.push('대문자');
      if (!passwordValidation.requirements.hasNumber) missingRequirements.push('숫자');
      if (!passwordValidation.requirements.hasSpecialChar) missingRequirements.push('특수문자');
      
      throw new Error(`비밀번호는 다음 조건을 만족해야 합니다: ${missingRequirements.join(', ')}`);
    }

    try {
      const pool = getPool();
      
      // 이메일 중복 확인
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('이미 존재하는 이메일입니다.');
      }

      // 비밀번호 해싱
      const hashedPassword = await User.hashPassword(password);
      const userId = uuidv4();

      // 사용자 생성
      const result = await pool.query(
        `INSERT INTO users (id, email, password, role, created_at, updated_at, is_active) 
         VALUES ($1, $2, $3, $4, NOW(), NOW(), true) 
         RETURNING id, email, role, created_at, is_active`,
        [userId, email, hashedPassword, role]
      );

      const newUser = new User({
        id: result.rows[0].id,
        email: result.rows[0].email,
        role: result.rows[0].role,
        createdAt: result.rows[0].created_at,
        isActive: result.rows[0].is_active
      });

      return {
        user: newUser.toSafeObject(),
        message: '회원가입이 완료되었습니다.'
      };

    } catch (dbError) {
      if (dbError.message.includes('이미 존재하는')) {
        throw dbError;
      }
      
      console.warn('⚠️  DB 연결 없음, 메모리에 사용자 저장:', dbError.message);
      
      // DB 연결이 없는 경우 메모리에 저장 (개발용)
      const hashedPassword = await User.hashPassword(password);
      const userId = uuidv4();
      
      const newUser = new User({
        id: userId,
        email,
        password: hashedPassword,
        role,
        createdAt: new Date(),
        isActive: true
      });

      // 메모리에 저장 (실제 운영에서는 사용하지 않음)
      global.memoryUsers = global.memoryUsers || new Map();
      global.memoryUsers.set(email, newUser);

      return {
        user: newUser.toSafeObject(),
        message: '회원가입이 완료되었습니다. (개발 모드)'
      };
    }
  }

  // 로그인
  static async login(credentials) {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error('이메일과 비밀번호를 입력해주세요.');
    }

    // 로그인 실패 횟수 확인
    const failedAttempts = await this.getFailedAttempts(email);
    if (failedAttempts >= 5) {
      throw new Error('로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요.');
    }

    try {
      const pool = getPool();
      
      // 사용자 조회
      const result = await pool.query(
        'SELECT id, email, password, role, is_active, created_at FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        await this.recordFailedAttempt(email);
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      const userData = result.rows[0];
      
      if (!userData.is_active) {
        throw new Error('비활성화된 계정입니다.');
      }

      const user = new User({
        id: userData.id,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        isActive: userData.is_active,
        createdAt: userData.created_at
      });

      // 비밀번호 검증
      const isValidPassword = await User.comparePassword(password, user.password);
      if (!isValidPassword) {
        await this.recordFailedAttempt(email);
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      // 로그인 성공 시 실패 횟수 초기화
      await this.clearFailedAttempts(email);

      // 토큰 생성
      const tokens = user.generateTokens();

      // Refresh Token 저장
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      return {
        user: user.toSafeObject(),
        tokens,
        message: '로그인 성공'
      };

    } catch (dbError) {
      if (dbError.message.includes('이메일 또는 비밀번호') || 
          dbError.message.includes('비활성화된') ||
          dbError.message.includes('로그인 시도 횟수')) {
        throw dbError;
      }

      console.warn('⚠️  DB 연결 없음, 메모리에서 사용자 확인:', dbError.message);
      
      // DB 연결이 없는 경우 메모리에서 확인 (개발용)
      global.memoryUsers = global.memoryUsers || new Map();
      const user = global.memoryUsers.get(email);
      
      if (!user) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      const isValidPassword = await User.comparePassword(password, user.password);
      if (!isValidPassword) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      const tokens = user.generateTokens();
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      return {
        user: user.toSafeObject(),
        tokens,
        message: '로그인 성공 (개발 모드)'
      };
    }
  }

  // 토큰 갱신
  static async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new Error('Refresh Token이 필요합니다.');
    }

    try {
      // Refresh Token 검증
      const decoded = User.verifyRefreshToken(refreshToken);
      
      // 저장된 Refresh Token 확인
      const isValidToken = await this.validateRefreshToken(decoded.id, refreshToken);
      if (!isValidToken) {
        throw new Error('유효하지 않은 Refresh Token입니다.');
      }

      // 사용자 정보 조회
      let user;
      try {
        const pool = getPool();
        const result = await pool.query(
          'SELECT id, email, role, is_active FROM users WHERE id = $1',
          [decoded.id]
        );

        if (result.rows.length === 0 || !result.rows[0].is_active) {
          throw new Error('사용자를 찾을 수 없거나 비활성화된 계정입니다.');
        }

        const userData = result.rows[0];
        user = new User({
          id: userData.id,
          email: userData.email,
          role: userData.role,
          isActive: userData.is_active
        });

      } catch (dbError) {
        console.warn('⚠️  DB 연결 없음, 토큰 정보 사용:', dbError.message);
        user = new User({
          id: decoded.id,
          email: decoded.email || 'unknown@example.com',
          role: decoded.role || 'user'
        });
      }

      // 새로운 토큰 생성
      const newTokens = user.generateTokens();

      // 기존 Refresh Token 제거 및 새 토큰 저장
      await this.removeRefreshToken(decoded.id, refreshToken);
      await this.storeRefreshToken(user.id, newTokens.refreshToken);

      return {
        user: user.toSafeObject(),
        tokens: newTokens,
        message: '토큰 갱신 성공'
      };

    } catch (error) {
      throw new Error('토큰 갱신 실패: ' + error.message);
    }
  }

  // 로그아웃
  static async logout(userId, refreshToken) {
    try {
      if (refreshToken) {
        await this.removeRefreshToken(userId, refreshToken);
      }
      
      return { message: '로그아웃 성공' };
    } catch (error) {
      console.error('❌ 로그아웃 처리 오류:', error);
      return { message: '로그아웃 완료' };
    }
  }

  // 모든 세션 로그아웃
  static async logoutAll(userId) {
    try {
      await this.removeAllRefreshTokens(userId);
      return { message: '모든 세션에서 로그아웃되었습니다.' };
    } catch (error) {
      console.error('❌ 전체 로그아웃 처리 오류:', error);
      return { message: '로그아웃 완료' };
    }
  }

  // Refresh Token 저장
  static async storeRefreshToken(userId, refreshToken) {
    try {
      const key = `refresh_token:${userId}`;
      const tokenData = {
        token: refreshToken,
        createdAt: new Date().toISOString()
      };

      if (redisClient && redisClient.status === 'ready') {
        // Redis에 저장 (7일 TTL)
        await redisClient.sadd(key, JSON.stringify(tokenData));
        await redisClient.expire(key, 7 * 24 * 60 * 60); // 7일
      } else {
        // 메모리에 저장
        if (!memoryRefreshTokens.has(userId)) {
          memoryRefreshTokens.set(userId, new Set());
        }
        memoryRefreshTokens.get(userId).add(JSON.stringify(tokenData));
      }
    } catch (error) {
      console.error('❌ Refresh Token 저장 실패:', error);
    }
  }

  // Refresh Token 검증
  static async validateRefreshToken(userId, refreshToken) {
    try {
      const key = `refresh_token:${userId}`;

      if (redisClient && redisClient.status === 'ready') {
        const tokens = await redisClient.smembers(key);
        return tokens.some(tokenStr => {
          try {
            const tokenData = JSON.parse(tokenStr);
            return tokenData.token === refreshToken;
          } catch {
            return false;
          }
        });
      } else {
        const userTokens = memoryRefreshTokens.get(userId);
        if (!userTokens) return false;
        
        for (const tokenStr of userTokens) {
          try {
            const tokenData = JSON.parse(tokenStr);
            if (tokenData.token === refreshToken) return true;
          } catch {
            continue;
          }
        }
        return false;
      }
    } catch (error) {
      console.error('❌ Refresh Token 검증 실패:', error);
      return false;
    }
  }

  // Refresh Token 제거
  static async removeRefreshToken(userId, refreshToken) {
    try {
      const key = `refresh_token:${userId}`;

      if (redisClient && redisClient.status === 'ready') {
        const tokens = await redisClient.smembers(key);
        for (const tokenStr of tokens) {
          try {
            const tokenData = JSON.parse(tokenStr);
            if (tokenData.token === refreshToken) {
              await redisClient.srem(key, tokenStr);
              break;
            }
          } catch {
            continue;
          }
        }
      } else {
        const userTokens = memoryRefreshTokens.get(userId);
        if (userTokens) {
          for (const tokenStr of userTokens) {
            try {
              const tokenData = JSON.parse(tokenStr);
              if (tokenData.token === refreshToken) {
                userTokens.delete(tokenStr);
                break;
              }
            } catch {
              continue;
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Refresh Token 제거 실패:', error);
    }
  }

  // 모든 Refresh Token 제거
  static async removeAllRefreshTokens(userId) {
    try {
      const key = `refresh_token:${userId}`;

      if (redisClient && redisClient.status === 'ready') {
        await redisClient.del(key);
      } else {
        memoryRefreshTokens.delete(userId);
      }
    } catch (error) {
      console.error('❌ 모든 Refresh Token 제거 실패:', error);
    }
  }

  // 로그인 실패 횟수 기록
  static async recordFailedAttempt(email) {
    try {
      const key = `failed_attempts:${email}`;

      if (redisClient && redisClient.status === 'ready') {
        await redisClient.incr(key);
        await redisClient.expire(key, 15 * 60); // 15분
      } else {
        const current = memoryFailedAttempts.get(email) || 0;
        memoryFailedAttempts.set(email, current + 1);
        
        // 15분 후 자동 삭제
        setTimeout(() => {
          memoryFailedAttempts.delete(email);
        }, 15 * 60 * 1000);
      }
    } catch (error) {
      console.error('❌ 실패 횟수 기록 실패:', error);
    }
  }

  // 로그인 실패 횟수 조회
  static async getFailedAttempts(email) {
    try {
      const key = `failed_attempts:${email}`;

      if (redisClient && redisClient.status === 'ready') {
        const attempts = await redisClient.get(key);
        return parseInt(attempts) || 0;
      } else {
        return memoryFailedAttempts.get(email) || 0;
      }
    } catch (error) {
      console.error('❌ 실패 횟수 조회 실패:', error);
      return 0;
    }
  }

  // 로그인 실패 횟수 초기화
  static async clearFailedAttempts(email) {
    try {
      const key = `failed_attempts:${email}`;

      if (redisClient && redisClient.status === 'ready') {
        await redisClient.del(key);
      } else {
        memoryFailedAttempts.delete(email);
      }
    } catch (error) {
      console.error('❌ 실패 횟수 초기화 실패:', error);
    }
  }
}

module.exports = AuthService;