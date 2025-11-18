# 개발 환경 설정 가이드

## 1. Node.js 설치

Vite와 React를 사용하기 위해서는 Node.js가 필요합니다.

### 설치 방법

1. **Node.js 공식 웹사이트 방문**
   - https://nodejs.org/ 접속
   - **LTS (Long Term Support)** 버전 다운로드 (권장)
   - 최소 버전: Node.js 18.x 이상

2. **설치 프로그램 실행**
   - 다운로드한 `.msi` 파일 실행
   - 설치 마법사를 따라 진행
   - **중요**: "Add to PATH" 옵션이 체크되어 있는지 확인

3. **설치 확인**
   - 터미널(또는 PowerShell)을 새로 열기
   - 다음 명령어로 확인:
   ```bash
   node --version
   npm --version
   ```
   - 버전 번호가 출력되면 설치 완료!

## 2. 프로젝트 설정

### 의존성 설치

UI 폴더로 이동한 후 의존성을 설치합니다:

```bash
cd UI
npm install
```

이 명령어는 `package.json`에 정의된 모든 패키지를 설치합니다:
- React 18
- React DOM
- Vite
- 기타 개발 도구들

### 개발 서버 실행

의존성 설치가 완료되면 개발 서버를 실행합니다:

```bash
npm run dev
```

서버가 실행되면 터미널에 다음과 같은 메시지가 표시됩니다:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

브라우저에서 `http://localhost:3000`으로 접속하면 앱을 확인할 수 있습니다.

## 3. 문제 해결

### Node.js가 인식되지 않는 경우

1. **터미널 재시작**: 설치 후 터미널을 완전히 닫고 다시 열기
2. **환경 변수 확인**: 시스템 환경 변수에 Node.js 경로가 추가되었는지 확인
3. **재부팅**: 필요시 컴퓨터 재부팅

### 포트가 이미 사용 중인 경우

다른 포트를 사용하려면 `vite.config.js` 파일에서 포트 번호를 변경하세요:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // 다른 포트 번호로 변경
    open: true
  }
})
```

### npm install 오류가 발생하는 경우

1. **인터넷 연결 확인**
2. **npm 캐시 정리**:
   ```bash
   npm cache clean --force
   ```
3. **다시 설치 시도**

## 4. 유용한 명령어

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드 생성
- `npm run preview`: 빌드 결과물 미리보기

