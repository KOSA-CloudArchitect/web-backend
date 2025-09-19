const airflowClient = require('./airflowClient');
// const kafkaProducer = require('./kafkaProducer');
const cacheService = require('./cacheService');
const { Sentry } = require('../config/sentry');
const RedisAnalysisRequest = require('../models/redisAnalysisRequest');
const RedisAnalysisQueue = require('../models/redisAnalysisQueue');
const MongoAnalysisResult = require('../models/mongoAnalysisResult');
const websocketService = require('./websocketService');

/**
 * 분석 서비스
 * Airflow DAG 트리거 및 분석 요청 관리
 */
class AnalysisService {
  constructor() {
    this.analysisCache = new Map(); // 진행 중인 분석 요청 캐시 (레거시)
    this.redisRequest = new RedisAnalysisRequest();
    this.redisQueue = new RedisAnalysisQueue();
    this.mongoResult = new MongoAnalysisResult();
  }

  /**
   * 단일 상품 분석 요청
   * @param {Object} params - 분석 요청 파라미터
   * @param {string} params.productId - 상품 ID
   * @param {string} params.productUrl - 상품 URL
   * @param {string} params.userId - 사용자 ID
   * @returns {Promise<Object>} 분석 요청 결과
   */
  async requestSingleProductAnalysis(params) {
    try {
      const { productId, productUrl, userId } = params;
      
      console.log(`🔍 Starting single product analysis request:`, {
        productId,
        userId,
        hasUrl: !!productUrl,
      });

      // 1. 상품 분석 락 확인 및 획득 시도
      const existingLock = await this.redisQueue.checkLock(productId);
      if (existingLock) {
        // 기존 분석이 진행 중인 경우 큐에 추가
        const existingRequest = await this.redisRequest.findByTaskId(existingLock);
        if (existingRequest) {
          console.log(`⚡ Analysis in progress for product ${productId}, adding to queue`);
          
          // 큐에 사용자 추가
          const queueInfo = await this.redisQueue.addToQueue(productId, userId, existingLock, 'realtime');
          
          return {
            status: 'queued',
            taskId: existingLock,
            dagRunId: existingRequest.dagRunId,
            dagId: existingRequest.dagId,
            message: 'Added to analysis queue',
            queuePosition: queueInfo.userCount,
            estimatedCompletion: queueInfo.estimatedCompletion,
            cached: true,
          };
        }
      }

      // 2. Airflow DAG 트리거
      const dagRun = await airflowClient.triggerSingleProductAnalysis({
        productId,
        productUrl,
        userId,
      });

      const taskId = `single_${productId}_${Date.now()}`;

      // 3. Redis 분석 요청 생성
      const analysisRequest = await this.redisRequest.create({
        taskId,
        userId,
        productId,
        requestType: 'realtime',
        dagId: dagRun.dagId,
        dagRunId: dagRun.dagRunId,
        metadata: {
          productUrl,
          triggerType: 'single_product',
        },
      });

      // 4. 분석 락 획득
      const lockAcquired = await this.redisQueue.acquireLock(productId, taskId);
      if (!lockAcquired) {
        // 락 획득 실패 시 기존 분석에 큐 추가
        await this.redisRequest.delete(taskId);
        const currentLock = await this.redisQueue.checkLock(productId);
        if (currentLock) {
          const queueInfo = await this.redisQueue.addToQueue(productId, userId, currentLock, 'realtime');
          return {
            status: 'queued',
            taskId: currentLock,
            message: 'Added to existing analysis queue',
            queuePosition: queueInfo.userCount,
            estimatedCompletion: queueInfo.estimatedCompletion,
          };
        }
      }

      // 5. 큐 생성 (첫 번째 사용자)
      await this.redisQueue.addToQueue(productId, userId, taskId, 'realtime');

      // 6. Kafka로 분석 시작 메시지 전송 (현재 사용하지 않음)
      // try {
      //   await kafkaProducer.sendMessage('analysis-requests', {
      //     type: 'single_product_analysis_started',
      //     taskId,
      //     dagRunId: dagRun.dagRunId,
      //     productId,
      //     userId,
      //     timestamp: new Date().toISOString(),
      //   });
      // } catch (kafkaError) {
      //   console.warn('⚠️ Failed to send Kafka message:', kafkaError);
      //   // Kafka 실패는 전체 프로세스를 중단시키지 않음
      // }

      console.log(`✅ Single product analysis triggered successfully:`, {
        taskId,
        dagRunId: dagRun.dagRunId,
        productId,
      });

      // WebSocket으로 분석 시작 알림
      websocketService.sendAnalysisUpdate(taskId, {
        status: 'triggered',
        type: 'analysis_started',
        message: '상품 분석이 시작되었습니다.',
        productId,
        userId,
        dagRunId: dagRun.dagRunId,
        estimatedTime: '약 2-5분 소요 예정'
      });

      // 사용자 룸에도 알림
      if (userId) {
        await websocketService.emitToRoom(`user:${userId}`, 'analysis-started', {
          taskId,
          productId,
          message: '상품 분석을 시작했습니다.',
          dagRunId: dagRun.dagRunId
        });
      }

      return {
        status: 'triggered',
        taskId,
        dagRunId: dagRun.dagRunId,
        dagId: dagRun.dagId,
        executionDate: dagRun.executionDate,
        message: 'Analysis started successfully',
      };

    } catch (error) {
      console.error('❌ Failed to request single product analysis:', error);
      
      Sentry.withScope((scope) => {
        scope.setTag('analysis_request_failed', true);
        scope.setContext('analysis_request', {
          type: 'single_product',
          productId: params.productId,
          userId: params.userId,
        });
        Sentry.captureException(error);
      });

      throw error;
    }
  }

