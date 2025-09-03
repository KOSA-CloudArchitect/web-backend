# 배치 분석 요청 API 문서

## 개요

배치 분석 요청 시스템은 관심 상품 등록 시 정기적인 분석을 위한 요청을 관리합니다. 기존의 Kafka 메시지 발행 방식에서 데이터베이스 기반 배치 처리 방식으로 변경되었습니다.

## 데이터베이스 스키마

### BatchAnalysisRequest 테이블

```sql
CREATE TABLE "batch_analysis_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "BatchAnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "scheduled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "batch_analysis_requests_pkey" PRIMARY KEY ("id")
);
```

### BatchAnalysisStatus ENUM

```sql
CREATE TYPE "BatchAnalysisStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
```

## 상태 전이 다이어그램

```
PENDING → PROCESSING → COMPLETED
   ↓           ↓
FAILED ←────────┘
   ↓
PENDING (재시도)
```

## API 엔드포인트

### 1. 배치 분석 요청 생성

**POST** `/api/batch-analysis/requests`

관심 상품 등록 시 자동으로 호출됩니다.

#### 요청 본문
```json
{
  "productId": "string",
  "userId": "string",
  "metadata": {
    "frequency": "daily|weekly|monthly",
    "notifications": true,
    "priceAlerts": true,
    "targetPrice": 50000,
    "watchItemId": "string"
  }
}
```

#### 응답
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "productId": "string",
    "userId": "string",
    "status": "PENDING",
    "scheduledAt": "2025-08-14T10:00:00.000Z",
    "createdAt": "2025-08-14T10:00:00.000Z",
    "updatedAt": "2025-08-14T10:00:00.000Z",
    "metadata": {},
    "user": {
      "id": "string",
      "email": "string"
    },
    "product": {
      "id": "string",
      "name": "string",
      "url": "string"
    }
  }
}
```

### 2. 배치 분석 요청 상태 업데이트

**PUT** `/api/batch-analysis/requests/:id/status`

Airflow 또는 분석 서버에서 호출됩니다.

#### 요청 본문
```json
{
  "status": "PROCESSING|COMPLETED|FAILED",
  "metadata": {
    "processingStartedAt": "2025-08-14T10:05:00.000Z",
    "errorMessage": "string",
    "retryCount": 1
  }
}
```

#### 응답
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "PROCESSING",
    "updatedAt": "2025-08-14T10:05:00.000Z",
    "metadata": {
      "statusHistory": [
        {
          "from": "PENDING",
          "to": "PROCESSING",
          "timestamp": "2025-08-14T10:05:00.000Z",
          "updatedBy": "analysisRequestStatusService"
        }
      ]
    }
  }
}
```

### 3. 사용자별 배치 분석 요청 조회

**GET** `/api/batch-analysis/requests/user/:userId`

#### 쿼리 파라미터
- `status`: PENDING|PROCESSING|COMPLETED|FAILED (선택)
- `limit`: 조회할 최대 개수 (기본값: 50)
- `offset`: 오프셋 (기본값: 0)

#### 응답
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "status": "PENDING",
      "scheduledAt": "2025-08-14T10:00:00.000Z",
      "createdAt": "2025-08-14T10:00:00.000Z",
      "product": {
        "id": "string",
        "name": "string",
        "url": "string",
        "currentPrice": 45000,
        "averageRating": 4.5,
        "totalReviews": 1234
      }
    }
  ]
}
```

### 4. 대기 중인 배치 분석 요청 조회 (스케줄러용)

**GET** `/api/batch-analysis/requests/pending`

#### 쿼리 파라미터
- `limit`: 조회할 최대 개수 (기본값: 100)

#### 응답
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "productId": "string",
      "userId": "string",
      "status": "PENDING",
      "scheduledAt": "2025-08-14T10:00:00.000Z",
      "user": {
        "id": "string",
        "email": "string"
      },
      "product": {
        "id": "string",
        "name": "string",
        "url": "string"
      }
    }
  ]
}
```

### 5. 배치 분석 요청 삭제

**DELETE** `/api/batch-analysis/requests/:id`

#### 응답
```json
{
  "success": true,
  "message": "배치 분석 요청이 삭제되었습니다."
}
```

## 서비스 클래스

### BatchAnalysisService

배치 분석 요청의 생성, 조회, 삭제를 담당합니다.

#### 주요 메서드

- `createBatchAnalysisRequest(productId, userId, metadata)`: 배치 분석 요청 생성
- `updateBatchAnalysisRequestStatus(requestId, status, metadata)`: 상태 업데이트
- `getBatchAnalysisRequestsByUser(userId, options)`: 사용자별 요청 조회
- `getPendingBatchAnalysisRequests(limit)`: 대기 중인 요청 조회
- `deleteBatchAnalysisRequest(requestId, userId)`: 요청 삭제

### AnalysisRequestStatusService

분석 요청의 상태 관리를 담당합니다.

#### 주요 메서드

- `updateAnalysisRequestStatus(requestId, status, metadata)`: 실시간 분석 요청 상태 업데이트
- `updateBatchAnalysisRequestStatus(requestId, status, metadata)`: 배치 분석 요청 상태 업데이트
- `updateRealtimeAnalysisSession(taskId, status, data)`: 실시간 분석 세션 업데이트
- `upsertAnalysisResult(taskId, resultData)`: 분석 결과 생성/업데이트
- `retryFailedRequest(requestId, requestType)`: 실패한 요청 재시도
- `getRequestStatusStats(filters)`: 요청 상태 통계 조회

## 트랜잭션 처리

관심 상품 등록과 배치 분석 요청 생성은 트랜잭션으로 원자적으로 처리됩니다:

```javascript
const result = await prisma.$transaction(async (tx) => {
  // 관심 상품 등록
  const watchItem = await tx.watchList.create({...});
  
  // 배치 분석 요청 생성
  await batchAnalysisService.createBatchAnalysisRequest(productId, userId, metadata);
  
  return watchItem;
});
```

## 동시성 제어

상태 업데이트 시 낙관적 잠금(Optimistic Locking)을 사용하여 동시성 문제를 방지합니다:

```javascript
const updatedRequest = await prisma.batchAnalysisRequest.update({
  where: { 
    id: requestId,
    updatedAt: currentRequest.updatedAt // 낙관적 잠금
  },
  data: { status, updatedAt: new Date() }
});
```

## 에러 처리

### 상태 전이 검증
- 유효하지 않은 상태 전이 시 에러 발생
- 예: COMPLETED → PROCESSING (불가능)

### 중복 요청 방지
- 같은 사용자, 같은 상품, PENDING 상태인 요청이 이미 존재하면 중복 생성 방지

### 동시 업데이트 감지
- 낙관적 잠금 실패 시 재시도 요청

## 모니터링 및 로깅

모든 주요 작업은 구조화된 로그로 기록됩니다:

```javascript
logger.info(`Batch analysis request created: ${batchRequest.id} for user ${userId}, product ${productId}`);
logger.info(`Batch analysis request ${requestId} status updated from ${currentRequest.status} to ${status}`);
```

## 성능 최적화

### 인덱스
- `product_id`, `user_id`, `status`, `scheduled_at`, `created_at`에 인덱스 생성
- 복합 인덱스 고려 사항

### 페이지네이션
- 대용량 데이터 조회 시 `limit`과 `offset` 사용
- 기본값: limit=50, offset=0

### 배치 처리
- 대기 중인 요청을 배치로 처리하여 성능 향상
- 스케줄러에서 주기적으로 처리