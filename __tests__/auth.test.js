const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('../routes/auth');
const User = require('../models/user');

// 테스트용 Express 앱 설정
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);

// 테스트 데이터
const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  confirmPassword: 'TestPassword123!'
};

const invalidUser = {
  email: 'invalid-email',
  password: '123',
  confirmPassword: '123'
};

describe('Authentication API', () => {
  
  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should reject registration with weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test2@example.com',
          password: 'weak',
          confirmPassword: 'weak'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should reject registration with mismatched passwords', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test3@example.com',
          password: 'TestPassword123!',
          confirmPassword: 'DifferentPassword123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/login', () => {
    // 로그인 테스트를 위해 먼저 사용자 등록
    beforeAll(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login-test@example.com',
          password: 'LoginTest123!',
          confirmPassword: 'LoginTest123!'
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login-test@example.com',
          password: 'LoginTest123!'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.user.email).toBe('login-test@example.com');
      
      // Refresh Token이 쿠키로 설정되었는지 확인
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some(cookie => cookie.includes('refreshToken'))).toBe(true);
    });

    it('should reject login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'LoginTest123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('AUTHENTICATION_FAILED');
    });

    it('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login-test@example.com',
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('AUTHENTICATION_FAILED');
    });

    it('should reject login with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'LoginTest123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken;

    beforeAll(async () => {
      // 로그인하여 Refresh Token 획득
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login-test@example.com',
          password: 'LoginTest123!'
        });

      const cookies = loginResponse.headers['set-cookie'];
      const refreshCookie = cookies.find(cookie => cookie.includes('refreshToken'));
      refreshToken = refreshCookie.split('=')[1].split(';')[0];
    });

    it('should refresh token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', [`refreshToken=${refreshToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.user).toBeDefined();
    });

    it('should reject refresh with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', ['refreshToken=invalid-token']);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('INVALID_REFRESH_TOKEN');
    });

    it('should reject refresh without token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('REFRESH_TOKEN_REQUIRED');
    });
  });

  describe('GET /api/auth/me', () => {
    let accessToken;

    beforeAll(async () => {
      // 로그인하여 Access Token 획득
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login-test@example.com',
          password: 'LoginTest123!'
        });

      accessToken = loginResponse.body.data.accessToken;
    });

    it('should get user info with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('login-test@example.com');
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('AUTHENTICATION_REQUIRED');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('INVALID_TOKEN');
    });
  });

  describe('POST /api/auth/logout', () => {
    let accessToken;
    let refreshToken;

    beforeAll(async () => {
      // 로그인하여 토큰들 획득
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login-test@example.com',
          password: 'LoginTest123!'
        });

      accessToken = loginResponse.body.data.accessToken;
      const cookies = loginResponse.headers['set-cookie'];
      const refreshCookie = cookies.find(cookie => cookie.includes('refreshToken'));
      refreshToken = refreshCookie.split('=')[1].split(';')[0];
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', [`refreshToken=${refreshToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('로그아웃되었습니다.');
    });

    it('should reject logout without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('AUTHENTICATION_REQUIRED');
    });
  });
});

describe('User Model', () => {
  describe('Password validation', () => {
    it('should validate strong password', () => {
      const result = User.validatePassword('StrongPassword123!');
      expect(result.isValid).toBe(true);
      expect(result.requirements.minLength).toBe(true);
      expect(result.requirements.hasLowercase).toBe(true);
      expect(result.requirements.hasUppercase).toBe(true);
      expect(result.requirements.hasNumber).toBe(true);
      expect(result.requirements.hasSpecialChar).toBe(true);
    });

    it('should reject weak password', () => {
      const result = User.validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.requirements.minLength).toBe(false);
    });

    it('should reject password without uppercase', () => {
      const result = User.validatePassword('lowercase123!');
      expect(result.isValid).toBe(false);
      expect(result.requirements.hasUppercase).toBe(false);
    });

    it('should reject password without special character', () => {
      const result = User.validatePassword('NoSpecialChar123');
      expect(result.isValid).toBe(false);
      expect(result.requirements.hasSpecialChar).toBe(false);
    });
  });

  describe('Email validation', () => {
    it('should validate correct email', () => {
      expect(User.validateEmail('test@example.com')).toBe(true);
      expect(User.validateEmail('user.name+tag@domain.co.kr')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(User.validateEmail('invalid-email')).toBe(false);
      expect(User.validateEmail('test@')).toBe(false);
      expect(User.validateEmail('@example.com')).toBe(false);
      expect(User.validateEmail('test.example.com')).toBe(false);
    });
  });

  describe('Token generation', () => {
    const user = new User({
      id: 'test-id',
      email: 'test@example.com',
      role: 'user'
    });

    it('should generate access token', () => {
      const token = user.generateAccessToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      // 토큰 검증
      const decoded = User.verifyAccessToken(token);
      expect(decoded.id).toBe('test-id');
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.role).toBe('user');
    });

    it('should generate refresh token', () => {
      const token = user.generateRefreshToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      // 토큰 검증
      const decoded = User.verifyRefreshToken(token);
      expect(decoded.id).toBe('test-id');
      expect(decoded.type).toBe('refresh');
    });

    it('should generate token pair', () => {
      const tokens = user.generateTokens();
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(tokens.tokenType).toBe('Bearer');
      expect(tokens.expiresIn).toBe(900); // 15분
    });
  });
});