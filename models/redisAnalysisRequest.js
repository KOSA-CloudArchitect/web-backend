const { redisClient } = require('../config/redis');
const { v4: uuidv4 } = require('uuid');

/**
 * Redis 기반 분석 요청 관리 모델
 * analysis_request:{task_id} 키로 분석 요청 정보 저장
 */
class RedisAnalysisRequest {
  constructor() {
    this.keyPrefix = 'analysis_request';
    this.defaultTTL = 7200; // 2시간
  }

  /**
   * 분석 요청 생성
   * @param {Object} data - 분석 요청 데이터
   * @returns {Promise<Object>} 생성된 분석 요청 정보
   */
  async create(data) {
    try {
      const taskId = data.taskId || uuidv4();
      const key = `${this.keyPrefix}:${taskId}`;
      
      const requestData = {
        id: uuidv4(),
        userId: data.userId,
        productId: data.productId,
        taskId: taskId,
        requestType: data.requestType || 'realtime',
        status: 'pending',
        progress: 0,
        currentStep: 'initializing',
        totalReviews: data.totalReviews || 0,
        processedReviews: 0,
        errorMessage: null,
        createdAt: new Date().toISOString(),
        startedAt: null,
        completedAt: null,
        ttl: this.defaultTTL,
        // Airflow 관련 정보
        dagId: data.dagId || null,
        dagRunId: data.dagRunId || null,
        // 추가 메타데이터
        metadata: data.metadata || {},
      };

      if (redisClient && redisClient.isReady) {
        await redisClient.setEx(key, this.defaultTTL, JSON.stringify(requestData));
        console.log(`✅ Redis analysis request created: ${key}`);
      } else {
        console.warn(`⚠️ Redis client not ready, creating request data without persistence: ${key}`);
      }
      
      return requestData;
    } catch (error) {
      console.error('❌ Redis create error:', error);
      // Redis 실패 시에도 기본 요청 데이터는 반환
      const taskId = data.taskId || uuidv4();
      return {
        id: uuidv4(),
        userId: data.userId,
        productId: data.productId,
        taskId: taskId,
        requestType: data.requestType || 'realtime',
        status: 'pending',
        progress: 0,
        currentStep: 'initializing',
        totalReviews: data.totalReviews || 0,
        processedReviews: 0,
        errorMessage: null,
        createdAt: new Date().toISOString(),
        startedAt: null,
        completedAt: null,
        ttl: this.defaultTTL,
        dagId: data.dagId || null,
        dagRunId: data.dagRunId || null,
        metadata: data.metadata || {},
      };
    }
  }

