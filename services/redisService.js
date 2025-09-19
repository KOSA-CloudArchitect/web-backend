const Redis = require('ioredis');
const logger = require('../config/logger');

class RedisService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.retryAttempts = 0;
    this.maxRetries = 5;
    this.retryDelay = 1000; // 1초
    this.keyPrefix = process.env.REDIS_KEY_PREFIX || ''; // 네임스페이스 프리픽스
  }

  // 네임스페이스 프리픽스 적용
  k(k) { return this.keyPrefix ? `${this.keyPrefix}:${k}` : k; }

  /**
   * Redis 클라이언트 초기화
   */
  async initialize() {
    try {
      const redisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: parseInt(process.env.REDIS_DB) || 0,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          logger.info(`Redis 재연결 시도 ${times}, ${delay}ms 후 재시도`);
          return delay;
        },
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        connectTimeout: 10000,
        commandTimeout: 5000
      };

      this.client = new Redis(redisConfig);

      // 이벤트 리스너 설정
      this.setupEventListeners();

      // 연결 시도
      await this.client.connect();
      
      logger.info('✅ Redis 연결 성공');
      return true;
    } catch (error) {
      logger.error('❌ Redis 초기화 실패:', error);
      return false;
    }
  }

  /**
   * Redis 이벤트 리스너 설정
   */
  setupEventListeners() {
    this.client.on('connect', () => {
      logger.info('🔄 Redis 연결 중...');
    });

    this.client.on('ready', () => {
      logger.info('✅ Redis 연결 준비 완료');
      this.isConnected = true;
      this.retryAttempts = 0;
    });

    this.client.on('error', (error) => {
      logger.error('❌ Redis 연결 오류:', error);
      this.isConnected = false;
    });

    this.client.on('close', () => {
      logger.warn('⚠️ Redis 연결 종료');
      this.isConnected = false;
    });

    this.client.on('reconnecting', (delay) => {
      logger.info(`🔄 Redis 재연결 중... (${delay}ms 후)`);
    });
  }

  /**
   * Redis 연결 상태 확인
   */
  isReady() {
    return this.isConnected && this.client && this.client.status === 'ready';
  }

  // ---------- 🔒 분산 락 유틸 ----------
  async acquireLock(rawKey, ttlSec = 300) {
    try {
      if (!this.isReady()) return false;
      const key = this.k(rawKey);
      const ok = await this.client.set(key, '1', 'EX', ttlSec, 'NX');
      return ok === 'OK';
    } catch (e) {
      logger.warn(`acquireLock 실패 [${rawKey}]:`, e);
      return false;
    }
  }

  async releaseLock(rawKey) {
    try {
      if (!this.isReady()) return false;
      const key = this.k(rawKey);
      await this.client.del(key);
      return true;
    } catch (e) {
      logger.warn(`releaseLock 실패 [${rawKey}]:`, e);
      return false;
    }
  }

  async lockTTL(rawKey) {
    try {
      if (!this.isReady()) return -2;
      const key = this.k(rawKey);
      return await this.client.ttl(key);
    } catch (e) {
      logger.warn(`lockTTL 실패 [${rawKey}]:`, e);
      return -2;
    }
  }
  // -------------------------------------

  /**
   * 기본 캐시 설정
   */
  async set(key, value, ttl = 3600) {
    try {
      if (!this.isReady()) {
        logger.warn('Redis 연결이 준비되지 않음');
        return false;
      }

      const serializedValue = JSON.stringify(value);
      key = this.k(key);

      if (ttl > 0) {
        await this.client.set(key, serializedValue, 'EX', ttl);
      } else {
        await this.client.set(key, serializedValue);
      }
      
      logger.debug(`Redis SET: ${key} (TTL: ${ttl}s)`);
      return true;
    } catch (error) {
      logger.error(`Redis SET 실패 [${key}]:`, error);
      return false;
    }
  }

  /**
   * 캐시 조회
   */
  async get(key) {
    try {
      if (!this.isReady()) {
        logger.warn('Redis 연결이 준비되지 않음');
        return null;
      }

      key = this.k(key);
      const value = await this.client.get(key);
      
      if (value === null) {
        logger.debug(`Redis GET MISS: ${key}`);
        return null;
      }

      logger.debug(`Redis GET HIT: ${key}`);
      return JSON.parse(value);
    } catch (error) {
      logger.error(`Redis GET 실패 [${key}]:`, error);
      return null;
    }
  }

  /**
   * 캐시 삭제
   */
  async del(key) {
    try {
      if (!this.isReady()) {
        logger.warn('Redis 연결이 준비되지 않음');
        return false;
      }

      key = this.k(key);
      const result = await this.client.del(key);
      logger.debug(`Redis DEL: ${key} (삭제된 키: ${result}개)`);
      return result > 0;
    } catch (error) {
      logger.error(`Redis DEL 실패 [${key}]:`, error);
      return false;
    }
  }

  /**
   * 키 존재 여부 확인
   */
  async exists(key) {
    try {
      if (!this.isReady()) {
        return false;
      }

      key = this.k(key);
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Redis EXISTS 실패 [${key}]:`, error);
      return false;
    }
  }

  /**
   * TTL 설정
   */
  async expire(key, ttl) {
    try {
      if (!this.isReady()) {
        return false;
      }

      key = this.k(key);
      const result = await this.client.expire(key, ttl);
      return result === 1;
    } catch (error) {
      logger.error(`Redis EXPIRE 실패 [${key}]:`, error);
      return false;
    }
  }

  /**
   * 인기 검색어 관리 (Sorted Set 사용)
   */
  async addPopularSearch(keyword, score = 1) {
    try {
      if (!this.isReady()) {
        return false;
      }

      const key = this.k('popular_searches');
      await this.client.zincrby(key, score, keyword);
      
      // 상위 100개만 유지
      await this.client.zremrangebyrank(key, 0, -101);
      
      // 7일 TTL 설정
      await this.client.expire(key, 7 * 24 * 3600);
      
      logger.debug(`인기 검색어 추가: ${keyword} (점수: ${score})`);
      return true;
    } catch (error) {
      logger.error(`인기 검색어 추가 실패 [${keyword}]:`, error);
      return false;
    }
  }

  /**
   * 인기 검색어 조회
   */
  async getPopularSearches(limit = 10) {
    try {
      if (!this.isReady()) {
        return [];
      }

      const key = this.k('popular_searches');
      const results = await this.client.zrevrange(key, 0, limit - 1, 'WITHSCORES');
      
      const searches = [];
      for (let i = 0; i < results.length; i += 2) {
        searches.push({
          keyword: results[i],
          score: parseInt(results[i + 1])
        });
      }
      
      logger.debug(`인기 검색어 조회: ${searches.length}개`);
      return searches;
    } catch (error) {
      logger.error('인기 검색어 조회 실패:', error);
      return [];
    }
  }

  /**
   * 사용자별 검색 기록 관리 (List 사용)
   */
  async addUserSearchHistory(userId, keyword, maxHistory = 10) {
    try {
      if (!this.isReady()) {
        return false;
      }

      const key = this.k(`user_search_history:${userId}`);
      
      // 중복 제거
      await this.client.lrem(key, 0, keyword);
      
      // 최신 검색어를 맨 앞에 추가
      await this.client.lpush(key, keyword);
      
      // 최대 개수 제한
      await this.client.ltrim(key, 0, maxHistory - 1);
      
      // 30일 TTL 설정
      await this.client.expire(key, 30 * 24 * 3600);
      
      logger.debug(`사용자 검색 기록 추가: ${userId} -> ${keyword}`);
      return true;
    } catch (error) {
      logger.error(`사용자 검색 기록 추가 실패 [${userId}]:`, error);
      return false;
    }
  }

  /**
   * 사용자 검색 기록 조회
   */
  async getUserSearchHistory(userId, limit = 10) {
    try {
      if (!this.isReady()) {
        return [];
      }

      const key = this.k(`user_search_history:${userId}`);
      const history = await this.client.lrange(key, 0, limit - 1);
      
      logger.debug(`사용자 검색 기록 조회: ${userId} -> ${history.length}개`);
      return history;
    } catch (error) {
      logger.error(`사용자 검색 기록 조회 실패 [${userId}]:`, error);
      return [];
    }
  }

  /**
   * 분석 상태 캐싱
   */
  async setAnalysisStatus(productId, status, ttl = 1800) { // 30분
    try {
      const key = this.k(`analysis_status:${productId}`);
      const statusData = {
        ...status,
        timestamp: new Date().toISOString()
      };
      
      return await this.set(key, statusData, ttl);
    } catch (error) {
      logger.error(`분석 상태 캐싱 실패 [${productId}]:`, error);
      return false;
    }
  }

  /**
   * 분석 상태 조회
   */
  async getAnalysisStatus(productId) {
    try {
      const key = this.k(`analysis_status:${productId}`);
      return await this.get(key);
    } catch (error) {
      logger.error(`분석 상태 조회 실패 [${productId}]:`, error);
      return null;
    }
  }

  /**
   * 분석 결과 캐싱
   */
  async setAnalysisResult(productId, result, ttl = 3600) { // 1시간
    try {
      const key = this.k(`analysis_result:${productId}`);
      const resultData = {
        ...result,
        cachedAt: new Date().toISOString()
      };
      
      return await this.set(key, resultData, ttl);
    } catch (error) {
      logger.error(`분석 결과 캐싱 실패 [${productId}]:`, error);
      return false;
    }
  }

  /**
   * 분석 결과 조회
   */
  async getAnalysisResult(productId) {
    try {
      const key = this.k(`analysis_result:${productId}`);
      return await this.get(key);
    } catch (error) {
      logger.error(`분석 결과 조회 실패 [${productId}]:`, error);
      return null;
    }
  }

  /**
   * 상품 정보 캐싱
   */
  async setProductInfo(productId, productInfo, ttl = 7200) { // 2시간
    try {
      const key = this.k(`product_info:${productId}`);
      return await this.set(key, productInfo, ttl);
    } catch (error) {
      logger.error(`상품 정보 캐싱 실패 [${productId}]:`, error);
      return false;
    }
  }

  /**
   * 상품 정보 조회
   */
  async getProductInfo(productId) {
    try {
      const key = this.k(`product_info:${productId}`);
      return await this.get(key);
    } catch (error) {
      logger.error(`상품 정보 조회 실패 [${productId}]:`, error);
      return null;
    }
  }

  /**
   * 검색 결과 캐싱
   */
  async setSearchResults(query, results, ttl = 1800) { // 30분
    try {
      const key = this.k(`search_results:${Buffer.from(query).toString('base64')}`);
      const searchData = {
        query,
        results,
        totalCount: results.length,
        cachedAt: new Date().toISOString()
      };
      
      return await this.set(key, searchData, ttl);
    } catch (error) {
      logger.error(`검색 결과 캐싱 실패 [${query}]:`, error);
      return false;
    }
  }

  /**
   * 검색 결과 조회
   */
  async getSearchResults(query) {
    try {
      const key = this.k(`search_results:${Buffer.from(query).toString('base64')}`);
      return await this.get(key);
    } catch (error) {
      logger.error(`검색 결과 조회 실패 [${query}]:`, error);
      return null;
    }
  }

  /**
   * 캐시 통계 조회
   */
  async getCacheStats() {
    try {
      if (!this.isReady()) {
        return null;
      }

      const info = await this.client.info('memory');
      const keyspace = await this.client.info('keyspace');
      
      return {
        memory: this.parseRedisInfo(info),
        keyspace: this.parseRedisInfo(keyspace),
        connected: this.isConnected,
        status: this.client.status
      };
    } catch (error) {
      logger.error('캐시 통계 조회 실패:', error);
      return null;
    }
  }

  /**
   * Redis INFO 파싱
   */
  parseRedisInfo(info) {
    const result = {};
    const lines = info.split('\r\n');
    
    for (const line of lines) {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        result[key] = value;
      }
    }
    
    return result;
  }

  /**
   * 헬스 체크
   */
  async healthCheck() {
    try {
      if (!this.isReady()) {
        return {
          status: 'unhealthy',
          message: 'Redis 연결이 준비되지 않음'
        };
      }

      const start = Date.now();
      await this.client.ping();
      const responseTime = Date.now() - start;

      return {
        status: 'healthy',
        responseTime: `${responseTime}ms`,
        connected: this.isConnected
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error.message
      };
    }
  }

  /**
   * 연결 종료
   */
  async disconnect() {
    try {
      if (this.client) {
        await this.client.quit();
        logger.info('✅ Redis 연결 종료');
      }
    } catch (error) {
      logger.error('Redis 연결 종료 실패:', error);
    }
  }

  /**
   * 캐시 무효화 (패턴 기반)
   */
  async invalidatePattern(pattern) {
    try {
      if (!this.isReady()) {
        return 0;
      }

      pattern = this.k(pattern);
      const keys = await this.client.keys(pattern);
      if (keys.length === 0) {
        return 0;
      }

      const result = await this.client.del(...keys);
      logger.info(`캐시 무효화: ${pattern} -> ${result}개 키 삭제`);
      return result;
    } catch (error) {
      logger.error(`캐시 무효화 실패 [${pattern}]:`, error);
      return 0;
    }
  }

  /**
   * 배치 캐시 무효화
   */
  async batchInvalidate(keys) {
    try {
      if (!this.isReady() || keys.length === 0) {
        return 0;
      }

      keys = keys.map(k => this.k(k));
      const result = await this.client.del(...keys);
      logger.info(`배치 캐시 무효화: ${result}개 키 삭제`);
      return result;
    } catch (error) {
      logger.error('배치 캐시 무효화 실패:', error);
      return 0;
    }
  }
}

// 싱글톤 인스턴스 생성
const redisService = new RedisService();

module.exports = redisService;