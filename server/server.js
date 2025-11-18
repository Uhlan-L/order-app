import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';
import { initDatabase, seedDatabase } from './database/init.js';
import menusRouter from './routes/menus.js';
import ordersRouter from './routes/orders.js';
import adminRouter from './routes/admin.js';

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL // 환경 변수로 프론트엔드 URL 설정
].filter(Boolean); // undefined 제거

app.use(cors({
  origin: (origin, callback) => {
    // 개발 환경에서는 모든 origin 허용, 프로덕션에서는 지정된 origin만 허용
    if (process.env.NODE_ENV === 'development' || !origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
})); // CORS 설정 (프론트엔드와 통신을 위해)
app.use(express.json()); // JSON 요청 본문 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 요청 본문 파싱

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: '커피 주문 앱 API 서버',
    version: '1.0.0',
    status: 'running'
  });
});

// API 라우트
app.use('/api/menus', menusRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: '요청한 리소스를 찾을 수 없습니다.'
    }
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('에러 발생:', err);
  res.status(err.status || 500).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || '서버 내부 오류가 발생했습니다.'
    }
  });
});

// 서버 시작
const startServer = async () => {
  try {
    // 데이터베이스 연결 테스트
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('데이터베이스 연결에 실패했습니다. 서버를 시작할 수 없습니다.');
      process.exit(1);
    }

    // 데이터베이스 스키마 초기화
    await initDatabase();
    
    // 초기 데이터 삽입 (처음 한 번만 실행)
    // 주의: 프로덕션에서는 이미 데이터가 있을 수 있으므로 주석 처리하거나 조건부로 실행
    if (process.env.NODE_ENV !== 'production' || process.env.SEED_DATA === 'true') {
      await seedDatabase();
    }

    // 서버 시작
    app.listen(PORT, () => {
      console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
      console.log(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
};

startServer();

export default app;

