const request = require('supertest');
const app = require('../../index');
const { getPool } = require('../../config/database');

describe('Authentication Integration Tests', () => {
  let server;
  let pool;

  beforeAll(async () => {
    // Start server
    server = app.listen(0);
    pool = getPool();
    
    // Clean up test data
    await pool.query('DELETE FROM users WHERE email LIKE %test%');
  });

  afterAll(async () => {
    // Clean up
    await pool.query('DELETE FROM users WHERE email LIKE %test%');
    await pool.end();
    server.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'TestPassword123!',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.stringContaining('회원가입이 완료되었습니다'),
        user: {
          email: userData.email,
          name: userData.name
        }
      });

      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject duplicate email registration', async () => {
      const userData = {
        email: 'duplicate@test.com',
        password: 'TestPassword123!',
        name: 'Test User'
      };

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Duplicate registration
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('이미 존재하는 이메일입니다')
      });
    });

    it('should validate email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'TestPassword123!',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('유효한 이메일 주소를 입력해주세요')
      });
    });

    it('should validate password strength', async () => {
      const userData = {
        email: 'weak@test.com',
        password: '123',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('비밀번호는 최소 8자 이상이어야 합니다')
      });
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login@test.com',
          password: 'TestPassword123!',
          name: 'Login Test User'
        });
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'login@test.com',
        password: 'TestPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.stringContaining('로그인 성공'),
        user: {
          email: loginData.email
        },
        token: expect.any(String),
        refreshToken: expect.any(String)
      });

      // Verify JWT token format
      expect(response.body.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    });

    it('should reject invalid email', async () => {
      const loginData = {
        email: 'nonexistent@test.com',
        password: 'TestPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('이메일 또는 비밀번호가 올바르지 않습니다')
      });
    });

    it('should reject invalid password', async () => {
      const loginData = {
        email: 'login@test.com',
        password: 'WrongPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('이메일 또는 비밀번호가 올바르지 않습니다')
      });
    });

    it('should handle missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('이메일과 비밀번호를 입력해주세요')
      });
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken;

    beforeEach(async () => {
      // Register and login to get refresh token
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'refresh@test.com',
          password: 'TestPassword123!',
          name: 'Refresh Test User'
        });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'refresh@test.com',
          password: 'TestPassword123!'
        });

      refreshToken = loginResponse.body.refreshToken;
    });

    it('should refresh token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        token: expect.any(String),
        refreshToken: expect.any(String)
      });

      // New tokens should be different
      expect(response.body.token).not.toBe(refreshToken);
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('유효하지 않은 리프레시 토큰입니다')
      });
    });

    it('should reject missing refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('리프레시 토큰이 필요합니다')
      });
    });
  });

  describe('POST /api/auth/logout', () => {
    let authToken;

    beforeEach(async () => {
      // Register and login to get auth token
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'logout@test.com',
          password: 'TestPassword123!',
          name: 'Logout Test User'
        });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logout@test.com',
          password: 'TestPassword123!'
        });

      authToken = loginResponse.body.token;
    });

    it('should logout successfully with valid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.stringContaining('로그아웃되었습니다')
      });
    });

    it('should reject logout without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('인증 토큰이 필요합니다')
      });
    });

    it('should reject logout with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('유효하지 않은 토큰입니다')
      });
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken;
    let userId;

    beforeEach(async () => {
      // Register and login to get auth token
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'profile@test.com',
          password: 'TestPassword123!',
          name: 'Profile Test User'
        });

      userId = registerResponse.body.user.id;

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'profile@test.com',
          password: 'TestPassword123!'
        });

      authToken = loginResponse.body.token;
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        user: {
          id: userId,
          email: 'profile@test.com',
          name: 'Profile Test User'
        }
      });

      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject profile request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('인증 토큰이 필요합니다')
      });
    });

    it('should reject profile request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('유효하지 않은 토큰입니다')
      });
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting to login attempts', async () => {
      const loginData = {
        email: 'ratelimit@test.com',
        password: 'WrongPassword123!'
      };

      // Make multiple failed login attempts
      const promises = Array(6).fill().map(() =>
        request(app)
          .post('/api/auth/login')
          .send(loginData)
      );

      const responses = await Promise.all(promises);

      // First 5 should be 401 (unauthorized)
      responses.slice(0, 5).forEach(response => {
        expect(response.status).toBe(401);
      });

      // 6th should be 429 (too many requests)
      expect(responses[5].status).toBe(429);
      expect(responses[5].body).toMatchObject({
        success: false,
        error: expect.stringContaining('너무 많은 로그인 시도')
      });
    });
  });
});