const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KOSA Review Analysis API',
      version: '1.0.0',
      description: '리뷰 기반 실시간 감정 분석 및 요약 서비스 API',
      contact: {
        name: 'KOSA Team',
        email: 'support@kosa.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://api.kosa.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT 토큰을 사용한 인증'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            id: {
              type: 'integer',
              description: '사용자 고유 ID'
            },
            email: {
              type: 'string',
              format: 'email',
              description: '사용자 이메일'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: '사용자 비밀번호 (최소 6자)'
            },
            name: {
              type: 'string',
              description: '사용자 이름'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '계정 생성일'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: '상품 고유 ID'
            },
            name: {
              type: 'string',
              description: '상품명'
            },
            price: {
              type: 'number',
              description: '상품 가격'
            },
            rating: {
              type: 'number',
              minimum: 0,
              maximum: 5,
              description: '평균 별점 (0-5)'
            },
            reviewCount: {
              type: 'integer',
              description: '총 리뷰 수'
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
              description: '상품 이미지 URL'
            },
            category: {
              type: 'string',
              description: '상품 카테고리'
            },
            url: {
              type: 'string',
              format: 'uri',
              description: '상품 페이지 URL'
            }
          }
        },
        AnalysisRequest: {
          type: 'object',
          required: ['productId'],
          properties: {
            productId: {
              type: 'string',
              description: '분석할 상품 ID'
            },
            options: {
              type: 'object',
              properties: {
                maxReviews: {
                  type: 'integer',
                  default: 100,
                  description: '분석할 최대 리뷰 수'
                },
                includeKeywords: {
                  type: 'boolean',
                  default: true,
                  description: '키워드 분석 포함 여부'
                }
              }
            }
          }
        },
        AnalysisResult: {
          type: 'object',
          properties: {
            productId: {
              type: 'string',
              description: '분석된 상품 ID'
            },
            sentiment: {
              type: 'object',
              properties: {
                positive: {
                  type: 'number',
                  description: '긍정 감정 비율 (0-1)'
                },
                negative: {
                  type: 'number',
                  description: '부정 감정 비율 (0-1)'
                },
                neutral: {
                  type: 'number',
                  description: '중립 감정 비율 (0-1)'
                }
              }
            },
            keywords: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  word: {
                    type: 'string',
                    description: '키워드'
                  },
                  frequency: {
                    type: 'integer',
                    description: '언급 빈도'
                  },
                  sentiment: {
                    type: 'string',
                    enum: ['positive', 'negative', 'neutral'],
                    description: '키워드 감정'
                  }
                }
              }
            },
            summary: {
              type: 'string',
              description: '리뷰 요약'
            },
            totalReviews: {
              type: 'integer',
              description: '분석된 총 리뷰 수'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '분석 완료 시간'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: '에러 메시지'
            },
            code: {
              type: 'string',
              description: '에러 코드'
            },
            details: {
              type: 'object',
              description: '에러 상세 정보'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT 액세스 토큰'
            },
            refreshToken: {
              type: 'string',
              description: 'JWT 리프레시 토큰'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './routes/*.js',
    './index.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'KOSA API Documentation'
  })
};