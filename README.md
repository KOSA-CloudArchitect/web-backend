# KOSA Backend

리뷰 분석 서버 연동 및 API 게이트웨이 (JWT 인증, Redis 캐싱 포함)

## 설치 및 실행

### 필수 요구사항

- Node.js 16 이상
- PostgreSQL 12 이상
- Redis 6 이상 (캐싱용)
- npm 또는 yarn

### 환경 설정

1. 저장소 클론

```bash
git clone <repository-url>
cd backend
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 필요한 환경 변수를 설정합니다.

```bash
cp .env.example .env
# .env 파일을 편집하여 필요한 설정을 변경합니다.
```

4. 데이터베이스 설정

PostgreSQL에 데이터베이스를 생성합니다.

```bash
psql -U postgres
CREATE DATABASE kosa;
\q
```

5. Redis 서버 시작

```bash
# Docker를 사용하는 경우
docker run -d --name redis -p 6379:6379 redis:7-alpine

# 또는 로컬 Redis 서버 시작
redis-server
```

6. 데이터베이스 마이그레이션 실행

```bash
npm run db:setup
```

### 개발 모드 실행

```bash
npm run dev
```

### 프로덕션 빌드 및 실행

```bash
npm run build
npm start
```

## Kafka 메시지 시스템

### Kafka 통합 개요

KOSA 백엔드는 Apache Kafka를 사용하여 외부 분석 파이프라인과 비동기 통신을 수행합니다.

#### 주요 기능

- **상품 검색 요청**: 크롤링 서버로 상품 검색 요청 전송
- **실시간 분석 요청**: 분석 서버로 실시간 리뷰 분석 요청 전송
- **관심 상품 등록**: 정기 분석을 위한 관심 상품 등록
- **배치 분석 작업**: 다중 상품 배치 분석 작업 등록
- **실시간 상태 업데이트**: WebSocket을 통한 실시간 진행 상황 전달

### Kafka 설정 및 실행

#### 로컬 Kafka 클러스터 시작

```bash
# Kafka 클러스터 시작 (Zookeeper, Kafka, Kafka UI, Redis 포함)
npm run kafka:start

# 토픽 초기화
npm run kafka:init-topics

# 전체 설정 (클러스터 시작 + 토픽 초기화)
npm run kafka:setup

# Kafka 로그 확인
npm run kafka:logs

# Kafka 클러스터 중지
npm run kafka:stop
```

#### Kafka UI 접속

- URL: http://localhost:8080
- 토픽, 메시지, 컨슈머 그룹 모니터링 가능

### Kafka API 엔드포인트

#### 상품 검색 요청

```bash
POST /api/kafka/search
Content-Type: application/json

{
  "query": "아이폰 15",
  "options": {
    "limit": 20,
    "includeReviews": false
  }
}
```

#### 실시간 분석 요청

```bash
POST /api/kafka/analysis/realtime
Content-Type: application/json

{
  "productId": "product_123",
  "options": {
    "includeKeywords": true,
    "includeSentiment": true,
    "includeTrends": true
  }
}
```

#### 배치 분석 요청

```bash
POST /api/kafka/analysis/batch
Content-Type: application/json

{
  "productId": "product_123",
  "options": {
    "includeKeywords": true,
    "includeSentiment": true
  }
}
```

#### 관심 상품 등록

```bash
POST /api/kafka/watchlist/add
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "productId": "product_123",
  "options": {
    "frequency": "daily",
    "notifications": true,
    "priceAlerts": true
  }
}
```

#### 다중 상품 배치 분석

```bash
POST /api/kafka/analysis/multi-batch
Content-Type: application/json

