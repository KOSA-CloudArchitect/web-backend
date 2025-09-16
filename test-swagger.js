const { specs } = require('./config/swagger');
const SwaggerParser = require('swagger-parser');

async function validateSwagger() {
  try {
    console.log('🔍 Swagger 스펙 검증 시작...\n');
    
    // 기본 정보 출력
    console.log('📋 기본 정보:');
    console.log('- OpenAPI 버전:', specs.openapi);
    console.log('- API 제목:', specs.info.title);
    console.log('- API 버전:', specs.info.version);
    console.log('- 서버 수:', specs.servers.length);
    console.log('- 스키마 수:', Object.keys(specs.components.schemas).length);

    // 경로 정보 출력
    if (specs.paths) {
      console.log('- 등록된 경로 수:', Object.keys(specs.paths).length);
      console.log('\n📍 등록된 경로들:');
      Object.keys(specs.paths).forEach(path => {
        const methods = Object.keys(specs.paths[path]);
        console.log(`  ${path} [${methods.join(', ').toUpperCase()}]`);
      });
    } else {
      console.log('- 경로 정보가 없습니다. 라우트 파일들을 확인해주세요.');
    }

    // Swagger 스펙 유효성 검사
    console.log('\n🔍 스펙 유효성 검사 중...');
    const api = await SwaggerParser.validate(specs);
    
    console.log('\n✅ Swagger 스펙 검증 완료!');
    console.log(`📊 총 ${Object.keys(api.paths).length}개의 엔드포인트가 정의되었습니다.`);
    
    // 태그별 엔드포인트 수 계산
    const tagCounts = {};
    Object.values(api.paths).forEach(pathItem => {
      Object.values(pathItem).forEach(operation => {
        if (operation.tags) {
          operation.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });
    });
    
    if (Object.keys(tagCounts).length > 0) {
      console.log('\n🏷️  태그별 엔드포인트 수:');
      Object.entries(tagCounts).forEach(([tag, count]) => {
        console.log(`  - ${tag}: ${count}개`);
      });
    }

    return true;
  } catch (error) {
    console.error('\n❌ Swagger 스펙 검증 실패:');
    console.error(error.message);
    
    if (error.details) {
      console.error('\n📝 상세 오류:');
      error.details.forEach((detail, index) => {
        console.error(`  ${index + 1}. ${detail.message}`);
        if (detail.path) {
          console.error(`     경로: ${detail.path}`);
        }
      });
    }
    
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  validateSwagger();
}

module.exports = { validateSwagger };