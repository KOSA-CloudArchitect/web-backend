const airflowClient = require('./airflowClient');
const kafkaProducer = require('./kafkaProducer');
const cacheService = require('./cacheService');
const { Sentry } = require('../config/sentry');

/**
 * 분석 서비스
 * Airflow DAG 트리거 및 분석 요청 관리
 */
class AnalysisService {
  constructor() {
    this.analysisCache = new Map(); // 진행 중인 분석 요청 캐시
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

      // 중복 요청 체크
      const cacheKey = `analysis:single:${productId}:${userId}`;
      const existingRequest = await cacheService.get(cacheKey);
      
      if (existingRequest) {
        console.log(`⚡ Found existing analysis request for product ${productId}`);
        return {
          status: 'in_progress',
          dagRunId: existingRequest.dagRunId,
          message: 'Analysis already in progress',
          cached: true,
        };
      }

      // Airflow DAG 트리거
      const dagRun = await airflowClient.triggerSingleProductAnalysis({
        productId,
        productUrl,
        userId,
      });

      // 요청 정보 캐시에 저장 (30분 TTL)
      const requestInfo = {
        dagId: dagRun.dagId,
        dagRunId: dagRun.dagRunId,
        productId,
        userId,
        status: 'triggered',
        createdAt: new Date().toISOString(),
      };
      
      await cacheService.set(cacheKey, requestInfo, 1800); // 30분

      // Kafka로 분석 시작 메시지 전송
      await kafkaProducer.sendMessage('analysis-requests', {
        type: 'single_product_analysis_started',
        dagRunId: dagRun.dagRunId,
        productId,
        userId,
        timestamp: new Date().toISOString(),
      });

      console.log(`✅ Single product analysis triggered successfully:`, {
        dagRunId: dagRun.dagRunId,
        productId,
      });

      return {
        status: 'triggered',
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

      // Kafka로 분석 시작 메시지 전송
      await kafkaProducer.sendMessage('analysis-requests', {
        type: 'multi_product_analysis_started',
        dagRunId: dagRun.dagRunId,
        searchQuery,
        userId,
        maxProducts,
        timestamp: new Date().toISOString(),
      });

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

      // Kafka로 분석 시작 메시지 전송
      await kafkaProducer.sendMessage('analysis-requests', {
        type: 'watchlist_analysis_started',
        dagRunId: dagRun.dagRunId,
        userId,
        productIds,
        timestamp: new Date().toISOString(),
      });

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