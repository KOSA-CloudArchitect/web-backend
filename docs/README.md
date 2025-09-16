# KOSA API Documentation

## 개요
리뷰 기반 실시간 감정 분석 및 요약 서비스 API 문서입니다.

## 버전 정보
- **현재 버전**: v1
- **문서 생성일**: 2025-08-04T00:35:25.877Z

## 문서 접근 방법

### 1. Swagger UI (권장)
- 개발 서버: http://localhost:3001/api-docs
- 정적 문서: [index.html](./index.html)

### 2. JSON 스펙
- [swagger.json](./swagger.json) - OpenAPI 3.0 스펙 파일
- [api-info.json](./api-info.json) - API 버전 및 변경 이력 정보

## 주요 엔드포인트

### 인증 (Authentication)
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보

### 상품 (Products)
- `GET /api/products` - 상품 목록 조회
- `GET /api/products/{id}` - 상품 상세 조회
- `POST /api/products/search` - 상품 검색 (크롤링 포함)
- `GET /api/products/count` - 상품 개수 조회

### 분석 (Analysis)
- `POST /api/analyze` - 리뷰 분석 요청
- `GET /api/analyze/status/{productId}` - 분석 상태 확인
- `GET /api/analyze/result/{productId}` - 분석 결과 조회

### API 정보 (API Info)
- `GET /api/info` - API 기본 정보
- `GET /api/info/versions` - 지원 버전 목록
- `GET /api/info/changelog` - 변경 이력
- `GET /api/info/health` - 서비스 상태 확인

## 인증 방법
API는 JWT(JSON Web Token) 기반 인증을 사용합니다.

1. `/api/auth/login`으로 로그인하여 토큰을 받습니다.
2. 이후 요청의 Authorization 헤더에 `Bearer {token}`을 포함합니다.

## 에러 코드
- `400` - 잘못된 요청
- `401` - 인증 실패
- `403` - 권한 없음
- `404` - 리소스를 찾을 수 없음
- `500` - 서버 내부 오류
- `503` - 서비스 사용 불가

## 지원 및 문의
- 개발팀: support@kosa.com
- 문서 이슈: GitHub Issues