  /**
   * Redis 기반 분석 상태 조회
   * @param {string} taskId - 작업 ID
   * @returns {Promise<Object>} 분석 상태 정보
   */
  async getAnalysisStatusByTaskId(taskId) {
    try {
      console.log(`🔍 Checking analysis status for task: ${taskId}`);
      
      const analysisRequest = await this.redisRequest.findByTaskId(taskId);
      if (!analysisRequest) {
        throw new Error('Analysis request not found');
      }
      
      // Airflow DAG 상태 확인 (진행 중인 경우)
      if (['pending', 'processing'].includes(analysisRequest.status) && 
          analysisRequest.dagId && analysisRequest.dagRunId) {
        
        try {
          const dagStatus = await airflowClient.getDagRunStatus(
            analysisRequest.dagId, 
            analysisRequest.dagRunId
          );
          
          // DAG 상태에 따른 분석 요청 상태 업데이트
          let newStatus = analysisRequest.status;
          if (dagStatus.state === 'success') {
            newStatus = 'completed';
          } else if (dagStatus.state === 'failed') {
            newStatus = 'failed';
          } else if (dagStatus.state === 'running') {
            newStatus = 'processing';
          }
          
          // 상태가 변경된 경우 업데이트
          if (newStatus !== analysisRequest.status) {
            await this.redisRequest.update(taskId, { status: newStatus });
            analysisRequest.status = newStatus;
            
            // 완료된 경우 락 해제
            if (newStatus === 'completed') {
              await this.redisQueue.releaseLock(analysisRequest.productId, taskId);
              await this.redisQueue.completeQueue(analysisRequest.productId);
            } else if (newStatus === 'failed') {
              await this.redisQueue.releaseLock(analysisRequest.productId, taskId);
              await this.redisRequest.markAsFailed(taskId, 'DAG execution failed');
            }
          }
          
        } catch (dagError) {
          console.warn(`⚠️ Failed to check DAG status: ${dagError.message}`);
        }
      }
      
      // 큐 정보 조회
      const queueInfo = await this.redisQueue.getQueue(analysisRequest.productId);
      
      return {
        taskId: analysisRequest.taskId,
        status: analysisRequest.status,
        progress: analysisRequest.progress,
        currentStep: analysisRequest.currentStep,
        totalReviews: analysisRequest.totalReviews,
        processedReviews: analysisRequest.processedReviews,
        errorMessage: analysisRequest.errorMessage,
        createdAt: analysisRequest.createdAt,
        startedAt: analysisRequest.startedAt,
        completedAt: analysisRequest.completedAt,
        dagId: analysisRequest.dagId,
        dagRunId: analysisRequest.dagRunId,
        queueInfo: queueInfo ? {
          position: queueInfo.queueData.findIndex(user => user.taskId === taskId) + 1,
          totalUsers: queueInfo.userCount,
          estimatedCompletion: queueInfo.estimatedCompletion,
        } : null,
      };
      
    } catch (error) {
      console.error('❌ Failed to get analysis status:', error);
      
      Sentry.withScope((scope) => {
        scope.setTag('analysis_status_check_failed', true);
        scope.setContext('analysis_status_check', { taskId });
        Sentry.captureException(error);
      });
      
      throw error;
    }
  }

