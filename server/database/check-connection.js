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
  console.warn('⚠️  .env 파일을 찾을 수 없습니다.');
}

const { Client } = pkg;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

async function checkConnection() {
  const client = new Client(dbConfig);
  
  try {
    console.log('PostgreSQL 연결 테스트 중...');
    console.log(`호스트: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`사용자: ${dbConfig.user}`);
    console.log('');
    
    await client.connect();
    const result = await client.query('SELECT NOW()');
    
    console.log('✅ 연결 성공!');
    console.log('서버 시간:', result.rows[0].now);
    
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 연결 실패!\n');
    
    if (error.code === '28P01') {
      console.error('비밀번호 인증 실패');
      console.error('해결 방법: .env 파일의 DB_PASSWORD를 올바른 비밀번호로 수정하세요.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('연결 거부됨 - PostgreSQL 서버가 실행 중인지 확인하세요.');
    } else {
      console.error('오류:', error.message);
    }
    
    await client.end().catch(() => {});
    process.exit(1);
  }
}

checkConnection();

