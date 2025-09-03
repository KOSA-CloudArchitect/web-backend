#!/usr/bin/env node

/**
 * API 문서 자동 생성 스크립트
 * CI/CD 파이프라인에서 사용됩니다.
 */

const fs = require('fs');
const path = require('path');
const { specs } = require('../config/swagger');

const OUTPUT_DIR = path.join(__dirname, '../docs');
const SWAGGER_JSON_PATH = path.join(OUTPUT_DIR, 'swagger.json');
const API_INFO_PATH = path.join(OUTPUT_DIR, 'api-info.json');

// 출력 디렉토리 생성
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Swagger JSON 파일 생성
console.log('📝 Swagger JSON 파일 생성 중...');
fs.writeFileSync(SWAGGER_JSON_PATH, JSON.stringify(specs, null, 2));
console.log(`✅ Swagger JSON 파일 생성 완료: ${SWAGGER_JSON_PATH}`);

// API 정보 파일 생성
console.log('📝 API 정보 파일 생성 중...');
const { API_VERSIONS, CHANGELOG, getLatestVersion } = require('../config/apiVersions');

const apiInfo = {
  name: 'KOSA Review Analysis API',
  description: '리뷰 기반 실시간 감정 분석 및 요약 서비스 API',
  version: getLatestVersion(),
  generatedAt: new Date().toISOString(),
  versions: API_VERSIONS,
  changelog: CHANGELOG,
  endpoints: {
    documentation: '/api-docs',
    health: '/health',
    apiInfo: '/api/info'
  }
};

fs.writeFileSync(API_INFO_PATH, JSON.stringify(apiInfo, null, 2));
console.log(`✅ API 정보 파일 생성 완료: ${API_INFO_PATH}`);

// HTML 문서 생성
console.log('📝 HTML 문서 생성 중...');
const htmlTemplate = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KOSA API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui.css" />
    <style>
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info { margin: 50px 0; }
        .swagger-ui .info .title { color: #3b4151; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui-bundle.js"></script>
    <script>
        SwaggerUIBundle({
            url: './swagger.json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIBundle.presets.standalone
            ],
            plugins: [
                SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout"
        });
    </script>
</body>
</html>
`;

const HTML_PATH = path.join(OUTPUT_DIR, 'index.html');
fs.writeFileSync(HTML_PATH, htmlTemplate.trim());
console.log(`✅ HTML 문서 생성 완료: ${HTML_PATH}`);

// README 파일 생성
console.log('📝 README 파일 생성 중...');
const readmeContent = `# KOSA API Documentation

## 개요
리뷰 기반 실시간 감정 분석 및 요약 서비스 API 문서입니다.

## 버전 정보
- **현재 버전**: ${getLatestVersion()}
- **문서 생성일**: ${new Date().toISOString()}

## 문서 접근 방법

### 1. Swagger UI (권장)
- 개발 서버: http://localhost:3001/api-docs
- 정적 문서: [index.html](./index.html)

### 2. JSON 스펙
- [swagger.json](./swagger.json) - OpenAPI 3.0 스펙 파일
- [api-info.json](./api-info.json) - API 버전 및 변경 이력 정보

## 주요 엔드포인트

### 인증 (Authentication)
- \`POST /api/auth/register\` - 회원가입
- \`POST /api/auth/login\` - 로그인
- \`POST /api/auth/refresh\` - 토큰 갱신
- \`POST /api/auth/logout\` - 로그아웃
- \`GET /api/auth/me\` - 현재 사용자 정보

### 상품 (Products)
- \`GET /api/products\` - 상품 목록 조회
- \`GET /api/products/{id}\` - 상품 상세 조회
- \`POST /api/products/search\` - 상품 검색 (크롤링 포함)
- \`GET /api/products/count\` - 상품 개수 조회

### 분석 (Analysis)
- \`POST /api/analyze\` - 리뷰 분석 요청
- \`GET /api/analyze/status/{productId}\` - 분석 상태 확인
- \`GET /api/analyze/result/{productId}\` - 분석 결과 조회

### API 정보 (API Info)
- \`GET /api/info\` - API 기본 정보
- \`GET /api/info/versions\` - 지원 버전 목록
- \`GET /api/info/changelog\` - 변경 이력
- \`GET /api/info/health\` - 서비스 상태 확인

## 인증 방법
API는 JWT(JSON Web Token) 기반 인증을 사용합니다.

1. \`/api/auth/login\`으로 로그인하여 토큰을 받습니다.
2. 이후 요청의 Authorization 헤더에 \`Bearer {token}\`을 포함합니다.

## 에러 코드
- \`400\` - 잘못된 요청
- \`401\` - 인증 실패
- \`403\` - 권한 없음
- \`404\` - 리소스를 찾을 수 없음
- \`500\` - 서버 내부 오류
- \`503\` - 서비스 사용 불가

## 지원 및 문의
- 개발팀: support@kosa.com
- 문서 이슈: GitHub Issues
`;

const README_PATH = path.join(OUTPUT_DIR, 'README.md');
fs.writeFileSync(README_PATH, readmeContent.trim());
console.log(`✅ README 파일 생성 완료: ${README_PATH}`);

console.log('\n🎉 API 문서 생성이 완료되었습니다!');
console.log(`📁 출력 디렉토리: ${OUTPUT_DIR}`);
console.log('📄 생성된 파일들:');
console.log('  - swagger.json (OpenAPI 스펙)');
console.log('  - api-info.json (API 정보)');
console.log('  - index.html (Swagger UI)');
console.log('  - README.md (문서 가이드)');