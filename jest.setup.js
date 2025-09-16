// Jest 설정 파일
require('dotenv').config({ path: '.env.test' });

// 테스트 환경 변수 설정
process.env.NODE_ENV = 'test';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.REDIS_DB = '1'; // 테스트용 DB

// 콘솔 로그 레벨 설정 (테스트 중 로그 최소화)
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// 테스트 중에는 로그 출력 최소화
console.log = (...args) => {
  if (process.env.JEST_VERBOSE === 'true') {
    originalConsoleLog(...args);
  }
};

console.warn = (...args) => {
  if (process.env.JEST_VERBOSE === 'true') {
    originalConsoleWarn(...args);
  }
};

// 에러는 항상 출력
console.error = originalConsoleError;

// 테스트 완료 후 정리
afterAll(async () => {
  // 모든 타이머 정리
  jest.clearAllTimers();
  
  // 콘솔 복원
  console.log = originalConsoleLog;
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});