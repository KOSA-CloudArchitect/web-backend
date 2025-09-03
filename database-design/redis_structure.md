# Redis 데이터 구조 설계
**용도**: 캐시, 세션, 임시 데이터, 실시간 카운터

## 1. 사용자 세션 관리
```redis
# JWT Refresh Token 저장 (TTL: 7일)
SET user_session:{user_id}:{session_id} "{refresh_token_hash}" EX 604800

# 사용자 로그인 상태 (TTL: 1시간)
SET user_online:{user_id} "true" EX 3600

# 로그인 실패 횟수 (TTL: 15분)
SET login_attempts:{email} "3" EX 900
```

## 2. 동시 작업 요청 관리 (작업 큐 시스템)
```redis
# 진행 중인 작업 잠금 (TTL: 1시간)
SET analysis_lock:{product_id} '{
  "task_id": "task-12345",
  "product_id": "prod-123", 
  "user_id": "user-456",
  "type": "batch",
  "status": "processing",
  "started_at": "2025-01-08T10:00:00Z",
  "estimated_completion": "2025-01-08T11:00:00Z",
  "user_count": 3
}' EX 3600

# 대기열 관리 (List 구조)
LPUSH analysis_queue:{product_id} "user-789:realtime"
LPUSH analysis_queue:{product_id} "user-101:batch"
LPUSH analysis_queue:{product_id} "user-202:realtime"

# 대기열 조회
LRANGE analysis_queue:{product_id} 0 -1
# 결과: ["user-202:realtime", "user-101:batch", "user-789:realtime"]

# 다음 작업 가져오기 (FIFO)
RPOP analysis_queue:{product_id}
# 결과: "user-789:realtime"
```

## 3. 실시간 분석 진행 상태
```redis
# 분석 진행률 (TTL: 2시간)
HSET analysis_progress:{task_id} 
  "status" "processing"
  "progress" "45"
  "current_step" "sentiment_analysis"
  "total_reviews" "1250"
  "processed_reviews" "562"
  "started_at" "2025-01-08T10:30:00Z"
  "estimated_completion" "2025-01-08T11:15:00Z"

EXPIRE analysis_progress:{task_id} 7200

# 실시간 통계 (TTL: 2시간)
HSET analysis_stats:{task_id}
  "positive" "45"
  "negative" "12" 
  "neutral" "8"
  "total_processed" "65"
  "last_updated" "2025-01-08T10:45:30Z"

EXPIRE analysis_stats:{task_id} 7200

# Redis Pub/Sub을 통한 실시간 알림
PUBLISH analysis_updates:{task_id} '{"progress": 47, "step": "keyword_extraction"}'
PUBLISH analysis_stats:{task_id} '{"positive": 48, "negative": 12, "neutral": 9}'
PUBLISH user_notifications:{user_id} '{"type": "analysis_started", "task_id": "task-456"}'

# WebSocket 연결 관리
HSET websocket_connections:{task_id}
  "user123" "conn_abc123"
  "user456" "conn_def456"
EXPIRE websocket_connections:{task_id} 7200
```

## 3. 검색 결과 캐시
```redis
# 상품 검색 결과 (TTL: 30분)
SET search_cache:{query_hash} "{json_results}" EX 1800

# 인기 검색어 (Sorted Set)
ZADD popular_searches 1 "아이폰 15"
ZADD popular_searches 5 "갤럭시 S24"
ZADD popular_searches 3 "맥북 프로"

# 사용자별 최근 검색어 (List, 최대 10개)
LPUSH user_recent_searches:{user_id} "아이폰 15"
LTRIM user_recent_searches:{user_id} 0 9
```

