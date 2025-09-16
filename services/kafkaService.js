const { Kafka } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');

class KafkaService {
  constructor() {
    this.kafka = null;
    this.producer = null;
    this.consumer = null;
    this.isConnected = false;
    this.messageHandlers = new Map();
  }

  /**
   * Kafka 클라이언트 초기화
   */
  async initialize() {
    try {
      const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
      const clientId = process.env.KAFKA_CLIENT_ID || 'kosa-backend';
      
      this.kafka = new Kafka({
        clientId,
        brokers,
        retry: {
          initialRetryTime: 100,
          retries: 8
        },
        // SSL 설정 (환경 변수로 제어)
        ...(process.env.KAFKA_SSL_ENABLED === 'true' && {
          ssl: {
            rejectUnauthorized: false
          }
        }),
        // SASL 인증 설정 (환경 변수로 제어)
        ...(process.env.KAFKA_SASL_ENABLED === 'true' && {
          sasl: {
            mechanism: process.env.KAFKA_SASL_MECHANISM || 'plain',
            username: process.env.KAFKA_SASL_USERNAME,
            password: process.env.KAFKA_SASL_PASSWORD
          }
        })
      });

      // Producer 초기화
      this.producer = this.kafka.producer({
        compression: 'lz4',
        batch: {
          size: 16384,
          lingerMs: 10
        },
        retry: {
          initialRetryTime: 100,
          retries: 5
        }
      });

      // Consumer 초기화
      this.consumer = this.kafka.consumer({
        groupId: process.env.KAFKA_GROUP_ID || 'kosa-backend-group',
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
        maxWaitTimeInMs: 5000
      });

      logger.info('Kafka 클라이언트 초기화 완료');
    } catch (error) {
      logger.error('Kafka 클라이언트 초기화 실패:', error);
      throw error;
    }
  }

  /**
   * Kafka Producer 연결
   */
  async connectProducer() {
    try {
      if (!this.producer) {
        throw new Error('Producer가 초기화되지 않았습니다.');
      }

      await this.producer.connect();
      logger.info('✅ Kafka Producer 연결 성공');
    } catch (error) {
      logger.error('❌ Kafka Producer 연결 실패:', error);
      throw error;
    }
  }

  /**
   * Kafka Consumer 연결 및 토픽 구독
   */
  async connectConsumer(topics = []) {
    try {
      if (!this.consumer) {
        throw new Error('Consumer가 초기화되지 않았습니다.');
      }

      await this.consumer.connect();
      
      if (topics.length > 0) {
        await this.consumer.subscribe({
          topics,
          fromBeginning: false
        });
      }

      logger.info('✅ Kafka Consumer 연결 성공');
      this.isConnected = true;
    } catch (error) {
      logger.error('❌ Kafka Consumer 연결 실패:', error);
      throw error;
    }
  }

  /**
   * 메시지 핸들러 등록
   */
  registerMessageHandler(topic, handler) {
    this.messageHandlers.set(topic, handler);
    logger.info(`메시지 핸들러 등록: ${topic}`);
  }

