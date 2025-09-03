// EKS Migration - Prometheus Metrics Middleware
// Task 6.1: 백엔드 애플리케이션 메트릭 수집

const promClient = require('prom-client');
const logger = require('../config/logger');

// 기본 메트릭 수집 활성화
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ 
  timeout: 5000,
  prefix: 'kosa_backend_'
});

// 커스텀 메트릭 정의
const httpRequestDuration = new promClient.Histogram({
  name: 'kosa_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new promClient.Counter({
  name: 'kosa_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const analysisJobsTotal = new promClient.Counter({
  name: 'kosa_analysis_jobs_total',
  help: 'Total number of analysis jobs',
  labelNames: ['status', 'type']
});

const websocketConnectionsTotal = new promClient.Gauge({
  name: 'kosa_websocket_connections_total',
  help: 'Current number of WebSocket connections'
});

const redisOperationsTotal = new promClient.Counter({
  name: 'kosa_redis_operations_total',
  help: 'Total number of Redis operations',
  labelNames: ['operation', 'status']
});

const databaseOperationsTotal = new promClient.Counter({
  name: 'kosa_database_operations_total',
  help: 'Total number of database operations',
  labelNames: ['operation', 'status']
});

// HTTP 요청 메트릭 미들웨어
const httpMetricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // 응답 완료 시 메트릭 기록
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    const method = req.method;
    const statusCode = res.statusCode.toString();
    
    // 메트릭 업데이트
    httpRequestDuration
      .labels(method, route, statusCode)
      .observe(duration);
    
    httpRequestTotal
      .labels(method, route, statusCode)
      .inc();
  });
  
  next();
};

// 분석 작업 메트릭 기록 함수
const recordAnalysisJob = (status, type = 'review') => {
  analysisJobsTotal.labels(status, type).inc();
  logger.info(`Analysis job recorded: ${status}, type: ${type}`);
};

// WebSocket 연결 메트릭 업데이트 함수
const updateWebSocketConnections = (count) => {
  websocketConnectionsTotal.set(count);
};

// Redis 작업 메트릭 기록 함수
const recordRedisOperation = (operation, status) => {
  redisOperationsTotal.labels(operation, status).inc();
};

// 데이터베이스 작업 메트릭 기록 함수
const recordDatabaseOperation = (operation, status) => {
  databaseOperationsTotal.labels(operation, status).inc();
};

// 메트릭 엔드포인트 핸들러
const metricsHandler = async (req, res) => {
  try {
    res.set('Content-Type', promClient.register.contentType);
    const metrics = await promClient.register.metrics();
    res.end(metrics);
  } catch (error) {
    logger.error('Error generating metrics:', error);
    res.status(500).end('Error generating metrics');
  }
};

// 헬스체크 메트릭 (의존성 서비스 상태 포함)
const healthCheckMetrics = new promClient.Gauge({
  name: 'kosa_service_health',
  help: 'Health status of dependent services (1 = healthy, 0 = unhealthy)',
  labelNames: ['service']
});

// 의존성 서비스 헬스체크 함수
const checkServiceHealth = async () => {
  const services = {
    redis: false,
    database: false,
    kafka: false
  };

  try {
    // Redis 상태 확인
    const redisService = require('../services/redisService');
    if (redisService.isConnected()) {
      services.redis = true;
    }
  } catch (error) {
    logger.warn('Redis health check failed:', error.message);
  }

  try {
    // 데이터베이스 상태 확인
    const { getPool } = require('../config/database');
    const pool = getPool();
    if (pool) {
      await pool.query('SELECT 1');
      services.database = true;
    }
  } catch (error) {
    logger.warn('Database health check failed:', error.message);
  }

  // try {
  //   // Kafka 상태 확인 (현재 사용하지 않음)
  //   const kafkaService = require('../services/kafkaService');
  //   if (kafkaService.isConnected()) {
  //     services.kafka = true;
  //   }
  // } catch (error) {
  //   logger.warn('Kafka health check failed:', error.message);
  // }

  // 메트릭 업데이트
  Object.entries(services).forEach(([service, isHealthy]) => {
    healthCheckMetrics.labels(service).set(isHealthy ? 1 : 0);
  });

  return services;
};

// 주기적 헬스체크 실행 (30초마다)
setInterval(checkServiceHealth, 30000);

module.exports = {
  promClient,
  httpMetricsMiddleware,
  metricsHandler,
  recordAnalysisJob,
  updateWebSocketConnections,
  recordRedisOperation,
  recordDatabaseOperation,
  checkServiceHealth,
  // 개별 메트릭 객체들 (필요시 직접 접근용)
  httpRequestDuration,
  httpRequestTotal,
  analysisJobsTotal,
  websocketConnectionsTotal,
  redisOperationsTotal,
  databaseOperationsTotal,
  healthCheckMetrics
};