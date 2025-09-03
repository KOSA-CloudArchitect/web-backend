const { redisClient } = require('../config/redis');

/**
 * Redis 기반 분석 큐 관리 모델
 * analysis_lock:{product_id}, analysis_queue:{product_id} 키로 동시 분석 요청 관리
 */
class RedisAnalysisQueue {
  constructor() {
    this.lockPrefix = 'analysis_lock';
    this.queuePrefix = 'analysis_queue';
    this.lockTTL = 3600; // 1시간
    this.queueTTL = 7200; // 2시간
  }

  /**
   * 상품 분석 락 생성 (동시 분석 방지)
   * @param {string} productId - 상품 ID
   * @param {string} taskId - 작업 ID
   * @returns {Promise<boolean>} 락 획득 성공 여부
   */
  async acquireLock(productId, taskId) {
    try {
      if (!redisClient || !redisClient.isReady) {
        console.warn('⚠️ Redis client not ready, allowing lock acquisition');
        return true; // Redis 없을 때는 락 없이 진행
      }
      
      const lockKey = `${this.lockPrefix}:${productId}`;
      
      // SET NX EX를 사용하여 원자적으로 락 획득
      const result = await redisClient.set(lockKey, taskId, {
        NX: true, // 키가 존재하지 않을 때만 설정
        EX: this.lockTTL, // 만료 시간 설정
      });
      
      const acquired = result === 'OK';
      
      if (acquired) {
        console.log(`🔒 Analysis lock acquired for product: ${productId}, task: ${taskId}`);
      } else {
        console.log(`⏳ Analysis lock already exists for product: ${productId}`);
      }
      
      return acquired;
    } catch (error) {
      console.error('❌ Redis acquireLock error:', error);
      return true; // 에러 시 락 없이 진행
    }
  }

