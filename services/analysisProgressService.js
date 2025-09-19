const Redis = require('ioredis');

class AnalysisProgressService {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    });
  }

  /**
   * 분석 진행률 업데이트 및 실시간 알림
   */
  async updateProgress(taskId, progressData) {
    const timestamp = new Date().toISOString();
    
    try {
      // 1. 상태 데이터 준비
      const stateData = {
        ...progressData,
        last_updated: timestamp
      };

      // 2. Redis Hash에 영구 저장
      await this.redis.hset(`analysis_progress:${taskId}`, stateData);
      await this.redis.expire(`analysis_progress:${taskId}`, 7200); // 2시간 TTL

      // 3. 실시간 알림 메시지 준비
      const realtimeMessage = {
        taskId,
        timestamp,
        type: 'progress_update',
        data: progressData
      };

      // 4. Redis Pub/Sub 채널에 발행
      await Promise.all([
        // 특정 작업 채널 (해당 분석을 보는 사용자들)
        this.redis.publish(`analysis_updates:${taskId}`, JSON.stringify(realtimeMessage)),
        
        // 사용자별 채널 (사용자가 여러 분석을 동시에 보는 경우)
        this.publishToUserChannels(taskId, realtimeMessage),
        
        // 전역 모니터링 채널 (관리자, 대시보드용)
        this.redis.publish('analysis_global', JSON.stringify({
          ...realtimeMessage,
          server_id: process.env.SERVER_ID || 'analysis-server-1'
        }))
      ]);

      console.log(`📊 Progress updated: Task ${taskId} - ${progressData.progress}% (${progressData.current_step})`);
      
    } catch (error) {
      console.error(`❌ Failed to update progress for task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * 분석 통계 업데이트 (감정 분석 결과 등)
   */
  async updateStats(taskId, statsData) {
    const timestamp = new Date().toISOString();
    
    try {
      // Redis Hash에 통계 저장
      await this.redis.hset(`analysis_stats:${taskId}`, {
        ...statsData,
        last_updated: timestamp
      });
      await this.redis.expire(`analysis_stats:${taskId}`, 7200);

      // 실시간 통계 알림
      const message = {
        taskId,
        timestamp,
        type: 'stats_update',
        data: statsData
      };

      await this.redis.publish(`analysis_stats:${taskId}`, JSON.stringify(message));
      
      console.log(`📈 Stats updated: Task ${taskId} - Positive: ${statsData.positive}, Negative: ${statsData.negative}`);
      
    } catch (error) {
      console.error(`❌ Failed to update stats for task ${taskId}:`, error);
    }
  }

  /**
   * 분석 완료 알림
   */
  async notifyCompletion(taskId, results) {
    try {
      const message = {
        taskId,
        timestamp: new Date().toISOString(),
        type: 'analysis_completed',
        data: {
          status: 'completed',
          progress: 100,
          results: results
        }
      };

      await Promise.all([
        // 상태 업데이트
        this.redis.hset(`analysis_progress:${taskId}`, {
          status: 'completed',
          progress: 100,
          completed_at: message.timestamp
        }),
        
        // 완료 알림 발행
        this.redis.publish(`analysis_updates:${taskId}`, JSON.stringify(message)),
        this.redis.publish('analysis_global', JSON.stringify(message))
      ]);

      console.log(`✅ Analysis completed: Task ${taskId}`);
      
    } catch (error) {
      console.error(`❌ Failed to notify completion for task ${taskId}:`, error);
    }
  }

  /**
   * 사용자별 채널에 메시지 발행
   */
  async publishToUserChannels(taskId, message) {
    try {
      // 해당 분석을 구독하는 사용자들 조회
      const subscribers = await this.redis.smembers(`task_subscribers:${taskId}`);
      
      const publishPromises = subscribers.map(userId => 
        this.redis.publish(`user_updates:${userId}`, JSON.stringify(message))
      );
      
      await Promise.all(publishPromises);
      
    } catch (error) {
      console.error('Failed to publish to user channels:', error);
    }
  }

  /**
   * 사용자를 분석 구독자로 등록
   */
  async subscribeUserToTask(userId, taskId) {
    try {
      await this.redis.sadd(`task_subscribers:${taskId}`, userId);
      await this.redis.expire(`task_subscribers:${taskId}`, 7200);
      
      console.log(`👤 User ${userId} subscribed to task ${taskId}`);
      
    } catch (error) {
      console.error('Failed to subscribe user to task:', error);
    }
  }

  /**
   * 에러 발생 시 알림
   */
  async notifyError(taskId, error) {
    try {
      const message = {
        taskId,
        timestamp: new Date().toISOString(),
        type: 'analysis_error',
        data: {
          status: 'error',
          error: error.message,
          stack: error.stack
        }
      };

      await Promise.all([
        this.redis.hset(`analysis_progress:${taskId}`, {
          status: 'error',
          error: error.message,
          failed_at: message.timestamp
        }),
        this.redis.publish(`analysis_updates:${taskId}`, JSON.stringify(message)),
        this.redis.publish('analysis_global', JSON.stringify(message))
      ]);

      console.error(`💥 Analysis error: Task ${taskId} - ${error.message}`);
      
    } catch (publishError) {
      console.error('Failed to notify error:', publishError);
    }
  }
}

module.exports = AnalysisProgressService;