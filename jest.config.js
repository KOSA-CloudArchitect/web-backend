module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  projects: [
    {
      displayName: 'unit',
      testMatch: [
        '**/__tests__/**/*.test.js',
        '**/__tests__/**/*.spec.js'
      ],
      testPathIgnorePatterns: [
        '/integration/',
        '/e2e/'
      ]
    },
    {
      displayName: 'integration',
      testMatch: [
        '**/__tests__/integration/**/*.test.js',
        '**/__tests__/integration/**/*.spec.js'
      ]
    }
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/__tests__/**/*.ts', 
    '**/?(*.)+(spec|test).js',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverageFrom: [
    'services/**/*.js',
    'routes/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    '!**/*.test.js',
    '!**/*.spec.js',
    '!**/__tests__/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './services/batchAnalysisService.js': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    './services/analysisRequestStatusService.js': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 10000,
  verbose: true,
  detectOpenHandles: true,
  forceExit: true
};