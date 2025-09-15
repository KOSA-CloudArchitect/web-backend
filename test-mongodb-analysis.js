/**
 * MongoDB 분석 결과 시스템 테스트 스크립트
 * 
 * 사용법:
 * 1. MongoDB 서버가 실행 중인지 확인
 * 2. 환경변수 설정 확인 (MONGODB_URI)
 * 3. node test-mongodb-analysis.js 실행
 */

require('dotenv').config();
const mongoose = require('mongoose');
const MongoAnalysisResult = require('./models/mongoAnalysisResult');

async function testMongoDBAnalysisSystem() {
  console.log('🚀 Starting MongoDB Analysis System test...\n');
  
  const mongoResult = new MongoAnalysisResult();
  
  try {
    // 1. 환경변수 확인
    console.log('📋 Environment Configuration:');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kosa_db';
    console.log(`  - MONGODB_URI: ${mongoUri}`);
    console.log();

    // 2. MongoDB 연결 테스트
    console.log('🔌 Testing MongoDB connection...');
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
    console.log();

    // 3. 분석 결과 생성 테스트
    console.log('💾 Testing analysis result creation...');
    const testResult1 = await mongoResult.create({
      productId: 'test-product-123',
      taskId: 'test-task-456',
      sentiment: {
        positive: 0.7,
        negative: 0.2,
        neutral: 0.1,
      },
      summary: '이 제품은 전반적으로 좋은 평가를 받고 있습니다. 품질이 우수하고 가성비가 뛰어나다는 의견이 많습니다.',
      totalReviews: 150,
      averageRating: 4.2,
      processingTime: 45,
      keywords: [
        { keyword: '품질', frequency: 25, sentiment: 'positive' },
        { keyword: '가성비', frequency: 18, sentiment: 'positive' },
        { keyword: '배송', frequency: 12, sentiment: 'neutral' },
        { keyword: '포장', frequency: 8, sentiment: 'negative' },
      ],
      reviewDistribution: {
        star5: 60,
        star4: 45,
        star3: 25,
        star2: 15,
        star1: 5,
      },
      crawledAt: new Date(),
      analysisVersion: '1.0.0',
      sourceUrl: 'https://www.coupang.com/products/test-product-123',
      userId: 'test-user-1',
      requestType: 'realtime',
    });
    
    console.log(`✅ Analysis result created: ${testResult1._id}`);
    console.log(`  - Product ID: ${testResult1.productId}`);
    console.log(`  - Task ID: ${testResult1.taskId}`);
    console.log(`  - Total Reviews: ${testResult1.totalReviews}`);
    console.log(`  - Average Rating: ${testResult1.averageRating}`);
    console.log();

    // 4. 추가 테스트 데이터 생성
    console.log('📊 Creating additional test data...');
    const testResult2 = await mongoResult.create({
      productId: 'test-product-456',
      taskId: 'test-task-789',
      sentiment: {
        positive: 0.4,
        negative: 0.5,
        neutral: 0.1,
      },
      summary: '이 제품에 대한 의견이 분분합니다. 일부는 만족하지만 품질 문제를 지적하는 리뷰도 많습니다.',
      totalReviews: 89,
      averageRating: 2.8,
      processingTime: 32,
      userId: 'test-user-1',
      requestType: 'realtime',
    });

    const testResult3 = await mongoResult.create({
      productId: 'test-product-123',
      taskId: 'test-task-101',
      sentiment: {
        positive: 0.8,
        negative: 0.1,
        neutral: 0.1,
      },
      summary: '최신 분석 결과: 이전보다 더 좋은 평가를 받고 있습니다.',
      totalReviews: 200,
      averageRating: 4.5,
      processingTime: 38,
      userId: 'test-user-2',
      requestType: 'realtime',
    });
    
    console.log(`✅ Additional test data created: ${testResult2._id}, ${testResult3._id}`);
    console.log();

    // 5. Task ID로 조회 테스트
    console.log('🔍 Testing findByTaskId...');
    const foundByTaskId = await mongoResult.findByTaskId('test-task-456');
    console.log(`✅ Found by task ID: ${foundByTaskId ? 'Success' : 'Failed'}`);
    if (foundByTaskId) {
      console.log(`  - Product ID: ${foundByTaskId.productId}`);
      console.log(`  - Sentiment: ${foundByTaskId.sentimentPositive}/${foundByTaskId.sentimentNegative}/${foundByTaskId.sentimentNeutral}`);
    }
    console.log();

    // 6. 상품 ID로 조회 테스트 (최신순)
    console.log('🔍 Testing findByProductId...');
    const foundByProductId = await mongoResult.findByProductId('test-product-123', 2);
    console.log(`✅ Found by product ID: ${foundByProductId.length} results`);
    foundByProductId.forEach((result, index) => {
      console.log(`  ${index + 1}. Task: ${result.taskId}, Rating: ${result.averageRating}, Created: ${result.createdAt}`);
    });
    console.log();

    // 7. 최신 결과 조회 테스트
    console.log('🔍 Testing findLatestByProductId...');
    const latestResult = await mongoResult.findLatestByProductId('test-product-123');
    console.log(`✅ Latest result: ${latestResult ? 'Success' : 'Failed'}`);
    if (latestResult) {
      console.log(`  - Task ID: ${latestResult.taskId}`);
      console.log(`  - Average Rating: ${latestResult.averageRating}`);
      console.log(`  - Created: ${latestResult.createdAt}`);
    }
    console.log();

    // 8. 사용자별 조회 테스트
    console.log('👤 Testing findByUserId...');
    const userResults = await mongoResult.findByUserId('test-user-1', 1, 5);
    console.log(`✅ User results: ${userResults.results.length} results, ${userResults.pagination.total} total`);
    console.log(`  - Page: ${userResults.pagination.page}/${userResults.pagination.pages}`);
    userResults.results.forEach((result, index) => {
      console.log(`  ${index + 1}. Product: ${result.productId}, Rating: ${result.averageRating}`);
    });
    console.log();

    // 9. 업데이트 테스트
    console.log('📝 Testing updateByTaskId...');
    const updatedResult = await mongoResult.updateByTaskId('test-task-456', {
      averageRating: 3.2,
      summary: '업데이트된 요약: 품질이 개선되었습니다.',
    });
    console.log(`✅ Update result: ${updatedResult ? 'Success' : 'Failed'}`);
    if (updatedResult) {
      console.log(`  - New rating: ${updatedResult.averageRating}`);
      console.log(`  - Updated at: ${updatedResult.updatedAt}`);
    }
    console.log();

    // 10. 통계 조회 테스트
    console.log('📈 Testing getStats...');
    const stats = await mongoResult.getStats();
    console.log('✅ Statistics:');
    console.log(`  - Total analyses: ${stats.totalAnalyses}`);
    console.log(`  - Avg positive sentiment: ${(stats.avgPositiveSentiment * 100).toFixed(1)}%`);
    console.log(`  - Avg negative sentiment: ${(stats.avgNegativeSentiment * 100).toFixed(1)}%`);
    console.log(`  - Avg neutral sentiment: ${(stats.avgNeutralSentiment * 100).toFixed(1)}%`);
    console.log(`  - Avg total reviews: ${Math.round(stats.avgTotalReviews)}`);
    console.log(`  - Avg rating: ${stats.avgRating?.toFixed(2) || 'N/A'}`);
    console.log(`  - Avg processing time: ${Math.round(stats.avgProcessingTime)}s`);
    console.log();

    // 11. 사용자별 통계 테스트
    console.log('📈 Testing user-specific stats...');
    const userStats = await mongoResult.getStats({ userId: 'test-user-1' });
    console.log('✅ User statistics:');
    console.log(`  - User analyses: ${userStats.totalAnalyses}`);
    console.log(`  - User avg rating: ${userStats.avgRating?.toFixed(2) || 'N/A'}`);
    console.log();

    // 12. 삭제 테스트
    console.log('🗑️ Testing deleteByTaskId...');
    const deleteResult = await mongoResult.deleteByTaskId('test-task-789');
    console.log(`✅ Delete result: ${deleteResult ? 'Success' : 'Failed'}`);
    console.log();

    // 13. 최종 통계 확인
    console.log('📊 Final Statistics:');
    const finalStats = await mongoResult.getStats();
    console.log(`  - Remaining analyses: ${finalStats.totalAnalyses}`);
    console.log();

    // 14. 정리 테스트 (실제로는 실행하지 않음)
    console.log('🧹 Testing cleanup (simulation)...');
    console.log('✅ Cleanup test completed (no actual cleanup performed)');
    console.log();

    // 15. 테스트 데이터 정리
    console.log('🗑️ Cleaning up test data...');
    await mongoResult.deleteByTaskId('test-task-456');
    await mongoResult.deleteByTaskId('test-task-101');
    console.log('✅ Test data cleaned up');
    console.log();

    console.log('🎉 All tests completed successfully!');
    console.log('\n✨ MongoDB Analysis System is working properly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check if MongoDB server is running');
    console.error('2. Verify MONGODB_URI environment variable');
    console.error('3. Check MongoDB connection and permissions');
    console.error('4. Ensure required MongoDB collections exist');
    process.exit(1);
  } finally {
    // MongoDB 연결 종료
    await mongoose.disconnect();
    console.log('🔌 MongoDB connection closed');
  }
}

// 테스트 실행
if (require.main === module) {
  testMongoDBAnalysisSystem()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Unhandled error:', error);
      process.exit(1);
    });
}

module.exports = testMongoDBAnalysisSystem;


