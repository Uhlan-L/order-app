# Render.com 배포 가이드

이 문서는 커피 주문 앱을 Render.com에 배포하는 방법을 설명합니다.

## 배포 순서

1. **PostgreSQL 데이터베이스 생성**
2. **백엔드 서버 배포**
3. **프론트엔드 배포**

---

## 1. PostgreSQL 데이터베이스 생성

### 1.1 Render 대시보드에서 데이터베이스 생성

1. Render.com에 로그인
2. **New +** 버튼 클릭 → **PostgreSQL** 선택
3. 설정:
   - **Name**: `coffee-order-db` (또는 원하는 이름)
   - **Database**: `coffee_order_db`
   - **User**: 자동 생성됨
   - **Region**: 가장 가까운 지역 선택
   - **PostgreSQL Version**: 최신 버전 선택
   - **Plan**: Free 플랜 선택 (또는 유료 플랜)
4. **Create Database** 클릭

### 1.2 데이터베이스 정보 확인

생성 후 **Connections** 탭에서 다음 정보를 확인:
- **Internal Database URL**: 백엔드에서 사용
- **External Database URL**: 로컬에서 접속 시 사용
- **Host**, **Port**, **Database**, **User**, **Password** 정보 확인

---

## 2. 백엔드 서버 배포

### 2.1 GitHub 저장소 준비

1. 프로젝트를 GitHub에 푸시 (이미 되어 있다면 생략)
2. `.env` 파일은 **절대 커밋하지 않기** (이미 `.gitignore`에 포함됨)

### 2.2 Render에서 Web Service 생성

1. Render 대시보드에서 **New +** → **Web Service** 선택
2. GitHub 저장소 연결
3. 설정:
   - **Name**: `coffee-order-api` (또는 원하는 이름)
   - **Region**: 데이터베이스와 같은 지역 선택
   - **Branch**: `main` (또는 기본 브랜치)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free 플랜 선택

### 2.3 환경 변수 설정

**Environment Variables** 섹션에서 다음 변수들을 추가:

```
PORT=10000
DB_HOST=<데이터베이스 호스트>
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=<데이터베이스 사용자>
DB_PASSWORD=<데이터베이스 비밀번호>
NODE_ENV=production
```

**참고**: 
- Render의 PostgreSQL은 **Internal Database URL**을 제공합니다.
- Internal Database URL 형식: `postgresql://user:password@host:port/database`
- 이 URL을 파싱하여 각 변수에 입력하거나, URL 전체를 사용할 수 있습니다.

**더 쉬운 방법**: Internal Database URL을 직접 사용하도록 코드 수정 (아래 참고)

### 2.4 데이터베이스 연결 수정 (선택사항)

Render의 Internal Database URL을 직접 사용하려면 `server/config/db.js`를 수정:

```javascript
// Internal Database URL 사용
const connectionString = process.env.DATABASE_URL || 
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
  connectionString: connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // ... 기타 설정
});
```

### 2.5 배포 확인

1. **Create Web Service** 클릭
2. 배포 로그 확인
3. 배포 완료 후 제공되는 URL 확인 (예: `https://coffee-order-api.onrender.com`)

---

## 3. 프론트엔드 배포

### 3.1 환경 변수 파일 생성

`UI` 폴더에 `.env.production` 파일 생성 (Git에 커밋 가능):

```env
VITE_API_URL=https://coffee-order-api.onrender.com/api
```

**참고**: 백엔드 URL을 실제 배포된 URL로 변경하세요.

### 3.2 Render에서 Static Site 생성

1. Render 대시보드에서 **New +** → **Static Site** 선택
2. GitHub 저장소 연결
3. 설정:
   - **Name**: `coffee-order-app` (또는 원하는 이름)
   - **Branch**: `main` (또는 기본 브랜치)
   - **Root Directory**: `UI`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free 플랜 선택

### 3.3 환경 변수 설정

**Environment Variables** 섹션에서:

```
VITE_API_URL=https://coffee-order-api.onrender.com/api
```

### 3.4 배포 확인

1. **Create Static Site** 클릭
2. 빌드 로그 확인
3. 배포 완료 후 제공되는 URL 확인 (예: `https://coffee-order-app.onrender.com`)

---

## 4. 배포 후 확인 사항

### 4.1 데이터베이스 초기화

1. 백엔드 서버가 실행되면 자동으로 스키마가 생성됩니다.
2. 초기 데이터(메뉴, 옵션)도 자동으로 삽입됩니다.

### 4.2 CORS 설정 확인

백엔드 서버의 CORS 설정이 프론트엔드 URL을 허용하는지 확인:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://coffee-order-app.onrender.com' // 프론트엔드 URL
  ],
  credentials: true
}));
```

### 4.3 테스트

1. 프론트엔드 URL 접속
2. 메뉴 목록이 표시되는지 확인
3. 주문 기능 테스트
4. 관리자 페이지 테스트

---

## 5. 문제 해결

### 5.1 데이터베이스 연결 오류

- 환경 변수가 올바르게 설정되었는지 확인
- Internal Database URL 사용 시 SSL 설정 확인
- 데이터베이스가 같은 지역에 있는지 확인

### 5.2 CORS 오류

- 백엔드 CORS 설정에 프론트엔드 URL이 포함되어 있는지 확인
- 프론트엔드의 API URL이 올바른지 확인

### 5.3 빌드 오류

- `package.json`의 스크립트가 올바른지 확인
- Node.js 버전 확인 (Render는 자동으로 감지)

### 5.4 무료 플랜 제한사항

- **Sleep Mode**: 15분간 요청이 없으면 서비스가 잠들 수 있음
- 첫 요청 시 깨어나는 데 시간이 걸릴 수 있음
- 프로덕션 환경에서는 유료 플랜 사용 권장

---

## 6. 추가 최적화

### 6.1 Health Check 엔드포인트

백엔드에 헬스 체크 엔드포인트 추가:

```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

### 6.2 환경별 설정

- 개발: 로컬 환경
- 프로덕션: Render 환경
- 환경 변수로 구분

---

## 7. 배포 체크리스트

- [ ] PostgreSQL 데이터베이스 생성 완료
- [ ] 백엔드 환경 변수 설정 완료
- [ ] 백엔드 배포 완료 및 URL 확인
- [ ] 프론트엔드 환경 변수 설정 완료 (API URL)
- [ ] 프론트엔드 배포 완료 및 URL 확인
- [ ] CORS 설정 확인
- [ ] 데이터베이스 스키마 생성 확인
- [ ] 기능 테스트 완료

---

## 참고 자료

- [Render.com 공식 문서](https://render.com/docs)
- [PostgreSQL on Render](https://render.com/docs/databases)
- [Node.js on Render](https://render.com/docs/node)

