/**
 * Database Migration Script
 * 데이터베이스 마이그레이션 실행 스크립트
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 환경 변수 로드
require('dotenv').config();

const MIGRATION_DIR = path.join(__dirname, '../prisma/migrations');
const SCHEMA_FILE = path.join(__dirname, '../prisma/schema.prisma');

/**
 * 데이터베이스 연결 확인
 */
function checkDatabaseConnection() {
  console.log('🔍 데이터베이스 연결 확인 중...');
  
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL 환경 변수가 설정되지 않았습니다.');
  }

  try {
    execSync('npx prisma db execute --command "SELECT 1"', { 
      stdio: 'pipe',
      cwd: path.join(__dirname, '..')
    });
    console.log('✅ 데이터베이스 연결 성공');
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error.message);
    throw error;
  }
}

/**
 * Prisma 스키마 검증
 */
function validateSchema() {
  console.log('📋 Prisma 스키마 검증 중...');
  
  if (!fs.existsSync(SCHEMA_FILE)) {
    throw new Error('Prisma 스키마 파일을 찾을 수 없습니다.');
  }

  try {
    execSync('npx prisma validate', { 
      stdio: 'pipe',
      cwd: path.join(__dirname, '..')
    });
    console.log('✅ 스키마 검증 성공');
  } catch (error) {
    console.error('❌ 스키마 검증 실패:', error.message);
    throw error;
  }
}

/**
 * 마이그레이션 파일 생성
 */
function generateMigration(name = 'init') {
  console.log(`📝 마이그레이션 파일 생성 중: ${name}`);
  
  try {
    const command = `npx prisma migrate dev --name ${name} --create-only`;
    execSync(command, { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log('✅ 마이그레이션 파일 생성 완료');
  } catch (error) {
    console.error('❌ 마이그레이션 파일 생성 실패:', error.message);
    throw error;
  }
}

/**
 * 마이그레이션 실행
 */
function runMigration() {
  console.log('🚀 마이그레이션 실행 중...');
  
  try {
    execSync('npx prisma migrate deploy', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log('✅ 마이그레이션 실행 완료');
  } catch (error) {
    console.error('❌ 마이그레이션 실행 실패:', error.message);
    throw error;
  }
}

/**
 * Prisma Client 생성
 */
function generateClient() {
  console.log('🔧 Prisma Client 생성 중...');
  
  try {
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log('✅ Prisma Client 생성 완료');
  } catch (error) {
    console.error('❌ Prisma Client 생성 실패:', error.message);
    throw error;
  }
}

/**
 * 데이터베이스 상태 확인
 */
function checkMigrationStatus() {
  console.log('📊 마이그레이션 상태 확인 중...');
  
  try {
    const output = execSync('npx prisma migrate status', { 
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });
    console.log(output);
  } catch (error) {
    console.error('❌ 마이그레이션 상태 확인 실패:', error.message);
    // 상태 확인 실패는 치명적이지 않으므로 계속 진행
  }
}

/**
 * 데이터베이스 초기화 (개발 환경용)
 */
function resetDatabase() {
  console.log('🔄 데이터베이스 초기화 중...');
  
  if (process.env.NODE_ENV === 'production') {
    throw new Error('프로덕션 환경에서는 데이터베이스 초기화를 할 수 없습니다.');
  }

  try {
    execSync('npx prisma migrate reset --force', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log('✅ 데이터베이스 초기화 완료');
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 실패:', error.message);
    throw error;
  }
}

/**
 * 마이그레이션 백업 생성
 */
function backupDatabase() {
  console.log('💾 데이터베이스 백업 생성 중...');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = `backup_${timestamp}.sql`;
  
  try {
    // PostgreSQL 백업 명령어 (환경에 따라 조정 필요)
    const dbUrl = new URL(process.env.DATABASE_URL);
    const command = `pg_dump -h ${dbUrl.hostname} -p ${dbUrl.port} -U ${dbUrl.username} -d ${dbUrl.pathname.slice(1)} > ${backupFile}`;
    
    console.log(`백업 파일: ${backupFile}`);
    console.log('수동으로 백업을 생성하세요:', command);
  } catch (error) {
    console.warn('⚠️ 자동 백업 생성 실패. 수동으로 백업을 생성하세요.');
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'migrate';

  console.log('🗄️ 데이터베이스 마이그레이션 도구');
  console.log(`📅 실행 시간: ${new Date().toLocaleString()}`);
  console.log(`🌍 환경: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 명령어: ${command}\n`);

  try {
    switch (command) {
      case 'check':
        checkDatabaseConnection();
        validateSchema();
        checkMigrationStatus();
        break;

      case 'generate':
        const migrationName = args[1] || 'migration';
        checkDatabaseConnection();
        validateSchema();
        generateMigration(migrationName);
        break;

      case 'deploy':
        checkDatabaseConnection();
        runMigration();
        generateClient();
        checkMigrationStatus();
        break;

      case 'reset':
        if (process.env.NODE_ENV === 'production') {
          throw new Error('프로덕션 환경에서는 reset을 사용할 수 없습니다.');
        }
        resetDatabase();
        generateClient();
        break;

      case 'backup':
        checkDatabaseConnection();
        backupDatabase();
        break;

      case 'migrate':
      default:
        checkDatabaseConnection();
        validateSchema();
        runMigration();
        generateClient();
        checkMigrationStatus();
        break;
    }

    console.log('\n🎉 마이그레이션 작업 완료!');

  } catch (error) {
    console.error('\n❌ 마이그레이션 실패:', error.message);
    process.exit(1);
  }
}

// 사용법 출력
function printUsage() {
  console.log(`
사용법: node migrate.js [command] [options]

명령어:
  migrate (기본값)  - 마이그레이션 실행 및 클라이언트 생성
  check            - 데이터베이스 연결 및 스키마 검증
  generate [name]  - 마이그레이션 파일 생성
  deploy           - 마이그레이션 배포 (프로덕션용)
  reset            - 데이터베이스 초기화 (개발용)
  backup           - 데이터베이스 백업

예시:
  node migrate.js                    # 기본 마이그레이션 실행
  node migrate.js check              # 상태 확인
  node migrate.js generate add_users # 새 마이그레이션 생성
  node migrate.js deploy             # 프로덕션 배포
  node migrate.js reset              # 개발 DB 초기화
`);
}

// 도움말 요청 시
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  printUsage();
  process.exit(0);
}

// 스크립트 실행
main().catch(console.error);