  /**
   * 상품 분석 락 해제
   * @param {string} productId - 상품 ID
   * @param {string} taskId - 작업 ID (검증용)
   * @returns {Promise<boolean>} 락 해제 성공 여부
   */
  async releaseLock(productId, taskId) {
    try {
      if (!redisClient || !redisClient.isReady) {
        console.warn('⚠️ Redis client not ready, skipping lock release');
        return true;
      }
      
      const lockKey = `${this.lockPrefix}:${productId}`;
      
      // Lua 스크립트를 사용하여 원자적으로 락 해제 (소유권 검증 포함)
      const luaScript = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `;
      
      const result = await redisClient.eval(luaScript, 1, lockKey, taskId);
      const released = result === 1;
      
      if (released) {
        console.log(`🔓 Analysis lock released for product: ${productId}, task: ${taskId}`);
      } else {
        console.log(`❌ Failed to release analysis lock for product: ${productId}, task: ${taskId}`);
      }
      
      return released;
    } catch (error) {
      console.error('❌ Redis releaseLock error:', error);
      return true; // 에러 시 해제된 것으로 처리
    }
  }

  /**
   * 상품 분석 락 확인
   * @param {string} productId - 상품 ID
   * @returns {Promise<string|null>} 락을 소유한 작업 ID (없으면 null)
   */
  async checkLock(productId) {
    try {
      if (!redisClient || !redisClient.isReady) {
        console.warn('⚠️ Redis client not ready, skipping lock check');
        return null;
      }
      
      const lockKey = `${this.lockPrefix}:${productId}`;
      return await redisClient.get(lockKey);
    } catch (error) {
      console.error('❌ Redis checkLock error:', error);
      return null;
    }
  }

  /**
   * 분석 큐에 사용자 추가
   * @param {string} productId - 상품 ID
   * @param {string} userId - 사용자 ID
   * @param {string} taskId - 작업 ID
   * @param {string} type - 큐 타입 ('batch' | 'realtime')
   * @returns {Promise<Object>} 큐 정보
   */
  async addToQueue(productId, userId, taskId, type = 'realtime') {
    try {
      if (!redisClient || !redisClient.isReady) {
        console.warn('⚠️ Redis client not ready, creating mock queue data');
        return {
          taskId,
          type,
          status: 'processing',
          userCount: 1,
          queueData: [{ userId, taskId, joinedAt: new Date().toISOString() }],
          startedAt: new Date().toISOString(),
          estimatedCompletion: new Date(Date.now() + 180000).toISOString(),
        };
      }
      
      const queueKey = `${this.queuePrefix}:${productId}`;
      const existing = await redisClient.get(queueKey);
    
    let queueData = {
      taskId,
      type,
      status: 'processing',
      userCount: 1,
      queueData: [{ userId, taskId, joinedAt: new Date().toISOString() }],
      startedAt: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 180000).toISOString(), // 3분 후
    };
    
    if (existing) {
      const existingData = JSON.parse(existing);
      
      // 이미 대기 중인 사용자인지 확인
      const userExists = existingData.queueData.some(user => user.userId === userId);
      
      if (!userExists) {
        queueData = {
          ...existingData,
          userCount: existingData.userCount + 1,
          queueData: [
            ...existingData.queueData,
            { userId, taskId, joinedAt: new Date().toISOString() }
          ],
        };
      } else {
        // 이미 대기 중인 사용자면 기존 데이터 반환
        return existingData;
      }
    }
    
    await redisClient.setEx(queueKey, this.queueTTL, JSON.stringify(queueData));
    
    console.log(`📝 User added to analysis queue for product: ${productId}, users: ${queueData.userCount}`);
    return queueData;
    
    } catch (error) {
      console.error('❌ Redis addToQueue error:', error);
      // Redis 실패 시 기본 큐 데이터 반환
      return {
        taskId,
        type,
        status: 'processing',
        userCount: 1,
        queueData: [{ userId, taskId, joinedAt: new Date().toISOString() }],
        startedAt: new Date().toISOString(),
        estimatedCompletion: new Date(Date.now() + 180000).toISOString(),
      };
    }
  }

  /**
   * 분석 큐에서 사용자 제거
   * @param {string} productId - 상품 ID
   * @param {string} userId - 사용자 ID
   * @returns {Promise<Object|null>} 업데이트된 큐 정보
   */
  async removeFromQueue(productId, userId) {
    const queueKey = `${this.queuePrefix}:${productId}`;
    const existing = await redisClient.get(queueKey);
    
    if (!existing) {
      return null;
    }
    
    const queueData = JSON.parse(existing);
    const filteredUsers = queueData.queueData.filter(user => user.userId !== userId);
    
    if (filteredUsers.length === 0) {
      // 큐가 비었으면 삭제
      await redisClient.del(queueKey);
      console.log(`🗑️ Empty analysis queue deleted for product: ${productId}`);
      return null;
    } else {
      // 사용자 수 업데이트
      const updatedData = {
        ...queueData,
        userCount: filteredUsers.length,
        queueData: filteredUsers,
      };
      
      await redisClient.setEx(queueKey, this.queueTTL, JSON.stringify(updatedData));
      console.log(`📝 User removed from analysis queue for product: ${productId}, remaining: ${updatedData.userCount}`);
      return updatedData;
    }
  }

  /**
   * 분석 큐 상태 조회
   * @param {string} productId - 상품 ID
   * @returns {Promise<Object|null>} 큐 정보
   */
  async getQueue(productId) {
    const queueKey = `${this.queuePrefix}:${productId}`;
    const data = await redisClient.get(queueKey);
    
    return data ? JSON.parse(data) : null;
  }

  /**
   * 분석 큐 완료 처리
   * @param {string} productId - 상품 ID
   * @returns {Promise<Object|null>} 완료된 큐 정보
   */
  async completeQueue(productId) {
    const queueKey = `${this.queuePrefix}:${productId}`;
    const existing = await redisClient.get(queueKey);
    
    if (!existing) {
      return null;
    }
    
    const queueData = JSON.parse(existing);
    const completedData = {
      ...queueData,
      status: 'completed',
      completedAt: new Date().toISOString(),
    };
    
    // 완료된 큐는 짧은 TTL로 설정 (결과 확인용)
    await redisClient.setEx(queueKey, 300, JSON.stringify(completedData)); // 5분
    
    console.log(`✅ Analysis queue completed for product: ${productId}, users: ${completedData.userCount}`);
    return completedData;
  }

  /**
   * 모든 활성 큐 목록 조회
   * @returns {Promise<Array>} 활성 큐 목록
   */
  async getActiveQueues() {
    const pattern = `${this.queuePrefix}:*`;
    const keys = await redisClient.keys(pattern);
    const queues = [];
    
    for (const key of keys) {
      const data = await redisClient.get(key);
      if (data) {
        const queueInfo = JSON.parse(data);
        if (queueInfo.status === 'processing') {
          queues.push({
            productId: key.replace(`${this.queuePrefix}:`, ''),
            ...queueInfo,
          });
        }
      }
    }
    
    return queues.sort((a, b) => 
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }

  /**
   * 만료된 락과 큐 정리
   * @returns {Promise<Object>} 정리 통계
   */
  async cleanup() {
    const lockPattern = `${this.lockPrefix}:*`;
    const queuePattern = `${this.queuePrefix}:*`;
    
    const lockKeys = await redisClient.keys(lockPattern);
    const queueKeys = await redisClient.keys(queuePattern);
    
    let cleanedLocks = 0;
    let cleanedQueues = 0;
    
    // 만료된 락 정리
    for (const key of lockKeys) {
      const ttl = await redisClient.ttl(key);
      if (ttl === -1 || ttl === -2) {
        await redisClient.del(key);
        cleanedLocks++;
      }
    }
    
    // 만료된 큐 정리
    for (const key of queueKeys) {
      const ttl = await redisClient.ttl(key);
      if (ttl === -1 || ttl === -2) {
        await redisClient.del(key);
        cleanedQueues++;
      }
    }
    
    const stats = { cleanedLocks, cleanedQueues };
    
    if (cleanedLocks > 0 || cleanedQueues > 0) {
      console.log(`🧹 Queue cleanup: ${cleanedLocks} locks, ${cleanedQueues} queues`);
    }
    
    return stats;
  }

  /**
   * 큐 시스템 통계 조회
   * @returns {Promise<Object>} 통계 정보
   */
  async getStats() {
    const lockPattern = `${this.lockPrefix}:*`;
    const queuePattern = `${this.queuePrefix}:*`;
    
    const lockKeys = await redisClient.keys(lockPattern);
    const queueKeys = await redisClient.keys(queuePattern);
    
    const stats = {
      activeLocks: lockKeys.length,
      activeQueues: 0,
      completedQueues: 0,
      totalUsers: 0,
    };
    
    for (const key of queueKeys) {
      const data = await redisClient.get(key);
      if (data) {
        const queueInfo = JSON.parse(data);
        if (queueInfo.status === 'processing') {
          stats.activeQueues++;
          stats.totalUsers += queueInfo.userCount;
        } else if (queueInfo.status === 'completed') {
          stats.completedQueues++;
        }
      }
    }
    
    return stats;
  }
}

module.exports = RedisAnalysisQueue;
