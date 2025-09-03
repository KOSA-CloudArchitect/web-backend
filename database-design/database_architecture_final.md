# 최종 데이터베이스 아키텍처

## 📊 전체 구조 개요

```
PostgreSQL (관계형)     MongoDB (문서형)        Redis (캐시/세션)
├─ users               ├─ keywords             ├─ 세션 관리
├─ user_profiles       ├─ product_reviews_raw  ├─ 작업 큐 관리
├─ user_sessions       ├─ product_analysis_*   ├─ 실시간 진행률
├─ products            ├─ coupang_keyword_tags ├─ API 캐시
├─ analysis_requests   └─ realtime_sessions    └─ Pub/Sub 알림
├─ analysis_results    
├─ search_history      
├─ watch_list          
└─ system_config       
```

## 🗄️ PostgreSQL (관계형 데이터)

### 핵심 테이블
- **users**: 사용자 기본 정보, 인증
- **products**: 상품 기본 정보 (이름, URL, 가격 등)
- **analysis_requests**: 분석 요청 이력 (status 필드 추가)
- **watch_list**: 관심 상품 (기존 interest_products 통합)

### 주요 변경사항
1. `analysis_requests`에 `status`, `error_message` 필드 추가
2. `watch_list`로 테이블명 통일
3. 인덱스 최적화

## 📄 MongoDB (문서형 데이터)

### 새로 추가된 컬렉션
1. **keywords**: 키워드 마스터 데이터
   - 키워드별 빈도, 감정 비율 저장
   - 태그 분류 시스템

2. **product_reviews_raw**: 리뷰 원본 데이터
   - 크롤링된 리뷰 텍스트
   - 감정 분석 결과
   - 키워드 배열

3. **product_analysis_daily/monthly**: 집계 분석 데이터
   - 일별/월별 통계
   - 가격 변동 추이
   - 감정 트렌드

4. **coupang_keyword_tags**: 쿠팡 키워드 태그
   - 크롤링된 구조화 키워드
   - 카테고리별 퍼센티지

## ⚡ Redis (캐시 및 실시간)

### 주요 용도
1. **작업 큐 관리**: 동시 분석 요청 처리
2. **실시간 진행률**: 분석 진행 상태
3. **세션 관리**: JWT 토큰, 로그인 상태
4. **API 캐시**: 자주 조회되는 데이터

## 🔄 데이터 흐름

### 1. 분석 요청 플로우
```
사용자 요청 → PostgreSQL (analysis_requests) 
           → Redis (작업 큐) 
           → 분석 서버 
           → MongoDB (결과 저장)
```

### 2. 실시간 데이터 플로우
```
크롤링 서버 → MongoDB (원본 저장) 
           → Redis (실시간 상태) 
           → WebSocket (사용자 알림)
```

### 3. 키워드 데이터 플로우
```
쿠팡 크롤링 → MongoDB (coupang_keyword_tags)
           → 프론트엔드 (실시간 계산)
           → 사용자 화면
```

## 📈 확장성 고려사항

### 샤딩 전략
- **MongoDB**: `product_id` 기준 샤딩
- **Redis**: 기능별 클러스터 분리

### 인덱스 최적화
- **PostgreSQL**: 복합 인덱스 활용
- **MongoDB**: 쿼리 패턴별 인덱스

### TTL 정책
- **Redis**: 데이터 유형별 차등 TTL
- **MongoDB**: 로그성 데이터 자동 삭제

## 🔧 운영 고려사항

### 백업 전략
- **PostgreSQL**: 일일 풀백업 + 트랜잭션 로그
- **MongoDB**: 레플리카셋 + 정기 백업
- **Redis**: RDB + AOF 조합

### 모니터링
- 각 DB별 성능 메트릭 수집
- 쿼리 성능 분석
- 용량 증가 추이 모니터링

이 구조로 확장성과 성능을 모두 고려한 안정적인 시스템을 구축할 수 있어요! 🚀