{
  "productIds": ["product_1", "product_2", "product_3"],
  "schedule": "daily",
  "options": {
    "notifications": true
  }
}
```

#### Kafka 연결 상태 확인

```bash
GET /api/kafka/status
```

### Kafka 토픽 구조

| 토픽명 | 파티션 | 복제 | 용도 | 보존 기간 |
|--------|--------|------|------|-----------|
| product-search-requests | 3 | 2 | 상품 검색 요청 | 1일 |
| product-search-results | 3 | 2 | 상품 검색 결과 | 1일 |
| analysis-requests | 5 | 2 | 분석 요청 | 7일 |
| realtime-status | 5 | 2 | 실시간 상태 업데이트 | 1시간 |
| analysis-results | 5 | 2 | 분석 결과 | 30일 |
| watchlist-requests | 3 | 2 | 관심 상품 등록 요청 | 30일 |
| watchlist-updates | 3 | 2 | 관심 상품 업데이트 | 7일 |
| batch-jobs | 2 | 2 | 배치 작업 | 30일 |
| batch-job-status | 2 | 2 | 배치 작업 상태 | 7일 |
| error-notifications | 2 | 2 | 오류 알림 | 7일 |

### WebSocket 실시간 통신

#### 클라이언트 연결 및 구독

```javascript
const socket = io('http://localhost:3001');

// 분석 상태 구독
socket.emit('subscribe-analysis', requestId);

// 검색 결과 구독
socket.emit('subscribe-search', messageId);

// 사용자 룸 참여 (인증된 사용자)
socket.emit('join-user-room', userId);

// 배치 작업 구독
socket.emit('subscribe-batch', jobId);
```

#### 실시간 이벤트 수신

```javascript
// 분석 상태 업데이트
socket.on(`analysis:${requestId}`, (data) => {
  console.log('분석 상태:', data.status, data.progress);
});

// 검색 결과 수신
socket.on(`search:${messageId}`, (data) => {
  console.log('검색 결과:', data.products);
});

// 관심 상품 업데이트
socket.on('watchlist:update', (data) => {
  console.log('관심 상품 업데이트:', data);
});

// 배치 작업 상태
socket.on(`batch:${jobId}`, (data) => {
  console.log('배치 작업 상태:', data.status, data.progress);
});

// 오류 알림
socket.on(`error:${requestId}`, (data) => {
  console.error('오류 발생:', data.message);
});
```

### Kafka 환경 변수

```bash
# Kafka 브로커 설정
KAFKA_BROKERS=localhost:9092,localhost:9093
KAFKA_CLIENT_ID=kosa-backend
KAFKA_GROUP_ID=kosa-backend-group

# SSL 설정 (프로덕션 환경)
KAFKA_SSL_ENABLED=false
KAFKA_SSL_REJECT_UNAUTHORIZED=false

# SASL 인증 설정 (프로덕션 환경)
KAFKA_SASL_ENABLED=false
KAFKA_SASL_MECHANISM=plain
KAFKA_SASL_USERNAME=your-kafka-username
KAFKA_SASL_PASSWORD=your-kafka-password
```

### Kafka 테스트

```bash
# Kafka 통합 테스트 실행
npm test -- --testPathPattern=kafka-integration

# 전체 테스트 실행
npm test
```

## WebSocket 실시간 통신

### WebSocket 서비스 개요

KOSA 백엔드는 Socket.IO를 사용하여 실시간 양방향 통신을 제공합니다.

#### 주요 기능

- **실시간 분석 상태 업데이트**: 분석 진행 상황을 실시간으로 전달
- **감성 카드 스트리밍**: 분석된 감성 카드를 실시간으로 제공
- **검색 결과 알림**: 상품 검색 완료 시 즉시 결과 전달
- **관심 상품 알림**: 가격 변동, 분석 업데이트 등 실시간 알림
- **시스템 알림**: 유지보수, 공지사항 등 시스템 메시지
- **룸 기반 통신**: 사용자별, 요청별 격리된 통신 채널

### 클라이언트 연결

#### 기본 연결

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling'],
  timeout: 20000
});

// 연결 확인
socket.on('connected', (data) => {
  console.log('WebSocket 연결 성공:', data.clientId);
});

// 연결 오류 처리
socket.on('connect_error', (error) => {
  console.error('WebSocket 연결 오류:', error);
});
```

#### 룸 참여

```javascript
// 분석 상태 구독
const requestId = 'analysis-request-123';
socket.emit('subscribe-analysis', requestId);

// 검색 결과 구독
const messageId = 'search-message-456';
socket.emit('subscribe-search', messageId);

// 사용자 룸 참여 (인증된 사용자)
const userId = 'user-789';
socket.emit('join-user-room', userId);

// 상품별 룸 참여
const productId = 'product-abc';
socket.emit('join-product-room', productId);

// 배치 작업 구독
const jobId = 'batch-job-def';
socket.emit('subscribe-batch', jobId);
```

