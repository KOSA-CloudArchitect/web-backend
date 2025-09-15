const { Sentry } = require('../config/sentry');

// 기본 에러 클래스
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 유효성 검사 에러
class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

// 외부 서비스 에러
class ExternalServiceError extends AppError {
  constructor(message) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR');
  }
}

// 타임아웃 에러
class TimeoutError extends AppError {
  constructor(message) {
    super(message, 504, 'TIMEOUT_ERROR');
  }
}

// 비동기 핸들러 래퍼
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 에러 핸들러 미들웨어
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Sentry에 에러 보고
  Sentry.withScope((scope) => {
    scope.setTag('handled_error', true);
    scope.setContext('error_details', {
      code: err.code,
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
    });
    Sentry.captureException(err);
  });

  // 응답 형식 설정
  const statusCode = err.statusCode || 500;
  const errorResponse = {
    success: false,
    error: {
      message: err.message || '서버 내부 오류가 발생했습니다.',
      code: err.code || 'INTERNAL_SERVER_ERROR',
    },
  };

  // 개발 환경에서는 스택 트레이스 포함
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.error.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

// 404 Not Found 핸들러
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: '요청한 리소스를 찾을 수 없습니다.',
      code: 'NOT_FOUND',
    },
  });
};

module.exports = {
  AppError,
  ValidationError,
  ExternalServiceError,
  TimeoutError,
  asyncHandler,
  errorHandler,
  notFoundHandler,
};