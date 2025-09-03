const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

// Create a fresh instance for testing
const AirflowClient = require('../airflowClient.js');

// Mock axios
const mock = new MockAdapter(axios);

describe('AirflowClient', () => {
  let airflowClient;

  beforeEach(() => {
    mock.reset();
    
    // Mock environment variables
    process.env.AIRFLOW_API_URL = 'http://localhost:8080/api/v1';
    process.env.AIRFLOW_USERNAME = 'admin';
    process.env.AIRFLOW_PASSWORD = 'admin';
    process.env.AIRFLOW_CIRCUIT_BREAKER_TIMEOUT = '1000';
    process.env.AIRFLOW_CIRCUIT_BREAKER_ERROR_THRESHOLD = '100'; // High threshold to avoid opening
    
    // Create new instance for each test to avoid circuit breaker state
    const AirflowClientClass = require('../airflowClient.js').constructor;
    airflowClient = new AirflowClientClass();
  });

  afterEach(() => {
    mock.restore();
  });

  describe('triggerSingleProductAnalysis', () => {
    it('should successfully trigger single product analysis DAG', async () => {
      const mockResponse = {
        dag_run_id: 'single_test-product_1234567890',
        execution_date: '2025-01-01T00:00:00Z',
        state: 'queued',
        conf: {
          product_id: 'test-product',
          product_url: 'https://example.com/product/123',
          user_id: 'user-123',
          analysis_type: 'single',
        },
      };

      mock.onPost('/dags/single_product_analysis/dagRuns').reply(200, mockResponse);

      const params = {
        productId: 'test-product',
        productUrl: 'https://example.com/product/123',
        userId: 'user-123',
      };

      const result = await airflowClient.triggerSingleProductAnalysis(params);

      expect(result.dagId).toBe('single_product_analysis');
      expect(result.dagRunId).toContain('single_test-product');
      expect(result.state).toBe('queued');
    });

    it('should handle DAG trigger failure', async () => {
      mock.onPost('/dags/single_product_analysis/dagRuns').reply(500, {
        detail: 'Internal server error',
      });

      const params = {
        productId: 'test-product',
        productUrl: 'https://example.com/product/123',
        userId: 'user-123',
      };

      await expect(airflowClient.triggerSingleProductAnalysis(params))
        .rejects.toThrow();
    });
  });

  describe('triggerMultiProductAnalysis', () => {
    it('should successfully trigger multi product analysis DAG', async () => {
      const mockResponse = {
        dag_run_id: 'multi_smartphone_1234567890',
        execution_date: '2025-01-01T00:00:00Z',
        state: 'queued',
        conf: {
          search_query: 'smartphone',
          user_id: 'user-123',
          max_products: 10,
          analysis_type: 'multi',
        },
      };

      mock.onPost('/dags/multi_product_analysis/dagRuns').reply(200, mockResponse);

      const params = {
        searchQuery: 'smartphone',
        userId: 'user-123',
        maxProducts: 10,
      };

      const result = await airflowClient.triggerMultiProductAnalysis(params);

      expect(result.dagId).toBe('multi_product_analysis');
      expect(result.dagRunId).toContain('multi_smartphone');
      expect(result.state).toBe('queued');
    });
  });

  describe('getDagRunStatus', () => {
    it('should successfully get DAG run status', async () => {
      const mockResponse = {
        dag_run_id: 'test-dag-run',
        state: 'running',
        execution_date: '2025-01-01T00:00:00Z',
        start_date: '2025-01-01T00:01:00Z',
        end_date: null,
        conf: { test: 'config' },
      };

      mock.onGet('/dags/test-dag/dagRuns/test-dag-run').reply(200, mockResponse);

      const result = await airflowClient.getDagRunStatus('test-dag', 'test-dag-run');

      expect(result.dagId).toBe('test-dag');
      expect(result.dagRunId).toBe('test-dag-run');
      expect(result.state).toBe('running');
    });

    it('should handle DAG run not found', async () => {
      mock.onGet('/dags/test-dag/dagRuns/non-existent').reply(404, {
        detail: 'DAG run not found',
      });

      await expect(airflowClient.getDagRunStatus('test-dag', 'non-existent'))
        .rejects.toThrow();
    });
  });

  describe('Authentication', () => {
    it('should include Basic Auth header in requests', async () => {
      let authHeaderReceived = '';
      
      mock.onPost('/dags/single_product_analysis/dagRuns').reply((config) => {
        authHeaderReceived = config.headers.Authorization;
        return [200, { 
          dag_run_id: 'test', 
          execution_date: '2025-01-01T00:00:00Z', 
          state: 'queued', 
          conf: {} 
        }];
      });

      const params = {
        productId: 'test-product',
        productUrl: 'https://example.com/product/123',
        userId: 'user-123',
      };

      await airflowClient.triggerSingleProductAnalysis(params);
      
      expect(authHeaderReceived).toMatch(/^Basic /);
      
      // Decode and verify credentials
      const credentials = Buffer.from(authHeaderReceived.replace('Basic ', ''), 'base64').toString();
      expect(credentials).toBe('admin:admin');
    });
  });
});