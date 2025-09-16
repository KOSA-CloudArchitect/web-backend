const logger = require('../config/logger');

class WebSocketService {
  constructor() {
    this.io = null;
    this.connectedClients = new Map();
    this.rooms = new Map();
    this.eventHandlers = new Map();
  }

  /**
   * Socket.IO 서버 초기화
   */
  initialize(server) {
    const socketIo = require('socket.io');
    
    this.io = socketIo(server, {
      cors: {
        origin: true, // 모든 오리진 허용 (개발 환경)
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000
    });

    this.setupEventHandlers();
    logger.info('✅ WebSocket 서버 초기화 완료');
    
    return this.io;
  }

  /**
   * 기본 이벤트 핸들러 설정
   */
  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      this.handleConnection(socket);
    });
  }

  /**
   * 클라이언트 연결 처리
   */
  handleConnection(socket) {
    const clientId = socket.id;
    const clientInfo = {
      id: clientId,
      connectedAt: new Date(),
      rooms: new Set(),
      userId: null,
      metadata: {}
    };

    this.connectedClients.set(clientId, clientInfo);
    logger.info(`🔗 클라이언트 연결: ${clientId} (총 ${this.connectedClients.size}명)`);

    // 기본 이벤트 핸들러 등록
    this.registerSocketEvents(socket);

    // 연결 해제 처리
    socket.on('disconnect', (reason) => {
      this.handleDisconnection(socket, reason);
    });

    // 에러 처리
    socket.on('error', (error) => {
      logger.error(`WebSocket 에러 [${clientId}]:`, error);
    });

    // 연결 확인 응답
    socket.emit('connected', {
      clientId,
      timestamp: new Date().toISOString(),
      message: '웹소켓 연결이 성공했습니다.'
    });
  }

  /**
   * 소켓 이벤트 핸들러 등록
   */
  registerSocketEvents(socket) {
    const clientId = socket.id;

    // 분석 상태 구독
    socket.on('subscribe-analysis', (requestId) => {
      this.joinRoom(socket, `analysis:${requestId}`);
      logger.info(`📊 분석 구독 [${clientId}]: ${requestId}`);
    });

    // 검색 결과 구독
    socket.on('subscribe-search', (messageId) => {
      this.joinRoom(socket, `search:${messageId}`);
      logger.info(`🔍 검색 구독 [${clientId}]: ${messageId}`);
    });

    // 사용자 룸 참여
    socket.on('join-user-room', (userId) => {
      this.joinUserRoom(socket, userId);
      logger.info(`👤 사용자 룸 참여 [${clientId}]: ${userId}`);
    });

    // 배치 작업 구독
    socket.on('subscribe-batch', (jobId) => {
      this.joinRoom(socket, `batch:${jobId}`);
      logger.info(`⚙️ 배치 구독 [${clientId}]: ${jobId}`);
    });

    // 상품별 룸 참여
    socket.on('join-product-room', (productId) => {
      this.joinRoom(socket, `product:${productId}`);
      logger.info(`📦 상품 룸 참여 [${clientId}]: ${productId}`);
    });

    // 룸 나가기
    socket.on('leave-room', (roomName) => {
      this.leaveRoom(socket, roomName);
      logger.info(`🚪 룸 나가기 [${clientId}]: ${roomName}`);
    });

    // 클라이언트 메타데이터 업데이트
    socket.on('update-metadata', (metadata) => {
      this.updateClientMetadata(clientId, metadata);
    });

    // 핑-퐁 (연결 상태 확인)
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date().toISOString() });
    });
  }

  /**
   * 클라이언트 연결 해제 처리
   */
  handleDisconnection(socket, reason) {
    const clientId = socket.id;
    const clientInfo = this.connectedClients.get(clientId);

    if (clientInfo) {
      // 참여한 모든 룸에서 제거
      clientInfo.rooms.forEach(roomName => {
        this.removeFromRoom(roomName, clientId);
      });

      this.connectedClients.delete(clientId);
      logger.info(`🔌 클라이언트 연결 해제: ${clientId} (이유: ${reason}, 총 ${this.connectedClients.size}명)`);
    }
  }

  /**
   * 룸 참여
   */
  joinRoom(socket, roomName) {
    const clientId = socket.id;
    const clientInfo = this.connectedClients.get(clientId);

    if (!clientInfo) return;

    socket.join(roomName);
    clientInfo.rooms.add(roomName);

    // 룸 정보 업데이트
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, {
        name: roomName,
        clients: new Set(),
        createdAt: new Date(),
        metadata: {}
      });
    }

    this.rooms.get(roomName).clients.add(clientId);
    logger.debug(`🏠 룸 참여: ${clientId} → ${roomName}`);
  }

  /**
   * 사용자 룸 참여 (인증된 사용자)
   */
  joinUserRoom(socket, userId) {
    const clientId = socket.id;
    const clientInfo = this.connectedClients.get(clientId);

    if (!clientInfo) return;

    clientInfo.userId = userId;
    this.joinRoom(socket, `user:${userId}`);
  }

  /**
   * 룸 나가기
   */
  leaveRoom(socket, roomName) {
    const clientId = socket.id;
    const clientInfo = this.connectedClients.get(clientId);

    if (!clientInfo) return;

    socket.leave(roomName);
    clientInfo.rooms.delete(roomName);
    this.removeFromRoom(roomName, clientId);

    logger.debug(`🚪 룸 나가기: ${clientId} ← ${roomName}`);
  }

  /**
   * 룸에서 클라이언트 제거
   */
  removeFromRoom(roomName, clientId) {
    const room = this.rooms.get(roomName);
    if (room) {
      room.clients.delete(clientId);
      
      // 빈 룸 정리
      if (room.clients.size === 0) {
        this.rooms.delete(roomName);
        logger.debug(`🗑️ 빈 룸 삭제: ${roomName}`);
      }
    }
  }

  /**
   * 클라이언트 메타데이터 업데이트
   */
  updateClientMetadata(clientId, metadata) {
    const clientInfo = this.connectedClients.get(clientId);
    if (clientInfo) {
      clientInfo.metadata = { ...clientInfo.metadata, ...metadata };
      logger.debug(`📝 메타데이터 업데이트 [${clientId}]:`, metadata);
    }
  }

  /**
   * 특정 룸에 메시지 전송
   */
  emitToRoom(roomName, event, data) {
    if (!this.io) return;

    this.io.to(roomName).emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
      room: roomName
    });

    logger.debug(`📤 룸 메시지 전송 [${roomName}]: ${event}`);
  }

  /**
   * 특정 클라이언트에 메시지 전송
   */
  emitToClient(clientId, event, data) {
    if (!this.io) return;

    this.io.to(clientId).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });

    logger.debug(`📤 클라이언트 메시지 전송 [${clientId}]: ${event}`);
  }

  /**
   * 모든 클라이언트에 브로드캐스트
   */
  broadcast(event, data) {
    if (!this.io) return;

    this.io.emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });

    logger.debug(`📢 브로드캐스트: ${event}`);
  }

  /**
   * 분석 상태 업데이트 전송
   */
  sendAnalysisUpdate(requestId, statusData) {
    const roomName = `analysis:${requestId}`;
    this.emitToRoom(roomName, 'analysis-update', {
      requestId,
      ...statusData
    });
  }

  /**
   * 검색 결과 전송
   */
  sendSearchResults(messageId, results) {
    const roomName = `search:${messageId}`;
    this.emitToRoom(roomName, 'search-results', {
      messageId,
      ...results
    });
  }

  /**
   * 관심 상품 업데이트 전송
   */
  sendWatchlistUpdate(userId, updateData) {
    const roomName = `user:${userId}`;
    this.emitToRoom(roomName, 'watchlist-update', updateData);
  }

  /**
   * 배치 작업 상태 전송
   */
  sendBatchJobUpdate(jobId, statusData) {
    const roomName = `batch:${jobId}`;
    this.emitToRoom(roomName, 'batch-update', {
      jobId,
      ...statusData
    });
  }

  /**
   * 오류 메시지 전송
   */
  sendError(target, errorData) {
    let roomName;
    
    if (target.startsWith('user:') || target.startsWith('analysis:') || 
        target.startsWith('search:') || target.startsWith('batch:')) {
      roomName = target;
    } else {
      roomName = `error:${target}`;
    }

    this.emitToRoom(roomName, 'error', {
      ...errorData,
      severity: errorData.severity || 'error'
    });
  }

  /**
   * 감성 카드 데이터 전송 (실시간 분석 결과)
   */
  sendSentimentCard(requestId, cardData) {
    const roomName = `analysis:${requestId}`;
    this.emitToRoom(roomName, 'sentiment-card', {
      requestId,
      card: cardData,
      type: 'sentiment-card'
    });
  }

  /**
   * 연결된 클라이언트 통계
   */
  getStats() {
    return {
      connectedClients: this.connectedClients.size,
      activeRooms: this.rooms.size,
      roomDetails: Array.from(this.rooms.entries()).map(([name, room]) => ({
        name,
        clientCount: room.clients.size,
        createdAt: room.createdAt
      }))
    };
  }

  /**
   * 특정 룸의 클라이언트 수 조회
   */
  getRoomClientCount(roomName) {
    const room = this.rooms.get(roomName);
    return room ? room.clients.size : 0;
  }

  /**
   * 클라이언트가 참여한 룸 목록 조회
   */
  getClientRooms(clientId) {
    const clientInfo = this.connectedClients.get(clientId);
    return clientInfo ? Array.from(clientInfo.rooms) : [];
  }

  /**
   * WebSocket 서버 종료
   */
  close() {
    if (this.io) {
      this.io.close();
      this.connectedClients.clear();
      this.rooms.clear();
      logger.info('✅ WebSocket 서버 종료');
    }
  }
}

// 싱글톤 인스턴스
const websocketService = new WebSocketService();

module.exports = websocketService;