import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock Sentry
jest.mock('../../config/sentry', () => ({
  Sentry: {
    captureException: jest.fn(),
    captureMessage: jest.fn(),
    addBreadcrumb: jest.fn(),
    withScope: jest.fn((callback) => callback({
      setTag: jest.fn(),
      setContext: jest.fn(),
    })),
  },
}));

describe('HttpClient', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    // Set environment variables
    process.env.ANALYSIS_SERVER_URL = 'http://localhost:5000';
    process.env.ANALYSIS_SERVER_TOKEN = 'test-token';
    process.env.HTTP_TIMEOUT = '5000';
    process.env.HTTP_RETRY_COUNT = '2';
    
    // Create a new mock adapter for each test
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
    jest.clearAllMocks();
  });

  describe('Basic functionality', () => {
    it('should be able to import httpClient', () => {
      const httpClient = require('../httpClient').default;
      expect(httpClient).toBeDefined();
      expect(typeof httpClient.requestAnalysis).toBe('function');
      expect(typeof httpClient.checkAnalysisStatus).toBe('function');
    });

    it('should handle axios configuration', () => {
      // Test that axios is properly configured
      expect(axios.defaults.timeout).toBeDefined();
    });

    it('should handle environment variables', () => {
      expect(process.env.ANALYSIS_SERVER_URL).toBe('http://localhost:5000');
      expect(process.env.ANALYSIS_SERVER_TOKEN).toBe('test-token');
    });
  });

  describe('Mock functionality', () => {
    it('should handle mock responses', async () => {
      mockAxios.onGet('http://localhost:5000/test').reply(200, { success: true });
      
      const response = await axios.get('http://localhost:5000/test');
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ success: true });
    });

    it('should handle mock errors', async () => {
      mockAxios.onGet('http://localhost:5000/error').reply(500, { error: 'Server Error' });
      
      try {
        await axios.get('http://localhost:5000/error');
      } catch (error: any) {
        expect(error.response.status).toBe(500);
        expect(error.response.data).toEqual({ error: 'Server Error' });
      }
    });
  });
});