  /**
   * Consumer 메시지 처리 시작
   */
  async startConsumer() {
    try {
      if (!this.consumer || !this.isConnected) {
        throw new Error('Consumer가 연결되지 않았습니다.');
      }

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const data = JSON.parse(message.value.toString());
            const headers = message.headers || {};
            
            logger.info(`📨 Kafka 메시지 수신 [${topic}]:`, {
              partition,
              offset: message.offset,
              key: message.key?.toString(),
              timestamp: message.timestamp
            });

            // 등록된 핸들러 실행
            const handler = this.messageHandlers.get(topic);
            if (handler) {
              await handler(data, { topic, partition, message, headers });
            } else {
              logger.warn(`핸들러가 등록되지 않은 토픽: ${topic}`);
            }

          } catch (error) {
            logger.error(`❌ Kafka 메시지 처리 오류 [${topic}]:`, error);
          }
        }
      });

      logger.info('✅ Kafka Consumer 메시지 처리 시작');
    } catch (error) {
      logger.error('❌ Kafka Consumer 시작 실패:', error);
      throw error;
    }
  }

  /**
   * 상품 검색 요청 전송
   */
  async sendProductSearchRequest(searchQuery, options = {}) {
    const messageId = `search_${Date.now()}_${uuidv4().slice(0, 8)}`;
    
    const searchRequest = {
      messageId,
      requestType: 'product_search',
      query: searchQuery,
      options: {
        limit: 20,
        includeReviews: false,
        ...options
      },
      timestamp: new Date().toISOString(),
      metadata: {
        source: 'web_app',
        userId: options.userId || 'anonymous'
      }
    };

    try {
      await this.producer.send({
        topic: 'product-search-requests',
        messages: [{
          key: searchQuery,
          value: JSON.stringify(searchRequest),
          headers: {
            'request-type': 'product_search',
            'message-id': messageId
          }
        }]
      });

      logger.info(`📤 상품 검색 요청 전송 [${messageId}]:`, searchQuery);
      return messageId;
    } catch (error) {
      logger.error('❌ 상품 검색 요청 전송 실패:', error);
      throw error;
    }
  }

  /**
   * 실시간 분석 요청 전송
   */
  async sendAnalysisRequest(productId, requestType = 'realtime', options = {}) {
    const requestId = uuidv4();
    const messageId = `analysis_${Date.now()}_${requestId.slice(0, 8)}`;

    const analysisRequest = {
      messageId,
      requestId,
      productId,
      requestType,
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
        userId: options.userId || 'anonymous'
      }
    };

    try {
      await this.producer.send({
        topic: 'analysis-requests',
        messages: [{
          key: productId,
          value: JSON.stringify(analysisRequest),
          headers: {
            'request-type': requestType,
            'priority': analysisRequest.priority,
            'request-id': requestId
          }
        }]
      });

      logger.info(`📤 분석 요청 전송 [${requestId}]:`, productId);
      return requestId;
    } catch (error) {
      logger.error('❌ 분석 요청 전송 실패:', error);
      throw error;
    }
  }

  /**
   * 관심 상품 등록 요청 전송
   */
  async sendWatchlistRequest(productId, userId, options = {}) {
    const messageId = `watchlist_${Date.now()}_${uuidv4().slice(0, 8)}`;

    const watchlistRequest = {
      messageId,
      requestType: 'watchlist_add',
      productId,
      userId,
      options: {
        frequency: 'daily',
        notifications: true,
        priceAlerts: true,
        ...options
      },
      timestamp: new Date().toISOString(),
      metadata: {
        source: 'web_app'
      }
    };

    try {
      await this.producer.send({
        topic: 'watchlist-requests',
        messages: [{
          key: `${userId}_${productId}`,
          value: JSON.stringify(watchlistRequest),
          headers: {
            'request-type': 'watchlist_add',
            'user-id': userId,
            'product-id': productId
          }
        }]
      });

      logger.info(`📤 관심 상품 등록 요청 전송 [${messageId}]:`, { productId, userId });
      return messageId;
    } catch (error) {
      logger.error('❌ 관심 상품 등록 요청 전송 실패:', error);
      throw error;
    }
  }

  /**
   * 배치 분석 작업 전송
   */
  async sendBatchJob(productIds, schedule = 'daily', options = {}) {
    const jobId = uuidv4();
    const messageId = `batch_${Date.now()}_${jobId.slice(0, 8)}`;

    const batchJob = {
      messageId,
      jobId,
      jobType: 'batch_analysis',
      productIds,
      schedule,
      options: {
        frequency: schedule,
        notifications: true,
        ...options
      },
      timestamp: new Date().toISOString(),
      metadata: {
        userId: options.userId || 'system',
        createdBy: 'api'
      }
    };

    try {
      await this.producer.send({
        topic: 'batch-jobs',
        messages: [{
          key: jobId,
          value: JSON.stringify(batchJob),
          headers: {
            'job-type': 'batch_analysis',
            'job-id': jobId
          }
        }]
      });

      logger.info(`📤 배치 작업 전송 [${jobId}]:`, `${productIds.length}개 상품`);
      return jobId;
    } catch (error) {
      logger.error('❌ 배치 작업 전송 실패:', error);
      throw error;
    }
  }

  /**
   * 연결 해제
   */
  async disconnect() {
    try {
      if (this.producer) {
        await this.producer.disconnect();
        logger.info('✅ Kafka Producer 연결 해제');
      }

      if (this.consumer) {
        await this.consumer.disconnect();
        logger.info('✅ Kafka Consumer 연결 해제');
      }

      this.isConnected = false;
    } catch (error) {
      logger.error('❌ Kafka 연결 해제 실패:', error);
      throw error;
    }
  }

  /**
   * 연결 상태 확인
   */
  isProducerConnected() {
    return this.producer && this.isConnected;
  }

  isConsumerConnected() {
    return this.consumer && this.isConnected;
  }
}

// 싱글톤 인스턴스
const kafkaService = new KafkaService();

module.exports = kafkaService;