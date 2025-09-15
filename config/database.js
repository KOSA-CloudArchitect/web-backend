const { Pool } = require('pg');
const { Sentry } = require('./sentry');

let pool = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'kosa',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      max: parseInt(process.env.DB_POOL_MAX || '20'),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'),
    });

    // Log database connection events
    pool.on('connect', () => {
      console.log('🔌 Connected to PostgreSQL database');
    });

    pool.on('error', (err) => {
      console.error('❌ PostgreSQL pool error:', err);
      Sentry.captureException(err);
    });

    // Test the connection
    testConnection();
  }

  return pool;
}

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL database connection test successful');
    client.release();
  } catch (err) {
    console.error('❌ PostgreSQL database connection test failed:', err);
    Sentry.captureException(err);
  }
}

function closePool() {
  if (pool) {
    console.log('🔌 Closing PostgreSQL connection pool');
    return pool.end();
  }
  return Promise.resolve();
}

module.exports = {
  getPool,
  closePool
};