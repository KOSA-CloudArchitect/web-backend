# 데이터베이스 아키텍처 설계

## 🗄️ 데이터베이스 역할 분담

### 1. PostgreSQL (RDS) - 관계형 데이터
**특징**: ACID 트랜잭션, 일관성, 복잡한 쿼리
**용도**: 
- ✅ 사용자 관리 (users, user_profiles)
- ✅ 상품 마스터 데이터 (products, categories)
- ✅ 관심 상품 관리 (watch_list)
- ✅ 최종 분석 결과 (analysis_results)
- ✅ 가격 이력 (price_history)
- ✅ 시스템 설정 (system_config)

### 2. Redis - 캐시 & 세션
**특징**: 인메모리, 빠른 읽기/쓰기, TTL 지원
**용도**:
- ✅ 사용자 세션 (JWT refresh token)
- ✅ 실시간 분석 진행률 캐시
- ✅ 검색 결과 캐시
- ✅ 상품 정보 캐시
- ✅ 레이트 리미팅
- ✅ WebSocket 연결 관리
- ✅ 알림 큐

### 3. MongoDB - 실시간 & 대용량 데이터
**특징**: 유연한 스키마, 수평 확장, 대용량 처리
**용도**:
- ✅ 실시간 감정 카드 (emotion_cards)
- ✅ 크롤링된 리뷰 원본 (raw_reviews)
- ✅ 분석 작업 큐 (analysis_queue)
- ✅ 키워드 분석 상세 데이터
- ✅ 로그 데이터

---

## 📊 데이터 흐름

### 실시간 분석 프로세스
```
1. 사용자 요청 → PostgreSQL (analysis_requests 저장)
2. 작업 큐 생성 → MongoDB (analysis_queue)
3. 진행률 추적 → Redis (analysis_progress:{task_id})
4. 실시간 카드 → MongoDB (realtime_analysis_sessions)
5. 최종 결과 → PostgreSQL (analysis_results)
```

### 캐시 전략
```
1. 상품 정보 → Redis 캐시 (1시간 TTL)
2. 검색 결과 → Redis 캐시 (30분 TTL)
3. 분석 결과 → Redis 캐시 (6시간 TTL)
4. 세션 정보 → Redis (7일 TTL)
```

---

## 🔄 데이터 동기화

### PostgreSQL ↔ Redis
```javascript
// 상품 정보 업데이트 시 캐시 무효화
await redis.del(`product_cache:${productId}`);
await redis.del(`analysis_cache:${productId}`);
```

### PostgreSQL ↔ MongoDB
```javascript
// 분석 완료 시 최종 결과 동기화
const finalResult = await mongodb.findOne({task_id});
await postgresql.analysis_results.create(finalResult);
```

### 데이터 일관성 보장
- **이벤트 기반 동기화**: Kafka를 통한 비동기 동기화
- **정기 배치 작업**: 일일 데이터 정합성 체크
- **캐시 무효화**: 데이터 변경 시 관련 캐시 삭제

---

## 🚀 성능 최적화

### 읽기 성능
- **Redis**: 자주 조회되는 데이터 캐싱
- **MongoDB**: 실시간 데이터 빠른 조회
- **PostgreSQL**: 복잡한 분석 쿼리

### 쓰기 성능
- **MongoDB**: 대용량 실시간 데이터 삽입
- **Redis**: 임시 데이터 빠른 저장
- **PostgreSQL**: 중요한 트랜잭션 데이터

### 확장성
- **MongoDB**: 샤딩을 통한 수평 확장
- **Redis**: 클러스터링
- **PostgreSQL**: 읽기 복제본 추가

---

## 📈 모니터링 지표

### PostgreSQL
- 연결 수, 쿼리 성능, 테이블 크기
- 트랜잭션 처리량, 락 대기 시간

### Redis
- 메모리 사용량, 히트율, 만료된 키 수
- 연결 수, 명령어 처리 속도

### MongoDB
- 문서 수, 컬렉션 크기, 인덱스 효율성
- 쿼리 성능, 복제 지연 시간

---

## 🔧 운영 고려사항

### 백업 전략
- **PostgreSQL**: 일일 풀백업 + 트랜잭션 로그
- **MongoDB**: 일일 스냅샷 + Oplog
- **Redis**: RDB + AOF 백업

### 장애 복구
- **PostgreSQL**: Multi-AZ 배포
- **MongoDB**: 레플리카 셋 구성
- **Redis**: 센티넬 또는 클러스터 모드

### 보안
- **모든 DB**: VPC 내부 배치, 암호화 전송
- **PostgreSQL**: 행 수준 보안 (RLS)
- **MongoDB**: 역할 기반 접근 제어
- **Redis**: AUTH 패스워드, 키 네임스페이스 분리