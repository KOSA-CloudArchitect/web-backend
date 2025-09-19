// 크롤링 상태 관리 서비스
const axios = require('axios');
const websocketService = require('./websocketService');

class CrawlingStatusService {
  constructor() {
    this.activePolls = new Map(); // keyword -> polling info
    this.crawlingServerUrl = process.env.CRAWLING_SERVER_URL || 'http://10.128.3.36:30800';
  }

  /**
   * 크롤링 상태 폴링 시작
   */
  async startStatusPolling(keyword, jobId) {
    // 이미 폴링 중인지 확인
    if (this.activePolls.has(keyword)) {
      console.log(`⏳ ${keyword} 이미 폴링 중`);
      return;
    }

    const pollInfo = {
      keyword,
      jobId,
      startTime: new Date(),
      intervalId: null,
      pollCount: 0
    };

    this.activePolls.set(keyword, pollInfo);
    console.log(`🔄 크롤링 상태 폴링 시작: ${keyword} (jobId: ${jobId})`);

    // 즉시 한 번 확인
    await this.checkCrawlingStatus(keyword);

    // 2초마다 상태 확인 (최대 5분)
    pollInfo.intervalId = setInterval(async () => {
      await this.checkCrawlingStatus(keyword);
    }, 2000);

    // 5분 후 자동 중단
    setTimeout(() => {
      this.stopStatusPolling(keyword);
    }, 5 * 60 * 1000);
  }

  /**
   * 크롤링 상태 확인
   */
  async checkCrawlingStatus(keyword) {
    const pollInfo = this.activePolls.get(keyword);
    if (!pollInfo) return;

    try {
      pollInfo.pollCount++;
      const response = await axios.get(
        `${this.crawlingServerUrl}/info_list/status/${encodeURIComponent(keyword)}`,
        { timeout: 5000 }
      );

      const { status, message } = response.data;
      const { jobId } = pollInfo;

      console.log(`📊 크롤링 상태 [${keyword}] (${pollInfo.pollCount}회): ${status}`);

      // WebSocket으로 상태 업데이트 전송
      if (websocketService && websocketService.emitToRoom) {
        await websocketService.emitToRoom(`search:${jobId}`, 'crawling-status', {
          keyword,
          status,
          message,
          pollCount: pollInfo.pollCount,
          timestamp: new Date().toISOString()
        });
      }

      // 완료되면 폴링 중단
      if (status === 'completed') {
        console.log(`✅ 크롤링 완료: ${keyword}`);
        this.stopStatusPolling(keyword);
        
        // 완료 알림
        if (websocketService && websocketService.emitToRoom) {
          await websocketService.emitToRoom(`search:${jobId}`, 'crawling-completed', {
            keyword,
            message: `"${keyword}" 크롤링이 완료되었습니다.`,
            timestamp: new Date().toISOString()
          });
        }
      }

    } catch (error) {
      console.error(`❌ 크롤링 상태 확인 실패 [${keyword}]:`, error.message);
      
      // 연속 3회 실패시 폴링 중단
      if (pollInfo.pollCount > 3) {
        console.log(`⚠️ 연속 실패로 폴링 중단: ${keyword}`);
        this.stopStatusPolling(keyword);
      }
    }
  }

  /**
   * 크롤링 상태 폴링 중단
   */
  stopStatusPolling(keyword) {
    const pollInfo = this.activePolls.get(keyword);
    if (!pollInfo) return;

    if (pollInfo.intervalId) {
      clearInterval(pollInfo.intervalId);
    }

    const duration = new Date() - pollInfo.startTime;
    console.log(`🛑 크롤링 상태 폴링 중단: ${keyword} (${Math.round(duration/1000)}초, ${pollInfo.pollCount}회 확인)`);
    
    this.activePolls.delete(keyword);
  }

  /**
   * 모든 폴링 중단
   */
  stopAllPolling() {
    for (const keyword of this.activePolls.keys()) {
      this.stopStatusPolling(keyword);
    }
  }

  /**
   * 현재 폴링 상태 조회
   */
  getActivePolls() {
    return Array.from(this.activePolls.entries()).map(([keyword, pollInfo]) => ({
      keyword,
      jobId: pollInfo.jobId,
      startTime: pollInfo.startTime,
      pollCount: pollInfo.pollCount,
      duration: new Date() - pollInfo.startTime
    }));
  }
}

module.exports = new CrawlingStatusService();