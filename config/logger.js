const winston = require('winston');
const path = require('path');

// 로그 레벨 설정
const logLevel = process.env.LOG_LEVEL || 'info';

// 로그 포맷 설정
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// 콘솔 출력 포맷
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// 로거 생성
const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  defaultMeta: { service: 'kosa-backend' },
  transports: [
    // 콘솔 출력
    new winston.transports.Console({
      format: consoleFormat
    })
  ]
});

// 파일 로깅 (프로덕션 환경에서만, 컨테이너에서는 콘솔만 사용)
if (process.env.NODE_ENV === 'production' && !process.env.KUBERNETES_SERVICE_HOST) {
  try {
    const fs = require('fs');
    const logDir = path.join(__dirname, '..', 'logs');
    
    // 로그 디렉토리가 없으면 생성
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    logger.add(new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }));

    logger.add(new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }));
  } catch (error) {
    // 파일 로깅 실패 시 콘솔에만 로그 출력
    console.warn('파일 로깅 설정 실패, 콘솔 로깅만 사용:', error.message);
  }
}

// 개발 환경에서는 더 자세한 로그 출력
if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug';
}

module.exports = logger;