  /**
   * 상품 기반 분석 상태 조회
   * @param {string} productId - 상품 ID
   * @param {string} userId - 사용자 ID
   * @returns {Promise<Object|null>} 분석 상태 정보
   */
  async getAnalysisStatusByProduct(productId, userId) {
    try {
      // 현재 진행 중인 분석 확인
      const activeLock = await this.redisQueue.checkLock(productId);
      if (activeLock) {
        const analysisRequest = await this.redisRequest.findByTaskId(activeLock);
        if (analysisRequest) {
          return await this.getAnalysisStatusByTaskId(activeLock);
        }
      }
      
      // 사용자의 최근 분석 요청 확인
      const activeRequests = await this.redisRequest.findActiveByUserId(userId);
      const productRequest = activeRequests.find(req => req.productId === productId);
      
      if (productRequest) {
        return await this.getAnalysisStatusByTaskId(productRequest.taskId);
      }
      
      return null;
      
    } catch (error) {
      console.error('❌ Failed to get product analysis status:', error);
      throw error;
    }
  }

  /**
   * 분석 결과 처리 및 MongoDB 저장
   * @param {string} taskId - 작업 ID
   * @param {Object} result - 분석 결과 데이터
   * @returns {Promise<Object>} 저장된 분석 결과
   */
  async processAnalysisResult(taskId, result) {
    try {
      console.log(`📊 Processing analysis result for task: ${taskId}`);
      
      // Redis에서 분석 요청 정보 조회
      const analysisRequest = await this.redisRequest.findByTaskId(taskId);
      if (!analysisRequest) {
        throw new Error(`Analysis request not found for task: ${taskId}`);
      }

      // 분석 결과 데이터 준비
      const analysisResultData = {
        productId: analysisRequest.productId,
        taskId: taskId,
        sentiment: {
          positive: result.sentiment?.positive || 0,
          negative: result.sentiment?.negative || 0,
          neutral: result.sentiment?.neutral || 0,
        },
        summary: result.summary || '',
        totalReviews: result.totalReviews || 0,
        averageRating: result.averageRating,
        processingTime: result.processingTime || this.calculateProcessingTime(analysisRequest),
        keywords: result.keywords || [],
        reviewDistribution: result.reviewDistribution || {},
        crawledAt: result.crawledAt,
        analysisVersion: result.analysisVersion || '1.0.0',
        sourceUrl: analysisRequest.metadata?.productUrl,
        userId: analysisRequest.userId,
        requestType: analysisRequest.requestType,
      };

      // MongoDB에 분석 결과 저장
      const savedResult = await this.mongoResult.create(analysisResultData);
      
      // Redis 분석 요청 완료 처리
      await this.redisRequest.markAsCompleted(taskId, {
        mongoId: savedResult._id,
        completedAt: new Date().toISOString(),
      });

      // 분석 락 해제 및 큐 완료 처리
      await this.redisQueue.releaseLock(analysisRequest.productId, taskId);
      await this.redisQueue.completeQueue(analysisRequest.productId);

      console.log(`✅ Analysis result processed and saved: ${savedResult._id}`);

      // WebSocket으로 실시간 분석 완료 알림
      websocketService.sendAnalysisUpdate(taskId, {
        status: 'completed',
        type: 'result_saved',
        message: '분석 결과가 MongoDB에 저장되었습니다.',
        productId: analysisRequest.productId,
        userId: analysisRequest.userId,
        result: {
          sentiment: analysisResultData.sentiment,
          summary: analysisResultData.summary,
          totalReviews: analysisResultData.totalReviews,
          averageRating: analysisResultData.averageRating,
          keywords: analysisResultData.keywords
        },
        mongoId: savedResult._id
      });

      // 상품별 룸에도 알림 (상품을 보고 있는 다른 사용자들에게)
      await websocketService.emitToRoom(`product:${analysisRequest.productId}`, 'analysis-completed', {
        productId: analysisRequest.productId,
        taskId: taskId,
        message: '새로운 분석 결과가 업데이트되었습니다.',
        summary: analysisResultData.summary,
        sentiment: analysisResultData.sentiment
      });

      // 사용자별 룸에도 알림
      if (analysisRequest.userId) {
        await websocketService.emitToRoom(`user:${analysisRequest.userId}`, 'my-analysis-completed', {
          taskId: taskId,
          productId: analysisRequest.productId,
          message: '요청하신 분석이 완료되었습니다.',
          result: {
            sentiment: analysisResultData.sentiment,
            summary: analysisResultData.summary,
            totalReviews: analysisResultData.totalReviews
          }
        });
      }
      
      return savedResult;

    } catch (error) {
      console.error('❌ Failed to process analysis result:', error);
      
      // 실패 시 Redis 상태 업데이트
      await this.redisRequest.markAsFailed(taskId, error.message);
      
      Sentry.withScope((scope) => {
        scope.setTag('analysis_result_processing_failed', true);
        scope.setContext('analysis_result_processing', { taskId });
        Sentry.captureException(error);
      });
      
      throw error;
    }
  }

