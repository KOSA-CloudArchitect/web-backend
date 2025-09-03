# KOSA Backend API

쿠팡 상품 리뷰 분석을 위한 백엔드 API 서버입니다.

## 🚀 빠른 시작

### 1. 환경 설정

```bash
# 저장소 클론
git clone <repository-url>
cd kosa-backend

# 환경 변수 설정
cp env.example .env
# .env 파일을 편집하여 필요한 설정을 변경합니다.

# 의존성 설치
npm install
```

### 2. 인프라 시작

```bash
# Docker로 인프라 서비스 시작 (PostgreSQL, Redis, MongoDB, Kafka)
npm run infra:up

# 또는 전체 서비스 시작 (백엔드 포함)
npm run docker:up
```

### 3. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npm run prisma:generate

# 데이터베이스 마이그레이션
npm run db:setup
```

### 4. 개발 서버 시작

```bash
# 개발 모드로 실행
npm run dev

# 또는 Docker로 실행
npm run docker:up
```

## 📋 서비스 접속

- **백엔드 API**: http://localhost:3001
- **API 문서**: http://localhost:3001/api-docs
- **Kafka UI**: http://localhost:8080
- **Prisma Studio**: `npm run prisma:studio`

## 🧪 테스트

```bash
# 전체 테스트 실행
npm test

# 커버리지 포함 테스트
npm run test:coverage

# 특정 테스트 실행
npm run test:cache
npm run test:redis
npm run test:batch
```

## 🔧 개발 도구

```bash
# 코드 린팅
npm run lint
npm run lint:fix

# 코드 포맷팅
npm run format
npm run format:check

# 타입 체크
npm run type-check

# 헬스 체크
npm run health
```

## 📁 프로젝트 구조

```
backend/
├── src/                    # TypeScript 소스 코드
├── config/                 # 설정 파일들
├── middleware/             # Express 미들웨어
├── models/                 # 데이터 모델
├── routes/                 # API 라우트
├── services/               # 비즈니스 로직
├── prisma/                 # 데이터베이스 스키마
├── __tests__/              # 테스트 파일
├── scripts/                # 유틸리티 스크립트
├── docs/                   # API 문서
├── Dockerfile              # Docker 설정
├── package.json            # 의존성 관리
└── README.md               # 프로젝트 문서
```

## 🛠️ 기술 스택

- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Message Queue**: Apache Kafka
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Code Quality**: ESLint + Prettier

## 🔐 환경 변수

주요 환경 변수들:

```bash
# 애플리케이션
NODE_ENV=development
PORT=3001

# 데이터베이스
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kosa
DB_USER=postgres
DB_PASSWORD=password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m

# Kafka
KAFKA_BROKERS=localhost:9092
```

전체 환경 변수는 `env.example` 파일을 참고하세요.

## 📚 API 문서

### 인증

```bash
# 회원가입
POST /api/auth/register

# 로그인
POST /api/auth/login

# 토큰 갱신
POST /api/auth/refresh
```

### 분석

```bash
# 분석 요청
POST /api/analyze

# 분석 상태 확인
GET /api/analyze/status/:productId

# 분석 결과 조회
GET /api/analyze/result/:productId
```

### 상품

```bash
# 상품 검색
GET /api/products/search

# 상품 상세 정보
GET /api/products/:id

# 관심 상품 등록
POST /api/interests
```

## 🐳 Docker

```bash
# Docker 이미지 빌드
docker build -t kosa-backend .

# Docker 컨테이너 실행
docker run -p 3001:3001 --env-file .env kosa-backend
```

## 🚀 배포

### 프로덕션 빌드

```bash
# TypeScript 컴파일
npm run build

# 프로덕션 모드 실행
npm start
```

### Docker 배포

```bash
# 프로덕션 Dockerfile 사용
docker build -f Dockerfile.prod -t kosa-backend:prod .
```

## 🧪 테스트 계정

- **이메일**: test@example.com
- **비밀번호**: Test123!@#

## 📊 모니터링

- **헬스 체크**: `GET /health`
- **메트릭스**: `GET /metrics`
- **API 문서**: `GET /api-docs`

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참고하세요.

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해 주세요.

---

**KOSA Team** - 리뷰 분석 서비스