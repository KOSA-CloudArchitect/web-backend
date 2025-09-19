const logger = require('../config/logger');

const axios = require('axios');



class WebSocketService {

  constructor() {

    this.io = null;

    this.connectedClients = new Map();

    this.rooms = new Map();

    this.eventHandlers = new Map();

    

    // 웹소켓 서버 URL 설정

    this.websocketUrl = process.env.WEBSOCKET_URL || 'http://websocket-service.web-tier.svc.cluster.local:3002';

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



    // 검색 상품 요청 처리

    socket.on('search-products', async (data) => {

      const { keyword, page = 1, limit = 20 } = data;

      const messageId = `${clientId}_${Date.now()}`;

      

      logger.info(`🔍 검색 요청 수신 [${clientId}]: "${keyword}", 페이지: ${page}, 제한: ${limit}`);

      

      try {

        // 검색 룸 참여

        this.joinRoom(socket, `search:${messageId}`);

        

        // 검색 시작 이벤트 전송

        socket.emit('search-started', {

          keyword,

          page,

          limit,

          messageId,

          timestamp: new Date().toISOString(),

          message: `"${keyword}" 검색을 시작합니다...`

        });



        // 실제 검색 서비스 호출 (크롤링 서비스 또는 분석 서비스로 위임)

        const searchRequest = {

          keyword,

          page,

          limit,

          messageId,

          clientId,

          requestedAt: new Date().toISOString()

        };



        // 검색 요청을 처리할 서비스 호출 (예: 크롤링 서비스, Kafka, 또는 직접 API 호출)

        

        // 검색 진행 상태 전송

        socket.emit('crawling-status', {

          messageId,

          status: 'crawling',

          message: '상품 정보를 수집하고 있습니다...',

          timestamp: new Date().toISOString()

        });



        // 비동기로 검색 결과 처리하도록 이벤트 emit

        process.nextTick(() => {

          this.handleSearchRequest(socket, searchRequest);

        });



      } catch (error) {

        logger.error(`검색 요청 처리 실패 [${clientId}]:`, error);

        socket.emit('search-error', {

          keyword,

          messageId,

          error: error.message,

          timestamp: new Date().toISOString()

        });

      }

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

   * 검색 요청 처리 (실제 검색 로직)

   */

  async handleSearchRequest(socket, searchRequest) {

    const { keyword, page, limit, messageId, clientId } = searchRequest;

    

    try {

      logger.info(`🔄 검색 처리 시작 [${messageId}]: "${keyword}"`);



      // 실제 검색 로직을 여기서 구현 

      // 예시: 기존 product 서비스를 사용하거나 크롤링 서비스 호출

      

      // 1. 크롤링 진행 상태 업데이트

      socket.emit('crawling-status', {

        messageId,

        status: 'processing',

        message: '검색 결과를 분석하고 있습니다...',

        progress: 50,

        timestamp: new Date().toISOString()

      });



      // 2. 실제 검색 결과 시뮬레이션 (실제 환경에서는 크롤링 서비스나 DB 조회)

      // TODO: 실제 product 검색 로직으로 교체

      const searchResults = await this.performProductSearch(keyword, page, limit);



      // 3. 검색 완료 이벤트 전송

      socket.emit('search-completed', {

        keyword,

        messageId,

        page,

        limit,

        results: searchResults.products || [],

        totalCount: searchResults.totalCount || 0,

        timestamp: new Date().toISOString(),

        message: `"${keyword}" 검색이 완료되었습니다. (${searchResults.totalCount}개 상품 발견)`

      });



      logger.info(`✅ 검색 완료 [${messageId}]: ${searchResults.totalCount}개 상품 발견`);



    } catch (error) {

      logger.error(`❌ 검색 처리 실패 [${messageId}]:`, error);

      

      socket.emit('search-error', {

        keyword,

        messageId,

        error: error.message,

        timestamp: new Date().toISOString(),

        message: '검색 중 오류가 발생했습니다.'

      });

    }

  }



  /**

   * 실제 상품 검색 수행 (크롤링 서비스 또는 DB 조회)

   */

  async performProductSearch(keyword, page = 1, limit = 20) {

    try {

      // 실제 환경에서는 여기서 크롤링 서비스를 호출하거나 

      // 기존 product API를 사용해서 검색 수행

      

      // 예시: HTTP 요청으로 크롤링 서비스 호출

      const axios = require('axios');

      const crawlingServerUrl = process.env.CRAWLING_SERVER_URL || 'http://10.128.3.36:30800';

      

      try {

        const response = await axios.post(`${crawlingServerUrl}/api/search`, {

          keyword,

          page,

          limit

        }, {

          timeout: parseInt(process.env.HTTP_TIMEOUT || '200000')

        });



        return {

          products: response.data.results || [],

          totalCount: response.data.totalCount || 0

        };

      } catch (crawlingError) {

        logger.warn(`크롤링 서비스 호출 실패, 기본 응답 반환:`, crawlingError.message);

        

        // 크롤링 서비스 실패 시 기본 응답 (실제로는 캐시된 데이터나 DB 조회 결과 사용)

        return {

          products: [

            {

              id: `${Date.now()}_1`,

              name: `${keyword} 관련 상품 1`,

              price: Math.floor(Math.random() * 100000) + 10000,

              url: `https://example.com/search?q=${encodeURIComponent(keyword)}`,

              image: 'https://via.placeholder.com/200',

              source: 'fallback',

              description: `${keyword}와 관련된 상품입니다.`

            },

            {

              id: `${Date.now()}_2`,

              name: `${keyword} 관련 상품 2`,

              price: Math.floor(Math.random() * 100000) + 10000,

              url: `https://example.com/search?q=${encodeURIComponent(keyword)}`,

              image: 'https://via.placeholder.com/200',

              source: 'fallback',

              description: `${keyword}와 관련된 다른 상품입니다.`

            }

          ],

          totalCount: 2

        };

      }

    } catch (error) {

      logger.error('상품 검색 수행 오류:', error);

      throw error;

    }

  }



  /**

   * 특정 룸에 메시지 전송 (HTTP API 우선, fallback은 직접 emit)

   */

  async emitToRoom(roomName, event, data) {

    // HTTP API를 통해 웹소켓 서버로 메시지 전송 시도

    try {

      const response = await axios.post(`${this.websocketUrl}/api/broadcast`, {

        event,

        data: {

          ...data,

          room: roomName

        }

      }, {

        timeout: 3000,

        headers: {

          'Content-Type': 'application/json'

        }

      });

      

      logger.debug(`📤 룸 메시지 HTTP API로 전송 [${roomName}]: ${event}`);

      return response.data;

      

    } catch (error) {

      logger.warn(`⚠️ HTTP API 전송 실패, fallback 사용 [${roomName}]: ${event}`, error.message);

      

      // HTTP API 실패 시 기존 방식으로 fallback

      if (this.io) {

        this.io.to(roomName).emit(event, {

          ...data,

          timestamp: new Date().toISOString(),

          room: roomName

        });

        logger.debug(`📤 룸 메시지 직접 전송 [${roomName}]: ${event}`);

      }

    }

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

   * 모든 클라이언트에 브로드캐스트 (HTTP API 우선)

   */

  async broadcast(event, data) {

    try {

      const response = await axios.post(`${this.websocketUrl}/api/broadcast`, {

        event,

        data

      }, {

        timeout: 3000,

        headers: {

          'Content-Type': 'application/json'

        }

      });

      

      logger.debug(`📢 브로드캐스트 HTTP API로 전송: ${event}`);

      return response.data;

      

    } catch (error) {

      logger.warn(`⚠️ 브로드캐스트 HTTP API 실패, fallback 사용: ${event}`, error.message);

      

      // HTTP API 실패 시 기존 방식으로 fallback

      if (this.io) {

        this.io.emit(event, {

          ...data,

          timestamp: new Date().toISOString()

        });

        logger.debug(`📢 브로드캐스트 직접 전송: ${event}`);

      }

    }

  }



  /**

   * 분석 상태 업데이트 전송 (HTTP API를 통해 웹소켓 서버로)

   */

  async sendAnalysisUpdate(requestId, statusData) {

    try {

      const response = await axios.post(`${this.websocketUrl}/api/analysis-update`, {

        requestId,

        statusData

      }, {

        timeout: 5000,

        headers: {

          'Content-Type': 'application/json'

        }

      });

      

      logger.info(`✅ Analysis update sent via HTTP API: ${requestId}`, {

        roomName: `analysis:${requestId}`,

        clientCount: response.data.clientCount || 0

      });

      

      return response.data;

    } catch (error) {

      logger.error(`❌ Failed to send analysis update via HTTP API:`, {

        requestId,

        error: error.message,

        websocketUrl: this.websocketUrl

      });

      

      // HTTP API 실패 시 기존 방식으로 fallback (io가 있는 경우)

      if (this.io) {

        const roomName = `analysis:${requestId}`;

        this.emitToRoom(roomName, 'analysis-update', {

          requestId,

          ...statusData

        });

      }

      

      throw error;

    }

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

   * 실시간 감정 카드 전송 (상품별)

   */

  async sendRealtimeEmotionCard(productId, cardData) {

    try {

      const roomName = `product:${productId}`;

      const eventData = {

        productId,

        card: cardData,

        type: 'realtime-emotion-card',

        timestamp: new Date().toISOString()

      };



      await this.emitToRoom(roomName, 'realtime-emotion-card', eventData);

      

      // 분석 상태 룸에도 전송

      if (cardData.refs && cardData.refs.jobId) {

        await this.emitToRoom(`analysis:${cardData.refs.jobId}`, 'emotion-card-new', eventData);

      }

      

      logger.debug(`📊 실시간 감정 카드 전송 [${productId}]: ${cardData.sentiment} (${cardData.score})`);

      

    } catch (error) {

      logger.error(`❌ 실시간 감정 카드 전송 실패 [${productId}]:`, error);

    }

  }



  // 진행률 전송 제거됨 - 실시간 감정 카드와 최종 요약만 사용



  /**

   * 실시간 분석 최종 요약 전송

   */

  async sendRealtimeFinalSummary(productId, summaryData) {

    try {

      const roomName = `product:${productId}`;

      const eventData = {

        productId,

        summary: summaryData,

        type: 'realtime-final-summary',

        timestamp: new Date().toISOString()

      };



      await this.emitToRoom(roomName, 'realtime-final-summary', eventData);

      

      // 분석 상태 룸에도 전송

      if (summaryData.jobId) {

        await this.emitToRoom(`analysis:${summaryData.jobId}`, 'analysis-completed', eventData);

      }

      

      logger.info(`🎯 실시간 최종 요약 전송 [${productId}]: ${summaryData.rawCount}개 리뷰 분석 완료`);

      

    } catch (error) {

      logger.error(`❌ 실시간 최종 요약 전송 실패 [${productId}]:`, error);

    }

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