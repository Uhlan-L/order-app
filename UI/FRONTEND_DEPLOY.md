# 프론트엔드 Render 배포 가이드

이 문서는 UI 폴더의 React 프론트엔드를 Render.com에 배포하는 방법을 설명합니다.

## 📋 배포 전 확인 사항

### 1. 백엔드 서버 배포 완료
- 백엔드 서버가 Render에 배포되어 있어야 합니다
- 백엔드 URL을 확인하세요 (예: `https://coffee-order-api.onrender.com`)

### 2. 코드 확인
- ✅ `UI/src/utils/api.js`에서 API URL이 환경 변수로 설정되어 있음
- ✅ `UI/vite.config.js`에 빌드 설정이 있음
- ✅ `UI/package.json`에 빌드 스크립트가 있음

---

## 🔧 코드 수정 사항

### 이미 완료된 수정사항

1. **API URL 환경 변수화** (`UI/src/utils/api.js`)
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
   ```
   - 환경 변수 `VITE_API_URL`을 사용하도록 설정됨

2. **빌드 설정** (`UI/vite.config.js`)
   - 빌드 최적화 설정 추가
   - 출력 디렉토리: `dist`

---

## 🚀 Render 배포 과정

### Step 1: GitHub 저장소 준비

1. 변경사항 커밋 및 푸시
   ```bash
   git add .
   git commit -m "Prepare frontend for deployment"
   git push origin main
   ```

### Step 2: Render에서 Static Site 생성

1. **Render 대시보드 접속**
   - [Render.com](https://render.com)에 로그인

2. **Static Site 생성**
   - **New +** 버튼 클릭
   - **Static Site** 선택

3. **GitHub 저장소 연결**
   - **Connect account** 또는 **Connect repository** 클릭
   - GitHub 저장소 선택 및 권한 부여

### Step 3: Static Site 설정

#### 기본 설정
- **Name**: `coffee-order-app` (원하는 이름)
- **Branch**: `main` (또는 기본 브랜치)
- **Root Directory**: `UI` ⚠️ **중요!**

#### 빌드 설정
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

#### 플랜
- **Free**: 무료 (충분함)

### Step 4: 환경 변수 설정

**Environment Variables** 섹션에서 다음 변수 추가:

```
Key: VITE_API_URL
Value: https://your-backend-api.onrender.com/api
```

**중요**: 
- `your-backend-api.onrender.com`을 실제 백엔드 URL로 변경하세요
- 예: `https://coffee-order-api.onrender.com/api`

### Step 5: 배포 시작

1. **Create Static Site** 버튼 클릭
2. 빌드 로그 확인 (2-5분 소요)
3. 배포 완료 후 URL 확인 (예: `https://coffee-order-app.onrender.com`)

---

## ✅ 배포 확인

### 1. 배포 상태 확인
- Render 대시보드에서 서비스 상태가 **Live**인지 확인
- 빌드 로그에서 에러가 없는지 확인

### 2. 프론트엔드 접속 테스트
- 제공된 URL 접속 (예: `https://coffee-order-app.onrender.com`)
- 메뉴 목록이 표시되는지 확인

### 3. API 연결 테스트
- 브라우저 개발자 도구 (F12) → Network 탭
- API 요청이 정상적으로 전송되는지 확인
- CORS 오류가 없는지 확인

### 4. 기능 테스트
- [ ] 메뉴 목록 표시
- [ ] 장바구니 추가
- [ ] 주문 생성
- [ ] 관리자 페이지 접속
- [ ] 재고 관리
- [ ] 주문 상태 변경

---

## 🔄 백엔드 CORS 설정 확인

프론트엔드 배포 후 백엔드의 CORS 설정을 확인하세요:

1. 백엔드 서비스 페이지로 이동
2. **Environment** 탭 클릭
3. 다음 환경 변수 추가/수정:
   ```
   Key: FRONTEND_URL
   Value: https://coffee-order-app.onrender.com
   ```
4. **Save Changes** 클릭 (자동 재배포)

---

## 🐛 문제 해결

### 빌드 오류

**증상**: 빌드가 실패함

**해결 방법**:
1. 빌드 로그 확인
2. `package.json`의 스크립트 확인
3. `Root Directory`가 `UI`로 설정되어 있는지 확인
4. `Build Command`가 `npm install && npm run build`인지 확인

### API 연결 오류

**증상**: API 요청이 실패함 (CORS 오류 또는 404)

**해결 방법**:
1. `VITE_API_URL` 환경 변수가 올바른지 확인
2. 백엔드 URL이 정확한지 확인 (끝에 `/api` 포함)
3. 백엔드의 `FRONTEND_URL` 환경 변수 확인
4. 브라우저 개발자 도구에서 네트워크 요청 확인

### 빈 화면 표시

**증상**: 페이지가 로드되지만 아무것도 표시되지 않음

**해결 방법**:
1. 브라우저 개발자 도구 → Console 탭에서 에러 확인
2. API 연결 확인
3. 빌드 로그에서 경고 확인

### 404 오류

**증상**: 페이지를 찾을 수 없음

**해결 방법**:
1. `Publish Directory`가 `dist`로 설정되어 있는지 확인
2. 빌드가 성공적으로 완료되었는지 확인
3. `dist` 폴더에 파일이 생성되었는지 확인

---

## 📝 배포 체크리스트

- [ ] GitHub에 코드 푸시 완료
- [ ] 백엔드 서버 배포 완료 및 URL 확인
- [ ] Render에서 Static Site 생성
- [ ] Root Directory: `UI` 설정
- [ ] Build Command: `npm install && npm run build` 설정
- [ ] Publish Directory: `dist` 설정
- [ ] 환경 변수 `VITE_API_URL` 설정 (백엔드 URL)
- [ ] 배포 완료 및 URL 확인
- [ ] 프론트엔드 접속 테스트
- [ ] API 연결 테스트
- [ ] 백엔드에 `FRONTEND_URL` 환경 변수 추가
- [ ] 전체 기능 테스트

---

## 🔄 재배포

코드를 수정한 후 재배포:

1. **자동 재배포** (권장)
   - GitHub에 푸시하면 자동으로 재배포됨

2. **수동 재배포**
   - Render 대시보드 → **Manual Deploy** → **Deploy latest commit**

---

## 📚 참고 자료

- [Vite 공식 문서](https://vitejs.dev/)
- [Render Static Sites](https://render.com/docs/static-sites)
- [Environment Variables in Vite](https://vitejs.dev/guide/env-and-mode.html)

---

**배포 성공을 기원합니다! 🚀**

