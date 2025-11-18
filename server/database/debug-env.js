import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env 파일 경로
const envPath = join(__dirname, '..', '.env');
const envExamplePath = join(__dirname, '..', 'env.example');

console.log('=== .env 파일 진단 ===\n');

// .env 파일 존재 여부 확인
console.log('1. .env 파일 경로:', envPath);
console.log('   존재 여부:', existsSync(envPath) ? '✅ 있음' : '❌ 없음');

if (existsSync(envPath)) {
  // .env 파일 내용 읽기 (비밀번호는 마스킹)
  const envContent = readFileSync(envPath, 'utf8');
  console.log('\n2. .env 파일 내용:');
  console.log('---');
  const lines = envContent.split('\n');
  lines.forEach((line, index) => {
    if (line.trim() && !line.trim().startsWith('#')) {
      if (line.includes('PASSWORD')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        console.log(`${index + 1}. ${key.trim()}=${value ? '***' : '(비어있음)'}`);
      } else {
        console.log(`${index + 1}. ${line.trim()}`);
      }
    }
  });
  console.log('---');
  
  // 환경 변수 로드
  dotenv.config({ path: envPath });
} else {
  console.log('\n⚠️  .env 파일이 없습니다!');
  console.log('   env.example 파일을 복사하여 .env 파일을 생성하세요:');
  console.log('   Copy-Item env.example .env');
  
  if (existsSync(envExamplePath)) {
    console.log('\n   env.example 파일 내용:');
    const exampleContent = readFileSync(envExamplePath, 'utf8');
    console.log(exampleContent);
  }
}

console.log('\n3. 로드된 환경 변수:');
console.log('   DB_HOST:', process.env.DB_HOST || '(설정되지 않음)');
console.log('   DB_PORT:', process.env.DB_PORT || '(설정되지 않음)');
console.log('   DB_NAME:', process.env.DB_NAME || '(설정되지 않음)');
console.log('   DB_USER:', process.env.DB_USER || '(설정되지 않음)');
console.log('   DB_PASSWORD:', process.env.DB_PASSWORD ? `"${process.env.DB_PASSWORD}" (길이: ${process.env.DB_PASSWORD.length})` : '(설정되지 않음)');

// 비밀번호 검증
if (process.env.DB_PASSWORD) {
  const password = process.env.DB_PASSWORD;
  console.log('\n4. 비밀번호 분석:');
  console.log('   원본 값:', JSON.stringify(password));
  console.log('   앞뒤 공백 제거 후:', JSON.stringify(password.trim()));
  console.log('   따옴표 포함 여부:', password.includes('"') || password.includes("'") ? '⚠️  포함됨' : '✅ 없음');
  console.log('   공백 포함 여부:', password.includes(' ') ? '⚠️  포함됨' : '✅ 없음');
  console.log('   줄바꿈 포함 여부:', password.includes('\n') || password.includes('\r') ? '⚠️  포함됨' : '✅ 없음');
  
  if (password !== password.trim()) {
    console.log('\n   ⚠️  경고: 비밀번호 앞뒤에 공백이 있습니다!');
    console.log('   해결: .env 파일에서 DB_PASSWORD=1234 (등호 뒤에 공백 없이)');
  }
  
  if (password.includes('"') || password.includes("'")) {
    console.log('\n   ⚠️  경고: 비밀번호에 따옴표가 포함되어 있습니다!');
    console.log('   해결: .env 파일에서 따옴표를 제거하세요');
  }
}

console.log('\n=== 진단 완료 ===');