### 실시간 이벤트 수신

#### 분석 상태 업데이트

```javascript
socket.on('analysis-update', (data) => {
  console.log('분석 상태:', {
    requestId: data.requestId,
    status: data.status,        // 'processing', 'completed', 'failed'
    progress: data.progress,    // 0-100
    message: data.message,      // 현재 단계 메시지
    estimatedTime: data.estimatedTime, // 예상 완료 시간(초)
    currentStep: data.currentStep,     // 현재 단계
    totalSteps: data.totalSteps        // 전체 단계 수
  });

  // 진행률 업데이트
  updateProgressBar(data.progress);
  
  // 완료 처리
  if (data.status === 'completed') {
    showAnalysisResults(data.results);
  }
});
```

#### 감성 카드 수신

```javascript
socket.on('sentiment-card', (data) => {
  const card = data.card;
  
  console.log('감성 카드 수신:', {
    id: card.id,
    sentiment: card.sentiment,    // 'positive', 'negative', 'neutral'
    text: card.text,             // 리뷰 텍스트
    keywords: card.keywords,     // 주요 키워드 배열
    confidence: card.confidence, // 신뢰도 (0-1)
    color: card.color,          // 감성별 색상
    reviewCount: card.reviewCount
  });

  // 감성 카드 UI 업데이트
  addSentimentCard(card);
});
```

#### 검색 결과 수신

```javascript
socket.on('search-results', (data) => {
  console.log('검색 결과:', {
    messageId: data.messageId,
    status: data.status,
    products: data.products,     // 상품 목록
    totalCount: data.totalCount, // 총 상품 수
    query: data.query,          // 검색어
    executionTime: data.executionTime // 실행 시간
  });

  // 검색 결과 표시
  displaySearchResults(data.products);
});
```

#### 관심 상품 업데이트

```javascript
socket.on('watchlist-update', (data) => {
  console.log('관심 상품 업데이트:', {
    productId: data.productId,
    updateType: data.updateType, // 'added', 'removed', 'price_changed'
    data: data.data
  });

  // 가격 알림 처리
  if (data.type === 'price-alert') {
    showPriceAlert({
      productName: data.data.productName,
      oldPrice: data.data.oldPrice,
      newPrice: data.data.newPrice,
      savings: data.data.savings
    });
  }
});
```

#### 시스템 알림

```javascript
socket.on('system-notification', (data) => {
  console.log('시스템 알림:', {
    message: data.message,
    type: data.type,           // 'info', 'warning', 'error'
    priority: data.priority    // 'normal', 'high'
  });

  showNotification(data);
});

socket.on('maintenance-alert', (data) => {
  console.log('유지보수 알림:', {
    message: data.message,
    startTime: data.startTime,
    endTime: data.endTime,
    affectedServices: data.affectedServices
  });

  showMaintenanceAlert(data);
});
```

#### 오류 처리

```javascript
socket.on('error', (data) => {
  console.error('WebSocket 오류:', {
    type: data.type,
    message: data.message,
    details: data.details,
    severity: data.severity
  });

  // 오류 타입별 처리
  switch (data.type) {
    case 'analysis-error':
      showAnalysisError(data);
      break;
    case 'search-error':
      showSearchError(data);
      break;
    default:
      showGenericError(data);
  }
});
```

### WebSocket API 엔드포인트

#### 연결 통계 조회

```bash
GET /api/websocket/stats
```

**응답:**
```json
{
  "success": true,
  "data": {
    "connectedClients": 25,
    "activeRooms": 12,
    "roomDetails": [
      {
        "name": "analysis:req-123",
        "clientCount": 3,
        "createdAt": "2024-01-01T10:00:00Z"
      }
    ]
  }
}
```

#### 룸 클라이언트 수 조회

```bash
GET /api/websocket/rooms/{roomName}/clients
```

#### 시스템 알림 전송

```bash
POST /api/websocket/notifications/system
Content-Type: application/json

{
  "message": "시스템 점검이 예정되어 있습니다.",
  "type": "warning",
  "priority": "high",
  "targetUsers": ["user1", "user2"]  // 선택사항
}
```

#### 유지보수 알림 전송

