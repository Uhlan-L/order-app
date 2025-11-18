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

const { Pool } = pkg;

// Render.com의 Internal Database URL 지원
// DATABASE_URL이 있으면 사용, 없으면 개별 환경 변수 사용
let poolConfig;

if (process.env.DATABASE_URL) {
  // Render.com의 Internal Database URL 사용
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
} else {
  // 개별 환경 변수 사용 (로컬 개발)
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'coffee_order_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
}

// 데이터베이스 연결 풀 생성
const pool = new Pool(poolConfig);

// 연결 테스트
pool.on('connect', () => {
  console.log('데이터베이스에 연결되었습니다.');
});

pool.on('error', (err) => {
  console.error('데이터베이스 연결 오류:', err);
});

// 데이터베이스 연결 테스트 함수
export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('데이터베이스 연결 성공:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error.message);
    return false;
  }
};

export default pool;

