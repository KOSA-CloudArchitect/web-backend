const { Pool } = require('pg');

// 데이터베이스 연결 설정
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'kosa',
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

let pool = null;

// 데이터베이스 연결 시도
try {
  pool = new Pool(dbConfig);
  
  // 연결 테스트
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.warn('⚠️  PostgreSQL 연결 실패:', err.message);
      console.warn('📝 데이터베이스 없이 서버를 실행합니다.');
    } else {
      console.log('✅ PostgreSQL 연결 성공:', res.rows[0].now);
    }
  });
  
} catch (error) {
  console.warn('⚠️  PostgreSQL 초기화 실패:', error.message);
  console.warn('📝 데이터베이스 없이 서버를 실행합니다.');
}

// 안전한 쿼리 실행 함수
const safeQuery = async (text, params) => {
  if (!pool) {
    console.warn('⚠️  데이터베이스가 연결되지 않았습니다.');
    return { rows: [] };
  }
  
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error('❌ 데이터베이스 쿼리 오류:', error);
    throw error;
  }
};

module.exports = {
  pool,
  query: safeQuery
}; 