# Render.com 배포 완전 가이드

이 가이드는 커피 주문 앱을 Render.com에 배포하는 전체 과정을 단계별로 설명합니다.

## 📋 배포 순서

1. **PostgreSQL 데이터베이스 생성**
2. **백엔드 서버 배포**
3. **프론트엔드 배포**
4. **환경 변수 설정 및 연결**

---

## 1️⃣ PostgreSQL 데이터베이스 생성

### Step 1: Render 대시보드 접속

1. [Render.com](https://render.com)에 로그인
2. 대시보드에서 **New +** 버튼 클릭
3. 드롭다운에서 **PostgreSQL** 선택

### Step 2: 데이터베이스 설정

다음 정보를 입력:

- **Name**: `coffee-order-db` (원하는 이름)
- **Database**: `coffee_order_db` (자동 생성됨)
- **User**: 자동 생성됨
- **Region**: 
  - 한국: `Singapore` (가장 가까움)
  - 또는 `Oregon` (미국 서부)
- **PostgreSQL Version**: 최신 버전 (15 또는 16)
- **Plan**: 
  - **Free**: 테스트용 (90일 후 삭제될 수 있음)
  - **Starter ($7/월)**: 프로덕션 권장

### Step 3: 데이터베이스 생성

1. **Create Database** 버튼 클릭
2. 생성 완료까지 1-2분 대기

### Step 4: 데이터베이스 정보 확인

생성 후 데이터베이스 페이지에서:

1. **Connections** 탭 클릭
2. 다음 정보 확인:
   - **Internal Database URL**: 백엔드에서 사용 (같은 네트워크 내)
   - **External Database URL**: 로컬에서 접속 시 사용
   - **Host**, **Port**, **Database**, **User**, **Password**

**중요**: 이 정보를 복사해두세요!

---

## 2️⃣ 백엔드 서버 배포

### Step 1: GitHub 저장소 준비

1. 프로젝트를 GitHub에 푸시 (아직 안 했다면)
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. `.env` 파일은 **절대 커밋하지 않기** (이미 `.gitignore`에 포함됨)

### Step 2: Render에서 Web Service 생성

1. Render 대시보드에서 **New +** → **Web Service** 선택
2. **Connect account** 또는 **Connect repository** 클릭
3. GitHub 저장소 선택 및 권한 부여

### Step 3: Web Service 설정

다음 정보를 입력:

#### 기본 설정
- **Name**: `coffee-order-api` (원하는 이름)
- **Region**: 데이터베이스와 **같은 지역** 선택 (중요!)
- **Branch**: `main` (또는 기본 브랜치)
- **Root Directory**: `server` ⚠️ **중요!**

#### 빌드 및 실행 설정
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check Path**: `/health` (선택사항, 자동 감지됨)

#### 플랜
- **Free**: 테스트용 (15분 비활성 시 sleep)
- **Starter ($7/월)**: 프로덕션 권장

### Step 4: 환경 변수 설정

**Environment Variables** 섹션에서 다음 변수 추가:

#### 방법 1: DATABASE_URL 사용 (권장)

1. 데이터베이스 페이지에서 **Internal Database URL** 복사
2. 환경 변수 추가:
   ```
   Key: DATABASE_URL
   Value: postgresql://user:password@host:port/database
   ```

3. 추가 환경 변수:
   ```
   Key: NODE_ENV
   Value: production
   
   Key: PORT
   Value: 10000
   ```

#### 방법 2: 개별 환경 변수 사용

```
DB_HOST=your-db-host.onrender.com
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=your-db-user
DB_PASSWORD=your-db-password
NODE_ENV=production
PORT=10000
```

**참고**: `FRONTEND_URL`은 프론트엔드 배포 후 추가합니다.

### Step 5: 데이터베이스 연결

1. **Advanced** 섹션에서 **Add Database** 클릭
2. 생성한 PostgreSQL 데이터베이스 선택
3. 이렇게 하면 `DATABASE_URL`이 자동으로 설정됩니다!

### Step 6: 배포 시작

1. **Create Web Service** 버튼 클릭
2. 배포 로그 확인 (1-3분 소요)
3. 배포 완료 후 URL 확인 (예: `https://coffee-order-api.onrender.com`)

### Step 7: 배포 확인

1. 제공된 URL 접속 (예: `https://coffee-order-api.onrender.com`)
2. 다음 메시지가 보이면 성공:
   ```json
   {
     "message": "커피 주문 앱 API 서버",
     "version": "1.0.0",
     "status": "running"
   }
   ```

3. API 테스트:
   - `https://coffee-order-api.onrender.com/api/menus` 접속
   - 메뉴 목록이 보이면 정상 작동

---

## 3️⃣ 프론트엔드 배포

### Step 1: Static Site 생성

1. Render 대시보드에서 **New +** → **Static Site** 선택
2. GitHub 저장소 연결 (백엔드와 같은 저장소)

### Step 2: Static Site 설정

다음 정보를 입력:

#### 기본 설정
- **Name**: `coffee-order-app` (원하는 이름)
- **Branch**: `main` (또는 기본 브랜치)
- **Root Directory**: `UI` ⚠️ **중요!**

#### 빌드 설정
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

#### 플랜
- **Free**: 무료 (충분함)

### Step 3: 환경 변수 설정

**Environment Variables** 섹션에서:

```
Key: VITE_API_URL
Value: https://coffee-order-api.onrender.com/api
```

**중요**: 백엔드 URL을 실제 배포된 URL로 변경하세요!

### Step 4: 배포 시작

1. **Create Static Site** 버튼 클릭
2. 빌드 로그 확인 (2-5분 소요)
3. 배포 완료 후 URL 확인 (예: `https://coffee-order-app.onrender.com`)

### Step 5: 배포 확인

1. 제공된 URL 접속
2. 메뉴 목록이 표시되면 성공!

---

## 4️⃣ 환경 변수 연결 및 최종 설정

### Step 1: 백엔드에 프론트엔드 URL 추가

1. 백엔드 Web Service 페이지로 이동
2. **Environment** 탭 클릭
3. 환경 변수 추가:
   ```
   Key: FRONTEND_URL
   Value: https://coffee-order-app.onrender.com
   ```
4. **Save Changes** 클릭
5. 자동으로 재배포됨

### Step 2: 데이터베이스 스키마 생성

#### 방법 1: 서버 자동 생성 (권장)

백엔드 서버가 시작되면 자동으로 스키마가 생성됩니다.
로그에서 다음 메시지 확인:
```
데이터베이스 스키마가 성공적으로 생성되었습니다.
```

#### 방법 2: 수동 생성

로컬에서 Render 데이터베이스에 연결하여 스키마 생성:

1. `.env` 파일 설정:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   NODE_ENV=production
   ```

2. 스키마 생성:
   ```bash
   cd server
   npm run init-render -- --seed
   ```

---

## 5️⃣ 최종 테스트

### 테스트 체크리스트

- [ ] 프론트엔드 접속 가능
- [ ] 메뉴 목록 표시
- [ ] 주문 기능 작동
- [ ] 관리자 페이지 접속
- [ ] 재고 관리 작동
- [ ] 주문 상태 변경 작동

### 문제 해결

#### CORS 오류
- 백엔드의 `FRONTEND_URL` 환경 변수 확인
- 프론트엔드의 `VITE_API_URL` 확인

#### 데이터베이스 연결 오류
- `DATABASE_URL` 또는 개별 환경 변수 확인
- 데이터베이스와 백엔드가 같은 지역인지 확인

#### 404 오류
- `Root Directory` 설정 확인 (`server`, `UI`)
- 빌드 로그 확인

---

## 6️⃣ 무료 플랜 제한사항

### Free 플랜 특징

1. **Sleep Mode**
   - 15분간 요청이 없으면 서비스가 잠듦
   - 첫 요청 시 깨어나는 데 30초~1분 소요
   - 해결: 유료 플랜 사용 또는 Keep-alive 서비스 사용

2. **데이터베이스**
   - 90일 후 삭제될 수 있음
   - 해결: 정기적으로 백업 또는 유료 플랜 사용

3. **빌드 시간**
   - 무료 플랜은 빌드 시간 제한이 있음

### 프로덕션 권장사항

- **Starter 플랜 ($7/월)**: 항상 실행, 더 빠른 응답
- **데이터베이스 백업**: 정기적으로 백업
- **모니터링**: 로그 확인 및 에러 추적

---

## 7️⃣ 배포 후 관리

### 로그 확인

1. 각 서비스 페이지에서 **Logs** 탭 클릭
2. 실시간 로그 확인
3. 에러 발생 시 로그 확인

### 환경 변수 수정

1. 서비스 페이지 → **Environment** 탭
2. 변수 추가/수정
3. **Save Changes** → 자동 재배포

### 재배포

1. **Manual Deploy** → **Deploy latest commit**
2. 또는 GitHub에 푸시하면 자동 재배포

### 서비스 삭제

1. 서비스 페이지 → **Settings** → **Delete Service**
2. 주의: 데이터베이스 삭제 시 모든 데이터 손실!

---

## 📝 요약

### 배포 순서
1. ✅ PostgreSQL 데이터베이스 생성
2. ✅ 백엔드 Web Service 배포
3. ✅ 프론트엔드 Static Site 배포
4. ✅ 환경 변수 연결
5. ✅ 테스트

### 중요한 설정
- **Root Directory**: `server`, `UI`
- **DATABASE_URL**: Internal Database URL 사용
- **FRONTEND_URL**: 백엔드에 프론트엔드 URL 추가
- **VITE_API_URL**: 프론트엔드에 백엔드 URL 추가

### 배포 URL 예시
- 백엔드: `https://coffee-order-api.onrender.com`
- 프론트엔드: `https://coffee-order-app.onrender.com`
- API 엔드포인트: `https://coffee-order-api.onrender.com/api`

---

## 🆘 문제 해결

### 자주 발생하는 오류

1. **"Root Directory not found"**
   - `Root Directory` 설정 확인
   - GitHub 저장소 구조 확인

2. **"Database connection failed"**
   - `DATABASE_URL` 확인
   - 데이터베이스와 백엔드가 같은 지역인지 확인

3. **"CORS error"**
   - `FRONTEND_URL` 환경 변수 확인
   - 프론트엔드 URL이 정확한지 확인

4. **"Build failed"**
   - 빌드 로그 확인
   - `package.json`의 스크립트 확인

---

## 📚 추가 자료

- [Render 공식 문서](https://render.com/docs)
- [PostgreSQL on Render](https://render.com/docs/databases)
- [Node.js on Render](https://render.com/docs/node)

---

**배포 성공을 기원합니다! 🚀**

