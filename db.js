const { Pool, Client } = require('pg');

// 기본 연결 설정
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'kosa',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: false,
};

let pool = null;

// 데이터베이스 연결 시도
try {
  pool = new Pool(dbConfig);

  // 연결 이벤트 핸들러
  pool.on('connect', () => {
    console.log('🔌 PostgreSQL 클라이언트 연결됨');
  });

  pool.on('error', (err) => {
    console.error('❌ PostgreSQL 풀 에러:', err.message);
  });

  // 단순한 연결 테스트
  const testConnection = async () => {
    const client = new Client(dbConfig);

    try {
      console.log('� PostgreSQL  연결 테스트 중...');
      console.log('🔧 연결 설정:', {
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        user: dbConfig.user
      });

      await client.connect();
      const res = await client.query('SELECT NOW() as current_time, current_database() as db_name');
      console.log('✅ PostgreSQL 연결 성공!');
      console.log('📅 현재 시간:', res.rows[0].current_time);
      console.log('�️  데이2터베이스:', res.rows[0].db_name);

      await client.end();

      // 성공하면 풀 연결도 테스트
      console.log('🔄 PostgreSQL 풀 연결 테스트 중...');
      const poolClient = await pool.connect();
      await poolClient.query('SELECT 1');
      poolClient.release();
      console.log('✅ PostgreSQL 풀 연결도 성공!');

    } catch (err) {
      console.warn('⚠️  PostgreSQL 연결 실패:', err.message);
      console.warn('📝 데이터베이스 없이 서버를 실행합니다.');
      try {
        await client.end();
      } catch (e) {
        // 무시
      }
    }
  };

  // 서버 시작 후 잠시 대기 후 연결 테스트
  setTimeout(testConnection, 2000);

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