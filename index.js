// 환경 변수 로드
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { Kafka } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');
const { initSentry, setupSentryErrorHandler } = require('./config/sentry');
const { getPool, closePool } = require('./config/database');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const analyzeRouter = require('./routes/analyze');

// Kafka 클라이언트 설정
const kafka = new Kafka({
  clientId: 'kosa-backend',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092,localhost:9093').split(','),
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

const producer = kafka.producer({
  compression: 'lz4',
  batch: {
    size: 16384,
    lingerMs: 10
  }
});

const consumer = kafka.consumer({
  groupId: 'kosa-backend-group',
  sessionTimeout: 30000,
  heartbeatInterval: 3000
});

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

// Socket.IO 설정 - 모든 오리진 허용
const io = socketIo(server, {
  cors: {
    origin: true, // 모든 오리진 허용
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// socket.io 인스턴스를 app에 등록
app.set('io', io);

// 임시 사용자 데이터 (메모리)
const users = [];

app.use(express.json());

// 헬스 체크 엔드포인트
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'KOSA Backend is running'
  });
});

// Kafka Producer 초기화
async function initKafka() {
  try {
    console.log('🔄 Kafka Producer 연결 중...');
    await producer.connect();
    console.log('✅ Kafka Producer 연결 성공');

    console.log('🔄 Kafka Consumer 연결 중...');
    await consumer.connect();
    await consumer.subscribe({
      topics: ['realtime-status', 'analysis-results'],
      fromBeginning: false
    });
    console.log('✅ Kafka Consumer 연결 성공');

    // Consumer 메시지 처리
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value.toString());
          console.log(`📨 Kafka 메시지 수신 [${topic}]:`, data);

          if (topic === 'realtime-status') {
            // 실시간 상태 업데이트를 WebSocket으로 전송
            io.emit(`analysis:${data.requestId}`, {
              status: data.status.stage,
              progress: data.status.progress,
              message: data.status.message,
              estimatedTime: data.status.estimatedTime
            });
          } else if (topic === 'analysis-results') {
            // 분석 결과를 WebSocket으로 전송
            io.emit(`analysis:${data.requestId}`, {
              status: 'completed',
              progress: 100,
              results: data.analysisResults
            });
          }
        } catch (error) {
          console.error('❌ Kafka 메시지 처리 오류:', error);
        }
      }
    });

  } catch (error) {
    console.error('❌ Kafka 초기화 실패:', error);
    // Kafka 연결 실패해도 서버는 계속 실행
  }
}

// Socket.IO 연결 처리
io.on('connection', (socket) => {
  console.log('클라이언트 연결됨:', socket.id);

  // 분석 상태 구독
  socket.on('subscribe-analysis', (requestId) => {
    socket.join(`analysis:${requestId}`);
    console.log(`클라이언트 ${socket.id}가 분석 ${requestId} 구독`);
  });

  socket.on('disconnect', () => {
    console.log('클라이언트 연결 해제:', socket.id);
  });
});

// 분석 상태 업데이트를 위한 함수
const updateAnalysisStatus = (productId, status, data = {}) => {
  io.emit(`analysis:${productId}`, {
    status,
    ...data
  });
};

// 분석 상태 변경 시 WebSocket으로 알림
const notifyAnalysisStatus = (productId, status) => {
  io.emit('analysis_status', { productId, status });
};

// analyzeRoutes에서 사용할 수 있도록 io 객체와 notifyAnalysisStatus 함수 전달
app.set('io', io);
app.set('notifyAnalysisStatus', notifyAnalysisStatus);

// 정적 파일 서빙
app.use(express.static('public'));

// 라우터 설정
console.log('🔄 라우터 설정 중...');
try {
  console.log('🛣️ /api/products 라우트 등록 시도 중...');
  app.use('/api/products', productRouter);
  console.log('✅ /api/products 라우트 등록 성공');

  console.log('🛣️ /api/categories 라우트 등록 시도 중...');
  app.use('/api/categories', categoryRouter);
  console.log('✅ /api/categories 라우트 등록 성공');

  console.log('🛣️ /api/analyze 라우트 등록 시도 중...');
  app.use('/api/analyze', analyzeRouter);
  console.log('✅ /api/analyze 라우트 등록 성공');
} catch (error) {
  console.error('❌ 라우터 등록 중 오류 발생:', error);
  throw error;
}

