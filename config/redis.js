const Redis = require('ioredis');
const { Sentry } = require('./sentry');

let redisClient = null;

function getRedisClient() {
  if (!redisClient) {
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0'),
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000,
    };

    redisClient = new Redis(redisConfig);

    // Connection event handlers
    redisClient.on('connect', () => {
      console.log('🔌 Connected to Redis server');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis client is ready');
    });

    redisClient.on('error', (error) => {
      console.error('❌ Redis connection error:', error);
      Sentry.captureException(error);
    });

    redisClient.on('close', () => {
      console.log('🔌 Redis connection closed');
    });

    redisClient.on('reconnecting', () => {
      console.log('🔄 Reconnecting to Redis...');
    });

    // Test the connection
    testRedisConnection();
  }

  return redisClient;
}

async function testRedisConnection() {
  try {
    await redisClient.ping();
    console.log('✅ Redis connection test successful');
  } catch (error) {
    console.error('❌ Redis connection test failed:', error);
    Sentry.captureException(error);
  }
}

async function closeRedisConnection() {
  if (redisClient) {
    console.log('🔌 Closing Redis connection');
    await redisClient.quit();
    redisClient = null;
  }
}

// Cache key generators
const CacheKeys = {
  analysisResult: (productId) => `analysis:result:${productId}`,
  analysisStatus: (productId) => `analysis:status:${productId}`,
  analysisTask: (taskId) => `analysis:task:${taskId}`,
};

// Cache TTL constants (in seconds)
const CacheTTL = {
  ANALYSIS_RESULT: 3600, // 1 hour
  ANALYSIS_STATUS: 300,  // 5 minutes
  ANALYSIS_TASK: 1800,   // 30 minutes
};

module.exports = {
  getRedisClient,
  closeRedisConnection,
  CacheKeys,
  CacheTTL
};