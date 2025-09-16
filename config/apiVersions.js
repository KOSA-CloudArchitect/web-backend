/**
 * API 버전 관리 설정
 */

const API_VERSIONS = {
  v1: {
    version: '1.0.0',
    releaseDate: '2025-08-04',
    status: 'stable',
    description: '초기 릴리즈 - 기본 인증, 상품 검색, 리뷰 분석 기능',
    endpoints: [
      '/api/auth/*',
      '/api/products/*',
      '/api/analyze/*',
      '/api/categories/*',
      '/api/kafka/*',
      '/api/websocket/*'
    ],
    deprecationDate: null,
    supportEndDate: null
  }
};

const CHANGELOG = [
  {
    version: '1.0.0',
    date: '2025-08-04',
    type: 'major',
    changes: [
      {
        type: 'added',
        description: 'JWT 기반 사용자 인증 시스템 구현',
        endpoints: ['/api/auth/register', '/api/auth/login', '/api/auth/refresh', '/api/auth/logout', '/api/auth/me']
      },
      {
        type: 'added',
        description: '상품 검색 및 조회 API 구현',
        endpoints: ['/api/products', '/api/products/search', '/api/products/{id}', '/api/products/count']
      },
      {
        type: 'added',
        description: '리뷰 분석 요청 및 결과 조회 API 구현',
        endpoints: ['/api/analyze', '/api/analyze/status/{productId}', '/api/analyze/result/{productId}']
      },
      {
        type: 'added',
        description: 'WebSocket 기반 실시간 상태 업데이트 지원',
        endpoints: ['/api/websocket/*']
      },
      {
        type: 'added',
        description: 'Kafka 메시지 큐 통합',
        endpoints: ['/api/kafka/*']
      },
      {
        type: 'added',
        description: 'OpenAPI 3.0 문서화 자동 생성',
        endpoints: ['/api-docs']
      }
    ]
  }
];

const getLatestVersion = () => {
  const versions = Object.keys(API_VERSIONS);
  return versions[versions.length - 1];
};

const getVersionInfo = (version) => {
  return API_VERSIONS[version] || null;
};

const getChangelog = (fromVersion = null, toVersion = null) => {
  if (!fromVersion && !toVersion) {
    return CHANGELOG;
  }
  
  // 특정 버전 범위의 변경사항 필터링 로직
  return CHANGELOG.filter(change => {
    if (fromVersion && toVersion) {
      return change.version >= fromVersion && change.version <= toVersion;
    } else if (fromVersion) {
      return change.version >= fromVersion;
    } else if (toVersion) {
      return change.version <= toVersion;
    }
    return true;
  });
};

const isVersionSupported = (version) => {
  const versionInfo = API_VERSIONS[version];
  if (!versionInfo) return false;
  
  if (versionInfo.supportEndDate) {
    return new Date() <= new Date(versionInfo.supportEndDate);
  }
  
  return true;
};

const isVersionDeprecated = (version) => {
  const versionInfo = API_VERSIONS[version];
  if (!versionInfo) return true;
  
  if (versionInfo.deprecationDate) {
    return new Date() >= new Date(versionInfo.deprecationDate);
  }
  
  return false;
};

module.exports = {
  API_VERSIONS,
  CHANGELOG,
  getLatestVersion,
  getVersionInfo,
  getChangelog,
  isVersionSupported,
  isVersionDeprecated
};