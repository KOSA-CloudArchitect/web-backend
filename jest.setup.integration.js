// Integration test setup
const { execSync } = require('child_process');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/test_db';
process.env.REDIS_HOST = process.env.REDIS_HOST || 'localhost';
process.env.REDIS_PORT = process.env.REDIS_PORT || '6379';

// Global test timeout
jest.setTimeout(30000);

// Setup database before all tests
beforeAll(async () => {
  try {
    // Run database migrations
    execSync('npm run db:migrate', { 
      cwd: __dirname,
      env: { ...process.env, NODE_ENV: 'test' },
      stdio: 'inherit'
    });
    
    console.log('✅ Database migrations completed for integration tests');
  } catch (error) {
    console.error('❌ Failed to run database migrations:', error);
    throw error;
  }
});

// Cleanup after all tests
afterAll(async () => {
  try {
    // Clean up test data
    const { getPool } = require('./config/database');
    const pool = getPool();
    
    // Clean up test tables
    await pool.query('TRUNCATE TABLE users, analysis, products CASCADE');
    await pool.end();
    
    console.log('✅ Integration test cleanup completed');
  } catch (error) {
    console.error('❌ Failed to cleanup integration tests:', error);
  }
});

// Mock external services for integration tests
jest.mock('./services/airflowClient', () => ({
  triggerSingleProductAnalysis: jest.fn(),
  triggerMultiProductAnalysis: jest.fn(),
  triggerWatchlistAnalysis: jest.fn(),
  getDagRunStatus: jest.fn(),
  getDagRunTasks: jest.fn(),
  getActiveDags: jest.fn(),
}));

jest.mock('./services/kafkaProducer', () => ({
  sendMessage: jest.fn().mockResolvedValue(true),
}));

// Suppress console logs during tests unless DEBUG is set
if (!process.env.DEBUG) {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}