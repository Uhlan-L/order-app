// 개발 환경 확인 스크립트
// 실행 방법: node check-setup.js

const fs = require('fs');
const path = require('path');

console.log('🔍 개발 환경 확인 중...\n');

// Node.js 버전 확인
try {
  const nodeVersion = process.version;
  console.log(`✅ Node.js: ${nodeVersion}`);
  
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (majorVersion < 18) {
    console.log('⚠️  경고: Node.js 18 이상을 권장합니다.');
  }
} catch (error) {
  console.log('❌ Node.js가 설치되어 있지 않습니다.');
  console.log('   https://nodejs.org/ 에서 Node.js를 설치해주세요.');
  process.exit(1);
}

// npm 버전 확인
try {
  const { execSync } = require('child_process');
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
  console.log(`✅ npm: ${npmVersion}`);
} catch (error) {
  console.log('❌ npm이 설치되어 있지 않습니다.');
  process.exit(1);
}

// package.json 확인
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  console.log('✅ package.json 파일 존재');
} else {
  console.log('❌ package.json 파일을 찾을 수 없습니다.');
  process.exit(1);
}

// node_modules 확인
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules 폴더 존재 (의존성 설치됨)');
} else {
  console.log('⚠️  node_modules 폴더가 없습니다.');
  console.log('   다음 명령어를 실행하세요: npm install');
}

// vite.config.js 확인
const viteConfigPath = path.join(__dirname, 'vite.config.js');
if (fs.existsSync(viteConfigPath)) {
  console.log('✅ vite.config.js 파일 존재');
} else {
  console.log('⚠️  vite.config.js 파일을 찾을 수 없습니다.');
}

console.log('\n✨ 확인 완료!');
console.log('\n다음 단계:');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('1. npm install 실행');
  console.log('2. npm run dev 실행');
} else {
  console.log('npm run dev 명령어로 개발 서버를 실행하세요!');
}