  /**
   * 분석 처리 시간 계산
   * @param {Object} analysisRequest - 분석 요청 정보
   * @returns {number} 처리 시간 (초)
   */
  calculateProcessingTime(analysisRequest) {
    if (!analysisRequest.startedAt) {
      return 0;
    }
    
    const startTime = new Date(analysisRequest.startedAt);
    const endTime = new Date();
    return Math.round((endTime - startTime) / 1000);
  }

  /**
   * 분석 결과 조회 (MongoDB에서)
   * @param {string} productId - 상품 ID
   * @returns {Promise<Object|null>} 분석 결과
   */
  async getAnalysisResult(productId) {
    try {
      console.log(`🔍 Getting analysis result for product: ${productId}`);
      
      // MongoDB에서 최신 분석 결과 조회
      const result = await this.mongoResult.findLatestByProductId(productId);
      
      if (!result) {
        return null;
      }

      // 프론트엔드 형식으로 변환
      return {
        productId: result.productId,
        sentiment: {
          positive: result.sentimentPositive,
          negative: result.sentimentNegative,
          neutral: result.sentimentNeutral,
        },
        summary: result.summary,
        keywords: result.keywords?.map(k => k.keyword) || [],
        totalReviews: result.totalReviews,
        averageRating: result.averageRating,
        processingTime: result.processingTime,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };

    } catch (error) {
      console.error('❌ Failed to get analysis result:', error);
      throw error;
    }
  }

  /**
   * 사용자의 분석 결과 목록 조회
   * @param {string} userId - 사용자 ID
   * @param {number} page - 페이지 번호
   * @param {number} limit - 페이지당 개수
   * @returns {Promise<Object>} 분석 결과 목록과 페이징 정보
   */
  async getUserAnalysisResults(userId, page = 1, limit = 10) {
    try {
      console.log(`🔍 Getting analysis results for user: ${userId}`);
      
      const results = await this.mongoResult.findByUserId(userId, page, limit);
      
      // 프론트엔드 형식으로 변환
      const formattedResults = results.results.map(result => ({
        productId: result.productId,
        sentiment: {
          positive: result.sentimentPositive,
          negative: result.sentimentNegative,
          neutral: result.sentimentNeutral,
        },
        summary: result.summary,
        totalReviews: result.totalReviews,
        averageRating: result.averageRating,
        createdAt: result.createdAt,
      }));

      return {
        results: formattedResults,
        pagination: results.pagination,
      };

    } catch (error) {
      console.error('❌ Failed to get user analysis results:', error);
      throw error;
    }
  }