```bash
POST /api/websocket/notifications/maintenance
Content-Type: application/json

{
  "message": "시스템 유지보수가 진행됩니다.",
  "startTime": "2024-01-01T02:00:00Z",
  "endTime": "2024-01-01T04:00:00Z",
  "affectedServices": ["analysis", "search"]
}
```

#### 특정 사용자에게 메시지 전송

```bash
POST /api/websocket/messages/user/{userId}
Content-Type: application/json

{
  "event": "custom-notification",
  "data": {
    "message": "개인 메시지입니다.",
    "priority": "normal"
  }
}
```

#### 브로드캐스트 메시지 전송

```bash
POST /api/websocket/messages/broadcast
Content-Type: application/json

{
  "event": "global-announcement",
  "data": {
    "message": "전체 공지사항입니다.",
    "type": "announcement"
  }
}
```

### 개발/테스트 도구

#### 테스트용 감성 카드 전송

```bash
POST /api/websocket/test/sentiment-card
Content-Type: application/json

{
  "requestId": "test-request-123",
  "card": {
    "sentiment": "positive",
    "text": "테스트 리뷰입니다.",
    "keywords": ["테스트", "좋음"],
    "confidence": 0.9
  }
}
```

#### 테스트용 분석 상태 전송

```bash
POST /api/websocket/test/analysis-status
Content-Type: application/json

{
  "requestId": "test-request-123",
  "status": "processing",
  "progress": 75,
  "message": "감성 분석 진행 중..."
}
```

### WebSocket 테스트

```bash
# WebSocket 통합 테스트 실행
npm test -- --testPathPattern=websocket-integration

# 전체 테스트 실행 (Kafka + WebSocket)
npm test
```

### 연결 상태 관리

#### 재연결 처리

```javascript
socket.on('disconnect', (reason) => {
  console.log('연결 끊김:', reason);
  
  if (reason === 'io server disconnect') {
    // 서버에서 연결을 끊은 경우 수동 재연결
    socket.connect();
  }
  // 다른 경우는 자동 재연결됨
});

socket.on('reconnect', (attemptNumber) => {
  console.log('재연결 성공:', attemptNumber);
  
  // 재연결 후 룸 재참여
  rejoinRooms();
});

socket.on('reconnect_error', (error) => {
  console.error('재연결 실패:', error);
});
```

#### 연결 상태 확인

```javascript
// 핑-퐁으로 연결 상태 확인
setInterval(() => {
  if (socket.connected) {
    socket.emit('ping');
  }
}, 30000);

socket.on('pong', (data) => {
  console.log('서버 응답 시간:', Date.now() - data.timestamp);
});
```

### 성능 최적화

- **룸 기반 통신**: 불필요한 메시지 전송 방지
- **이벤트 핸들러 최적화**: 메모리 누수 방지를 위한 적절한 정리
- **연결 풀링**: 다중 탭/창에서의 효율적인 연결 관리
- **메시지 압축**: 대용량 데이터 전송 시 압축 적용

## 캐싱 시스템

### Redis 캐시 전략

이 프로젝트는 **Cache-Aside 패턴**을 사용하여 성능을 최적화합니다:

1. **분석 결과 캐싱**: 완료된 분석 결과를 1시간 동안 캐시
2. **분석 상태 캐싱**: 진행 중인 분석 상태를 5분 동안 캐시
3. **자동 무효화**: 데이터 업데이트 시 관련 캐시 자동 삭제

### 캐시 키 구조

```
analysis:result:{productId}  # 분석 결과 (TTL: 1시간)
analysis:status:{productId}  # 분석 상태 (TTL: 5분)
analysis:task:{taskId}       # 작업별 분석 정보 (TTL: 30분)
```

### 캐시 관리 API

```bash
# 캐시 헬스체크
GET /api/analyze/cache/health

# 캐시 통계 조회
GET /api/analyze/cache/stats

# 특정 상품 캐시 무효화
DELETE /api/analyze/cache/{productId}
```

## 인증 시스템

### JWT 기반 인증

KOSA 백엔드는 JWT(JSON Web Token) 기반의 인증 시스템을 사용합니다.

#### 토큰 구조

- **Access Token**: 15분 만료, API 요청 시 사용
- **Refresh Token**: 7일 만료, Access Token 갱신용, HttpOnly 쿠키로 저장