  /**
   * 분석 요청 조회
   * @param {string} taskId - 작업 ID
   * @returns {Promise<Object|null>} 분석 요청 정보
   */
  async findByTaskId(taskId) {
    try {
      if (!redisClient || !redisClient.isReady) {
        console.warn('⚠️ Redis client not ready, returning null for findByTaskId');
        return null;
      }
      
      const key = `${this.keyPrefix}:${taskId}`;
      const data = await redisClient.get(key);
      
      if (!data) {
        return null;
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Redis findByTaskId error:', error);
      return null;
    }
  }

  /**
   * 사용자의 활성 분석 요청 목록 조회
   * @param {string} userId - 사용자 ID
   * @returns {Promise<Array>} 활성 분석 요청 목록
   */
  async findActiveByUserId(userId) {
    const pattern = `${this.keyPrefix}:*`;
    const keys = await redisClient.keys(pattern);
    const activeRequests = [];
    
    for (const key of keys) {
      const data = await redisClient.get(key);
      if (data) {
        const request = JSON.parse(data);
        if (request.userId === userId && 
            ['pending', 'processing'].includes(request.status)) {
          activeRequests.push(request);
        }
      }
    }
    
    return activeRequests.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * 상품의 활성 분석 요청 조회
   * @param {string} productId - 상품 ID
   * @returns {Promise<Object|null>} 활성 분석 요청
   */
  async findActiveByProductId(productId) {
    const pattern = `${this.keyPrefix}:*`;
    const keys = await redisClient.keys(pattern);
    
    for (const key of keys) {
      const data = await redisClient.get(key);
      if (data) {
        const request = JSON.parse(data);
        if (request.productId === productId && 
            ['pending', 'processing'].includes(request.status)) {
          return request;
        }
      }
    }
    
    return null;
  }

  /**
   * 분석 요청 상태 업데이트
   * @param {string} taskId - 작업 ID
   * @param {Object} updates - 업데이트할 데이터
   * @returns {Promise<Object|null>} 업데이트된 분석 요청
   */
  async update(taskId, updates) {
    const key = `${this.keyPrefix}:${taskId}`;
    const existing = await this.findByTaskId(taskId);
    
    if (!existing) {
      return null;
    }
    
    const updatedData = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    // 상태별 특별 처리
    if (updates.status === 'processing' && !existing.startedAt) {
      updatedData.startedAt = new Date().toISOString();
    } else if (['completed', 'failed'].includes(updates.status) && !existing.completedAt) {
      updatedData.completedAt = new Date().toISOString();
    }
    
    await redisClient.setEx(key, this.defaultTTL, JSON.stringify(updatedData));
    
    console.log(`✅ Redis analysis request updated: ${key}, status: ${updates.status}`);
    return updatedData;
  }

  /**
   * 분석 진행률 업데이트
   * @param {string} taskId - 작업 ID
   * @param {number} progress - 진행률 (0-100)
   * @param {string} currentStep - 현재 단계
   * @param {number} processedReviews - 처리된 리뷰 수
   * @returns {Promise<Object|null>} 업데이트된 분석 요청
   */
  async updateProgress(taskId, progress, currentStep, processedReviews = null) {
    const updates = {
      progress: Math.min(100, Math.max(0, progress)),
      currentStep,
      status: progress >= 100 ? 'completed' : 'processing',
    };
    
    if (processedReviews !== null) {
      updates.processedReviews = processedReviews;
    }
    
    return this.update(taskId, updates);
  }

  /**
   * 분석 요청 실패 처리
   * @param {string} taskId - 작업 ID
   * @param {string} errorMessage - 에러 메시지
   * @returns {Promise<Object|null>} 업데이트된 분석 요청
   */
  async markAsFailed(taskId, errorMessage) {
    return this.update(taskId, {
      status: 'failed',
      errorMessage,
      progress: 0,
    });
  }

  /**
   * 분석 요청 완료 처리
   * @param {string} taskId - 작업 ID
   * @param {Object} result - 분석 결과 (선택적)
   * @returns {Promise<Object|null>} 업데이트된 분석 요청
   */
  async markAsCompleted(taskId, result = null) {
    const updates = {
      status: 'completed',
      progress: 100,
      currentStep: 'completed',
    };
    
    if (result) {
      updates.result = result;
    }
    
    return this.update(taskId, updates);
  }

  /**
   * 분석 요청 삭제
   * @param {string} taskId - 작업 ID
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async delete(taskId) {
    const key = `${this.keyPrefix}:${taskId}`;
    const result = await redisClient.del(key);
    
    console.log(`🗑️ Redis analysis request deleted: ${key}`);
    return result === 1;
  }

  /**
   * 만료된 분석 요청 정리
   * @returns {Promise<number>} 정리된 요청 수
   */
  async cleanup() {
    const pattern = `${this.keyPrefix}:*`;
    const keys = await redisClient.keys(pattern);
    let cleanedCount = 0;
    
    for (const key of keys) {
      const ttl = await redisClient.ttl(key);
      if (ttl === -1 || ttl === -2) { // 만료되었거나 존재하지 않음
        await redisClient.del(key);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} expired analysis requests`);
    }
    
    return cleanedCount;
  }

  /**
   * 통계 정보 조회
   * @returns {Promise<Object>} 통계 정보
   */
  async getStats() {
    const pattern = `${this.keyPrefix}:*`;
    const keys = await redisClient.keys(pattern);
    const stats = {
      total: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
    };
    
    for (const key of keys) {
      const data = await redisClient.get(key);
      if (data) {
        const request = JSON.parse(data);
        stats.total++;
        stats[request.status] = (stats[request.status] || 0) + 1;
      }
    }
    
    return stats;
  }
}

module.exports = RedisAnalysisRequest;