// Kafka를 통한 분석 요청 API
app.post('/api/analysis/start', async (req, res) => {
  try {
    const { productId, requestType = 'realtime', options = {} } = req.body;
    const requestId = uuidv4();

    // 분석 요청 메시지 생성
    const analysisRequest = {
      messageId: `req_${Date.now()}_${requestId.slice(0, 8)}`,
      requestId: requestId,
      productId: productId,
      requestType: requestType,
      userId: req.headers['user-id'] || 'anonymous',
      options: {
        includeKeywords: true,
        includeSentiment: true,
        includeTrends: true,
        ...options
      },
      priority: requestType === 'realtime' ? 'high' : 'medium',
      timestamp: new Date().toISOString(),
      metadata: {
        source: 'web_app',
        userAgent: req.headers['user-agent']
      }
    };

    // Kafka로 분석 요청 전송
    await producer.send({
      topic: 'analysis-requests',
      messages: [{
        key: productId,
        value: JSON.stringify(analysisRequest),
        headers: {
          'request-type': requestType,
          'priority': analysisRequest.priority
        }
      }]
    });

    console.log(`📤 분석 요청 전송 완료 [${requestId}]:`, productId);

    res.json({
      success: true,
      requestId: requestId,
      message: '분석 요청이 접수되었습니다.',
      estimatedTime: requestType === 'realtime' ? 120 : 3600
    });

  } catch (error) {
    console.error('❌ 분석 요청 처리 오류:', error);
    res.status(500).json({
      success: false,
      error: '분석 요청 처리 중 오류가 발생했습니다.'
    });
  }
});

// 분석 상태 조회 API
app.get('/api/analysis/status/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;

    // TODO: 실제로는 Redis나 DB에서 상태 조회
    // 현재는 기본 응답 반환
    res.json({
      requestId: requestId,
      status: 'processing',
      progress: 0,
      message: '분석 대기 중...',
      estimatedTime: 120
    });

  } catch (error) {
    console.error('❌ 분석 상태 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '분석 상태 조회 중 오류가 발생했습니다.'
    });
  }
});

// 배치 분석 요청 API
app.post('/api/analysis/batch', async (req, res) => {
  try {
    const { productIds, schedule = 'daily', options = {} } = req.body;
    const jobId = uuidv4();

    const batchJob = {
      messageId: `batch_${Date.now()}_${jobId.slice(0, 8)}`,
      jobId: jobId,
      jobType: 'batch_analysis',
      productIds: productIds,
      schedule: schedule,
      options: {
        frequency: schedule,
        notifications: true,
        ...options
      },
      timestamp: new Date().toISOString(),
      metadata: {
        userId: req.headers['user-id'] || 'anonymous',
        createdBy: 'api'
      }
    };

    // Kafka로 배치 작업 전송
    await producer.send({
      topic: 'batch-jobs',
      messages: [{
        key: jobId,
        value: JSON.stringify(batchJob)
      }]
    });

    console.log(`📤 배치 작업 전송 완료 [${jobId}]:`, productIds.length, '개 상품');

    res.json({
      success: true,
      jobId: jobId,
      message: '배치 분석 작업이 등록되었습니다.',
      productCount: productIds.length
    });

  } catch (error) {
    console.error('❌ 배치 분석 요청 오류:', error);
    res.status(500).json({
      success: false,
      error: '배치 분석 요청 처리 중 오류가 발생했습니다.'
    });
  }
});

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

// 회원가입
app.post('/api/signup', (req, res) => {
  const { userId, password, email } = req.body;
  if (users.find(u => u.userId === userId)) {
    return res.status(409).json({ message: '이미 존재하는 아이디입니다.' });
  }
  users.push({ userId, password, email });
  res.json({ message: '회원가입 성공' });
});

// 로그인
app.post('/api/login', (req, res) => {
  const { userId, password } = req.body;
  const user = users.find(u => u.userId === userId && u.password === password);
  if (!user) {
    return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
  }
  res.json({ message: '로그인 성공', userId: user.userId });
});

// 서버 시작
async function startServer() {
  try {
    // Sentry 초기화
    initSentry(app);

    // Kafka 초기화
    await initKafka();

    // 에러 핸들러 설정
    setupSentryErrorHandler(app);
    app.use(errorHandler);
    app.use(notFoundHandler);

    // HTTP 서버 시작
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 KOSA 백엔드 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
      console.log(`📊 Kafka UI: http://localhost:8080`);
      console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
}

// Graceful shutdown
// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  console.log(`🛑 Received ${signal}, starting graceful shutdown...`);

  try {
    // Close database connections
    await closePool();
    console.log('✅ Database connections closed');
    
    // Close Kafka connections
    await producer.disconnect();
    await consumer.disconnect();
    console.log('✅ Kafka connections closed');
    
    server.close(() => {
      console.log('✅ HTTP server closed');
      
      io.close(() => {
        console.log('✅ Socket.IO server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('❌ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// 서버 시작
startServer();