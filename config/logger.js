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

// 파일 로깅 (프로덕션 환경에서만)
if (process.env.NODE_ENV === 'production') {
  const fs = require('fs');
  // 로그 디렉토리 생성
  const logDir = path.join(__dirname, '..', 'logs');
  
  // 로그 디렉토리가 없으면 생성
  if (!fs.existsSync(logDir)) {
    try {
      fs.mkdirSync(logDir, { recursive: true });
    } catch (error) {
      console.warn('로그 디렉토리 생성 실패:', error.message);
    }
  }
  
  // 로그 디렉토리가 존재하는 경우에만 파일 로그 추가
  if (fs.existsSync(logDir)) {
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
  } else {
    console.warn('로그 디렉토리를 생성할 수 없어 파일 로깅이 비활성화됩니다.');
  }
}

// 개발 환경에서는 더 자세한 로그 출력
if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug';
}

module.exports = logger;