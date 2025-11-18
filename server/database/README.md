# 데이터베이스 설정 가이드

## 1. PostgreSQL 데이터베이스 생성

### 방법 1: Node.js 스크립트 사용 (권장)

가장 간단한 방법입니다. `.env` 파일이 설정되어 있다면:

```bash
npm run create-db
```

이 명령어는 자동으로 데이터베이스를 생성합니다.

### 방법 2: psql 사용

PostgreSQL의 `psql` 명령어를 사용할 수 있다면:

```bash
psql -U postgres -c "CREATE DATABASE coffee_order_db;"
```

또는 psql에 접속한 후:
```sql
CREATE DATABASE coffee_order_db;
```

### 방법 3: pgAdmin 사용

pgAdmin을 사용하는 경우:
1. pgAdmin 실행
2. 서버 연결
3. Databases 우클릭 → Create → Database
4. Database name: `coffee_order_db` 입력
5. Save 클릭

### 방법 4: PostgreSQL bin 디렉토리를 PATH에 추가

`createdb` 명령어를 사용하려면 PostgreSQL의 bin 디렉토리를 PATH에 추가해야 합니다:

1. PostgreSQL 설치 경로 확인 (보통 `C:\Program Files\PostgreSQL\15\bin`)
2. 시스템 환경 변수 PATH에 추가
3. 터미널 재시작 후 `createdb coffee_order_db` 실행

## 2. 환경 변수 설정

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

**중요**: 
- `.env` 파일에서는 **따옴표 없이** 값만 입력하세요.
  - ✅ 올바른 예: `DB_PASSWORD=1234`
  - ❌ 잘못된 예: `DB_PASSWORD="1234"` 또는 `DB_PASSWORD='1234'`
- `.env` 파일은 Git에 올라가지 않습니다 (`.gitignore`에 포함됨)
- 각 개발자가 자신의 환경에 맞게 `.env` 파일을 생성해야 합니다

## 3. 데이터베이스 스키마 생성

서버를 실행하면 자동으로 스키마가 생성됩니다. 

또는 수동으로 생성하려면:
```bash
psql -U postgres -d coffee_order_db -f database/schema.sql
```

## 4. 초기 데이터 삽입 (선택사항)

`server.js` 파일에서 `seedDatabase()` 함수 호출의 주석을 해제하면 초기 메뉴 및 옵션 데이터가 자동으로 삽입됩니다.

## 5. 연결 확인

서버를 실행하면 자동으로 데이터베이스 연결을 테스트합니다. 
성공 메시지가 표시되면 정상적으로 연결된 것입니다.

## 문제 해결

### 비밀번호 인증 오류가 발생하는 경우

**증상**: `password authentication failed` 오류

**해결 방법**:

1. **연결 테스트 먼저 실행**:
```bash
npm run check-db
```
이 명령어로 PostgreSQL 연결을 테스트할 수 있습니다.

2. **.env 파일 확인**:
   - `server` 폴더에 `.env` 파일이 있는지 확인
   - `DB_PASSWORD`가 올바른지 확인
   - PostgreSQL 설치 시 설정한 비밀번호를 사용해야 합니다

3. **비밀번호 확인 방법**:
   - pgAdmin을 열어 서버 연결 시 사용하는 비밀번호 확인
   - 또는 PostgreSQL 설치 시 설정한 비밀번호 확인

4. **.env 파일 예시**:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=실제_비밀번호_입력  # 여기에 올바른 비밀번호 입력
```

### 연결 오류가 발생하는 경우

1. **PostgreSQL 서비스 확인**:
```bash
# Windows PowerShell
Get-Service postgresql*

# PostgreSQL 서비스 시작
Start-Service postgresql-x64-15  # 버전에 따라 다를 수 있음
```

2. **.env 파일 확인**:
   - 파일이 `server` 폴더에 있는지 확인
   - 모든 설정 값이 올바른지 확인

3. **연결 테스트**:
```bash
npm run check-db
```

