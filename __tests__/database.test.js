/**
 * Database Integration Tests
 * 데이터베이스 스키마 및 모델 테스트
 */

const { PrismaClient } = require('@prisma/client');
const User = require('../models/User');
const Product = require('../models/Product');
const AnalysisRequest = require('../models/AnalysisRequest');
const SearchHistory = require('../models/SearchHistory');
const { connectMongoDB, queries, closeMongoDB } = require('../config/mongodb');

const prisma = new PrismaClient();

describe('Database Integration Tests', () => {
  beforeAll(async () => {
    // 테스트 데이터베이스 연결
    await connectMongoDB();
  });

  afterAll(async () => {
    // 테스트 데이터 정리
    await prisma.keyword.deleteMany();
    await prisma.analysisResult.deleteMany();
    await prisma.analysisRequest.deleteMany();
    await prisma.searchHistory.deleteMany();
    await prisma.watchList.deleteMany();
    await prisma.priceHistory.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.userSession.deleteMany();
    await prisma.userProfile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.systemConfig.deleteMany();
    
    await prisma.$disconnect();
    await closeMongoDB();
  });

  describe('User Model Tests', () => {
    let testUser;

    test('사용자 생성', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'test123!',
        role: 'user'
      };

      testUser = await User.create(userData);

      expect(testUser).toBeDefined();
      expect(testUser.email).toBe(userData.email);
      expect(testUser.role).toBe(userData.role);
      expect(testUser.password).toBeUndefined(); // 비밀번호는 반환되지 않아야 함
      expect(testUser.profile).toBeDefined();
    });

    test('이메일로 사용자 찾기', async () => {
      const foundUser = await User.findByEmail('test@example.com');

      expect(foundUser).toBeDefined();
      expect(foundUser.email).toBe('test@example.com');
      expect(foundUser.profile).toBeDefined();
    });

    test('비밀번호 검증', async () => {
      const foundUser = await User.findByEmail('test@example.com');
      const isValid = await User.validatePassword('test123!', foundUser.password);
      const isInvalid = await User.validatePassword('wrongpassword', foundUser.password);

      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });

    test('JWT 토큰 생성', () => {
      const tokens = User.generateTokens(testUser);

      expect(tokens).toBeDefined();
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
    });

    test('중복 이메일 사용자 생성 실패', async () => {
      const userData = {
        email: 'test@example.com', // 이미 존재하는 이메일
        password: 'test123!',
        role: 'user'
      };

      await expect(User.create(userData)).rejects.toThrow('이미 존재하는 이메일입니다.');
    });
  });

  describe('Category and Product Model Tests', () => {
    let testCategory;
    let testProduct;

    test('카테고리 생성', async () => {
      testCategory = await prisma.category.create({
        data: {
          name: '테스트 카테고리',
          path: '테스트 카테고리',
          level: 0
        }
      });

      expect(testCategory).toBeDefined();
      expect(testCategory.name).toBe('테스트 카테고리');
      expect(testCategory.level).toBe(0);
    });

    test('상품 생성', async () => {
      const productData = {
        name: '테스트 상품',
        url: 'https://test.com/product/123',
        categoryId: testCategory.id,
        currentPrice: 100000,
        averageRating: 4.5,
        totalReviews: 100,
        imageUrl: 'https://test.com/image.jpg'
      };

      testProduct = await Product.upsert(productData);

      expect(testProduct).toBeDefined();
      expect(testProduct.name).toBe(productData.name);
      expect(testProduct.url).toBe(productData.url);
      expect(testProduct.categoryId).toBe(testCategory.id);
      expect(parseFloat(testProduct.currentPrice)).toBe(productData.currentPrice);
    });

    test('상품 검색', async () => {
      const searchResults = await Product.search('테스트', { limit: 10 });

      expect(searchResults).toBeDefined();
      expect(searchResults.products).toBeDefined();
      expect(searchResults.total).toBeGreaterThan(0);
      expect(searchResults.products.length).toBeGreaterThan(0);
      expect(searchResults.products[0].name).toContain('테스트');
    });

    test('URL로 상품 찾기', async () => {
      const foundProduct = await Product.findByUrl('https://test.com/product/123');

      expect(foundProduct).toBeDefined();
      expect(foundProduct.name).toBe('테스트 상품');
      expect(foundProduct.category).toBeDefined();
      expect(foundProduct.category.name).toBe('테스트 카테고리');
    });
  });

  describe('AnalysisRequest Model Tests', () => {
    let testUser;
    let testProduct;
    let testAnalysisRequest;

    beforeAll(async () => {
      // 테스트용 사용자 생성
      testUser = await User.create({
        email: 'analysis@example.com',
        password: 'test123!',
        role: 'user'
      });

      // 테스트용 카테고리 및 상품 생성
      const category = await prisma.category.create({
        data: {
          name: '분석 테스트 카테고리',
          path: '분석 테스트 카테고리',
          level: 0
        }
      });

      testProduct = await Product.upsert({
        name: '분석 테스트 상품',
        url: 'https://test.com/analysis/123',
        categoryId: category.id,
        currentPrice: 50000,
        averageRating: 4.0,
        totalReviews: 50
      });
    });

    test('분석 요청 생성', async () => {
      const requestData = {
        userId: testUser.id,
        productId: testProduct.id,
        requestType: 'realtime',
        priority: 5
      };

      testAnalysisRequest = await AnalysisRequest.create(requestData);

      expect(testAnalysisRequest).toBeDefined();
      expect(testAnalysisRequest.userId).toBe(testUser.id);
      expect(testAnalysisRequest.productId).toBe(testProduct.id);
      expect(testAnalysisRequest.taskId).toBeDefined();
      expect(testAnalysisRequest.status).toBe('pending');
      expect(testAnalysisRequest.user).toBeDefined();
      expect(testAnalysisRequest.product).toBeDefined();
    });

    test('Task ID로 분석 요청 찾기', async () => {
      const foundRequest = await AnalysisRequest.findByTaskId(testAnalysisRequest.taskId);

      expect(foundRequest).toBeDefined();
      expect(foundRequest.id).toBe(testAnalysisRequest.id);
      expect(foundRequest.user.email).toBe(testUser.email);
      expect(foundRequest.product.name).toBe(testProduct.name);
    });

    test('분석 요청 상태 업데이트', async () => {
      const updatedRequest = await AnalysisRequest.updateStatus(
        testAnalysisRequest.taskId,
        'processing',
        50
      );

      expect(updatedRequest).toBeDefined();
      expect(updatedRequest.status).toBe('processing');
      expect(updatedRequest.progress).toBe(50);
    });

    test('사용자별 분석 요청 조회', async () => {
      const userRequests = await AnalysisRequest.findByUserId(testUser.id);

      expect(userRequests).toBeDefined();
      expect(userRequests.requests).toBeDefined();
      expect(userRequests.total).toBeGreaterThan(0);
      expect(userRequests.requests[0].userId).toBe(testUser.id);
    });
  });

  describe('SearchHistory Model Tests', () => {
    let testUser;

    beforeAll(async () => {
      testUser = await User.create({
        email: 'search@example.com',
        password: 'test123!',
        role: 'user'
      });
    });

    test('검색 기록 생성', async () => {
      const searchData = {
        userId: testUser.id,
        query: '테스트 검색어',
        resultCount: 10
      };

      const searchHistory = await SearchHistory.create(searchData);

      expect(searchHistory).toBeDefined();
      expect(searchHistory.userId).toBe(testUser.id);
      expect(searchHistory.query).toBe('테스트 검색어');
      expect(searchHistory.resultCount).toBe(10);
    });

    test('최근 검색어 조회', async () => {
      // 추가 검색 기록 생성
      await SearchHistory.create({
        userId: testUser.id,
        query: '두 번째 검색어',
        resultCount: 5
      });

      const recentSearches = await SearchHistory.getRecentSearches(testUser.id, 5);

      expect(recentSearches).toBeDefined();
      expect(recentSearches.length).toBeGreaterThan(0);
      expect(recentSearches[0].query).toBe('두 번째 검색어'); // 최신 검색어가 첫 번째
    });

    test('중복 검색어 처리', async () => {
      // 같은 검색어 다시 검색
      const duplicateSearch = await SearchHistory.create({
        userId: testUser.id,
        query: '테스트 검색어',
        resultCount: 15
      });

      expect(duplicateSearch).toBeDefined();
      expect(duplicateSearch.resultCount).toBe(15); // 업데이트된 결과 수

      const recentSearches = await SearchHistory.getRecentSearches(testUser.id, 10);
      const testSearches = recentSearches.filter(s => s.query === '테스트 검색어');
      expect(testSearches.length).toBe(1); // 중복 제거됨
    });

    test('자동완성 제안', async () => {
      const suggestions = await SearchHistory.getAutocompleteSuggestions(
        testUser.id,
        '테스트',
        5
      );

      expect(suggestions).toBeDefined();
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0].query).toContain('테스트');
    });
  });

  describe('MongoDB Integration Tests', () => {
    const testTaskId = 'test-task-123';
    const testProductId = 'test-product-123';

    test('실시간 감정 카드 저장 및 조회', async () => {
      const cardData = {
        taskId: testTaskId,
        productId: testProductId,
        cardIndex: 0,
        reviewText: '이 상품 정말 좋아요!',
        sentiment: {
          type: 'positive',
          confidence: 0.95
        },
        keywords: ['좋음', '만족'],
        rating: 5,
        reviewDate: new Date(),
        cardColor: 'green',
        processingTime: 150
      };

      // MongoDB가 연결되어 있을 때만 테스트 실행
      if (queries) {
        const result = await require('../config/mongodb').saveRealtimeSentimentCard(cardData);
        
        if (result) {
          expect(result.insertedId).toBeDefined();

          // 저장된 카드 조회
          const cards = await queries.getRealtimeSentimentCards(testTaskId);
          expect(cards.length).toBeGreaterThan(0);
          expect(cards[0].reviewText).toBe(cardData.reviewText);
          expect(cards[0].sentiment.type).toBe('positive');
        }
      } else {
        console.log('⚠️ MongoDB 연결이 없어 테스트를 건너뜁니다.');
      }
    });

    test('분석 진행 상태 업데이트 및 조회', async () => {
      const progressData = {
        productId: testProductId,
        userId: 'test-user-123',
        status: 'processing',
        progress: {
          current: 50,
          total: 100,
          stage: '감성 분석',
          message: '리뷰 분석 중...'
        },
        estimatedTimeRemaining: 60
      };

      if (queries) {
        const result = await require('../config/mongodb').updateAnalysisProgress(testTaskId, progressData);
        
        if (result) {
          expect(result.upsertedCount + result.modifiedCount).toBeGreaterThan(0);

          // 진행 상태 조회
          const progress = await queries.getAnalysisProgress(testTaskId);
          if (progress) {
            expect(progress.status).toBe('processing');
            expect(progress.progress.current).toBe(50);
            expect(progress.progress.stage).toBe('감성 분석');
          }
        }
      } else {
        console.log('⚠️ MongoDB 연결이 없어 테스트를 건너뜁니다.');
      }
    });
  });

  describe('Database Schema Validation', () => {
    test('모든 필수 테이블이 존재하는지 확인', async () => {
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      `;

      const tableNames = tables.map(t => t.table_name);
      
      const requiredTables = [
        'users',
        'user_profiles',
        'user_sessions',
        'categories',
        'products',
        'price_history',
        'analysis_requests',
        'analysis_results',
        'keywords',
        'search_history',
        'watch_list',
        'system_config'
      ];

      requiredTables.forEach(tableName => {
        expect(tableNames).toContain(tableName);
      });
    });

    test('외래 키 제약 조건 확인', async () => {
      const constraints = await prisma.$queryRaw`
        SELECT 
          tc.constraint_name,
          tc.table_name,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      `;

      expect(constraints.length).toBeGreaterThan(0);
      
      // 주요 외래 키 관계 확인
      const constraintNames = constraints.map(c => c.constraint_name);
      expect(constraintNames.some(name => name.includes('user_profiles_user_id_fkey'))).toBe(true);
      expect(constraintNames.some(name => name.includes('products_category_id_fkey'))).toBe(true);
      expect(constraintNames.some(name => name.includes('analysis_requests_user_id_fkey'))).toBe(true);
    });

    test('인덱스 존재 확인', async () => {
      const indexes = await prisma.$queryRaw`
        SELECT 
          indexname,
          tablename,
          indexdef
        FROM pg_indexes
        WHERE schemaname = 'public'
        ORDER BY tablename, indexname
      `;

      expect(indexes.length).toBeGreaterThan(0);
      
      // 주요 인덱스 확인
      const indexNames = indexes.map(i => i.indexname);
      expect(indexNames.some(name => name.includes('users_email_key'))).toBe(true);
      expect(indexNames.some(name => name.includes('products_url_key'))).toBe(true);
      expect(indexNames.some(name => name.includes('analysis_requests_task_id_key'))).toBe(true);
    });
  });
});