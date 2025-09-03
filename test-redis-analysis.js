/**
 * Redis 기반 분석 시스템 테스트 스크립트
 * 
 * 사용법:
 * 1. Redis 서버가 실행 중인지 확인
 * 2. 환경변수 설정 확인 (REDIS_URL)
 * 3. node test-redis-analysis.js 실행
 */

require('dotenv').config();
const RedisAnalysisRequest = require('./models/redisAnalysisRequest');
const RedisAnalysisQueue = require('./models/redisAnalysisQueue');

async function testRedisAnalysisSystem() {
  console.log('🚀 Starting Redis Analysis System test...\n');
  
  const redisRequest = new RedisAnalysisRequest();
  const redisQueue = new RedisAnalysisQueue();
  
  try {
    // 1. 환경변수 확인
    console.log('📋 Environment Configuration:');
    console.log(`  - REDIS_URL: ${process.env.REDIS_URL || 'redis://localhost:6379'}`);
    console.log();

    // 2. Redis 연결 테스트
    console.log('🔌 Testing Redis connection...');
    const stats = await redisRequest.getStats();
    console.log(`✅ Redis connected successfully. Current requests: ${stats.total}`);
    console.log();

    // 3. 분석 요청 생성 테스트
    console.log('📝 Testing analysis request creation...');
    const testRequest1 = await redisRequest.create({
      userId: 'test-user-1',
      productId: 'test-product-123',
      requestType: 'realtime',
      dagId: 'single_product_analysis',
      dagRunId: 'test-dag-run-1',
      metadata: {
        productUrl: 'https://www.coupang.com/products/test-product-123',
        triggerType: 'single_product',
      },
    });
    
    console.log(`✅ Analysis request created: ${testRequest1.taskId}`);
    console.log(`  - Status: ${testRequest1.status}`);
    console.log(`  - User ID: ${testRequest1.userId}`);
    console.log(`  - Product ID: ${testRequest1.productId}`);
    console.log();

    // 4. 분석 락 및 큐 테스트
    console.log('🔒 Testing analysis lock and queue...');
    const lockAcquired = await redisQueue.acquireLock('test-product-123', testRequest1.taskId);
    console.log(`✅ Lock acquired: ${lockAcquired}`);
    
    const queueInfo = await redisQueue.addToQueue('test-product-123', 'test-user-1', testRequest1.taskId, 'realtime');
    console.log(`✅ Added to queue: ${queueInfo.userCount} users`);
    console.log();

    // 5. 중복 요청 테스트 (같은 상품에 다른 사용자)
    console.log('👥 Testing concurrent requests...');
    const testRequest2 = await redisRequest.create({
      userId: 'test-user-2',
      productId: 'test-product-123',
      requestType: 'realtime',
    });
    
    const lockAcquired2 = await redisQueue.acquireLock('test-product-123', testRequest2.taskId);
    console.log(`✅ Second lock acquired: ${lockAcquired2} (should be false)`);
    
    if (!lockAcquired2) {
      const queueInfo2 = await redisQueue.addToQueue('test-product-123', 'test-user-2', testRequest1.taskId, 'realtime');
      console.log(`✅ Second user added to existing queue: ${queueInfo2.userCount} users`);
    }
    console.log();

    // 6. 상태 조회 테스트
    console.log('🔍 Testing status retrieval...');
    const retrievedRequest = await redisRequest.findByTaskId(testRequest1.taskId);
    console.log(`✅ Request retrieved: ${retrievedRequest ? 'Success' : 'Failed'}`);
    
    const activeRequests = await redisRequest.findActiveByUserId('test-user-1');
    console.log(`✅ Active requests for user: ${activeRequests.length}`);
    
    const queueStatus = await redisQueue.getQueue('test-product-123');
    console.log(`✅ Queue status: ${queueStatus.userCount} users, status: ${queueStatus.status}`);
    console.log();

    // 7. 상태 업데이트 테스트
    console.log('📊 Testing status updates...');
    await redisRequest.updateProgress(testRequest1.taskId, 25, 'crawling_reviews');
    console.log('✅ Progress updated to 25%');
    
    await redisRequest.updateProgress(testRequest1.taskId, 50, 'analyzing_sentiment');
    console.log('✅ Progress updated to 50%');
    
    await redisRequest.updateProgress(testRequest1.taskId, 100, 'completed');
    console.log('✅ Progress updated to 100% (completed)');
    console.log();

    // 8. 완료 처리 테스트
    console.log('🎯 Testing completion flow...');
    await redisRequest.markAsCompleted(testRequest1.taskId, {
      sentiment: { positive: 0.7, negative: 0.2, neutral: 0.1 },
      summary: 'Test analysis completed successfully',
      totalReviews: 150,
    });
    console.log('✅ Request marked as completed');
    
    await redisQueue.releaseLock('test-product-123', testRequest1.taskId);
    console.log('✅ Lock released');
    
    await redisQueue.completeQueue('test-product-123');
    console.log('✅ Queue completed');
    console.log();

    // 9. 통계 확인
    console.log('📈 System Statistics:');
    const finalStats = await redisRequest.getStats();
    console.log(`  - Total requests: ${finalStats.total}`);
    console.log(`  - Pending: ${finalStats.pending || 0}`);
    console.log(`  - Processing: ${finalStats.processing || 0}`);
    console.log(`  - Completed: ${finalStats.completed || 0}`);
    console.log(`  - Failed: ${finalStats.failed || 0}`);
    
    const queueStats = await redisQueue.getStats();
    console.log(`  - Active locks: ${queueStats.activeLocks}`);
    console.log(`  - Active queues: ${queueStats.activeQueues}`);
    console.log(`  - Total users in queues: ${queueStats.totalUsers}`);
    console.log();

    // 10. 정리 테스트
    console.log('🧹 Testing cleanup...');
    const cleanupStats = await redisRequest.cleanup();
    console.log(`✅ Cleaned up ${cleanupStats} expired requests`);
    
    const queueCleanupStats = await redisQueue.cleanup();
    console.log(`✅ Cleaned up ${queueCleanupStats.cleanedLocks} locks, ${queueCleanupStats.cleanedQueues} queues`);
    console.log();

    // 11. 테스트 데이터 정리
    console.log('🗑️ Cleaning up test data...');
    await redisRequest.delete(testRequest1.taskId);
    await redisRequest.delete(testRequest2.taskId);
    console.log('✅ Test data cleaned up');
    console.log();

    console.log('🎉 All tests completed successfully!');
    console.log('\n✨ Redis Analysis System is working properly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check if Redis server is running');
    console.error('2. Verify REDIS_URL environment variable');
    console.error('3. Check Redis connection and permissions');
    console.error('4. Ensure required Redis modules are available');
    process.exit(1);
  }
}

// 테스트 실행
if (require.main === module) {
  testRedisAnalysisSystem()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Unhandled error:', error);
      process.exit(1);
    });
}

module.exports = testRedisAnalysisSystem;

