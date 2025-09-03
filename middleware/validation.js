const { validationResult } = require('express-validator');

/**
 * 요청 검증 미들웨어
 * express-validator의 검증 결과를 확인하고 오류가 있으면 응답을 반환
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: '입력 데이터가 유효하지 않습니다.',
      details: formattedErrors
    });
  }

  next();
};

/**
 * 페이지네이션 검증 미들웨어
 */
const validatePagination = (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_PAGE',
      message: '페이지 번호는 1 이상의 정수여야 합니다.'
    });
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_LIMIT',
      message: '한 페이지당 항목 수는 1~100 사이여야 합니다.'
    });
  }

  req.pagination = {
    page: pageNum,
    limit: limitNum
  };

  next();
};

/**
 * 정렬 검증 미들웨어
 */
const validateSort = (allowedFields = []) => {
  return (req, res, next) => {
    const { sortBy, sortOrder = 'desc' } = req.query;

    if (sortBy && !allowedFields.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_SORT_FIELD',
        message: `정렬 필드는 ${allowedFields.join(', ')} 중 하나여야 합니다.`
      });
    }

    if (sortOrder && !['asc', 'desc'].includes(sortOrder.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_SORT_ORDER',
        message: '정렬 순서는 asc 또는 desc여야 합니다.'
      });
    }

    req.sort = {
      sortBy: sortBy || allowedFields[0] || 'createdAt',
      sortOrder: sortOrder.toLowerCase()
    };

    next();
  };
};

/**
 * 파일 업로드 검증 미들웨어
 */
const validateFileUpload = (options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
    required = false
  } = options;

  return (req, res, next) => {
    if (!req.file && required) {
      return res.status(400).json({
        success: false,
        error: 'FILE_REQUIRED',
        message: '파일이 필요합니다.'
      });
    }

    if (!req.file && !required) {
      return next();
    }

    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        error: 'FILE_TOO_LARGE',
        message: `파일 크기는 ${Math.round(maxSize / 1024 / 1024)}MB 이하여야 합니다.`
      });
    }

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_FILE_TYPE',
        message: `허용된 파일 형식: ${allowedTypes.join(', ')}`
      });
    }

    next();
  };
};

/**
 * JSON 파싱 오류 처리 미들웨어
 */
const handleJsonError = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_JSON',
      message: 'JSON 형식이 올바르지 않습니다.'
    });
  }
  next(err);
};

/**
 * 사용자 정의 검증 함수들
 */
const customValidators = {
  /**
   * 쿠팡 URL 검증
   */
  isCoupangUrl: (value) => {
    const coupangUrlPattern = /^https?:\/\/(www\.)?coupang\.com\/vp\/products\/\d+/;
    return coupangUrlPattern.test(value);
  },

  /**
   * 한국 전화번호 검증
   */
  isKoreanPhone: (value) => {
    const phonePattern = /^01[0-9]-?\d{3,4}-?\d{4}$/;
    return phonePattern.test(value);
  },

  /**
   * 강력한 비밀번호 검증
   */
  isStrongPassword: (value) => {
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordPattern.test(value);
  },

  /**
   * 배열 길이 검증
   */
  isArrayLength: (min, max) => {
    return (value) => {
      if (!Array.isArray(value)) return false;
      return value.length >= min && value.length <= max;
    };
  }
};

module.exports = {
  validateRequest,
  validatePagination,
  validateSort,
  validateFileUpload,
  handleJsonError,
  customValidators
};