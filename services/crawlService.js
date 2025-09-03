const fetch = require('node-fetch');
const { AbortController } = require('node-fetch');

async function fetchInfoList({ keyword, max_links = 10, timeout = 30000 }) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    console.log(`🔍 크롤링 요청 시작: keyword="${keyword}", max_links=${max_links}, timeout=${timeout}ms`);
    
    const res = await fetch('http://crawler-svc.web-tier.svc.cluster.local:30800/info_list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword, max_links }),
      signal: controller.signal,
      timeout: timeout
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`❌ 크롤링 HTTP 오류: ${res.status} - ${text}`);
      
      // 504 Gateway Timeout의 경우 더 관대한 처리
      if (res.status === 504) {
        console.warn('⚠️ Gateway Timeout - 빈 결과 반환');
        return [];
      }
      
      throw new Error(`Crawler error ${res.status}: ${text}`);
    }
    
    const data = await res.json();
    const result = Array.isArray(data.info_list) ? data.info_list : [];
    console.log(`✅ 크롤링 완료: ${result.length}개 상품 찾음`);
    return result;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.warn(`⏰ 크롤링 타임아웃 (${timeout}ms) - 빈 결과 반환`);
      return [];
    }
    
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      console.warn(`🔌 연결 문제: ${error.code} - 빈 결과 반환`);
      return [];
    }
    
    console.error(`❌ 크롤링 오류:`, error.message);
    throw error;
  }
}

module.exports = { fetchInfoList };