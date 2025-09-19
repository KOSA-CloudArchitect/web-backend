// 환경 변수 로드
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const db = require('./db');
const { initSentry, setupSentryErrorHandler } = require('./config/sentry');
const { getPool, closePool } = require('./config/database');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const logger = require('./config/logger');
// const kafkaService = require('./services/kafkaService');
// const kafkaConsumer = require('./services/kafkaConsumer');
const websocketService = require('./services/websocketService');
const { serve, setup } = require('./config/swagger');
const redisService = require('./services/redisService');
const { cacheService } = require('./services/cacheService');
const { createSessionMiddleware } = require('./config/session');
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const analyzeRouter = require('./routes/analyze');
const authRouter = require('./routes/auth');
// const kafkaRouter = require('./routes/kafka');
const websocketRouter = require('./routes/websocket');
const apiInfoRouter = require('./routes/api-info');
const cacheRouter = require('./routes/cache');
const interestsRouter = require('./routes/interests');
const analysisStatusRouter = require('./routes/analysisStatus');
const notificationsRouter = require('./routes/notifications');
const trendingRouter = require('./routes/trending');
const imageProxyRouter = require('./routes/image-proxy');
// const interestUpdateConsumer = require('./services/interestUpdateConsumer');

// Kafka 서비스는 별도 모듈로 분리됨

const app = express();
const server = http.createServer(app);

// 포트 설정 (환경 변수에서 가져오거나 기본값 사용)
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: true, // 모든 오리진 허용
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

// CORS 미들웨어 적용
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// WebSocket 서비스 초기화
const io = websocketService.initialize(server);

// socket.io 인스턴스를 app에 등록
app.set('io', io);
app.set('websocketService', websocketService);

// JWT 기반 인증 시스템으로 대체됨

app.use(express.json());
app.use(cookieParser());

// 모든 HTTP 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} - Query: ${JSON.stringify(req.query)} - Body: ${JSON.stringify(req.body)}`);
  next();
});

// 세션 미들웨어 설정
app.use(createSessionMiddleware());

// Prometheus 메트릭 미들웨어
const { httpMetricsMiddleware, metricsHandler, checkServiceHealth } = require('./middleware/metrics');
app.use(httpMetricsMiddleware);

// Swagger API 문서
app.use('/api-docs', serve, setup);

// Prometheus 메트릭 엔드포인트
app.get('/metrics', metricsHandler);

// 헬스 체크 엔드포인트
/**
 * @swagger
 * /health:
 *   get:
 *     summary: 서버 상태 확인
 *     description: 서버가 정상적으로 실행 중인지 확인합니다.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: 서버 정상 상태
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 message:
 *                   type: string
 *                   example: KOSA Backend is running
 */