  /**
   * 다중 상품 분석 요청 (검색어 기반)
   * @param {Object} params - 분석 요청 파라미터
   * @param {string} params.searchQuery - 검색어
   * @param {string} params.userId - 사용자 ID
   * @param {number} params.maxProducts - 최대 상품 수
   * @returns {Promise<Object>} 분석 요청 결과
   */
  async requestMultiProductAnalysis(params) {
    try {
      const { searchQuery, userId, maxProducts = 10 } = params;
      
      console.log(`🔍 Starting multi product analysis request:`, {
        searchQuery,
        userId,
        maxProducts,
      });

      // 중복 요청 체크
      const cacheKey = `analysis:multi:${searchQuery}:${userId}`;
      const existingRequest = await cacheService.get(cacheKey);
      
      if (existingRequest) {
        console.log(`⚡ Found existing analysis request for search "${searchQuery}"`);
        return {
          status: 'in_progress',
          dagRunId: existingRequest.dagRunId,
          message: 'Analysis already in progress',
          cached: true,
        };
      }

      // Airflow DAG 트리거
      const dagRun = await airflowClient.triggerMultiProductAnalysis({
        searchQuery,
        userId,
        maxProducts,
      });

      // 요청 정보 캐시에 저장 (30분 TTL)
      const requestInfo = {
        dagId: dagRun.dagId,
        dagRunId: dagRun.dagRunId,
        searchQuery,
        userId,
        maxProducts,
        status: 'triggered',
        createdAt: new Date().toISOString(),
      };
      
      await cacheService.set(cacheKey, requestInfo, 1800); // 30분

      // Kafka로 분석 시작 메시지 전송 (현재 사용하지 않음)
      // await kafkaProducer.sendMessage('analysis-requests', {
      //   type: 'multi_product_analysis_started',
      //   dagRunId: dagRun.dagRunId,
      //   searchQuery,
      //   userId,
      //   maxProducts,
      //   timestamp: new Date().toISOString(),
      // });

      console.log(`✅ Multi product analysis triggered successfully:`, {
        dagRunId: dagRun.dagRunId,
        searchQuery,
      });

      return {
        status: 'triggered',
        dagRunId: dagRun.dagRunId,
        dagId: dagRun.dagId,
        executionDate: dagRun.executionDate,
        message: 'Analysis started successfully',
      };

    } catch (error) {
      console.error('❌ Failed to request multi product analysis:', error);
      
      Sentry.withScope((scope) => {
        scope.setTag('analysis_request_failed', true);
        scope.setContext('analysis_request', {
          type: 'multi_product',
          searchQuery: params.searchQuery,
          userId: params.userId,
        });
        Sentry.captureException(error);
      });

      throw error;
    }
  }

  /**
   * 관심 상품 배치 분석 요청
   * @param {Object} params - 분석 요청 파라미터
   * @param {string} params.userId - 사용자 ID
   * @param {Array} params.productIds - 관심 상품 ID 목록
   * @returns {Promise<Object>} 분석 요청 결과
   */
  async requestWatchlistAnalysis(params) {
    try {
      const { userId, productIds } = params;
      
      console.log(`🔍 Starting watchlist analysis request:`, {
        userId,
        productCount: productIds.length,
      });

      // 중복 요청 체크
      const cacheKey = `analysis:watchlist:${userId}`;
      const existingRequest = await cacheService.get(cacheKey);
      
      if (existingRequest) {
        console.log(`⚡ Found existing watchlist analysis request for user ${userId}`);
        return {
          status: 'in_progress',
          dagRunId: existingRequest.dagRunId,
          message: 'Watchlist analysis already in progress',
          cached: true,
        };
      }

      // Airflow DAG 트리거
      const dagRun = await airflowClient.triggerWatchlistAnalysis({
        userId,
        productIds,
      });

      // 요청 정보 캐시에 저장 (1시간 TTL)
      const requestInfo = {
        dagId: dagRun.dagId,
        dagRunId: dagRun.dagRunId,
        userId,
        productIds,
        status: 'triggered',
        createdAt: new Date().toISOString(),
      };
      
      await cacheService.set(cacheKey, requestInfo, 3600); // 1시간

      // Kafka로 분석 시작 메시지 전송 (현재 사용하지 않음)
      // await kafkaProducer.sendMessage('analysis-requests', {
      //   type: 'watchlist_analysis_started',
      //   dagRunId: dagRun.dagRunId,
      //   userId,
      //   productIds,
      //   timestamp: new Date().toISOString(),
      // });

      console.log(`✅ Watchlist analysis triggered successfully:`, {
        dagRunId: dagRun.dagRunId,
        userId,
        productCount: productIds.length,
      });

      return {
        status: 'triggered',
        dagRunId: dagRun.dagRunId,
        dagId: dagRun.dagId,
        executionDate: dagRun.executionDate,
        message: 'Watchlist analysis started successfully',
      };

    } catch (error) {
      console.error('❌ Failed to request watchlist analysis:', error);
      
      Sentry.withScope((scope) => {
        scope.setTag('analysis_request_failed', true);
        scope.setContext('analysis_request', {
          type: 'watchlist',
          userId: params.userId,
          productCount: params.productIds.length,
        });
        Sentry.captureException(error);
      });

      throw error;
    }
  }

