const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'topic-initializer',
  brokers: ['localhost:9092', 'localhost:9093'],
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

const admin = kafka.admin();

const topics = [
  {
    topic: 'product-search-requests',
    numPartitions: 3,
    replicationFactor: 2,
    configEntries: [
      { name: 'cleanup.policy', value: 'delete' },
      { name: 'retention.ms', value: '86400000' } // 1일
    ]
  },
  {
    topic: 'product-search-results',
    numPartitions: 3,
    replicationFactor: 2,
    configEntries: [
      { name: 'cleanup.policy', value: 'delete' },
      { name: 'retention.ms', value: '86400000' } // 1일
    ]
  },
  {
    topic: 'analysis-requests',
    numPartitions: 5,
    replicationFactor: 2,
    configEntries: [
      { name: 'cleanup.policy', value: 'delete' },
      { name: 'retention.ms', value: '604800000' } // 7일
    ]
  },
  {
    topic: 'realtime-status',
    numPartitions: 5,
    replicationFactor: 2,
    configEntries: [
      { name: 'cleanup.policy', value: 'delete' },
      { name: 'retention.ms', value: '3600000' } // 1시간
    ]
  },
  {
    topic: 'analysis-results',
    numPartitions: 5,
    replicationFactor: 2,
    configEntries: [
      { name: 'cleanup.policy', value: 'delete' },
      { name: 'retention.ms', value: '2592000000' } // 30일
    ]
  },
  {
    topic: 'watchlist-requests',
    numPartitions: 3,
    replicationFactor: 2,
    configEntries: [
      { name: 'cleanup.policy', value: 'delete' },
      { name: 'retention.ms', value: '2592000000' } // 30일
    ]
  },
  {
    topic: 'watchlist-updates',
    numPartitions: 3,
    replicationFactor: 2,
    configEntries: [
      { name: 'cleanup.policy', value: 'delete' },
      { name: 'retention.ms', value: '604800000' } // 7일
    ]
  },
  {
    topic: 'batch-jobs',
    numPartitions: 2,
    replicationFactor: 2,
    configEntries: [
      { name: 'cleanup.policy', value: 'delete' },
      { name: 'retention.ms', value: '2592000000' } // 30일
    ]
  },
  {
    topic: 'batch-job-status',
    numPartitions: 2,
    replicationFactor: 2,
    configEntries: [
      { name: 'cleanup.policy', value: 'delete' },
      { name: 'retention.ms', value: '604800000' } // 7일
    ]
  },
  {
    topic: 'error-notifications',
    numPartitions: 2,
    replicationFactor: 2,
    configEntries: [
      { name: 'cleanup.policy', value: 'delete' },
      { name: 'retention.ms', value: '604800000' } // 7일
    ]
  }
];

async function initializeTopics() {
  try {
    console.log('🔄 Kafka Admin 클라이언트 연결 중...');
    await admin.connect();
    console.log('✅ Kafka Admin 클라이언트 연결 성공');

    // 기존 토픽 목록 조회
    const existingTopics = await admin.listTopics();
    console.log('📋 기존 토픽 목록:', existingTopics);

    // 생성할 토픽 필터링
    const topicsToCreate = topics.filter(topic => !existingTopics.includes(topic.topic));

    if (topicsToCreate.length === 0) {
      console.log('✅ 모든 토픽이 이미 존재합니다.');
      return;
    }

    console.log(`🔄 ${topicsToCreate.length}개 토픽 생성 중...`);
    await admin.createTopics({
      topics: topicsToCreate
    });

    console.log('✅ 토픽 생성 완료:');
    topicsToCreate.forEach(topic => {
      console.log(`  - ${topic.topic} (파티션: ${topic.numPartitions}, 복제: ${topic.replicationFactor})`);
    });

    // 토픽 설정 확인
    console.log('🔍 토픽 설정 확인 중...');
    const topicConfigs = await admin.describeConfigs({
      resources: topicsToCreate.map(topic => ({
        type: admin.RESOURCE_TYPES.TOPIC,
        name: topic.topic
      }))
    });

    console.log('📊 토픽 설정 정보:');
    topicConfigs.resources.forEach(resource => {
      console.log(`  ${resource.resourceName}:`);
      resource.configEntries.forEach(config => {
        if (config.configName === 'retention.ms' || config.configName === 'cleanup.policy') {
          console.log(`    ${config.configName}: ${config.configValue}`);
        }
      });
    });

  } catch (error) {
    console.error('❌ 토픽 초기화 실패:', error);
    throw error;
  } finally {
    await admin.disconnect();
    console.log('✅ Kafka Admin 클라이언트 연결 해제');
  }
}

// 스크립트 실행
if (require.main === module) {
  initializeTopics()
    .then(() => {
      console.log('🎉 Kafka 토픽 초기화 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Kafka 토픽 초기화 실패:', error);
      process.exit(1);
    });
}

module.exports = { initializeTopics, topics };