/**
 * Airflow JWT 토큰 연동 테스트 스크립트
 * 
 * 사용법:
 * 1. Airflow 서버가 JWT 인증으로 설정되어 있는지 확인
 * 2. 환경변수 설정 확인
 * 3. node test-airflow-jwt.js 실행
 */

require('dotenv').config();
const airflowTokenManager = require('./services/airflowTokenManager');
const airflowClient = require('./services/airflowClient');

async function testAirflowJWT() {
  console.log('🚀 Starting Airflow JWT integration test...\n');
  
  try {
    // 1. 환경변수 확인
    console.log('📋 Environment Configuration:');
    console.log(`  - AIRFLOW_API_URL: ${process.env.AIRFLOW_API_URL || 'http://localhost:8080'}`);
    console.log(`  - AIRFLOW_USERNAME: ${process.env.AIRFLOW_USERNAME || 'admin'}`);
    console.log(`  - AIRFLOW_PASSWORD: ${'*'.repeat((process.env.AIRFLOW_PASSWORD || 'admin').length)}`);
    console.log();

    // 2. JWT 토큰 발급 테스트
    console.log('🔑 Testing JWT token issuance...');
    const token = await airflowTokenManager.getValidToken();
    console.log(`✅ JWT token issued successfully: ${token.substring(0, 50)}...`);
    console.log();

    // 3. 토큰 정보 확인
    console.log('📊 Token Information:');
    const tokenInfo = airflowTokenManager.getTokenInfo();
    console.log(`  - Has Token: ${tokenInfo.hasToken}`);
    console.log(`  - Is Valid: ${tokenInfo.isValid}`);
    console.log(`  - Expiry: ${tokenInfo.expiry}`);
    console.log(`  - Is Refreshing: ${tokenInfo.isRefreshing}`);
    console.log();

    // 4. Airflow API 호출 테스트 - 활성 DAG 목록 조회
    console.log('📡 Testing Airflow API calls...');
    const activeDags = await airflowClient.getActiveDags();
    console.log(`✅ Retrieved ${activeDags.length} active DAGs:`);
    activeDags.slice(0, 3).forEach(dag => {
      console.log(`  - ${dag.dagId} (Active: ${!dag.isPaused})`);
    });
    console.log();

    // 5. 단일 상품 분석 DAG 트리거 테스트
    console.log('🎯 Testing single product analysis DAG trigger...');
    const analysisResult = await airflowClient.triggerSingleProductAnalysis({
      productId: 'test-product-123',
      productUrl: 'https://www.coupang.com/products/test-product-123',
      userId: 'test-user',
    });
    
    console.log(`✅ Single product analysis DAG triggered successfully:`);
    console.log(`  - DAG ID: ${analysisResult.dagId}`);
    console.log(`  - DAG Run ID: ${analysisResult.dagRunId}`);
    console.log(`  - State: ${analysisResult.state}`);
    console.log(`  - Execution Date: ${analysisResult.executionDate}`);
    console.log();

    // 6. DAG 실행 상태 조회 테스트
    console.log('📊 Testing DAG run status check...');
    const statusResult = await airflowClient.getDagRunStatus(
      analysisResult.dagId,
      analysisResult.dagRunId
    );
    
    console.log(`✅ DAG run status retrieved:`);
    console.log(`  - State: ${statusResult.state}`);
    console.log(`  - Start Date: ${statusResult.startDate || 'Not started'}`);
    console.log(`  - End Date: ${statusResult.endDate || 'Not finished'}`);
    console.log();

    // 7. 토큰 만료 및 갱신 테스트
    console.log('🔄 Testing token refresh...');
    airflowTokenManager.invalidateToken();
    const newToken = await airflowTokenManager.getValidToken();
    console.log(`✅ Token refreshed successfully: ${newToken.substring(0, 50)}...`);
    console.log();

    console.log('🎉 All tests completed successfully!');
    console.log('\n✨ Airflow JWT integration is working properly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check if Airflow is running and accessible');
    console.error('2. Verify JWT authentication is enabled in Airflow');
    console.error('3. Confirm username and password are correct');
    console.error('4. Check network connectivity to Airflow server');
    process.exit(1);
  }
}

// 테스트 실행
if (require.main === module) {
  testAirflowJWT()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Unhandled error:', error);
      process.exit(1);
    });
}

module.exports = testAirflowJWT;


