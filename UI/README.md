# COZY 커피 주문 앱 - 프론트엔드

Vite + React + JavaScript로 개발된 커피 주문 앱의 프론트엔드입니다.

## 개발 환경 설정

### 필수 요구사항
- Node.js 18.x 이상
- npm 또는 yarn

> 📖 **상세한 설치 가이드**: [SETUP.md](./SETUP.md) 파일을 참고하세요.

### 빠른 시작

1. **Node.js 설치 확인**:
```bash
node --version
npm --version
```
버전이 출력되지 않으면 [Node.js 공식 사이트](https://nodejs.org/)에서 설치하세요.

2. **의존성 설치**:
```bash
npm install
```

3. **개발 서버 실행**:
```bash
npm run dev
```

개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

### 환경 확인

설치가 제대로 되었는지 확인하려면:
```bash
node check-setup.js
```

### 빌드

프로덕션 빌드:
```bash
npm run build
```

빌드 결과물 미리보기:
```bash
npm run preview
```

## 프로젝트 구조

```
UI/
├── public/          # 정적 파일
├── src/            # 소스 코드
│   ├── App.jsx     # 메인 앱 컴포넌트
│   ├── App.css     # 앱 스타일
│   ├── main.jsx    # 진입점
│   └── index.css   # 전역 스타일
├── index.html      # HTML 템플릿
├── vite.config.js  # Vite 설정
└── package.json    # 프로젝트 설정
```

## 기술 스택

- **React 18**: UI 라이브러리
- **Vite**: 빌드 도구 및 개발 서버
- **JavaScript**: 프로그래밍 언어

