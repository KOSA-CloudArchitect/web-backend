/**
 * 캐시 성능 벤치마크 스크립트
 * T-003 요구사항: 캐시 적중 시 평균 응답 50ms 이하 확인
 */

const { cacheService } = require('../services/cacheService');
const { getRedisClient } = require('../config/redis');

class CacheBenchmark {
  constructor() {
    this.results = {
      cacheHits: [],
      cacheMisses: [],
      dbQueries: [],
    };
  }

  async runBenchmark() {
    console.log('🚀 Starting cache performance benchmark...\n');

    try {
      // Redis 연결 테스트
      await this.testRedisConnection();
      
      // 캐시 히트 성능 테스트
      await this.benchmarkCacheHits();
      
      // 캐시 미스 성능 테스트
      await this.benchmarkCacheMisses();
      
      // 결과 분석 및 출력
      this.analyzeResults();
      
    } catch (error) {
      console.error('❌ Benchmark failed:', error);
      process.exit(1);
    }
  }

  async testRedisConnection() {
    console.log('🔌 Testing Redis connection...');
    const start = Date.now();
    
    try {
      const redis = getRedisClient();
      await redis.ping();
      const latency = Date.now() - start;
      
      console.log(`✅ Redis connection successful (${latency}ms)\n`);
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      throw error;
    }
  }

  async benchmarkCacheHits() {
    console.log('📊 Benchmarking cache hits...');
    
    // 테스트 데이터 준비
    const testData = {
      productId: 'benchmark-product-123',
      sentiment: { positive: 70, negative: 20, neutral: 10 },
      summary: 'This is a benchmark test summary for cache performance testing.',
      keywords: ['performance', 'cache', 'benchmark', 'redis'],
      totalReviews: 1000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 캐시에 데이터 저장
    await cacheService.setAnalysisResult(testData.productId, testData);
    
    // 캐시 히트 성능 측정 (100회)
    const iterations = 100;
    console.log(`Running ${iterations} cache hit operations...`);
    
    for (let i = 0; i < iterations; i++) {
      const start = Date.now();
      const result = await cacheService.getAnalysisResult(testData.productId);
      const duration = Date.now() - start;
      
      this.results.cacheHits.push(duration);
      
      // 결과 검증
      if (!result || result.productId !== testData.productId) {
        throw new Error(`Cache hit test failed at iteration ${i + 1}`);
      }
    }
    
    console.log(`✅ Cache hits benchmark completed (${iterations} operations)\n`);
  }

  async benchmarkCacheMisses() {
    console.log('📊 Benchmarking cache misses...');
    
    // 캐시 미스 성능 측정 (50회)
    const iterations = 50;
    console.log(`Running ${iterations} cache miss operations...`);
    
    for (let i = 0; i < iterations; i++) {
      const productId = `non-existent-product-${i}`;
      const start = Date.now();
      const result = await cacheService.getAnalysisResult(productId);
      const duration = Date.now() - start;
      
      this.results.cacheMisses.push(duration);
      
      // 결과 검증 (null이어야 함)
      if (result !== null) {
        throw new Error(`Cache miss test failed at iteration ${i + 1}`);
      }
    }
    
    console.log(`✅ Cache misses benchmark completed (${iterations} operations)\n`);
  }

  analyzeResults() {
    console.log('📈 Performance Analysis Results');
    console.log('================================\n');

    // 캐시 히트 분석
    const hitStats = this.calculateStats(this.results.cacheHits);
    console.log('🎯 Cache Hits Performance:');
    console.log(`   Average: ${hitStats.average.toFixed(2)}ms`);
    console.log(`   Median:  ${hitStats.median.toFixed(2)}ms`);
    console.log(`   Min:     ${hitStats.min}ms`);
    console.log(`   Max:     ${hitStats.max}ms`);
    console.log(`   P95:     ${hitStats.p95.toFixed(2)}ms`);
    console.log(`   P99:     ${hitStats.p99.toFixed(2)}ms`);
    
    // T-003 요구사항 검증
    const passesRequirement = hitStats.average <= 50;
    console.log(`   ✅ T-003 Requirement (≤50ms): ${passesRequirement ? 'PASS' : 'FAIL'}`);
    console.log('');

    // 캐시 미스 분석
    const missStats = this.calculateStats(this.results.cacheMisses);
    console.log('❌ Cache Misses Performance:');
    console.log(`   Average: ${missStats.average.toFixed(2)}ms`);
    console.log(`   Median:  ${missStats.median.toFixed(2)}ms`);
    console.log(`   Min:     ${missStats.min}ms`);
    console.log(`   Max:     ${missStats.max}ms`);
    console.log('');

    // 성능 비교
    const improvement = ((missStats.average - hitStats.average) / missStats.average * 100);
    console.log('⚡ Performance Improvement:');
    console.log(`   Cache hits are ${improvement.toFixed(1)}% faster than cache misses`);
    console.log('');

    // 권장사항
    this.printRecommendations(hitStats, missStats);

    return {
      cacheHits: hitStats,
      cacheMisses: missStats,
      passesRequirement,
    };
  }

  calculateStats(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const sum = data.reduce((a, b) => a + b, 0);
    
    return {
      average: sum / data.length,
      median: sorted[Math.floor(sorted.length / 2)],
      min: Math.min(...data),
      max: Math.max(...data),
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
      count: data.length,
    };
  }

  printRecommendations(hitStats, missStats) {
    console.log('💡 Recommendations:');
    
    if (hitStats.average > 50) {
      console.log('   ⚠️  Cache hit performance exceeds 50ms requirement');
      console.log('   - Consider Redis connection pooling optimization');
      console.log('   - Check network latency to Redis server');
      console.log('   - Consider using Redis pipelining for batch operations');
    } else {
      console.log('   ✅ Cache hit performance meets requirements');
    }
    
    if (hitStats.p99 > 100) {
      console.log('   ⚠️  P99 latency is high, consider investigating outliers');
    }
    
    if (missStats.average > 10) {
      console.log('   ℹ️  Cache miss latency is acceptable for Redis operations');
    }
    
    console.log('   📊 Monitor cache hit rate to ensure effective caching strategy');
    console.log('');
  }
}

// 스크립트 실행
if (require.main === module) {
  const benchmark = new CacheBenchmark();
  benchmark.runBenchmark()
    .then(() => {
      console.log('🎉 Benchmark completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Benchmark failed:', error);
      process.exit(1);
    });
}

module.exports = CacheBenchmark;