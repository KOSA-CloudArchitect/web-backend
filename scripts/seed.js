/**
 * Database Seed Script
 * 테스트용 더미 데이터 생성 스크립트
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// 더미 데이터 생성 함수들
async function createCategories() {
  console.log('📁 카테고리 데이터 생성 중...');
  
  const categories = [
    {
      name: '가전',
      path: '가전',
      level: 0,
      children: [
        {
          name: '휴대폰',
          path: '가전 > 휴대폰',
          level: 1,
          children: [
            { name: '스마트폰', path: '가전 > 휴대폰 > 스마트폰', level: 2 },
            { name: '피처폰', path: '가전 > 휴대폰 > 피처폰', level: 2 }
          ]
        },
        {
          name: '컴퓨터',
          path: '가전 > 컴퓨터',
          level: 1,
          children: [
            { name: '노트북', path: '가전 > 컴퓨터 > 노트북', level: 2 },
            { name: '데스크톱', path: '가전 > 컴퓨터 > 데스크톱', level: 2 }
          ]
        }
      ]
    },
    {
      name: '패션',
      path: '패션',
      level: 0,
      children: [
        {
          name: '의류',
          path: '패션 > 의류',
          level: 1,
          children: [
            { name: '상의', path: '패션 > 의류 > 상의', level: 2 },
            { name: '하의', path: '패션 > 의류 > 하의', level: 2 }
          ]
        }
      ]
    },
    {
      name: '생활용품',
      path: '생활용품',
      level: 0,
      children: [
        {
          name: '주방용품',
          path: '생활용품 > 주방용품',
          level: 1,
          children: [
            { name: '조리도구', path: '생활용품 > 주방용품 > 조리도구', level: 2 }
          ]
        }
      ]
    }
  ];

  const createdCategories = new Map();

  // 재귀적으로 카테고리 생성
  async function createCategoryTree(categoryData, parentId = null) {
    const { children, ...categoryInfo } = categoryData;
    
    const category = await prisma.category.create({
      data: {
        ...categoryInfo,
        parentId
      }
    });

    createdCategories.set(categoryInfo.name, category.id);

    if (children && children.length > 0) {
      for (const child of children) {
        await createCategoryTree(child, category.id);
      }
    }

    return category;
  }

  for (const category of categories) {
    await createCategoryTree(category);
  }

  console.log(`✅ ${createdCategories.size}개 카테고리 생성 완료`);
  return createdCategories;
}

async function createUsers() {
  console.log('👥 사용자 데이터 생성 중...');
  
  const users = [
    {
      email: 'admin@highpipe.com',
      password: 'admin123!',
      role: 'admin',
      profile: {
        firstName: '관리자',
        lastName: '시스템',
        language: 'ko',
        timezone: 'Asia/Seoul'
      }
    },
    {
      email: 'user1@example.com',
      password: 'user123!',
      role: 'user',
      profile: {
        firstName: '김',
        lastName: '철수',
        language: 'ko',
        timezone: 'Asia/Seoul'
      }
    },
    {
      email: 'user2@example.com',
      password: 'user123!',
      role: 'user',
      profile: {
        firstName: '이',
        lastName: '영희',
        language: 'ko',
        timezone: 'Asia/Seoul'
      }
    },
    {
      email: 'tester@example.com',
      password: 'test123!',
      role: 'user',
      profile: {
        firstName: '테스트',
        lastName: '사용자',
        language: 'ko',
        timezone: 'Asia/Seoul'
      }
    }
  ];

  const createdUsers = [];

  for (const userData of users) {
    const { profile, ...userInfo } = userData;
    const hashedPassword = await bcrypt.hash(userInfo.password, 12);

    const user = await prisma.user.create({
      data: {
        ...userInfo,
        password: hashedPassword,
        emailVerified: true,
        profile: {
          create: profile
        }
      },
      include: {
        profile: true
      }
    });

    createdUsers.push(user);
  }

  console.log(`✅ ${createdUsers.length}명 사용자 생성 완료`);
  return createdUsers;
}

async function createProducts(categories) {
  console.log('📱 상품 데이터 생성 중...');
  
  const products = [
    {
      name: '삼성 갤럭시 S24 Ultra 256GB',
      url: 'https://www.coupang.com/vp/products/7654321',
      categoryName: '스마트폰',
      currentPrice: 1299000,
      averageRating: 4.5,
      totalReviews: 1250,
      imageUrl: 'https://example.com/galaxy-s24-ultra.jpg'
    },
    {
      name: '아이폰 15 Pro 128GB',
      url: 'https://www.coupang.com/vp/products/7654322',
      categoryName: '스마트폰',
      currentPrice: 1350000,
      averageRating: 4.7,
      totalReviews: 890,
      imageUrl: 'https://example.com/iphone-15-pro.jpg'
    },
    {
      name: 'LG 그램 17인치 노트북',
      url: 'https://www.coupang.com/vp/products/7654323',
      categoryName: '노트북',
      currentPrice: 1890000,
      averageRating: 4.3,
      totalReviews: 456,
      imageUrl: 'https://example.com/lg-gram-17.jpg'
    },
    {
      name: '맥북 에어 M3 13인치',
      url: 'https://www.coupang.com/vp/products/7654324',
      categoryName: '노트북',
      currentPrice: 1590000,
      averageRating: 4.8,
      totalReviews: 723,
      imageUrl: 'https://example.com/macbook-air-m3.jpg'
    },
    {
      name: '나이키 에어맥스 운동화',
      url: 'https://www.coupang.com/vp/products/7654325',
      categoryName: '상의', // 임시로 상의 카테고리 사용
      currentPrice: 129000,
      averageRating: 4.2,
      totalReviews: 2340,
      imageUrl: 'https://example.com/nike-airmax.jpg'
    },
    {
      name: '쿠쿠 전기밥솥 6인용',
      url: 'https://www.coupang.com/vp/products/7654326',
      categoryName: '조리도구',
      currentPrice: 89000,
      averageRating: 4.6,
      totalReviews: 1567,
      imageUrl: 'https://example.com/cuckoo-ricecooker.jpg'
    }
  ];

  const createdProducts = [];

  for (const productData of products) {
    const { categoryName, ...productInfo } = productData;
    const categoryId = categories.get(categoryName);

    const product = await prisma.product.create({
      data: {
        ...productInfo,
        categoryId
      }
    });

    // 가격 이력 생성 (최근 30일)
    const priceHistory = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // 가격 변동 시뮬레이션 (±10% 범위)
      const basePrice = productInfo.currentPrice;
      const variation = (Math.random() - 0.5) * 0.2; // -10% ~ +10%
      const price = Math.round(basePrice * (1 + variation));

      priceHistory.push({
        productId: product.id,
        price,
        createdAt: date
      });
    }

    await prisma.priceHistory.createMany({
      data: priceHistory
    });

    createdProducts.push(product);
  }

  console.log(`✅ ${createdProducts.length}개 상품 생성 완료`);
  return createdProducts;
}

async function createAnalysisData(products, users) {
  console.log('📊 분석 데이터 생성 중...');
  
  const analysisRequests = [];
  const analysisResults = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const user = users[i % users.length]; // 사용자 순환 할당

    // 분석 요청 생성
    const request = await prisma.analysisRequest.create({
      data: {
        userId: user.id,
        productId: product.id,
        taskId: `task-${Date.now()}-${i}`,
        status: 'completed',
        progress: 100,
        requestType: 'realtime',
        priority: Math.floor(Math.random() * 10) + 1,
        completedAt: new Date()
      }
    });

    analysisRequests.push(request);

    // 분석 결과 생성
    const sentimentPositive = Math.random() * 0.4 + 0.3; // 30-70%
    const sentimentNegative = Math.random() * 0.3 + 0.1; // 10-40%
    const sentimentNeutral = 1 - sentimentPositive - sentimentNegative;

    const keywords = [
      { keyword: '좋음', sentiment: 'positive', frequency: Math.floor(Math.random() * 100) + 50 },
      { keyword: '만족', sentiment: 'positive', frequency: Math.floor(Math.random() * 80) + 30 },
      { keyword: '빠름', sentiment: 'positive', frequency: Math.floor(Math.random() * 60) + 20 },
      { keyword: '비쌈', sentiment: 'negative', frequency: Math.floor(Math.random() * 40) + 10 },
      { keyword: '무거움', sentiment: 'negative', frequency: Math.floor(Math.random() * 30) + 5 },
      { keyword: '보통', sentiment: 'neutral', frequency: Math.floor(Math.random() * 50) + 15 }
    ];

    const result = await prisma.analysisResult.create({
      data: {
        productId: product.id,
        taskId: request.taskId,
        status: 'completed',
        sentimentPositive,
        sentimentNegative,
        sentimentNeutral,
        summary: `${product.name}에 대한 리뷰 분석 결과입니다. 전반적으로 ${sentimentPositive > 0.5 ? '긍정적인' : '보통의'} 반응을 보이고 있습니다.`,
        keywords: {
          positive: keywords.filter(k => k.sentiment === 'positive'),
          negative: keywords.filter(k => k.sentiment === 'negative'),
          neutral: keywords.filter(k => k.sentiment === 'neutral')
        },
        totalReviews: product.totalReviews,
        averageRating: product.averageRating,
        ratingDistribution: {
          1: Math.floor(Math.random() * 50) + 10,
          2: Math.floor(Math.random() * 80) + 20,
          3: Math.floor(Math.random() * 150) + 50,
          4: Math.floor(Math.random() * 300) + 100,
          5: Math.floor(Math.random() * 400) + 200
        },
        processingTime: Math.floor(Math.random() * 120) + 30 // 30-150초
      }
    });

    // 키워드 상세 정보 생성
    for (const keywordData of keywords) {
      await prisma.keyword.create({
        data: {
          analysisResultId: result.id,
          keyword: keywordData.keyword,
          sentiment: keywordData.sentiment,
          frequency: keywordData.frequency,
          confidence: Math.random() * 0.3 + 0.7 // 70-100%
        }
      });
    }

    analysisResults.push(result);
  }

  console.log(`✅ ${analysisRequests.length}개 분석 요청 및 결과 생성 완료`);
  return { analysisRequests, analysisResults };
}

async function createSearchHistory(users) {
  console.log('🔍 검색 기록 생성 중...');
  
  const searchQueries = [
    '아이폰 15',
    '갤럭시 S24',
    '노트북',
    '맥북',
    '운동화',
    '전기밥솥',
    '무선이어폰',
    '스마트워치',
    '태블릿',
    '키보드'
  ];

  const searchHistory = [];

  for (const user of users) {
    // 각 사용자마다 5-15개의 검색 기록 생성
    const searchCount = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < searchCount; i++) {
      const query = searchQueries[Math.floor(Math.random() * searchQueries.length)];
      const resultCount = Math.floor(Math.random() * 100) + 10;
      
      // 최근 30일 내 랜덤 날짜
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));

      const search = await prisma.searchHistory.create({
        data: {
          userId: user.id,
          query,
          resultCount,
          createdAt
        }
      });

      searchHistory.push(search);
    }
  }

  console.log(`✅ ${searchHistory.length}개 검색 기록 생성 완료`);
  return searchHistory;
}

async function createWatchList(users, products) {
  console.log('⭐ 관심 상품 생성 중...');
  
  const watchList = [];

  for (const user of users) {
    // 각 사용자마다 2-4개의 관심 상품 생성
    const watchCount = Math.floor(Math.random() * 3) + 2;
    const selectedProducts = products
      .sort(() => 0.5 - Math.random())
      .slice(0, watchCount);

    for (const product of selectedProducts) {
      const targetPrice = product.currentPrice * (0.8 + Math.random() * 0.2); // 80-100% 가격

      const watchItem = await prisma.watchList.create({
        data: {
          userId: user.id,
          productId: product.id,
          priceAlert: Math.random() > 0.3, // 70% 확률로 가격 알림 설정
          targetPrice,
          analysisFrequency: ['daily', 'weekly', 'monthly'][Math.floor(Math.random() * 3)]
        }
      });

      watchList.push(watchItem);
    }
  }

  console.log(`✅ ${watchList.length}개 관심 상품 생성 완료`);
  return watchList;
}

async function createSystemConfig() {
  console.log('⚙️ 시스템 설정 생성 중...');
  
  const configs = [
    {
      key: 'analysis_settings',
      value: {
        maxConcurrentAnalysis: 5,
        defaultTimeout: 300,
        retryAttempts: 3,
        enableRealTimeUpdates: true
      }
    },
    {
      key: 'cache_settings',
      value: {
        analysisResultTTL: 3600,
        searchResultTTL: 1800,
        popularSearchTTL: 900
      }
    },
    {
      key: 'notification_settings',
      value: {
        enableEmailNotifications: true,
        enablePushNotifications: true,
        priceAlertThreshold: 0.1
      }
    }
  ];

  const createdConfigs = [];

  for (const config of configs) {
    const created = await prisma.systemConfig.create({
      data: config
    });
    createdConfigs.push(created);
  }

  console.log(`✅ ${createdConfigs.length}개 시스템 설정 생성 완료`);
  return createdConfigs;
}

// 메인 시드 함수
async function main() {
  console.log('🌱 데이터베이스 시드 시작...');
  
  try {
    // 기존 데이터 정리 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 기존 데이터 정리 중...');
      
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
      
      console.log('✅ 기존 데이터 정리 완료');
    }

    // 데이터 생성
    const categories = await createCategories();
    const users = await createUsers();
    const products = await createProducts(categories);
    const { analysisRequests, analysisResults } = await createAnalysisData(products, users);
    const searchHistory = await createSearchHistory(users);
    const watchList = await createWatchList(users, products);
    const systemConfigs = await createSystemConfig();

    console.log('\n🎉 데이터베이스 시드 완료!');
    console.log('📊 생성된 데이터 요약:');
    console.log(`   - 카테고리: ${categories.size}개`);
    console.log(`   - 사용자: ${users.length}명`);
    console.log(`   - 상품: ${products.length}개`);
    console.log(`   - 분석 요청: ${analysisRequests.length}개`);
    console.log(`   - 분석 결과: ${analysisResults.length}개`);
    console.log(`   - 검색 기록: ${searchHistory.length}개`);
    console.log(`   - 관심 상품: ${watchList.length}개`);
    console.log(`   - 시스템 설정: ${systemConfigs.length}개`);

    console.log('\n🔑 테스트 계정 정보:');
    console.log('   - 관리자: admin@highpipe.com / admin123!');
    console.log('   - 사용자1: user1@example.com / user123!');
    console.log('   - 사용자2: user2@example.com / user123!');
    console.log('   - 테스터: tester@example.com / test123!');

  } catch (error) {
    console.error('❌ 시드 실행 중 오류 발생:', error);
    throw error;
  }
}

// 스크립트 실행
main()
  .catch((e) => {
    console.error('❌ 시드 실행 실패:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });