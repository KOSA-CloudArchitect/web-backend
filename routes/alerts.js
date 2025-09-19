// EKS Migration - Alert Webhook Endpoints
// Task 6.2: AlertManager 웹훅 수신 및 처리

const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
const { recordAnalysisJob } = require('../middleware/metrics');

// 기본 인증 미들웨어
const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  
  if (!auth || !auth.startsWith('Basic ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const credentials = Buffer.from(auth.slice(6), 'base64').toString().split(':');
  const username = credentials[0];
  const password = credentials[1];
  
  if (username !== 'alertmanager' || password !== 'kosa-alert-2024') {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  next();
};

// 알림 처리 공통 함수
const processAlert = (alert, severity) => {
  const alertInfo = {
    alertname: alert.labels?.alertname || 'Unknown',
    instance: alert.labels?.instance || 'Unknown',
    job: alert.labels?.job || 'Unknown',
    severity: severity,
    status: alert.status,
    summary: alert.annotations?.summary || 'No summary',
    description: alert.annotations?.description || 'No description',
    startsAt: alert.startsAt,
    endsAt: alert.endsAt,
    generatorURL: alert.generatorURL
  };
  
  logger.warn(`Alert received: ${alertInfo.alertname}`, alertInfo);
  
  // 메트릭 기록
  recordAnalysisJob('alert_received', severity);
  
  return alertInfo;
};

// 일반 알림 웹훅
router.post('/webhook', basicAuth, (req, res) => {
  try {
    const { alerts } = req.body;
    
    if (!alerts || !Array.isArray(alerts)) {
      return res.status(400).json({ message: 'Invalid alert format' });
    }
    
    const processedAlerts = alerts.map(alert => processAlert(alert, 'info'));
    
    logger.info(`Processed ${processedAlerts.length} alerts via webhook`);
    
    res.json({ 
      message: 'Alerts processed successfully',
      count: processedAlerts.length,
      alerts: processedAlerts
    });
  } catch (error) {
    logger.error('Error processing webhook alerts:', error);
    res.status(500).json({ message: 'Error processing alerts' });
  }
});

// 중요 알림 웹훅
router.post('/critical', basicAuth, (req, res) => {
  try {
    const { alerts } = req.body;
    
    if (!alerts || !Array.isArray(alerts)) {
      return res.status(400).json({ message: 'Invalid alert format' });
    }
    
    const processedAlerts = alerts.map(alert => {
      const alertInfo = processAlert(alert, 'critical');
      
      // 중요 알림의 경우 추가 처리
      logger.error(`CRITICAL ALERT: ${alertInfo.alertname}`, alertInfo);
      
      // 여기에 추가적인 알림 로직 구현 가능
      // 예: 이메일 발송, Slack 메시지, SMS 등
      
      return alertInfo;
    });
    
    logger.error(`Processed ${processedAlerts.length} CRITICAL alerts`);
    
    res.json({ 
      message: 'Critical alerts processed successfully',
      count: processedAlerts.length,
      alerts: processedAlerts
    });
  } catch (error) {
    logger.error('Error processing critical alerts:', error);
    res.status(500).json({ message: 'Error processing critical alerts' });
  }
});

// 경고 알림 웹훅
router.post('/warning', basicAuth, (req, res) => {
  try {
    const { alerts } = req.body;
    
    if (!alerts || !Array.isArray(alerts)) {
      return res.status(400).json({ message: 'Invalid alert format' });
    }
    
    const processedAlerts = alerts.map(alert => processAlert(alert, 'warning'));
    
    logger.warn(`Processed ${processedAlerts.length} warning alerts`);
    
    res.json({ 
      message: 'Warning alerts processed successfully',
      count: processedAlerts.length,
      alerts: processedAlerts
    });
  } catch (error) {
    logger.error('Error processing warning alerts:', error);
    res.status(500).json({ message: 'Error processing warning alerts' });
  }
});

// 알림 상태 조회
router.get('/status', (req, res) => {
  try {
    // 최근 알림 통계 (실제 구현에서는 데이터베이스나 캐시에서 조회)
    const alertStats = {
      total_alerts_today: 0,
      critical_alerts_today: 0,
      warning_alerts_today: 0,
      resolved_alerts_today: 0,
      last_alert_time: null,
      alert_system_status: 'healthy'
    };
    
    res.json(alertStats);
  } catch (error) {
    logger.error('Error getting alert status:', error);
    res.status(500).json({ message: 'Error getting alert status' });
  }
});

// 알림 테스트 엔드포인트
router.post('/test', (req, res) => {
  try {
    const testAlert = {
      alerts: [{
        labels: {
          alertname: 'TestAlert',
          instance: 'test-instance',
          job: 'test-job',
          severity: 'info'
        },
        annotations: {
          summary: 'This is a test alert',
          description: 'Test alert for webhook functionality'
        },
        status: 'firing',
        startsAt: new Date().toISOString(),
        generatorURL: 'http://prometheus:9090/test'
      }]
    };
    
    logger.info('Test alert generated', testAlert);
    
    res.json({ 
      message: 'Test alert generated successfully',
      alert: testAlert
    });
  } catch (error) {
    logger.error('Error generating test alert:', error);
    res.status(500).json({ message: 'Error generating test alert' });
  }
});

module.exports = router;