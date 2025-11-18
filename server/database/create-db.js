import pkg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env 파일 경로 확인
const envPath = join(__dirname, '..', '.env');
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn('⚠️  .env 파일을 찾을 수 없습니다. env.example을 참고하여 .env 파일을 생성하세요.');
  console.warn('   Copy-Item env.example .env');
}

const { Client } = pkg;

// 환경 변수 확인
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: 'postgres', // 기본 데이터베이스
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

const dbName = process.env.DB_NAME || 'coffee_order_db';

// 설정 정보 출력
console.log('데이터베이스 연결 설정:');
console.log(`  호스트: ${dbConfig.host}`);
console.log(`  포트: ${dbConfig.port}`);
console.log(`  사용자: ${dbConfig.user}`);
console.log(`  데이터베이스 이름: ${dbName}`);
console.log(`  비밀번호: ${dbConfig.password ? '***' : '(설정되지 않음)'}`);
console.log('');

async function createDatabase() {
  const adminClient = new Client(dbConfig);
  
  try {
    // postgres 데이터베이스에 연결
    console.log('PostgreSQL에 연결 중...');
    await adminClient.connect();
    console.log('✅ PostgreSQL에 연결되었습니다.\n');

    // 데이터베이스 존재 여부 확인
    const checkDbQuery = `
      SELECT 1 FROM pg_database WHERE datname = $1
    `;
    const dbExists = await adminClient.query(checkDbQuery, [dbName]);

    if (dbExists.rows.length > 0) {
      console.log(`ℹ️  데이터베이스 '${dbName}'가 이미 존재합니다.`);
    } else {
      // 데이터베이스 생성
      console.log(`데이터베이스 '${dbName}' 생성 중...`);
      await adminClient.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ 데이터베이스 '${dbName}'가 성공적으로 생성되었습니다.`);
    }

    await adminClient.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 데이터베이스 생성 실패!\n');
    
    if (error.code === '28P01') {
      console.error('비밀번호 인증 실패:');
      console.error('  - .env 파일의 DB_PASSWORD가 올바른지 확인하세요.');
      console.error('  - PostgreSQL 설치 시 설정한 비밀번호를 사용하세요.');
      console.error('\n해결 방법:');
      console.error('  1. .env 파일을 열어 DB_PASSWORD를 확인/수정하세요.');
      console.error('  2. 또는 pgAdmin에서 서버 비밀번호를 확인하세요.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('연결 거부됨:');
      console.error('  - PostgreSQL 서버가 실행 중인지 확인하세요.');
      console.error('  - .env 파일의 DB_HOST와 DB_PORT가 올바른지 확인하세요.');
    } else if (error.code === '3D000') {
      console.error('데이터베이스 연결 오류:');
      console.error('  - postgres 데이터베이스에 접근할 수 없습니다.');
    } else {
      console.error('오류 코드:', error.code);
      console.error('오류 메시지:', error.message);
    }
    
    console.error('\n현재 설정:');
    console.error(`  DB_HOST: ${dbConfig.host}`);
    console.error(`  DB_PORT: ${dbConfig.port}`);
    console.error(`  DB_USER: ${dbConfig.user}`);
    console.error(`  DB_PASSWORD: ${dbConfig.password ? '설정됨' : '설정되지 않음'}`);
    
    try {
      await adminClient.end();
    } catch (e) {
      // 연결이 안 된 경우 무시
    }
    process.exit(1);
  }
}

createDatabase();

