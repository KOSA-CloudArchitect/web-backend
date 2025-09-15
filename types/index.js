/**
 * 분석 요청 타입 정의
 * @typedef {Object} AnalysisRequest
 * @property {string} productId - 상품 ID
 * @property {string} [url] - 상품 URL (선택적)
 * @property {string[]} [keywords] - 키워드 목록 (선택적)
 */

/**
 * 외부 분석 서버 요청 타입 정의
 * @typedef {Object} ExternalAnalysisRequest
 * @property {string} productId - 상품 ID
 * @property {string} [url] - 상품 URL (선택적)
 * @property {string[]} [keywords] - 키워드 목록 (선택적)
 * @property {string} callbackUrl - 콜백 URL
 */

/**
 * 외부 분석 서버 응답 타입 정의
 * @typedef {Object} ExternalAnalysisResponse
 * @property {string} taskId - 작업 ID
 * @property {number} estimatedTime - 예상 소요 시간 (초)
 */

/**
 * 분석 상태 타입 정의
 * @typedef {Object} AnalysisStatus
 * @property {string} status - 상태 (pending, processing, completed, failed)
 * @property {number} progress - 진행률 (0-100)
 * @property {number} [estimatedTime] - 예상 남은 시간 (초)
 * @property {string} [error] - 오류 메시지
 */

/**
 * 서킷 브레이커 옵션 타입 정의
 * @typedef {Object} CircuitBreakerOptions
 * @property {number} timeout - 타임아웃 (ms)
 * @property {number} errorThresholdPercentage - 오류 임계값 비율
 * @property {number} resetTimeout - 리셋 타임아웃 (ms)
 */

module.exports = {
  // 타입 정의는 JSDoc으로만 제공됨
};