#### 인증 API

##### 회원가입

```
POST /api/auth/register
```

**요청 본문:**

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!",
  "confirmPassword": "StrongPassword123!",
  "role": "user"
}
```

**응답:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "2023-05-01T12:00:00Z",
      "isActive": true
    },
    "message": "회원가입이 완료되었습니다."
  }
}
```

##### 로그인

```
POST /api/auth/login
```

**요청 본문:**

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

**응답:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 900
  },
  "message": "로그인 성공"
}
```

##### 토큰 갱신

```
POST /api/auth/refresh
```

**응답:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 900
  },
  "message": "토큰 갱신 성공"
}
```

##### 로그아웃

```
POST /api/auth/logout
Authorization: Bearer {accessToken}
```

**응답:**

```json
{
  "success": true,
  "message": "로그아웃되었습니다."
}
```

##### 현재 사용자 정보

```
GET /api/auth/me
Authorization: Bearer {accessToken}
```

**응답:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "2023-05-01T12:00:00Z",
      "isActive": true
    }
  }
}
```

#### 보안 기능

- **Rate Limiting**: IP별 요청 제한
- **로그인 실패 제한**: 5회 실패 시 15분 차단
- **비밀번호 강도 검증**: 대소문자, 숫자, 특수문자 포함 8자 이상
- **Refresh Token 관리**: Redis 기반 토큰 저장 및 무효화
- **IP 차단**: 비정상적인 접근 패턴 감지 시 자동 차단

#### 미들웨어 사용법

```javascript
const { authenticateToken, authorize } = require('./middleware/auth');

// 인증 필요한 라우트
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// 관리자 권한 필요한 라우트
app.get('/api/admin', authenticateToken, authorize(['admin']), (req, res) => {
  res.json({ message: 'Admin only' });
});
```

## API 문서

### 분석 요청 시작

```
POST /api/analyze
```

**요청 본문:**

```json
{
  "productId": "product-123",
  "url": "https://example.com/product/123",
  "keywords": ["품질", "가격", "배송"]
}
```

**응답:**

```json
{
  "success": true,
  "message": "분석이 시작되었습니다.",
  "taskId": "task-123",
  "estimatedTime": 120,
  "fromCache": false
}
```

### 분석 상태 확인

```
GET /api/analyze/status/:productId
```

**응답:**

```json
{
  "status": "processing",
  "progress": 50,
  "estimatedTime": 60,
  "fromCache": true
}
```

### 분석 결과 조회

```
GET /api/analyze/result/:productId
```

**응답:**

```json
{
  "success": true,
  "status": "completed",
  "result": {
    "productId": "product-123",
    "sentiment": {
      "positive": 65,
      "negative": 20,
      "neutral": 15
    },
    "summary": "이 상품은 전반적으로 긍정적인 평가를 받고 있습니다.",
    "keywords": ["가성비", "품질", "배송"],
    "totalReviews": 150,
    "createdAt": "2023-05-01T12:00:00Z",
    "updatedAt": "2023-05-01T12:05:00Z"
  },
  "fromCache": true
}
```

## 데이터베이스 스키마

### analysis_results 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 기본 키 |
| product_id | VARCHAR(255) | 상품 ID |
| task_id | VARCHAR(255) | 분석 작업 ID (외부 서버) |
| status | VARCHAR(50) | 상태 (pending, processing, completed, failed) |
| sentiment_positive | DECIMAL(5,2) | 긍정 감성 비율 |
| sentiment_negative | DECIMAL(5,2) | 부정 감성 비율 |
| sentiment_neutral | DECIMAL(5,2) | 중립 감성 비율 |
| summary | TEXT | 분석 요약 |
| keywords | JSONB | 주요 키워드 배열 |
| total_reviews | INTEGER | 총 리뷰 수 |
| error | TEXT | 오류 메시지 |
| created_at | TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | 업데이트 시간 |

## 캐싱 시스템

### Redis 캐싱

KOSA 백엔드는 Redis를 사용한 Cache-Aside 패턴을 구현하여 성능을 최적화합니다.

#### 캐시 키 구조

- `analysis:result:{productId}` - 분석 결과 (TTL: 1시간)
- `analysis:status:{productId}` - 분석 상태 (TTL: 5분)
- `analysis:task:{taskId}` - 작업별 분석 정보 (TTL: 30분)

#### 캐시 관리 API

```bash
# 캐시 상태 확인
GET /api/analyze/cache/health

