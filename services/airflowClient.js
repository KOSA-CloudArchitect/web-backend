const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const CircuitBreaker = require('opossum');
const { Sentry } = require('../config/sentry');

/**
 * Airflow API 클라이언트
 * DAG 트리거 및 실행 상태 조회를 위한 클라이언트
 */
class AirflowClient {
  constructor() {
    this.client = this.createAxiosInstance();
    this.setupRetryLogic();
    this.circuitBreaker = this.createCircuitBreaker();
  }

  createAxiosInstance() {
    const client = axios.create({
      baseURL: process.env.AIRFLOW_API_URL || 'http://localhost:8080/api/v1',
      timeout: parseInt(process.env.AIRFLOW_TIMEOUT || '30000'),
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'KOSA-Backend/1.0.0',
      },
    });

    // Basic Auth 설정 (Airflow 기본 인증)
    const username = process.env.AIRFLOW_USERNAME || 'admin';
    const password = process.env.AIRFLOW_PASSWORD || 'admin';
    
    client.interceptors.request.use(
      (config) => {
        // Basic Auth 헤더 추가
        const auth = Buffer.from(`${username}:${password}`).toString('base64');
        config.headers.Authorization = `Basic ${auth}`;
        
        // Log request (without sensitive data)
        console.log(`🔄 Airflow Request: ${config.method?.toUpperCase()} ${config.url}`);
        
        return config;
      },
      (error) => {
        console.error('❌ Airflow request interceptor error:', error);
        Sentry.captureException(error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and error handling
    client.interceptors.response.use(
      (response) => {
        console.log(`✅ Airflow Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        const status = error.response?.status;
        const url = error.config?.url;
        
        console.error(`❌ Airflow Error: ${status} ${url}`, {
          message: error.message,
          status,
          data: error.response?.data,
        });

        // Sentry error reporting with context
        Sentry.withScope((scope) => {
          scope.setTag('airflow_error', true);
          scope.setContext('airflow_request', {
            url,
            method: error.config?.method,
            status,
          });
          Sentry.captureException(error);
        });

        return Promise.reject(error);
      }
    );

    return client;
  }

  setupRetryLogic() {
    axiosRetry(this.client, {
      retries: parseInt(process.env.AIRFLOW_RETRY_COUNT || '3'),
      retryDelay: (retryCount) => {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`🔄 Airflow retry attempt ${retryCount}, waiting ${delay}ms`);
        return delay;
      },
      retryCondition: (error) => {
        // Retry on network errors or 5xx responses
        return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
               (error.response?.status !== undefined && error.response.status >= 500 && error.response.status < 600);
      },
      onRetry: (retryCount, error, requestConfig) => {
        console.log(`🔄 Retrying Airflow request (${retryCount}/${process.env.AIRFLOW_RETRY_COUNT || '3'}): ${requestConfig.url}`);
        
        Sentry.addBreadcrumb({
          message: `Airflow retry attempt ${retryCount}`,
          category: 'airflow',
          level: 'warning',
          data: {
            url: requestConfig.url,
            method: requestConfig.method,
            error: error.message,
          },
        });
      },
    });
  }

  createCircuitBreaker() {
    const options = {
      timeout: parseInt(process.env.AIRFLOW_CIRCUIT_BREAKER_TIMEOUT || '30000'),
      errorThresholdPercentage: parseInt(process.env.AIRFLOW_CIRCUIT_BREAKER_ERROR_THRESHOLD || '50'),
      resetTimeout: parseInt(process.env.AIRFLOW_CIRCUIT_BREAKER_RESET_TIMEOUT || '60000'),
    };

    const breaker = new CircuitBreaker(this.makeRequest.bind(this), options);

    breaker.on('open', () => {
      console.warn('🔴 Airflow circuit breaker opened - requests will be rejected');
      Sentry.captureMessage('Airflow circuit breaker opened', 'warning');
    });

    breaker.on('halfOpen', () => {
      console.log('🟡 Airflow circuit breaker half-open - testing requests');
      Sentry.captureMessage('Airflow circuit breaker half-open', 'info');
    });

    breaker.on('close', () => {
      console.log('🟢 Airflow circuit breaker closed - normal operation resumed');
      Sentry.captureMessage('Airflow circuit breaker closed', 'info');
    });

    return breaker;
  }

  async makeRequest(method, url, data = null) {
    const config = {
      method,
      url,
    };
    
    if (data) {
      config.data = data;
    }
    
    return this.client(config);
  }

  /**
   * 단일 상품 분석 DAG 트리거
   * @param {Object} params - 분석 요청 파라미터
   * @param {string} params.productId - 상품 ID
   * @param {string} params.productUrl - 상품 URL
   * @param {string} params.userId - 사용자 ID
   * @returns {Promise<Object>} DAG run 정보
   */
  async triggerSingleProductAnalysis(params) {
    try {
      const dagId = 'single_product_analysis';
      const dagRunId = `single_${params.productId}_${Date.now()}`;
      
      const payload = {
        dag_run_id: dagRunId,
        conf: {
          product_id: params.productId,
          product_url: params.productUrl,
          user_id: params.userId,
          analysis_type: 'single',
          timestamp: new Date().toISOString(),
        },
      };

      console.log(`🚀 Triggering single product analysis DAG: ${dagId}`, {
        dagRunId,
        productId: params.productId,
      });

      const response = await this.circuitBreaker.fire(
        'POST',
        `/dags/${dagId}/dagRuns`,
        payload
      );

      const result = {
        dagId,
        dagRunId,
        executionDate: response.data.execution_date,
        state: response.data.state,
        conf: response.data.conf,
      };

      console.log(`✅ Single product analysis DAG triggered successfully:`, result);
      
      return result;
    } catch (error) {
      console.error('❌ Failed to trigger single product analysis DAG:', error);
      
      Sentry.withScope((scope) => {
        scope.setTag('dag_trigger_failed', true);
        scope.setContext('dag_trigger', {
          dagType: 'single_product_analysis',
          productId: params.productId,
          userId: params.userId,
        });
        Sentry.captureException(error);
      });

      throw error;
    }
  }

  /**
   * 다중 상품 분석 DAG 트리거 (검색어 기반)
   * @param {Object} params - 분석 요청 파라미터
   * @param {string} params.searchQuery - 검색어
   * @param {string} params.userId - 사용자 ID
   * @param {number} params.maxProducts - 최대 상품 수 (기본값: 10)
   * @returns {Promise<Object>} DAG run 정보
   */
  async triggerMultiProductAnalysis(params) {
    try {
      const dagId = 'multi_product_analysis';
      const dagRunId = `multi_${params.searchQuery.replace(/\s+/g, '_')}_${Date.now()}`;
      
      const payload = {
        dag_run_id: dagRunId,
        conf: {
          search_query: params.searchQuery,
          user_id: params.userId,
          max_products: params.maxProducts || 10,
          analysis_type: 'multi',
          timestamp: new Date().toISOString(),
        },
      };

      console.log(`🚀 Triggering multi product analysis DAG: ${dagId}`, {
        dagRunId,
        searchQuery: params.searchQuery,
      });

      const response = await this.circuitBreaker.fire(
        'POST',
        `/dags/${dagId}/dagRuns`,
        payload
      );

      const result = {
        dagId,
        dagRunId,
        executionDate: response.data.execution_date,
        state: response.data.state,
        conf: response.data.conf,
      };

      console.log(`✅ Multi product analysis DAG triggered successfully:`, result);
      
      return result;
    } catch (error) {
      console.error('❌ Failed to trigger multi product analysis DAG:', error);
      
      Sentry.withScope((scope) => {
        scope.setTag('dag_trigger_failed', true);
        scope.setContext('dag_trigger', {
          dagType: 'multi_product_analysis',
          searchQuery: params.searchQuery,
          userId: params.userId,
        });
        Sentry.captureException(error);
      });

      throw error;
    }
  }

  /**
   * 관심 상품 배치 분석 DAG 트리거
   * @param {Object} params - 분석 요청 파라미터
   * @param {string} params.userId - 사용자 ID
   * @param {Array} params.productIds - 관심 상품 ID 목록
   * @returns {Promise<Object>} DAG run 정보
   */
  async triggerWatchlistAnalysis(params) {
    try {
      const dagId = 'watchlist_batch_analysis';
      const dagRunId = `watchlist_${params.userId}_${Date.now()}`;
      
      const payload = {
        dag_run_id: dagRunId,
        conf: {
          user_id: params.userId,
          product_ids: params.productIds,
          analysis_type: 'watchlist',
          timestamp: new Date().toISOString(),
        },
      };

      console.log(`🚀 Triggering watchlist analysis DAG: ${dagId}`, {
        dagRunId,
        userId: params.userId,
        productCount: params.productIds.length,
      });

      const response = await this.circuitBreaker.fire(
        'POST',
        `/dags/${dagId}/dagRuns`,
        payload
      );

      const result = {
        dagId,
        dagRunId,
        executionDate: response.data.execution_date,
        state: response.data.state,
        conf: response.data.conf,
      };

      console.log(`✅ Watchlist analysis DAG triggered successfully:`, result);
      
      return result;
    } catch (error) {
      console.error('❌ Failed to trigger watchlist analysis DAG:', error);
      
      Sentry.withScope((scope) => {
        scope.setTag('dag_trigger_failed', true);
        scope.setContext('dag_trigger', {
          dagType: 'watchlist_batch_analysis',
          userId: params.userId,
          productCount: params.productIds.length,
        });
        Sentry.captureException(error);
      });

      throw error;
    }
  }

  /**
   * DAG 실행 상태 조회
   * @param {string} dagId - DAG ID
   * @param {string} dagRunId - DAG Run ID
   * @returns {Promise<Object>} DAG run 상태 정보
   */
  async getDagRunStatus(dagId, dagRunId) {
    try {
      console.log(`🔍 Checking DAG run status: ${dagId}/${dagRunId}`);

      const response = await this.circuitBreaker.fire(
        'GET',
        `/dags/${dagId}/dagRuns/${dagRunId}`
      );

      const result = {
        dagId,
        dagRunId,
        state: response.data.state,
        executionDate: response.data.execution_date,
        startDate: response.data.start_date,
        endDate: response.data.end_date,
        conf: response.data.conf,
      };

      console.log(`📊 DAG run status retrieved:`, result);
      
      return result;
    } catch (error) {
      console.error('❌ Failed to get DAG run status:', error);
      
      Sentry.withScope((scope) => {
        scope.setTag('dag_status_check_failed', true);
        scope.setContext('dag_status_check', {
          dagId,
          dagRunId,
        });
        Sentry.captureException(error);
      });

      throw error;
    }
  }

  /**
   * DAG 실행 태스크 목록 조회
   * @param {string} dagId - DAG ID
   * @param {string} dagRunId - DAG Run ID
   * @returns {Promise<Array>} 태스크 인스턴스 목록
   */
  async getDagRunTasks(dagId, dagRunId) {
    try {
      console.log(`🔍 Getting DAG run tasks: ${dagId}/${dagRunId}`);

      const response = await this.circuitBreaker.fire(
        'GET',
        `/dags/${dagId}/dagRuns/${dagRunId}/taskInstances`
      );

      const tasks = response.data.task_instances.map(task => ({
        taskId: task.task_id,
        state: task.state,
        startDate: task.start_date,
        endDate: task.end_date,
        duration: task.duration,
        tryNumber: task.try_number,
      }));

      console.log(`📋 Retrieved ${tasks.length} task instances for DAG run`);
      
      return tasks;
    } catch (error) {
      console.error('❌ Failed to get DAG run tasks:', error);
      
      Sentry.withScope((scope) => {
        scope.setTag('dag_tasks_check_failed', true);
        scope.setContext('dag_tasks_check', {
          dagId,
          dagRunId,
        });
        Sentry.captureException(error);
      });

      throw error;
    }
  }

  /**
   * 활성 DAG 목록 조회
   * @returns {Promise<Array>} 활성 DAG 목록
   */
  async getActiveDags() {
    try {
      console.log('🔍 Getting active DAGs');

      const response = await this.circuitBreaker.fire(
        'GET',
        '/dags?only_active=true'
      );

      const dags = response.data.dags.map(dag => ({
        dagId: dag.dag_id,
        isActive: dag.is_active,
        isPaused: dag.is_paused,
        lastParsedTime: dag.last_parsed_time,
        description: dag.description,
      }));

      console.log(`📋 Retrieved ${dags.length} active DAGs`);
      
      return dags;
    } catch (error) {
      console.error('❌ Failed to get active DAGs:', error);
      
      Sentry.withScope((scope) => {
        scope.setTag('active_dags_check_failed', true);
        Sentry.captureException(error);
      });

      throw error;
    }
  }
}

module.exports = new AirflowClient();