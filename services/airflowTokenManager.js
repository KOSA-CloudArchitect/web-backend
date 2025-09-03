const axios = require('axios');
const { Sentry } = require('../config/sentry');

/**
 * Airflow JWT 토큰 관리자
 * JWT 토큰의 발급, 갱신, 캐싱을 담당
 */
class AirflowTokenManager {
  constructor() {
    this.token = null;
    this.tokenExpiry = null;
    this.isRefreshing = false;
    this.refreshPromise = null;
    
    // Airflow 설정
    this.airflowUrl = process.env.AIRFLOW_API_URL || 'http://my-airflow-api-server.airflow.svc.cluster.local:8080';
    this.username = process.env.AIRFLOW_USERNAME || 'admin';
    this.password = process.env.AIRFLOW_PASSWORD || 'admin';
    this.tokenExpirationBuffer = 60; // 만료 60초 전에 갱신
    
    console.log('🔧 AirflowTokenManager initialized with URL:', this.airflowUrl);
  }

  /**
   * JWT 토큰이 유효한지 확인
   * @returns {boolean} 토큰 유효성
   */
  isTokenValid() {
    if (!this.token || !this.tokenExpiry) {
      return false;
    }
    
    const now = Math.floor(Date.now() / 1000);
    const expiryWithBuffer = this.tokenExpiry - this.tokenExpirationBuffer;
    
    return now < expiryWithBuffer;
  }

  /**
   * Airflow에서 새로운 JWT 토큰 발급
   * @returns {Promise<string>} JWT 토큰
   */
  async issueNewToken() {
    try {
      console.log('🔄 Requesting new JWT token from Airflow...');
      
      const response = await axios.post(
        `${this.airflowUrl}/auth/token`,
        {
          username: this.username,
          password: this.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30초 타임아웃
        }
      );

      const { access_token } = response.data;
      
      if (!access_token) {
        throw new Error('Access token not found in response');
      }

      // JWT 토큰에서 만료 시간 추출 (간단한 파싱)
      const tokenPayload = this.parseJwtPayload(access_token);
      const expiry = tokenPayload.exp || (Math.floor(Date.now() / 1000) + 24 * 60 * 60); // 기본 24시간
      
      this.token = access_token;
      this.tokenExpiry = expiry;
      
      const expiryDate = new Date(expiry * 1000);
      console.log(`✅ JWT token issued successfully. Expires at: ${expiryDate.toISOString()}`);
      
      // Sentry에 토큰 발급 성공 기록
      Sentry.addBreadcrumb({
        message: 'Airflow JWT token issued',
        category: 'auth',
        level: 'info',
        data: {
          expiry: expiryDate.toISOString(),
        },
      });
      
      return access_token;
      
    } catch (error) {
      console.error('❌ Failed to issue JWT token:', error);
      
      // 토큰 발급 실패 시 기존 토큰 무효화
      this.token = null;
      this.tokenExpiry = null;
      
      // Sentry에 토큰 발급 실패 기록
      Sentry.withScope((scope) => {
        scope.setTag('airflow_token_issue_failed', true);
        scope.setContext('token_issue', {
          airflowUrl: this.airflowUrl,
          username: this.username,
          error: error.message,
        });
        Sentry.captureException(error);
      });
      
      // 에러 타입별 처리
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Airflow 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else if (error.response?.status === 401) {
        throw new Error('Airflow 인증 정보가 올바르지 않습니다. 사용자명과 비밀번호를 확인해주세요.');
      } else if (error.code === 'ETIMEDOUT') {
        throw new Error('Airflow 서버 응답 시간이 초과되었습니다.');
      }
      
      throw new Error(`JWT 토큰 발급 실패: ${error.message}`);
    }
  }

  /**
   * JWT 토큰의 payload 파싱 (간단한 Base64 디코딩)
   * @param {string} token - JWT 토큰
   * @returns {Object} 토큰 payload
   */
  parseJwtPayload(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }
      
      const payload = parts[1];
      const decoded = Buffer.from(payload, 'base64').toString('utf8');
      return JSON.parse(decoded);
      
    } catch (error) {
      console.warn('⚠️ Failed to parse JWT payload:', error);
      return {}; // 파싱 실패 시 빈 객체 반환
    }
  }

  /**
   * 유효한 JWT 토큰 반환 (필요시 갱신)
   * @returns {Promise<string>} 유효한 JWT 토큰
   */
  async getValidToken() {
    // 이미 갱신 중인 경우 대기
    if (this.isRefreshing && this.refreshPromise) {
      console.log('🔄 Token refresh already in progress, waiting...');
      return await this.refreshPromise;
    }
    
    // 토큰이 유효한 경우 바로 반환
    if (this.isTokenValid()) {
      return this.token;
    }
    
    // 토큰 갱신 필요
    console.log('🔄 Token expired or invalid, refreshing...');
    
    this.isRefreshing = true;
    this.refreshPromise = this.issueNewToken()
      .finally(() => {
        this.isRefreshing = false;
        this.refreshPromise = null;
      });
    
    return await this.refreshPromise;
  }

  /**
   * 현재 토큰 정보 반환 (디버깅용)
   * @returns {Object} 토큰 정보
   */
  getTokenInfo() {
    return {
      hasToken: !!this.token,
      isValid: this.isTokenValid(),
      expiry: this.tokenExpiry ? new Date(this.tokenExpiry * 1000).toISOString() : null,
      isRefreshing: this.isRefreshing,
    };
  }

  /**
   * 토큰 무효화 (로그아웃 등)
   */
  invalidateToken() {
    console.log('🗑️ Invalidating JWT token');
    
    this.token = null;
    this.tokenExpiry = null;
    this.isRefreshing = false;
    this.refreshPromise = null;
    
    Sentry.addBreadcrumb({
      message: 'Airflow JWT token invalidated',
      category: 'auth',
      level: 'info',
    });
  }

  /**
   * 토큰 갱신 스케줄러 시작 (선택적)
   * 주기적으로 토큰 만료 시간을 체크하여 미리 갱신
   */
  startTokenRefreshScheduler() {
    const checkInterval = 5 * 60 * 1000; // 5분마다 체크
    
    const scheduler = setInterval(async () => {
      try {
        if (!this.isTokenValid() && !this.isRefreshing) {
          console.log('🕐 Scheduled token refresh triggered');
          await this.getValidToken();
        }
      } catch (error) {
        console.error('❌ Scheduled token refresh failed:', error);
      }
    }, checkInterval);
    
    console.log('⏰ Token refresh scheduler started (check every 5 minutes)');
    
    return scheduler; // 필요시 clearInterval로 정지 가능
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const airflowTokenManager = new AirflowTokenManager();

module.exports = airflowTokenManager;