## 4. 상품 정보 캐시
```redis
# 상품 기본 정보 (TTL: 1시간)
HSET product_cache:{product_id}
  "name" "아이폰 15 Pro 128GB"
  "price" "1290000"
  "rating" "4.5"
  "review_count" "1250"
  "image_url" "https://..."

EXPIRE product_cache:{product_id} 3600

# 상품 분석 결과 캐시 (TTL: 6시간)
SET analysis_cache:{product_id} "{final_analysis_json}" EX 21600
```

## 5. 실시간 알림 큐
```redis
# 사용자별 알림 큐 (List)
LPUSH user_notifications:{user_id} "{notification_json}"

# 가격 알림 대기열 (Sorted Set, score는 timestamp)
ZADD price_alert_queue {timestamp} "{user_id}:{product_id}:{target_price}"

# WebSocket 연결 관리
SET websocket_connection:{user_id} "{connection_id}" EX 3600
```

## 6. 시스템 모니터링
```redis
# API 요청 카운터 (TTL: 1일)
INCR api_requests:{date}:{endpoint}
EXPIRE api_requests:{date}:{endpoint} 86400

# 활성 사용자 수 (HyperLogLog)
PFADD active_users:{date} {user_id}

# 시스템 상태
HSET system_status
  "total_users" "1250"
  "active_analyses" "15"
  "queue_size" "45"
```

## 7. 레이트 리미팅
```redis
# 사용자별 API 호출 제한 (TTL: 1분)
SET rate_limit:{user_id}:{endpoint} "10" EX 60

# IP별 요청 제한 (TTL: 1시간)
SET ip_limit:{ip_address} "100" EX 3600
```

## Redis 키 네이밍 규칙
- `{category}:{identifier}:{sub_identifier}`
- 예: `user_session:user123:sess456`
- 예: `analysis_progress:task789`
- 예: `product_cache:prod123`

## TTL 정책
- 세션: 7일 (604800초)
- 캐시: 30분-6시간 (1800-21600초)
- 임시 데이터: 2시간 (7200초)
- 카운터: 1일 (86400초)
## 실시간 분석
 아키텍처 플로우

### 1. 기존 방식 (비효율적)
```
분석서버 → Redis 업데이트 → 프론트엔드 폴링 → 사용자
   ↑                           ↓
   └── 계속 상태 업데이트 ──────┘
```

### 2. 개선된 방식 (Redis Pub/Sub + WebSocket)
```
분석서버 → Redis Pub/Sub → WebSocket서버 → 실시간 전송 → 사용자
   ↓           ↓              ↓
Redis 상태저장  채널구독      연결관리
```

### 3. 구현 방법

#### 분석 서버에서:
```javascript
// 진행률 업데이트 시
await redis.hset(`analysis_progress:${taskId}`, {
  progress: currentProgress,
  current_step: currentStep,
  processed_reviews: processedCount
});

// 실시간 알림 발송
await redis.publish(`analysis_updates:${taskId}`, JSON.stringify({
  progress: currentProgress,
  step: currentStep,
  timestamp: new Date().toISOString()
}));
```

#### WebSocket 서버에서:
```javascript
// Redis 채널 구독
redis.subscribe(`analysis_updates:*`);
redis.on('message', (channel, message) => {
  const taskId = channel.split(':')[1];
  const data = JSON.parse(message);
  
  // 해당 분석을 구독하는 모든 클라이언트에게 전송
  broadcastToTaskSubscribers(taskId, data);
});
```

#### 프론트엔드에서:
```javascript
// WebSocket 연결 및 분석 구독
const ws = new WebSocket('ws://localhost:8080');
ws.send(JSON.stringify({
  type: 'subscribe',
  taskId: 'analysis_123'
}));

// 실시간 업데이트 수신
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateProgressBar(data.progress);
  updateCurrentStep(data.step);
};
```

## 장점
- **실시간성**: 분석 진행률이 즉시 반영
- **효율성**: 폴링 대신 푸시 방식
- **확장성**: 여러 사용자가 동시에 같은 분석 모니터링 가능
- **리소스 절약**: 불필요한 HTTP 요청 제거