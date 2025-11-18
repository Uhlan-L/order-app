# 커피 주문 앱 - 백엔드 서버

Express.js를 사용한 RESTful API 서버입니다.

## 개발 환경 설정

### 필수 요구사항
- Node.js 18.x 이상
- PostgreSQL (데이터베이스)
- npm 또는 yarn

### 설치 방법

1. **의존성 설치**:
```bash
npm install
```

2. **PostgreSQL 데이터베이스 생성**:

**방법 1 (권장)**: Node.js 스크립트 사용
```bash
npm run create-db
```

**방법 2**: psql 사용
```bash
psql -U postgres -c "CREATE DATABASE coffee_order_db;"
```

**방법 3**: pgAdmin 사용
- pgAdmin에서 Databases 우클릭 → Create → Database
- Database name: `coffee_order_db` 입력

자세한 내용은 `database/README.md`를 참고하세요.

3. **환경 변수 설정**:

`server` 폴더에 `.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=your_password
NODE_ENV=development
```

**중요**: `.env` 파일은 Git에 올라가지 않습니다. 각 개발자가 자신의 환경에 맞게 생성해야 합니다.

4. **개발 서버 실행**:
```bash
npm run dev
```

개발 서버는 `nodemon`을 사용하여 파일 변경 시 자동으로 재시작됩니다.

5. **프로덕션 서버 실행**:
```bash
npm start
```

## 프로젝트 구조

```
server/
├── server.js          # 메인 서버 파일
├── package.json       # 프로젝트 설정 및 의존성
├── env.example        # 환경 변수 예시 파일
├── .env               # 환경 변수 파일 (로컬에서 생성)
├── .gitignore         # Git 무시 파일
├── config/
│   └── db.js          # 데이터베이스 연결 설정
├── database/
│   ├── schema.sql     # 데이터베이스 스키마
│   ├── init.js        # 데이터베이스 초기화 및 시드
│   └── README.md      # 데이터베이스 설정 가이드
└── README.md          # 프로젝트 문서
```

## API 엔드포인트

### 메뉴 관련
- `GET /api/menus` - 메뉴 목록 조회
- `GET /api/menus/:menuId/options` - 메뉴별 옵션 조회

### 주문 관련
- `POST /api/orders` - 주문 생성
- `GET /api/orders/:orderId` - 주문 정보 조회

### 관리자 관련
- `GET /api/admin/dashboard` - 대시보드 통계 조회
- `GET /api/admin/inventory` - 재고 조회
- `PUT /api/admin/inventory/:menuId` - 재고 수정
- `GET /api/admin/orders` - 주문 목록 조회
- `PUT /api/admin/orders/:orderId/status` - 주문 상태 변경

## 환경 변수

`.env` 파일에서 다음 변수들을 설정할 수 있습니다:

- `PORT`: 서버 포트 (기본값: 5000)
- `DB_HOST`: 데이터베이스 호스트
- `DB_PORT`: 데이터베이스 포트
- `DB_NAME`: 데이터베이스 이름
- `DB_USER`: 데이터베이스 사용자
- `DB_PASSWORD`: 데이터베이스 비밀번호
- `NODE_ENV`: 환경 설정 (development/production)

## 개발 가이드

### 서버 실행 확인

서버가 정상적으로 실행되면 다음 URL에서 확인할 수 있습니다:
- http://localhost:5000

기본 라우트(`/`)에 접속하면 서버 상태를 확인할 수 있습니다.

### 데이터베이스 연결

서버를 실행하면 자동으로:
1. 데이터베이스 연결을 테스트합니다
2. 필요한 테이블이 없으면 자동으로 생성합니다

자세한 내용은 `database/README.md`를 참고하세요.

## 기술 스택

- **Express.js**: 웹 프레임워크
- **CORS**: Cross-Origin Resource Sharing 지원
- **dotenv**: 환경 변수 관리
- **pg**: PostgreSQL 클라이언트
- **nodemon**: 개발 시 자동 재시작

