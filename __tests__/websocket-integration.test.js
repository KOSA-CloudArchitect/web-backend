const request = require('supertest');
const express = require('express');
const http = require('http');
const Client = require('socket.io-client');
const websocketService = require('../services/websocketService');
const websocketEventHandler = require('../services/websocketEventHandler');
const websocketRouter = require('../routes/websocket');

// Mock logger
jest.mock('../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

describe('WebSocket Integration Tests', () => {
  let app, server, clientSocket, serverSocket;
  const TEST_PORT = 3002;

  beforeAll((done) => {
    // Express 앱 설정
    app = express();
    app.use(express.json());
    app.use('/api/websocket', websocketRouter);
    
    // HTTP 서버 생성
    server = http.createServer(app);
    
    // WebSocket 서비스 초기화
    const io = websocketService.initialize(server);
    
    server.listen(TEST_PORT, () => {
      // 클라이언트 소켓 연결
      clientSocket = new Client(`http://localhost:${TEST_PORT}`);
      
      clientSocket.on('connect', () => {
        done();
      });
    });
  });

  afterAll((done) => {
    if (clientSocket) {
      clientSocket.close();
    }
    
    websocketService.close();
    server.close(done);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('WebSocket Connection', () => {
    it('should establish connection successfully', (done) => {
      clientSocket.on('connected', (data) => {
        expect(data.clientId).toBeDefined();
        expect(data.message).toBe('웹소켓 연결이 성공했습니다.');
        done();
      });
    });

    it('should handle ping-pong', (done) => {
      clientSocket.emit('ping');
      
      clientSocket.on('pong', (data) => {
        expect(data.timestamp).toBeDefined();
        done();
      });
    });
  });

  describe('Room Management', () => {
    it('should join analysis room', (done) => {
      const requestId = 'test-request-123';
      
      clientSocket.emit('subscribe-analysis', requestId);
      
      setTimeout(() => {
        const stats = websocketService.getStats();
        const analysisRoom = stats.roomDetails.find(room => 
          room.name === `analysis:${requestId}`
        );
        
        expect(analysisRoom).toBeDefined();
        expect(analysisRoom.clientCount).toBe(1);
        done();
      }, 100);
    });

    it('should join search room', (done) => {
      const messageId = 'test-search-456';
      
      clientSocket.emit('subscribe-search', messageId);
      
      setTimeout(() => {
        const stats = websocketService.getStats();
        const searchRoom = stats.roomDetails.find(room => 
          room.name === `search:${messageId}`
        );
        
        expect(searchRoom).toBeDefined();
        expect(searchRoom.clientCount).toBe(1);
        done();
      }, 100);
    });

    it('should join user room', (done) => {
      const userId = 'test-user-789';
      
      clientSocket.emit('join-user-room', userId);
      
      setTimeout(() => {
        const stats = websocketService.getStats();
        const userRoom = stats.roomDetails.find(room => 
          room.name === `user:${userId}`
        );
        
        expect(userRoom).toBeDefined();
        expect(userRoom.clientCount).toBe(1);
        done();
      }, 100);
    });

    it('should leave room', (done) => {
      const roomName = 'test-room-leave';
      
      // 먼저 룸에 참여
      clientSocket.emit('join-product-room', roomName);
      
      setTimeout(() => {
        // 룸에서 나가기
        clientSocket.emit('leave-room', `product:${roomName}`);
        
        setTimeout(() => {
          const stats = websocketService.getStats();
          const room = stats.roomDetails.find(r => 
            r.name === `product:${roomName}`
          );
          
          expect(room).toBeUndefined();
          done();
        }, 100);
      }, 100);
    });
  });

  describe('Event Handling', () => {
    it('should receive analysis status update', (done) => {
      const requestId = 'test-analysis-status';
      
      // 분석 룸에 참여
      clientSocket.emit('subscribe-analysis', requestId);
      
      // 분석 상태 업데이트 수신 대기
      clientSocket.on('analysis-update', (data) => {
        expect(data.requestId).toBe(requestId);
        expect(data.status).toBeDefined();
        expect(data.progress).toBeDefined();
        expect(data.timestamp).toBeDefined();
        done();
      });
      
      // 분석 상태 업데이트 전송
      setTimeout(() => {
        websocketEventHandler.handleEvent('analysis-status-update', {
          requestId,
          status: 'processing',
          progress: 50,
          message: '분석 진행 중...'
        });
      }, 100);
    });

    it('should receive sentiment card', (done) => {
      const requestId = 'test-sentiment-card';
      
      // 분석 룸에 참여
      clientSocket.emit('subscribe-analysis', requestId);
      
      // 감성 카드 수신 대기
      clientSocket.on('sentiment-card', (data) => {
        expect(data.requestId).toBe(requestId);
        expect(data.card).toBeDefined();
        expect(data.card.sentiment).toBeDefined();
        expect(data.card.color).toBeDefined();
        expect(data.type).toBe('sentiment-card');
        done();
      });
      
      // 감성 카드 전송
      setTimeout(() => {
        websocketEventHandler.handleEvent('sentiment-card-update', {
          requestId,
          card: {
            id: 'card-123',
            sentiment: 'positive',
            text: '좋은 상품입니다',
            keywords: ['좋은', '상품'],
            confidence: 0.9,
            reviewCount: 1
          }
        });
      }, 100);
    });

    it('should receive search results', (done) => {
      const messageId = 'test-search-results';
      
      // 검색 룸에 참여
      clientSocket.emit('subscribe-search', messageId);
      
      // 검색 결과 수신 대기
      clientSocket.on('search-results', (data) => {
        expect(data.messageId).toBe(messageId);
        expect(data.status).toBe('completed');
        expect(data.products).toBeDefined();
        expect(data.type).toBe('search-results');
        done();
      });
      
      // 검색 결과 전송
      setTimeout(() => {
        websocketEventHandler.handleEvent('search-completed', {
          messageId,
          products: [
            { id: 'product-1', name: '테스트 상품 1' },
            { id: 'product-2', name: '테스트 상품 2' }
          ],
          totalCount: 2,
          query: '테스트'
        });
      }, 100);
    });

    it('should receive error notification', (done) => {
      const requestId = 'test-error';
      
      // 에러 수신 대기
      clientSocket.on('error', (data) => {
        expect(data.type).toBe('analysis-error');
        expect(data.message).toBeDefined();
        expect(data.timestamp).toBeDefined();
        done();
      });
      
      // 에러 전송
      setTimeout(() => {
        websocketService.sendError(`analysis:${requestId}`, {
          type: 'analysis-error',
          message: '분석 중 오류가 발생했습니다.',
          details: 'Test error details'
        });
      }, 100);
    });
  });

  describe('API Endpoints', () => {
    it('should get WebSocket stats', async () => {
      const response = await request(app)
        .get('/api/websocket/stats');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.connectedClients).toBeDefined();
      expect(response.body.data.activeRooms).toBeDefined();
    });

    it('should get room client count', async () => {
      const roomName = 'test-room-count';
      
      // 먼저 룸에 참여
      clientSocket.emit('join-product-room', roomName);
      
      // 잠시 대기 후 API 호출
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await request(app)
        .get(`/api/websocket/rooms/product:${roomName}/clients`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.roomName).toBe(`product:${roomName}`);
      expect(response.body.data.clientCount).toBe(1);
    });

    it('should send system notification', async () => {
      const response = await request(app)
        .post('/api/websocket/notifications/system')
        .send({
          message: '시스템 점검 안내',
          type: 'warning',
          priority: 'high'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('시스템 알림이 전송되었습니다.');
    });

    it('should send maintenance alert', async () => {
      const response = await request(app)
        .post('/api/websocket/notifications/maintenance')
        .send({
          message: '시스템 유지보수 예정',
          startTime: '2024-01-01T02:00:00Z',
          endTime: '2024-01-01T04:00:00Z',
          affectedServices: ['analysis', 'search']
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('유지보수 알림이 전송되었습니다.');
    });

    it('should return 400 for invalid system notification', async () => {
      const response = await request(app)
        .post('/api/websocket/notifications/system')
        .send({
          type: 'info'
          // message 누락
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('메시지를 입력해주세요.');
    });

    it('should return 400 for invalid maintenance alert', async () => {
      const response = await request(app)
        .post('/api/websocket/notifications/maintenance')
        .send({
          message: '유지보수 예정'
          // startTime, endTime 누락
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('유지보수 시작 시간과 종료 시간을 입력해주세요.');
    });

    it('should get registered event handlers', async () => {
      const response = await request(app)
        .get('/api/websocket/handlers');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.handlers).toBeDefined();
      expect(Array.isArray(response.body.data.handlers)).toBe(true);
      expect(response.body.data.count).toBeDefined();
    });
  });

  describe('Test Endpoints (Development Only)', () => {
    beforeEach(() => {
      // 테스트 환경으로 설정
      process.env.NODE_ENV = 'test';
    });

    afterEach(() => {
      // 환경 변수 복원
      delete process.env.NODE_ENV;
    });

    it('should send test sentiment card', async () => {
      const response = await request(app)
        .post('/api/websocket/test/sentiment-card')
        .send({
          requestId: 'test-request',
          card: {
            sentiment: 'positive',
            text: '테스트 리뷰',
            keywords: ['테스트'],
            confidence: 0.8
          }
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('테스트 감성 카드가 전송되었습니다.');
    });

    it('should send test analysis status', async () => {
      const response = await request(app)
        .post('/api/websocket/test/analysis-status')
        .send({
          requestId: 'test-request',
          status: 'processing',
          progress: 75,
          message: '테스트 분석 중...'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('테스트 분석 상태가 전송되었습니다.');
    });

    it('should return 403 for test endpoints in production', async () => {
      process.env.NODE_ENV = 'production';

      const response = await request(app)
        .post('/api/websocket/test/sentiment-card')
        .send({
          requestId: 'test-request',
          card: { sentiment: 'positive' }
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('프로덕션 환경에서는 사용할 수 없습니다.');
    });
  });

  describe('Error Handling', () => {
    it('should handle WebSocket service errors gracefully', async () => {
      // WebSocket 서비스를 일시적으로 무효화
      const originalBroadcast = websocketService.broadcast;
      websocketService.broadcast = jest.fn().mockImplementation(() => {
        throw new Error('WebSocket service error');
      });

      const response = await request(app)
        .post('/api/websocket/messages/broadcast')
        .send({
          event: 'test-event',
          data: { message: 'test' }
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);

      // 원래 함수 복원
      websocketService.broadcast = originalBroadcast;
    });
  });
});