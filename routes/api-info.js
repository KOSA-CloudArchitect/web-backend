const express = require('express');
const { 
  API_VERSIONS, 
  CHANGELOG, 
  getLatestVersion, 
  getVersionInfo, 
  getChangelog 
} = require('../config/apiVersions');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: API Info
 *   description: API 정보 및 버전 관리
 */

/**
 * @swagger
 * /api/info:
 *   get:
 *     summary: API 기본 정보 조회
 *     description: API의 기본 정보와 현재 버전을 조회합니다.
 *     tags: [API Info]
 *     responses:
 *       200:
 *         description: API 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: KOSA Review Analysis API
 *                 description:
 *                   type: string
 *                   example: 리뷰 기반 실시간 감정 분석 및 요약 서비스 API
 *                 currentVersion:
 *                   type: string
 *                   example: v1
 *                 latestVersion:
 *                   type: string
 *                   example: 1.0.0
 *                 documentation:
 *                   type: string
 *                   example: /api-docs
 *                 status:
 *                   type: string
 *                   example: stable
 *                 uptime:
 *                   type: string
 *                   description: 서버 가동 시간
 */
router.get('/', (req, res) => {
  const latestVersion = getLatestVersion();
  const versionInfo = getVersionInfo(latestVersion);
  
  res.json({
    name: 'KOSA Review Analysis API',
    description: '리뷰 기반 실시간 감정 분석 및 요약 서비스 API',
    currentVersion: latestVersion,
    latestVersion: versionInfo?.version || '1.0.0',
    documentation: '/api-docs',
    status: versionInfo?.status || 'stable',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /api/info/versions:
 *   get:
 *     summary: 지원되는 API 버전 목록 조회
 *     description: 현재 지원되는 모든 API 버전의 정보를 조회합니다.
 *     tags: [API Info]
 *     responses:
 *       200:
 *         description: API 버전 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 versions:
 *                   type: object
 *                   description: 버전별 상세 정보
 *                 latest:
 *                   type: string
 *                   description: 최신 버전
 *                 supported:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: 지원되는 버전 목록
 */
router.get('/versions', (req, res) => {
  const supportedVersions = Object.keys(API_VERSIONS).filter(version => {
    const versionInfo = API_VERSIONS[version];
    if (versionInfo.supportEndDate) {
      return new Date() <= new Date(versionInfo.supportEndDate);
    }
    return true;
  });

  res.json({
    versions: API_VERSIONS,
    latest: getLatestVersion(),
    supported: supportedVersions,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /api/info/changelog:
 *   get:
 *     summary: API 변경 이력 조회
 *     description: API의 버전별 변경 이력을 조회합니다.
 *     tags: [API Info]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *         description: "시작 버전 (예: 1.0.0)"
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         description: "종료 버전 (예: 1.1.0)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 조회할 최대 항목 수
 *     responses:
 *       200:
 *         description: 변경 이력 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 changelog:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       version:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date
 *                       type:
 *                         type: string
 *                         enum: [major, minor, patch]
 *                       changes:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             type:
 *                               type: string
 *                               enum: [added, changed, deprecated, removed, fixed, security]
 *                             description:
 *                               type: string
 *                             endpoints:
 *                               type: array
 *                               items:
 *                                 type: string
 *                 total:
 *                   type: integer
 *                   description: 전체 변경 이력 수
 */
router.get('/changelog', (req, res) => {
  const { from, to, limit = 10 } = req.query;
  
  let changelog = getChangelog(from, to);
  
  if (limit && !isNaN(parseInt(limit))) {
    changelog = changelog.slice(0, parseInt(limit));
  }
  
  res.json({
    changelog,
    total: CHANGELOG.length,
    filters: {
      from: from || null,
      to: to || null,
      limit: parseInt(limit) || 10
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /api/info/version/{version}:
 *   get:
 *     summary: 특정 버전 정보 조회
 *     description: 특정 API 버전의 상세 정보를 조회합니다.
 *     tags: [API Info]
 *     parameters:
 *       - in: path
 *         name: version
 *         required: true
 *         schema:
 *           type: string
 *         description: "조회할 버전 (예: v1)"
 *     responses:
 *       200:
 *         description: 버전 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 version:
 *                   type: string
 *                 releaseDate:
 *                   type: string
 *                   format: date
 *                 status:
 *                   type: string
 *                   enum: [stable, beta, deprecated]
 *                 description:
 *                   type: string
 *                 endpoints:
 *                   type: array
 *                   items:
 *                     type: string
 *                 deprecationDate:
 *                   type: string
 *                   format: date
 *                   nullable: true
 *                 supportEndDate:
 *                   type: string
 *                   format: date
 *                   nullable: true
 *       404:
 *         description: 버전을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/version/:version', (req, res) => {
  const { version } = req.params;
  const versionInfo = getVersionInfo(version);
  
  if (!versionInfo) {
    return res.status(404).json({
      error: 'VERSION_NOT_FOUND',
      message: `버전 '${version}'을 찾을 수 없습니다.`,
      availableVersions: Object.keys(API_VERSIONS)
    });
  }
  
  res.json({
    ...versionInfo,
    versionKey: version,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /api/info/health:
 *   get:
 *     summary: API 상태 확인
 *     description: API 서버의 상태와 의존성 서비스들의 상태를 확인합니다.
 *     tags: [API Info]
 *     responses:
 *       200:
 *         description: 서비스 정상 상태
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: 서버 가동 시간 (초)
 *                 version:
 *                   type: string
 *                   description: 현재 API 버전
 *                 dependencies:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: string
 *                       enum: [healthy, unhealthy, unknown]
 *                     redis:
 *                       type: string
 *                       enum: [healthy, unhealthy, unknown]
 *                     kafka:
 *                       type: string
 *                       enum: [healthy, unhealthy, unknown]
 *       503:
 *         description: 서비스 비정상 상태
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: unhealthy
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/health', async (req, res) => {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: getLatestVersion(),
    dependencies: {
      database: 'unknown',
      redis: 'unknown',
      kafka: 'unknown'
    }
  };

  const errors = [];

  // 데이터베이스 상태 확인
  try {
    const { getPool } = require('../config/database');
    const pool = getPool();
    await pool.query('SELECT 1');
    healthStatus.dependencies.database = 'healthy';
  } catch (error) {
    healthStatus.dependencies.database = 'unhealthy';
    errors.push(`Database: ${error.message}`);
  }

  // Redis 상태 확인
  try {
    const Redis = require('ioredis');
    const redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      connectTimeout: 5000,
      lazyConnect: true
    });
    await redis.ping();
    healthStatus.dependencies.redis = 'healthy';
    redis.disconnect();
  } catch (error) {
    healthStatus.dependencies.redis = 'unhealthy';
    errors.push(`Redis: ${error.message}`);
  }

  // Kafka 상태 확인
  try {
    const kafkaService = require('../services/kafkaService');
    if (kafkaService.isConnected && kafkaService.isConnected()) {
      healthStatus.dependencies.kafka = 'healthy';
    } else {
      healthStatus.dependencies.kafka = 'unhealthy';
      errors.push('Kafka: Not connected');
    }
  } catch (error) {
    healthStatus.dependencies.kafka = 'unhealthy';
    errors.push(`Kafka: ${error.message}`);
  }

  // 전체 상태 결정
  const hasUnhealthyDependencies = Object.values(healthStatus.dependencies)
    .some(status => status === 'unhealthy');

  if (hasUnhealthyDependencies) {
    healthStatus.status = 'unhealthy';
    healthStatus.errors = errors;
    return res.status(503).json(healthStatus);
  }

  res.json(healthStatus);
});

module.exports = router;