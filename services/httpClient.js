const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const CircuitBreaker = require('opossum');
const { Sentry } = require('../config/sentry');

class HttpClient {
  constructor() {
    this.client = this.createAxiosInstance();
    this.setupRetryLogic();
    this.circuitBreaker = this.createCircuitBreaker();
  }

  createAxiosInstance() {
    const client = axios.create({
      baseURL: process.env.ANALYSIS_SERVER_URL || 'http://localhost:30800',
      timeout: parseInt(process.env.HTTP_TIMEOUT || '120000'),
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'KOSA-Backend/1.0.0',
      },
    });

    // 크롤링 서버용 별도 클라이언트 생성
    this.crawlerClient = axios.create({
      baseURL: process.env.CRAWLING_SERVER_URL || 'http://localhost:30900',
      timeout: parseInt(process.env.HTTP_TIMEOUT || '120000'),
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'KOSA-Backend/1.0.0',
      },
    });

    // 크롤링 서버 클라이언트에도 인터셉터 적용
    this.setupCrawlerInterceptors();

    // Request interceptor for Bearer token
    client.interceptors.request.use(
      (config) => {
        const token = process.env.ANALYSIS_SERVER_TOKEN;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log request (without sensitive data)
        console.log(`🔄 HTTP Request: ${config.method?.toUpperCase()} ${config.url}`);
        
        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        Sentry.captureException(error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and error handling
    client.interceptors.response.use(
      (response) => {
        console.log(`✅ HTTP Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        const status = error.response?.status;
        const url = error.config?.url;
        
        console.error(`❌ HTTP Error: ${status} ${url}`, {
          message: error.message,
          status,
          data: error.response?.data,
        });

        // Sentry error reporting with context
        Sentry.withScope((scope) => {
          scope.setTag('http_error', true);
          scope.setContext('http_request', {
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
      retries: parseInt(process.env.HTTP_RETRY_COUNT || '3'),
      retryDelay: (retryCount) => {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`🔄 Retry attempt ${retryCount}, waiting ${delay}ms`);
        return delay;
      },
      retryCondition: (error) => {
        // Retry on network errors or 5xx responses
        return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
               (error.response?.status !== undefined && error.response.status >= 500 && error.response.status < 600);
      },
      onRetry: (retryCount, error, requestConfig) => {
        console.log(`🔄 Retrying request (${retryCount}/${process.env.HTTP_RETRY_COUNT || '3'}): ${requestConfig.url}`);
        
        Sentry.addBreadcrumb({
          message: `HTTP retry attempt ${retryCount}`,
          category: 'http',
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
      timeout: parseInt(process.env.CIRCUIT_BREAKER_TIMEOUT || '120000'),
      errorThresholdPercentage: parseInt(process.env.CIRCUIT_BREAKER_ERROR_THRESHOLD || '50'),
      resetTimeout: parseInt(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT || '60000'),
    };

    const breaker = new CircuitBreaker(this.makeRequest.bind(this), options);

    breaker.on('open', () => {
      console.warn('🔴 Circuit breaker opened - requests will be rejected');
      Sentry.captureMessage('Circuit breaker opened', 'warning');
    });

    breaker.on('halfOpen', () => {
      console.log('🟡 Circuit breaker half-open - testing requests');
      Sentry.captureMessage('Circuit breaker half-open', 'info');
    });

    breaker.on('close', () => {
      console.log('🟢 Circuit breaker closed - normal operation resumed');
      Sentry.captureMessage('Circuit breaker closed', 'info');
    });

    return breaker;
  }

  async makeRequest(url, data) {
    return this.client.post(url, data);
  }

  async requestAnalysis(request) {
    try {
      const response = await this.circuitBreaker.fire('/analyze', request);
      return response.data;
    } catch (error) {
      console.error('❌ Analysis request failed:', error);
      
      // Enhanced error context for Sentry
      Sentry.withScope((scope) => {
        scope.setTag('analysis_request_failed', true);
        scope.setContext('analysis_request', {
          productId: request.productId,
          hasUrl: !!request.url,
          keywordCount: request.keywords?.length || 0,
        });
        Sentry.captureException(error);
      });

      throw error;
    }
  }

  async checkAnalysisStatus(taskId) {
    try {
      const response = await this.circuitBreaker.fire(`/status/${taskId}`, {});
      return response.data;
    } catch (error) {
      console.error('❌ Status check failed:', error);
      
      Sentry.withScope((scope) => {
        scope.setTag('status_check_failed', true);
        scope.setContext('status_check', { taskId });
        Sentry.captureException(error);
      });

      throw error;
    }
  }

  setupCrawlerInterceptors() {
    // Request interceptor for crawler client
    this.crawlerClient.interceptors.request.use(
      (config) => {
        const token = process.env.CRAWLING_SERVER_TOKEN;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log(`🕷️ Crawler Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Crawler request interceptor error:', error);
        Sentry.captureException(error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for crawler client
    this.crawlerClient.interceptors.response.use(
      (response) => {
        console.log(`✅ Crawler Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        const status = error.response?.status;
        const url = error.config?.url;
        
        console.error(`❌ Crawler Error: ${status} ${url}`, {
          message: error.message,
          status,
          data: error.response?.data,
        });

        Sentry.withScope((scope) => {
          scope.setTag('crawler_error', true);
          scope.setContext('crawler_request', {
            url,
            method: error.config?.method,
            status,
          });
          Sentry.captureException(error);
        });

        return Promise.reject(error);
      }
    );
  }

  async requestProductSearch(request) {
    try {
      console.log(`🕷️ Requesting product search from crawler:`, {
        keyword: request.keyword,
        maxLinks: request.max_links,
        crawlerUrl: process.env.CRAWLING_SERVER_URL || 'http://localhost:30900'
      });

      // 크롤링 서버의 info_list 엔드포인트 호출
      const response = await this.crawlerClient.post('/info_list', request);
      
      console.log(`✅ Crawler response received:`, {
        status: response.status,
        dataKeys: Object.keys(response.data || {}),
        hasInfoList: !!(response.data?.info_list)
      });

      return response.data;
    } catch (error) {
      console.error('❌ Product search request failed:', error);
      
      // 상세한 오류 정보 로깅
      if (error.code === 'ECONNREFUSED') {
        console.error(`❌ Cannot connect to crawler server: ${process.env.CRAWLING_SERVER_URL || 'http://localhost:30900'}`);
      } else if (error.code === 'ETIMEDOUT') {
        console.error(`❌ Crawler server timeout: ${process.env.CRAWLING_SERVER_URL || 'http://localhost:30900'}`);
      } else if (error.response) {
        console.error(`❌ Crawler server error response:`, {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      
      // Enhanced error context for Sentry
      Sentry.withScope((scope) => {
        scope.setTag('product_search_failed', true);
        scope.setContext('search_request', {
          keyword: request.keyword,
          maxLinks: request.max_links,
          crawlerUrl: process.env.CRAWLING_SERVER_URL,
          errorCode: error.code,
          errorStatus: error.response?.status
        });
        Sentry.captureException(error);
      });

      throw error;
    }
  }
}

module.exports = new HttpClient();