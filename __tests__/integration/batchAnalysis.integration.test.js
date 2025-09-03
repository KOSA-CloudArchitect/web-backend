const request = require('supertest');
const app = require('../../index');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Batch Analysis Integration Tests', () => {
  let testUser;
  let testProduct;
  let authToken;

  beforeAll(async () => {
    // 테스트 환경 설정
    process.env.NODE_ENV = 'test';
    
    // 테스트 사용자 생성
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'user',
        isActive: true
      }
    });

    // 테스트 상품 생성
    testProduct = await prisma.product.create({
      data: {
        name: 'Test Product',
        url: 'https://www.coupang.com/vp/products/test-product',
        currentPrice: 50000,
        averageRating: 4.5,
        totalReviews: 100,
        isActive: true
      }
    });

    // 인증 토큰 생성 (실제 구현에 따라 조정)
    authToken = 'Bearer test-jwt-token';
  });

  afterAll(async () => {
    // 테스트 데이터 정리
    await prisma.batchAnalysisRequest.deleteMany({
      where: { userId: testUser.id }
    });
    await prisma.watchList.deleteMany({
      where: { userId: testUser.id }
    });
    await prisma.product.delete({
      where: { id: testProduct.id }
    });
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    
    await prisma.$disconnect();
  });

  describe('관심 상품 등록 및 배치 분석 요청 생성', () => {
    it('관심 상품 등록 시 배치 분석 요청이 자동으로 생성되어야 함', async () => {
      const response = await request(app)
        .post('/api/interests')
        .set('Authorization', authToken)
        .send({
          productUrl: testProduct.url,
          priceAlert: true,
          targetPrice: 45000,
          analysisFrequency: 'daily'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');

      // 배치 분석 요청이 생성되었는지 확인
      const batchRequest = await prisma.batchAnalysisRequest.findFirst({
        where: {
          userId: testUser.id,
          productId: testProduct.id
        }
      });

      expect(batchRequest).toBeTruthy();
      expect(batchRequest.status).toBe('PENDING');
      expect(batchRequest.metadata).toHaveProperty('frequency', 'daily');
    });

    it('중복 관심 상품 등록 시 중복 배치 분석 요청이 생성되지 않아야 함', async () => {
      // 첫 번째 등록
      await request(app)
        .post('/api/interests')
        .set('Authorization', authToken)
        .send({
          productUrl: 'https://www.coupang.com/vp/products/duplicate-test',
          analysisFrequency: 'weekly'
        });

      // 두 번째 등록 시도
      const response = await request(app)
        .post('/api/interests')
        .set('Authorization', authToken)
        .send({
          productUrl: 'https://www.coupang.com/vp/products/duplicate-test',
          analysisFrequency: 'weekly'
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('이미 관심 상품으로 등록된');

      // 배치 분석 요청이 하나만 있는지 확인
      const batchRequests = await prisma.batchAnalysisRequest.findMany({
        where: {
          userId: testUser.id,
          product: {
            url: 'https://www.coupang.com/vp/products/duplicate-test'
          }
        }
      });

      expect(batchRequests).toHaveLength(1);
    });
  });

  describe('배치 분석 요청 상태 관리', () => {
    let batchRequestId;

    beforeEach(async () => {
      // 테스트용 배치 분석 요청 생성
      const batchRequest = await prisma.batchAnalysisRequest.create({
        data: {
          userId: testUser.id,
          productId: testProduct.id,
          status: 'PENDING',
          metadata: { testData: true }
        }
      });
      batchRequestId = batchRequest.id;
    });

    afterEach(async () => {
      // 테스트 데이터 정리
      await prisma.batchAnalysisRequest.deleteMany({
        where: { id: batchRequestId }
      });
    });

    it('배치 분석 요청 상태를 PENDING에서 PROCESSING으로 업데이트해야 함', async () => {
      const response = await request(app)
        .put(`/api/batch-analysis/requests/${batchRequestId}/status`)
        .set('Authorization', authToken)
        .send({
          status: 'PROCESSING',
          metadata: {
            processingStartedAt: new Date().toISOString()
          }
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('PROCESSING');

      // 데이터베이스에서 확인
      const updatedRequest = await prisma.batchAnalysisRequest.findUnique({
        where: { id: batchRequestId }
      });

      expect(updatedRequest.status).toBe('PROCESSING');
      expect(updatedRequest.metadata.statusHistory).toHaveLength(1);
      expect(updatedRequest.metadata.statusHistory[0]).toMatchObject({
        from: 'PENDING',
        to: 'PROCESSING'
      });
    });

    it('유효하지 않은 상태 전이 시 에러를 반환해야 함', async () => {
      // PENDING에서 COMPLETED로 직접 전이 시도 (PROCESSING을 거쳐야 함)
      const response = await request(app)
        .put(`/api/batch-analysis/requests/${batchRequestId}/status`)
        .set('Authorization', authToken)
        .send({
          status: 'COMPLETED'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid status transition');
    });

    it('존재하지 않는 요청 ID로 404 에러를 반환해야 함', async () => {
      const response = await request(app)
        .put('/api/batch-analysis/requests/non-existent-id/status')
        .set('Authorization', authToken)
        .send({
          status: 'PROCESSING'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('배치 분석 요청 조회', () => {
    let batchRequests = [];

    beforeAll(async () => {
      // 테스트용 배치 분석 요청들 생성
      for (let i = 0; i < 5; i++) {
        const product = await prisma.product.create({
          data: {
            name: `Test Product ${i}`,
            url: `https://www.coupang.com/vp/products/test-${i}`,
            isActive: true
          }
        });

        const batchRequest = await prisma.batchAnalysisRequest.create({
          data: {
            userId: testUser.id,
            productId: product.id,
            status: i % 2 === 0 ? 'PENDING' : 'COMPLETED',
            metadata: { testIndex: i }
          }
        });

        batchRequests.push({ batchRequest, product });
      }
    });

    afterAll(async () => {
      // 테스트 데이터 정리
      for (const { batchRequest, product } of batchRequests) {
        await prisma.batchAnalysisRequest.delete({
          where: { id: batchRequest.id }
        });
        await prisma.product.delete({
          where: { id: product.id }
        });
      }
      batchRequests = [];
    });

    it('사용자의 모든 배치 분석 요청을 조회해야 함', async () => {
      const response = await request(app)
        .get(`/api/batch-analysis/requests/user/${testUser.id}`)
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(5);
      
      // 최신순으로 정렬되어 있는지 확인
      const createdAts = response.body.data.map(req => new Date(req.createdAt));
      for (let i = 1; i < createdAts.length; i++) {
        expect(createdAts[i-1]).toBeInstanceOf(Date);
        expect(createdAts[i]).toBeInstanceOf(Date);
        expect(createdAts[i-1].getTime()).toBeGreaterThanOrEqual(createdAts[i].getTime());
      }
    });

    it('상태별 필터링이 적용되어야 함', async () => {
      const response = await request(app)
        .get(`/api/batch-analysis/requests/user/${testUser.id}`)
        .query({ status: 'PENDING' })
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3); // 0, 2, 4번 인덱스
      
      response.body.data.forEach(request => {
        expect(request.status).toBe('PENDING');
      });
    });

    it('페이지네이션이 적용되어야 함', async () => {
      const response = await request(app)
        .get(`/api/batch-analysis/requests/user/${testUser.id}`)
        .query({ limit: 2, offset: 1 })
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('대기 중인 배치 분석 요청 조회 (스케줄러용)', () => {
    let pendingRequests = [];

    beforeAll(async () => {
      // 다양한 상태의 배치 분석 요청 생성
      const statuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'PENDING', 'FAILED'];
      
      for (let i = 0; i < statuses.length; i++) {
        const product = await prisma.product.create({
          data: {
            name: `Scheduler Test Product ${i}`,
            url: `https://www.coupang.com/vp/products/scheduler-test-${i}`,
            isActive: true
          }
        });

        const batchRequest = await prisma.batchAnalysisRequest.create({
          data: {
            userId: testUser.id,
            productId: product.id,
            status: statuses[i],
            scheduledAt: new Date(Date.now() + i * 1000), // 1초씩 차이
            metadata: { schedulerTest: true }
          }
        });

        pendingRequests.push({ batchRequest, product });
      }
    });

    afterAll(async () => {
      // 테스트 데이터 정리
      for (const { batchRequest, product } of pendingRequests) {
        await prisma.batchAnalysisRequest.delete({
          where: { id: batchRequest.id }
        });
        await prisma.product.delete({
          where: { id: product.id }
        });
      }
      pendingRequests = [];
    });

    it('PENDING 상태의 요청만 조회해야 함', async () => {
      const response = await request(app)
        .get('/api/batch-analysis/requests/pending')
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2); // 최소 2개 (인덱스 0, 3)
      
      response.body.data.forEach(request => {
        expect(request.status).toBe('PENDING');
        expect(request).toHaveProperty('user');
        expect(request).toHaveProperty('product');
      });
    });

    it('scheduledAt 순서로 정렬되어야 함', async () => {
      const response = await request(app)
        .get('/api/batch-analysis/requests/pending')
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      
      const scheduledAts = response.body.data.map(req => new Date(req.scheduledAt));
      for (let i = 1; i < scheduledAts.length; i++) {
        expect(scheduledAts[i-1].getTime()).toBeLessThanOrEqual(scheduledAts[i].getTime());
      }
    });

    it('limit 파라미터가 적용되어야 함', async () => {
      const response = await request(app)
        .get('/api/batch-analysis/requests/pending')
        .query({ limit: 1 })
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('배치 분석 요청 삭제', () => {
    let deletableRequest;

    beforeEach(async () => {
      deletableRequest = await prisma.batchAnalysisRequest.create({
        data: {
          userId: testUser.id,
          productId: testProduct.id,
          status: 'PENDING',
          metadata: { deletable: true }
        }
      });
    });

    it('PENDING 상태의 요청을 삭제할 수 있어야 함', async () => {
      const response = await request(app)
        .delete(`/api/batch-analysis/requests/${deletableRequest.id}`)
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('삭제되었습니다');

      // 데이터베이스에서 삭제되었는지 확인
      const deletedRequest = await prisma.batchAnalysisRequest.findUnique({
        where: { id: deletableRequest.id }
      });
      expect(deletedRequest).toBeNull();
    });

    it('PROCESSING 상태의 요청은 삭제할 수 없어야 함', async () => {
      // 상태를 PROCESSING으로 변경
      await prisma.batchAnalysisRequest.update({
        where: { id: deletableRequest.id },
        data: { status: 'PROCESSING' }
      });

      const response = await request(app)
        .delete(`/api/batch-analysis/requests/${deletableRequest.id}`)
        .set('Authorization', authToken);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('cannot be deleted');

      // 데이터베이스에서 여전히 존재하는지 확인
      const existingRequest = await prisma.batchAnalysisRequest.findUnique({
        where: { id: deletableRequest.id }
      });
      expect(existingRequest).toBeTruthy();
    });

    it('다른 사용자의 요청은 삭제할 수 없어야 함', async () => {
      // 다른 사용자 생성
      const otherUser = await prisma.user.create({
        data: {
          email: 'other@example.com',
          password: 'hashedpassword',
          role: 'user',
          isActive: true
        }
      });

      const otherUserRequest = await prisma.batchAnalysisRequest.create({
        data: {
          userId: otherUser.id,
          productId: testProduct.id,
          status: 'PENDING'
        }
      });

      const response = await request(app)
        .delete(`/api/batch-analysis/requests/${otherUserRequest.id}`)
        .set('Authorization', authToken); // testUser의 토큰 사용

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);

      // 정리
      await prisma.batchAnalysisRequest.delete({
        where: { id: otherUserRequest.id }
      });
      await prisma.user.delete({
        where: { id: otherUser.id }
      });
    });
  });

  describe('트랜잭션 무결성 테스트', () => {
    it('관심 상품 등록 실패 시 배치 분석 요청도 생성되지 않아야 함', async () => {
      // 잘못된 데이터로 관심 상품 등록 시도
      const response = await request(app)
        .post('/api/interests')
        .set('Authorization', authToken)
        .send({
          productUrl: 'invalid-url', // 유효하지 않은 URL
          analysisFrequency: 'daily'
        });

      expect(response.status).toBe(400);

      // 배치 분석 요청이 생성되지 않았는지 확인
      const batchRequests = await prisma.batchAnalysisRequest.findMany({
        where: {
          userId: testUser.id,
          metadata: {
            path: ['requestSource'],
            equals: 'interest_product_registration'
          }
        }
      });

      // 이전 테스트에서 생성된 것들 제외하고 새로 생성된 것이 없어야 함
      const recentRequests = batchRequests.filter(
        req => new Date(req.createdAt) > new Date(Date.now() - 10000)
      );
      expect(recentRequests).toHaveLength(0);
    });
  });

  describe('동시성 테스트', () => {
    it('동시에 같은 상품에 대한 관심 상품 등록 시 하나의 배치 분석 요청만 생성되어야 함', async () => {
      const testUrl = 'https://www.coupang.com/vp/products/concurrency-test';
      
      // 동시에 여러 요청 전송
      const promises = Array(3).fill().map(() =>
        request(app)
          .post('/api/interests')
          .set('Authorization', authToken)
          .send({
            productUrl: testUrl,
            analysisFrequency: 'daily'
          })
      );

      const responses = await Promise.allSettled(promises);
      
      // 하나는 성공, 나머지는 중복 에러
      const successCount = responses.filter(
        result => result.status === 'fulfilled' && result.value.status === 201
      ).length;
      const duplicateCount = responses.filter(
        result => result.status === 'fulfilled' && result.value.status === 409
      ).length;

      expect(successCount).toBe(1);
      expect(duplicateCount).toBe(2);

      // 배치 분석 요청이 하나만 생성되었는지 확인
      const batchRequests = await prisma.batchAnalysisRequest.findMany({
        where: {
          userId: testUser.id,
          product: { url: testUrl }
        }
      });

      expect(batchRequests).toHaveLength(1);
    });
  });
});

describe('Performance Tests', () => {
  describe.skip('대용량 데이터 처리', () => {
    it('1000개의 배치 분석 요청 조회 성능 테스트', async () => {
      // 성능 테스트는 실제 환경에서만 실행
      const startTime = Date.now();
      
      const response = await request(app)
        .get('/api/batch-analysis/requests/pending')
        .query({ limit: 1000 });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(response.status).toBe(200);
      expect(responseTime).toBeLessThan(5000); // 5초 이내
    });
  });
});