app.get('/health', async (req, res) => {
  try {
    const services = await checkServiceHealth();
    const allHealthy = Object.values(services).every(status => status);
    
    res.status(allHealthy ? 200 : 503).json({
      status: allHealthy ? 'OK' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      message: 'KOSA Backend is running',
      services: services
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Redis 초기화
async function initRedis() {
  try {
    logger.info('🔄 Redis 서비스 초기화 중...');

    // Redis 서비스 초기화
    await redisService.initialize();

    // 캐시 서비스 초기화
    await cacheService.initialize();

    logger.info('✅ Redis 서비스 초기화 완료');
  } catch (error) {
    logger.error('❌ Redis 초기화 실패:', error);
    // Redis 연결 실패해도 서버는 계속 실행
  }
}

// Kafka 초기화 (현재 사용하지 않음)
// async function initKafka() {
//   try {
//     logger.info('🔄 Kafka 서비스 초기화 중...');

//     // Kafka 서비스 초기화
//     await kafkaService.initialize();

//     // Producer 연결
//     await kafkaService.connectProducer();

//     // Consumer 초기화
//     await kafkaConsumer.initialize();

//     // Interest Update Consumer 시작
//     await interestUpdateConsumer.start();

//     logger.info('✅ Kafka 서비스 초기화 완료');
//   } catch (error) {
//     logger.error('❌ Kafka 초기화 실패:', error);
//     // Kafka 연결 실패해도 서버는 계속 실행
//   }
// }

// WebSocket 연결 처리는 websocketService에서 자동으로 처리됨

// 분석 상태 업데이트를 위한 함수 (WebSocket 서비스를 통해)
const updateAnalysisStatus = (productId, status, data = {}) => {
  websocketService.emitToRoom(`product:${productId}`, 'analysis-update', {
    productId,
    status,
    ...data
  });
};

// 분석 상태 변경 시 WebSocket으로 알림
const notifyAnalysisStatus = (productId, status) => {
  websocketService.emitToRoom(`product:${productId}`, 'analysis_status', { 
    productId, 
    status 
  });
};

// analyzeRoutes에서 사용할 수 있도록 WebSocket 서비스와 notifyAnalysisStatus 함수 전달
app.set('websocketService', websocketService);
app.set('notifyAnalysisStatus', notifyAnalysisStatus);

// 정적 파일 서빙
app.use(express.static('public'));

// 라우터 설정
logger.info('🔄 라우터 설정 중...');
try {
  logger.info('🛣️ /api/auth 라우트 등록 시도 중...');
  app.use('/api/auth', authRouter);
  logger.info('✅ /api/auth 라우트 등록 성공');

  logger.info('🛣️ /api/products 라우트 등록 시도 중...');
  app.use('/api/products', productRouter);
  logger.info('✅ /api/products 라우트 등록 성공');

  logger.info('🛣️ /api/categories 라우트 등록 시도 중...');
  app.use('/api/categories', categoryRouter);
  logger.info('✅ /api/categories 라우트 등록 성공');

  logger.info('🛣️ /api/analyze 라우트 등록 시도 중...');
  app.use('/api/analyze', analyzeRouter);
  logger.info('✅ /api/analyze 라우트 등록 성공');

  logger.info('🛣️ /api/kafka 라우트 등록 시도 중...');
  // app.use('/api/kafka', kafkaRouter);
  logger.info('✅ /api/kafka 라우트 등록 성공');

  logger.info('🛣️ /api/websocket 라우트 등록 시도 중...');
  app.use('/api/websocket', websocketRouter);
  logger.info('✅ /api/websocket 라우트 등록 성공');

  logger.info('🛣️ /api/info 라우트 등록 시도 중...');
  app.use('/api/info', apiInfoRouter);
  logger.info('✅ /api/info 라우트 등록 성공');

  logger.info('🛣️ /api/cache 라우트 등록 시도 중...');
  app.use('/api/cache', cacheRouter);
  logger.info('✅ /api/cache 라우트 등록 성공');

  logger.info('🛣️ /api/interests 라우트 등록 시도 중...');
  app.use('/api/interests', interestsRouter);
  logger.info('✅ /api/interests 라우트 등록 성공');

  logger.info('🛣️ /api/analysis-status 라우트 등록 시도 중...');
  app.use('/api/analysis-status', analysisStatusRouter);
  logger.info('✅ /api/analysis-status 라우트 등록 성공');

  logger.info('🛣️ /api/notifications 라우트 등록 시도 중...');
  app.use('/api/notifications', notificationsRouter);
  logger.info('✅ /api/notifications 라우트 등록 성공');

  logger.info('🛣️ /api/trending 라우트 등록 시도 중...');
  app.use('/api/trending', trendingRouter);
  logger.info('✅ /api/trending 라우트 등록 성공');

  logger.info('🛣️ /api/image 라우트 등록 시도 중...');
  app.use('/api/image', imageProxyRouter);
  logger.info('✅ /api/image 라우트 등록 성공');

  logger.info('🛣️ /api/alerts 라우트 등록 시도 중...');
  const alertsRouter = require('./routes/alerts');
  app.use('/api/alerts', alertsRouter);
  logger.info('✅ /api/alerts 라우트 등록 성공');
} catch (error) {
  logger.error('❌ 라우터 등록 중 오류 발생:', error);
  throw error;
}

// Kafka API는 별도 라우터로 분리됨 (/api/kafka)

// 기존 콜백 엔드포인트 (호환성 유지)
app.post('/api/analyze/callback', async (req, res) => {
  const { productId, status, result, error } = req.body;

  try {
    if (status === 'completed') {
      // 결과를 DB에 저장 (DB 연결이 있는 경우에만)
      try {
        await db.query(
          'INSERT INTO analysis_results (product_id, sentiment_data, keywords) VALUES ($1, $2, $3)',
          [productId, result.sentiment, result.keywords]
        );
        console.log('✅ 분석 결과 DB 저장 완료');
      } catch (error) {
        console.warn('⚠️  DB 저장 실패 (DB 연결 없음):', error.message);
      }
    }

    // WebSocket으로 상태 업데이트
    updateAnalysisStatus(productId, status, { result, error });

    res.json({ message: '콜백 처리 완료' });
  } catch (error) {
    console.error('콜백 처리 실패:', error);
    res.status(500).json({ message: '콜백 처리 실패' });
  }
});

// 인증 관련 엔드포인트는 /api/auth 라우터로 이동됨

// 서버 시작
async function startServer() {
  try {
    // Sentry 초기화
    initSentry(app);

    // Redis 초기화
    await initRedis();

    // Kafka 초기화 (현재 사용하지 않음)
    // await initKafka();

    // WebSocket 서비스는 이미 위에서 초기화됨 (line 54)
    logger.info('✅ WebSocket 서비스 초기화 완료 (기존 인스턴스 사용)');

    // 에러 핸들러 설정
    setupSentryErrorHandler(app);
    app.use(errorHandler);
    app.use(notFoundHandler);

    // HTTP 서버 시작
    server.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 KOSA 백엔드 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
      logger.info(`📊 Kafka UI: http://localhost:8080`);
      logger.info(`🔍 Health Check: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    logger.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
}

// Graceful shutdown
// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  logger.info(`🛑 Received ${signal}, starting graceful shutdown...`);

  try {
    // Close database connections
    await closePool();
    logger.info('✅ Database connections closed');

    // Close Redis connections
    await redisService.disconnect();
    logger.info('✅ Redis connections closed');

    // Close Kafka connections (현재 사용하지 않음)
    // await kafkaService.disconnect();

    // Stop Interest Update Consumer (현재 사용하지 않음)
    // await interestUpdateConsumer.stop();

    // logger.info('✅ Kafka connections closed');

    // Close WebSocket server
    websocketService.close();

    server.close(() => {
      logger.info('✅ HTTP server closed');
      process.exit(0);
    });
  } catch (error) {
    logger.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('❌ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// 서버 시작
startServer();