# 캐시 통계 조회
GET /api/analyze/cache/stats

# 캐시 히트율 조회
GET /api/analyze/cache/hitrate?days=7

# 특정 상품 캐시 무효화
DELETE /api/analyze/cache/{productId}

# 배치 캐시 무효화
DELETE /api/analyze/cache/batch
Content-Type: application/json
{
  "productIds": ["product1", "product2", "product3"]
}

# 캐시 워밍업
POST /api/analyze/cache/warmup
Content-Type: application/json
{
  "productIds": ["product1", "product2", "product3"]
}
```

#### 성능 요구사항

- 캐시 히트 시 평균 응답 시간: ≤50ms
- 캐시 히트율 목표: ≥80%

### 테스트 및 벤치마크

```bash
# 캐시 단위 테스트
npm run test:cache

# 캐시 통합 테스트 (Redis 서버 필요)
npm run test:integration

# 캐시 성능 벤치마크
npm run benchmark:cache
```

## 마이그레이션

### 마이그레이션 실행

```bash
# 모든 마이그레이션 적용
npm run migrate:up

# 특정 마이그레이션까지 적용
npm run migrate:up 1

# 모든 마이그레이션 롤백
npm run migrate:down

# 특정 마이그레이션까지 롤백
npm run migrate:down 1
```

## 성능 최적화

### 캐시 적중률 모니터링

```bash
# Redis 통계 확인
redis-cli info stats

# 캐시 적중률 확인
curl http://localhost:3001/api/analyze/cache/stats
```

### 예상 성능 개선

- **캐시 적중 시**: 평균 응답 시간 50ms 이하
- **캐시 미스 시**: DB 조회로 인한 100-200ms 응답 시간
- **메모리 사용량**: 상품당 약 1-2KB 캐시 데이터

## 테스트

```bash
# 전체 테스트 실행
npm test

# 캐시 서비스 테스트만 실행
npm test -- --testPathPattern=cacheService

# 테스트 커버리지 확인
npm test -- --coverage
```

## 환경 변수

### JWT 설정

```bash
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m                    # Access Token 만료 시간
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=7d             # Refresh Token 만료 시간
```

### Redis 설정

```bash
REDIS_HOST=localhost          # Redis 서버 호스트
REDIS_PORT=6379              # Redis 서버 포트
REDIS_PASSWORD=              # Redis 비밀번호 (선택사항)
REDIS_DB=0                   # Redis 데이터베이스 번호
```

### 데이터베이스 설정

```bash
DB_HOST=localhost            # PostgreSQL 호스트
DB_PORT=5432                # PostgreSQL 포트
DB_NAME=kosa                # 데이터베이스 이름
DB_USER=postgres            # 데이터베이스 사용자
DB_PASSWORD=password        # 데이터베이스 비밀번호
DB_POOL_MAX=20              # 최대 연결 풀 크기
DB_IDLE_TIMEOUT=30000       # 유휴 연결 타임아웃 (ms)
DB_CONNECTION_TIMEOUT=2000  # 연결 타임아웃 (ms)
```

## 모니터링

### 헬스체크

```bash
# 전체 시스템 헬스체크
curl http://localhost:3001/health

# 캐시 시스템 헬스체크
curl http://localhost:3001/api/analyze/cache/health
```

### 로그 모니터링

- 캐시 적중/미스 로그
- 데이터베이스 연결 상태 로그
- Redis 연결 상태 로그
- 성능 메트릭 로그

## 트러블슈팅

### Redis 연결 문제

```bash
# Redis 서버 상태 확인
redis-cli ping

# Redis 로그 확인
redis-cli monitor
```

### 데이터베이스 연결 문제

```bash
# PostgreSQL 연결 테스트
psql -h localhost -U postgres -d kosa -c "SELECT 1;"
```

### 캐시 성능 문제

```bash
# 캐시 통계 확인
curl http://localhost:3001/api/analyze/cache/stats

# 특정 상품 캐시 무효화
curl -X DELETE http://localhost:3001/api/analyze/cache/product-123
```