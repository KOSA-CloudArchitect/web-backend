const Redis = require('ioredis');
const { v4: uuidv4 } = require('uuid');

class AnalysisQueueManager {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    });
  }

  /**
   * 분석 요청 처리 (동시 작업 관리)
   */
  async requestAnalysis(productId, userId, type = 'realtime') {
    try {
      const lockKey = `analysis_lock:${productId}`;
      const queueKey = `analysis_queue:${productId}`;
      
      // 1. 현재 진행 중인 작업 확인
      const currentTask = await this.redis.get(lockKey);
      
      if (currentTask) {
        const taskData = JSON.parse(currentTask);
        
        // 2-1. 배치 작업 진행 중 → 대기열 추가
        if (taskData.type === 'batch') {
          return await this.addToQueue(productId, userId, type, taskData);
        }
        
        // 2-2. 실시간 작업 진행 중 → 결과 공유
        if (taskData.type === 'realtime' && type === 'realtime') {
          return await this.shareRealtimeAnalysis(taskData);
        }
        
        // 2-3. 실시간 진행 중인데 배치 요청 → 대기열 추가
        if (taskData.type === 'realtime' && type === 'batch') {
          return await this.addToQueue(productId, userId, type, taskData);
        }
      }
      
      // 3. 새 작업 시작
      return await this.startNewAnalysis(productId, userId, type);
      
    } catch (error) {
      console.error('분석 요청 처리 실패:', error);
      throw error;
    }
  }

  /**
   * 대기열에 사용자 추가
   */
  async addToQueue(productId, userId, type, currentTask) {
    const queueKey = `analysis_queue:${productId}`;
    const lockKey = `analysis_lock:${productId}`;
    
    // 대기열에 추가
    await this.redis.lpush(queueKey, `${userId}:${type}`);
    
    // 대기 사용자 수 증가
    await this.redis.hincrby(lockKey, 'user_count', 1);
    
    // 대기열 위치 확인
    const queuePosition = await this.redis.llen(queueKey);
    const estimatedWait = this.calculateWaitTime(currentTask, queuePosition);
    
    console.log(`👥 사용자 ${userId} 대기열 추가: ${productId} (위치: ${queuePosition})`);
    
    return {
      status: 'queued',
      message: `현재 ${currentTask.type === 'batch' ? '배치' : '실시간'} 분석이 진행 중입니다. 완료 후 자동으로 시작됩니다.`,
      queue_position: queuePosition,
      estimated_wait_minutes: estimatedWait,
      current_task: {
        type: currentTask.type,
        progress: await this.getAnalysisProgress(currentTask.task_id),
        estimated_completion: currentTask.estimated_completion
      }
    };
  }

  /**
   * 실시간 분석 결과 공유
   */
  async shareRealtimeAnalysis(currentTask) {
    const progress = await this.getAnalysisProgress(currentTask.task_id);
    
    console.log(`🔄 실시간 분석 결과 공유: ${currentTask.task_id}`);
    
    return {
      status: 'sharing',
      message: '현재 실시간 분석이 진행 중입니다. 같은 결과를 공유합니다.',
      task_id: currentTask.task_id,
      progress: progress,
      started_at: currentTask.started_at,
      estimated_completion: currentTask.estimated_completion
    };
  }

  /**
   * 새 분석 작업 시작
   */
  async startNewAnalysis(productId, userId, type) {
    const taskId = `task-${uuidv4()}`;
    const lockKey = `analysis_lock:${productId}`;
    
    const taskData = {
      task_id: taskId,
      product_id: productId,
      user_id: userId,
      type: type,
      status: 'processing',
      started_at: new Date().toISOString(),
      estimated_completion: this.calculateEstimatedCompletion(type),
      user_count: 1
    };
    
    // Redis에 작업 잠금 설정 (1시간 TTL)
    await this.redis.setex(lockKey, 3600, JSON.stringify(taskData));
    
    // PostgreSQL에 분석 요청 기록
    await this.createAnalysisRequest(taskId, productId, userId, type);
    
    console.log(`🚀 새 분석 시작: ${taskId} (${type})`);
    
    return {
      status: 'started',
      task_id: taskId,
      message: '분석을 시작합니다.',
      type: type,
      estimated_completion: taskData.estimated_completion
    };
  }

  /**
   * 분석 완료 시 대기열 처리
   */
  async onAnalysisComplete(productId, taskId, results = null) {
    try {
      const lockKey = `analysis_lock:${productId}`;
      const queueKey = `analysis_queue:${productId}`;
      
      console.log(`✅ 분석 완료: ${taskId}`);
      
      // 1. 현재 작업 잠금 해제
      await this.redis.del(lockKey);
      
      // 2. 분석 결과 저장 (있는 경우)
      if (results) {
        await this.saveAnalysisResults(taskId, productId, results);
      }
      
      // 3. 대기열에서 다음 작업 처리
      const nextUser = await this.redis.rpop(queueKey);
      
      if (nextUser) {
        const [userId, type] = nextUser.split(':');
        
        console.log(`⏭️ 다음 작업 시작: ${userId} (${type})`);
        
        // 4. 다음 작업 자동 시작
        const nextResult = await this.startNewAnalysis(productId, userId, type);
        
        // 5. 사용자에게 알림 (WebSocket 또는 Push)
        await this.notifyUser(userId, {
          type: 'analysis_started',
          message: '대기하던 분석이 시작되었습니다.',
          task_id: nextResult.task_id,
          product_id: productId
        });
        
        return nextResult;
      }
      
      console.log(`📝 대기열 비어있음: ${productId}`);
      return null;
      
    } catch (error) {
      console.error('분석 완료 처리 실패:', error);
      throw error;
    }
  }

  /**
   * 분석 진행률 조회
   */
  async getAnalysisProgress(taskId) {
    try {
      const progressKey = `analysis_progress:${taskId}`;
      const progress = await this.redis.hgetall(progressKey);
      
      if (Object.keys(progress).length === 0) {
        return { progress: 0, status: 'initializing' };
      }
      
      return {
        progress: parseInt(progress.progress) || 0,
        status: progress.status || 'processing',
        current_step: progress.current_step || 'initializing',
        processed_reviews: parseInt(progress.processed_reviews) || 0,
        total_reviews: parseInt(progress.total_reviews) || 0
      };
    } catch (error) {
      console.error('진행률 조회 실패:', error);
      return { progress: 0, status: 'error' };
    }
  }

  /**
   * 대기 시간 계산
   */
  calculateWaitTime(currentTask, queuePosition = 1) {
    const baseTime = currentTask.type === 'batch' ? 45 : 15; // 분 단위
    const remainingTime = new Date(currentTask.estimated_completion) - new Date();
    const remainingMinutes = Math.max(0, Math.ceil(remainingTime / (1000 * 60)));
    
    return remainingMinutes + (queuePosition - 1) * baseTime;
  }

  /**
   * 예상 완료 시간 계산
   */
  calculateEstimatedCompletion(type) {
    const minutes = type === 'batch' ? 45 : 15;
    const completion = new Date();
    completion.setMinutes(completion.getMinutes() + minutes);
    return completion.toISOString();
  }

  /**
   * PostgreSQL에 분석 요청 기록
   */
  async createAnalysisRequest(taskId, productId, userId, type) {
    // 실제로는 Prisma 사용
    console.log(`📝 분석 요청 기록: ${taskId}`);
    // await prisma.analysisRequest.create({
    //   data: {
    //     id: uuidv4(),
    //     task_id: taskId,
    //     product_id: productId,
    //     user_id: userId,
    //     request_type: type,
    //     progress: 0,
    //     status: 'processing'
    //   }
    // });
  }

  /**
   * 분석 결과 저장
   */
  async saveAnalysisResults(taskId, productId, results) {
    console.log(`💾 분석 결과 저장: ${taskId}`);
    // MongoDB와 PostgreSQL에 결과 저장
  }

  /**
   * 사용자 알림
   */
  async notifyUser(userId, notification) {
    console.log(`🔔 사용자 알림: ${userId}`, notification);
    // WebSocket 또는 Push 알림 발송
    await this.redis.publish(`user_notifications:${userId}`, JSON.stringify(notification));
  }

  /**
   * 대기열 상태 조회
   */
  async getQueueStatus(productId) {
    const lockKey = `analysis_lock:${productId}`;
    const queueKey = `analysis_queue:${productId}`;
    
    const currentTask = await this.redis.get(lockKey);
    const queueLength = await this.redis.llen(queueKey);
    
    return {
      has_active_task: !!currentTask,
      current_task: currentTask ? JSON.parse(currentTask) : null,
      queue_length: queueLength,
      estimated_wait: currentTask ? this.calculateWaitTime(JSON.parse(currentTask), queueLength + 1) : 0
    };
  }

  /**
   * 강제 작업 취소 (관리자용)
   */
  async cancelAnalysis(productId, reason = 'manual_cancel') {
    const lockKey = `analysis_lock:${productId}`;
    const queueKey = `analysis_queue:${productId}`;
    
    const currentTask = await this.redis.get(lockKey);
    
    if (currentTask) {
      const taskData = JSON.parse(currentTask);
      
      // 작업 취소
      await this.redis.del(lockKey);
      
      // 대기열 모든 사용자에게 알림
      const queue = await this.redis.lrange(queueKey, 0, -1);
      for (const userEntry of queue) {
        const [userId] = userEntry.split(':');
        await this.notifyUser(userId, {
          type: 'analysis_cancelled',
          message: `분석이 취소되었습니다: ${reason}`,
          task_id: taskData.task_id
        });
      }
      
      // 대기열 삭제
      await this.redis.del(queueKey);
      
      console.log(`❌ 분석 취소: ${taskData.task_id} (${reason})`);
      return true;
    }
    
    return false;
  }
}

module.exports = AnalysisQueueManager;