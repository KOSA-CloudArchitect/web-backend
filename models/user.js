/**
 * User Model
 * 사용자 인증 및 권한 관리를 위한 모델
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class User {
  /**
   * User 생성자
   * @param {Object} userData - 사용자 데이터
   */
  constructor(userData = {}) {
    this.id = userData.id;
    this.email = userData.email;
    this.password = userData.password;
    this.role = userData.role || 'user';
    this.isActive = userData.isActive !== undefined ? userData.isActive : true;
    this.createdAt = userData.createdAt || new Date();
    this.updatedAt = userData.updatedAt || new Date();
  }

  /**
   * 안전한 사용자 객체 반환 (비밀번호 제외)
   * @returns {Object} 비밀번호가 제거된 사용자 정보
   */
  toSafeObject() {
    const { password, ...safeUser } = this;
    return safeUser;
  }

  /**
   * JWT 토큰 생성
   * @returns {Object} 액세스 토큰과 리프레시 토큰
   */
  generateTokens() {
    const payload = {
      id: this.id,
      email: this.email,
      role: this.role
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      { id: this.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
  }

  /**
   * 사용자 생성
   * @param {Object} userData - 사용자 데이터
   * @returns {Promise<Object>} 생성된 사용자 정보
   */
  static async create(userData) {
    const { email, password, role = 'user' } = userData;
    
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 12);
    
    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          profile: {
            create: {
              notificationPreferences: {
                email: true,
                push: true,
                priceAlert: true
              }
            }
          }
        },
        include: {
          profile: true
        }
      });
      
      // 비밀번호 제거 후 반환
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('이미 존재하는 이메일입니다.');
      }
      throw error;
    }
  }

  /**
   * 이메일로 사용자 찾기
   * @param {string} email - 이메일
   * @returns {Promise<Object|null>} 사용자 정보
   */
  static async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        sessions: {
          where: {
            expiresAt: {
              gt: new Date()
            }
          }
        }
      }
    });
  }

  /**
   * ID로 사용자 찾기
   * @param {string} id - 사용자 ID
   * @returns {Promise<Object|null>} 사용자 정보
   */
  static async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true
      }
    });
  }

  /**
   * 비밀번호 비교 검증
   * @param {string} plainPassword - 평문 비밀번호
   * @param {string} hashedPassword - 해시된 비밀번호
   * @returns {Promise<boolean>} 검증 결과
   */
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * JWT 액세스 토큰 검증
   * @param {string} token - JWT 토큰
   * @returns {Object} 디코딩된 토큰 정보
   */
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('expired');
      }
      throw new Error('invalid');
    }
  }

  /**
   * 이메일 유효성 검증
   * @param {string} email - 이메일
   * @returns {boolean} 유효성 여부
   */
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 비밀번호 유효성 검증
   * @param {string} password - 비밀번호
   * @returns {Object} 검증 결과
   */
  static validatePassword(password) {
    const requirements = {
      minLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const isValid = Object.values(requirements).every(req => req);

    return {
      isValid,
      requirements
    };
  }

  /**
   * 비밀번호 해싱
   * @param {string} password - 평문 비밀번호
   * @returns {Promise<string>} 해시된 비밀번호
   */
  static async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  /**
   * 리프레시 토큰 저장
   * @param {string} userId - 사용자 ID
   * @param {string} refreshToken - 리프레시 토큰
   * @param {Object} sessionInfo - 세션 정보
   * @returns {Promise<Object>} 생성된 세션
   */
  static async saveRefreshToken(userId, refreshToken, sessionInfo = {}) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    
    return await prisma.userSession.create({
      data: {
        userId,
        refreshTokenHash: hashedToken,
        deviceInfo: sessionInfo.deviceInfo || null,
        ipAddress: sessionInfo.ipAddress || null,
        userAgent: sessionInfo.userAgent || null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7일
      }
    });
  }

  /**
   * 로그인 시도 실패 기록
   * @param {string} email - 이메일
   * @returns {Promise<Object>} 업데이트된 사용자 정보
   */
  static async recordFailedLogin(email) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) return null;

    const failedAttempts = user.failedLoginAttempts + 1;
    const shouldLock = failedAttempts >= 5;

    return await prisma.user.update({
      where: { email },
      data: {
        failedLoginAttempts: failedAttempts,
        lockedUntil: shouldLock ? new Date(Date.now() + 30 * 60 * 1000) : null // 30분 잠금
      }
    });
  }

  /**
   * 로그인 성공 시 초기화
   * @param {string} userId - 사용자 ID
   * @returns {Promise<Object>} 업데이트된 사용자 정보
   */
  static async recordSuccessfulLogin(userId) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date()
      }
    });
  }

  /**
   * 사용자 계정 잠금 확인
   * @param {Object} user - 사용자 정보
   * @returns {boolean} 잠금 여부
   */
  static isAccountLocked(user) {
    if (!user.lockedUntil) return false;
    return new Date() < user.lockedUntil;
  }

  /**
   * 사용자 프로필 업데이트
   * @param {string} userId - 사용자 ID
   * @param {Object} profileData - 프로필 데이터
   * @returns {Promise<Object>} 업데이트된 프로필
   */
  static async updateProfile(userId, profileData) {
    return await prisma.userProfile.upsert({
      where: { userId },
      update: {
        ...profileData,
        updatedAt: new Date()
      },
      create: {
        userId,
        ...profileData
      }
    });
  }

  /**
   * 리프레시 토큰 검증 및 새 토큰 발급
   * @param {string} refreshToken - 리프레시 토큰
   * @returns {Promise<Object|null>} 새 토큰 또는 null
   */
  static async refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // 데이터베이스에서 세션 확인
      const sessions = await prisma.userSession.findMany({
        where: {
          userId: decoded.id,
          expiresAt: {
            gt: new Date()
          }
        }
      });

      // 토큰 해시 검증
      let validSession = null;
      for (const session of sessions) {
        if (await bcrypt.compare(refreshToken, session.refreshTokenHash)) {
          validSession = session;
          break;
        }
      }

      if (!validSession) {
        throw new Error('Invalid refresh token');
      }

      // 사용자 정보 조회
      const user = await this.findById(decoded.id);
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      // 새 토큰 생성
      const tokens = this.generateTokens(user);

      // 세션 업데이트
      await prisma.userSession.update({
        where: { id: validSession.id },
        data: { lastUsedAt: new Date() }
      });

      return tokens;
    } catch (error) {
      return null;
    }
  }

  /**
   * 사용자 세션 정리 (로그아웃)
   * @param {string} userId - 사용자 ID
   * @param {string} refreshToken - 리프레시 토큰 (선택적)
   * @returns {Promise<void>}
   */
  static async clearSessions(userId, refreshToken = null) {
    if (refreshToken) {
      // 특정 세션만 삭제
      const sessions = await prisma.userSession.findMany({
        where: { userId }
      });

      for (const session of sessions) {
        if (await bcrypt.compare(refreshToken, session.refreshTokenHash)) {
          await prisma.userSession.delete({
            where: { id: session.id }
          });
          break;
        }
      }
    } else {
      // 모든 세션 삭제
      await prisma.userSession.deleteMany({
        where: { userId }
      });
    }
  }
}

module.exports = User;