  /**
   * 분석 상태 조회
   * @param {string} dagId - DAG ID
   * @param {string} dagRunId - DAG Run ID
   * @returns {Promise<Object>} 분석 상태 정보
   */
  async getAnalysisStatus(dagId, dagRunId) {
    try {
      console.log(`🔍 Getting analysis status: ${dagId}/${dagRunId}`);

      // 캐시에서 기본 정보 조회
      const cacheKey = `status:${dagId}:${dagRunId}`;
      const cachedStatus = await cacheService.get(cacheKey);

      // Airflow에서 최신 상태 조회
      const dagRunStatus = await airflowClient.getDagRunStatus(dagId, dagRunId);
      const tasks = await airflowClient.getDagRunTasks(dagId, dagRunId);

      const result = {
        dagId,
        dagRunId,
        state: dagRunStatus.state,
        executionDate: dagRunStatus.executionDate,
        startDate: dagRunStatus.startDate,
        endDate: dagRunStatus.endDate,
        tasks: tasks,
        progress: this.calculateProgress(tasks),
        cached: !!cachedStatus,
      };

      // 상태 정보 캐시 (5분 TTL)
      await cacheService.set(cacheKey, result, 300);

      console.log(`📊 Analysis status retrieved:`, {
        dagRunId,
        state: result.state,
        progress: result.progress,
      });

      return result;

    } catch (error) {
      console.error('❌ Failed to get analysis status:', error);
      
      Sentry.withScope((scope) => {
        scope.setTag('analysis_status_check_failed', true);
        scope.setContext('analysis_status_check', {
          dagId,
          dagRunId,
        });
        Sentry.captureException(error);
      });

      throw error;
    }
  }

  /**
   * 태스크 진행률 계산
   * @param {Array} tasks - 태스크 목록
   * @returns {Object} 진행률 정보
   */
  calculateProgress(tasks) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.state === 'success').length;
    const failedTasks = tasks.filter(task => task.state === 'failed').length;
    const runningTasks = tasks.filter(task => task.state === 'running').length;

    return {
      total: totalTasks,
      completed: completedTasks,
      failed: failedTasks,
      running: runningTasks,
      percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  }

  /**
   * 활성 분석 목록 조회
   * @param {string} userId - 사용자 ID
   * @returns {Promise<Array>} 활성 분석 목록
   */
  async getActiveAnalyses(userId) {
    try {
      console.log(`🔍 Getting active analyses for user: ${userId}`);

      // 캐시에서 사용자의 활성 분석 목록 조회
      const cachePattern = `analysis:*:*:${userId}`;
      const activeAnalyses = [];

      // 실제 구현에서는 Redis SCAN을 사용하거나 별도 인덱스 관리 필요
      // 여기서는 간단한 예시로 구현

      console.log(`📋 Found ${activeAnalyses.length} active analyses for user ${userId}`);
      
      return activeAnalyses;

    } catch (error) {
      console.error('❌ Failed to get active analyses:', error);
      
      Sentry.withScope((scope) => {
        scope.setTag('active_analyses_check_failed', true);
        scope.setContext('active_analyses_check', { userId });
        Sentry.captureException(error);
      });

      throw error;
    }
  }
}

module.exports = new AnalysisService();