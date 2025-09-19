const AnalysisProgressService = require('./analysisProgressService');

class ReviewAnalysisWorker {
  constructor() {
    this.progressService = new AnalysisProgressService();
  }

  async processReviews(taskId, productId, reviews) {
    try {
      console.log(`🚀 Starting analysis for task ${taskId} with ${reviews.length} reviews`);
      
      // 초기 상태 설정
      await this.progressService.updateProgress(taskId, {
        status: 'processing',
        progress: 0,
        current_step: 'initializing',
        total_reviews: reviews.length,
        processed_reviews: 0,
        product_id: productId
      });

      // 1단계: 데이터 전처리 (5%)
      await this.preprocessReviews(taskId, reviews);
      
      // 2단계: 감정 분석 (5% -> 70%)
      const sentimentResults = await this.analyzeSentiments(taskId, reviews);
      
      // 3단계: 키워드 추출 (70% -> 85%)
      const keywords = await this.extractKeywords(taskId, reviews);
      
      // 4단계: 요약 생성 (85% -> 95%)
      const summary = await this.generateSummary(taskId, sentimentResults, keywords);
      
      // 5단계: 최종 결과 저장 (95% -> 100%)
      const finalResults = await this.saveResults(taskId, {
        sentiments: sentimentResults,
        keywords: keywords,
        summary: summary
      });

      // 완료 알림
      await this.progressService.notifyCompletion(taskId, finalResults);
      
      return finalResults;
      
    } catch (error) {
      await this.progressService.notifyError(taskId, error);
      throw error;
    }
  }

  async preprocessReviews(taskId, reviews) {
    await this.progressService.updateProgress(taskId, {
      current_step: 'preprocessing',
      progress: 5
    });

    // 실제 전처리 로직
    await this.sleep(1000); // 시뮬레이션
    
    console.log(`📝 Preprocessing completed for task ${taskId}`);
  }

  async analyzeSentiments(taskId, reviews) {
    const results = { positive: 0, negative: 0, neutral: 0 };
    const batchSize = 10;
    
    for (let i = 0; i < reviews.length; i += batchSize) {
      const batch = reviews.slice(i, i + batchSize);
      
      // 배치 처리
      for (const review of batch) {
        const sentiment = await this.analyzeSingleReview(review);
        results[sentiment]++;
      }
      
      const processedCount = Math.min(i + batchSize, reviews.length);
      const progress = Math.floor((processedCount / reviews.length) * 65) + 5; // 5% -> 70%
      
      // 진행률 업데이트
      await this.progressService.updateProgress(taskId, {
        current_step: 'sentiment_analysis',
        progress: progress,
        processed_reviews: processedCount
      });
      
      // 통계 업데이트
      await this.progressService.updateStats(taskId, {
        ...results,
        total_processed: processedCount
      });
      
      // 배치 간 잠시 대기
      await this.sleep(100);
    }
    
    console.log(`😊 Sentiment analysis completed for task ${taskId}:`, results);
    return results;
  }

  async extractKeywords(taskId, reviews) {
    await this.progressService.updateProgress(taskId, {
      current_step: 'keyword_extraction',
      progress: 75
    });

    // 키워드 추출 시뮬레이션
    await this.sleep(2000);
    
    const keywords = ['배송', '품질', '가격', '디자인', '사용감'];
    
    await this.progressService.updateProgress(taskId, {
      current_step: 'keyword_extraction',
      progress: 85
    });
    
    console.log(`🔑 Keyword extraction completed for task ${taskId}`);
    return keywords;
  }

  async generateSummary(taskId, sentiments, keywords) {
    await this.progressService.updateProgress(taskId, {
      current_step: 'summary_generation',
      progress: 90
    });

    // 요약 생성 시뮬레이션
    await this.sleep(1500);
    
    const summary = {
      overall_sentiment: sentiments.positive > sentiments.negative ? 'positive' : 'negative',
      key_points: keywords.slice(0, 3),
      recommendation: '전반적으로 긍정적인 평가를 받고 있습니다.'
    };
    
    await this.progressService.updateProgress(taskId, {
      current_step: 'summary_generation',
      progress: 95
    });
    
    console.log(`📋 Summary generation completed for task ${taskId}`);
    return summary;
  }

  async saveResults(taskId, results) {
    await this.progressService.updateProgress(taskId, {
      current_step: 'saving_results',
      progress: 98
    });

    // 결과 저장 시뮬레이션
    await this.sleep(500);
    
    const finalResults = {
      ...results,
      analysis_id: taskId,
      completed_at: new Date().toISOString()
    };
    
    console.log(`💾 Results saved for task ${taskId}`);
    return finalResults;
  }

  async analyzeSingleReview(review) {
    // 간단한 감정 분석 시뮬레이션
    const positiveWords = ['좋다', '만족', '추천', '훌륭'];
    const negativeWords = ['나쁘다', '불만', '실망', '최악'];
    
    const hasPositive = positiveWords.some(word => review.content.includes(word));
    const hasNegative = negativeWords.some(word => review.content.includes(word));
    
    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = ReviewAnalysisWorker;