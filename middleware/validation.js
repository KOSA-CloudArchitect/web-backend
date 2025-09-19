const { validationResult } = require('express-validator');

/**
 * 요청 검증 미들웨어
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '입력 데이터가 유효하지 않습니다.',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

/**
 * 파라미터 검증 미들웨어
 */
const validateParams = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '요청 파라미터가 유효하지 않습니다.',
        errors: errors.array()
      });
    }
    
    next();
  };
};

/**
 * 에러 포맷팅 유틸리티
 */
const formatValidationErrors = (errors) => {
  return errors.array().reduce((acc, error) => {
    const field = error.path || error.param;
    if (!acc[field]) {
      acc[field] = [];
    }
    acc[field].push(error.msg);
    return acc;
  }, {});
};

module.exports = {
  validateRequest,
  validateParams,
  formatValidationErrors
};