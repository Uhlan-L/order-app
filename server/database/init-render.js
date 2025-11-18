import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 스키마 파일 읽기 및 실행
const initSchema = async () => {
  const client = await pool.connect();
  
  try {
    console.log('Render 데이터베이스에 스키마를 생성합니다...\n');
    
    // 트랜잭션 시작
    await client.query('BEGIN');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // SQL 문을 세미콜론으로 분리하여 실행
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement) {
        try {
          await client.query(statement);
          console.log('✓ SQL 문 실행 완료');
        } catch (error) {
          // 테이블이 이미 존재하는 경우 무시
          if (error.code === '42P07' || error.message.includes('already exists')) {
            console.log('⚠ 테이블이 이미 존재합니다. 건너뜁니다.');
          } else {
            throw error;
          }
        }
      }
    }
    
    // 트랜잭션 커밋
    await client.query('COMMIT');
    
    console.log('\n✅ 데이터베이스 스키마가 성공적으로 생성되었습니다.');
    
    // 테이블 확인
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n생성된 테이블:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ 스키마 생성 실패:', error.message);
    console.error('오류 코드:', error.code);
    throw error;
  } finally {
    client.release();
  }
};

// 초기 데이터 삽입
const seedData = async () => {
  const client = await pool.connect();
  
  try {
    console.log('\n초기 데이터를 삽입합니다...\n');
    
    // 메뉴 데이터 확인
    const menuCheck = await client.query('SELECT COUNT(*) FROM menus');
    if (parseInt(menuCheck.rows[0].count) > 0) {
      console.log('⚠ 이미 데이터가 존재합니다. 시드 데이터를 건너뜁니다.');
      return;
    }

    // 메뉴 데이터 삽입
    const menuInsert = `
      INSERT INTO menus (name, description, price, image_url, stock) VALUES
      ('아메리카노(ICE)', '간단한 설명...', 4000, '/images/coffee-ice.jpg', 10),
      ('아메리카노(HOT)', '간단한 설명...', 4000, '/images/coffee-hot.jpg', 8),
      ('카페라떼', '간단한 설명...', 5000, '/images/coffee-latte.jpg', 5),
      ('카푸치노', '간단한 설명...', 5000, '/images/coffee-cappuccino.jpg', 5),
      ('바닐라라떼', '간단한 설명...', 5500, '/images/coffee-latte.jpg', 5),
      ('카라멜마키아토', '간단한 설명...', 5500, '/images/coffee-latte.jpg', 5)
      RETURNING id, name;
    `;
    
    const menuResult = await client.query(menuInsert);
    console.log('✓ 메뉴 데이터 삽입 완료:', menuResult.rows.length, '개');

    // 옵션 데이터 삽입
    const menus = menuResult.rows;
    for (const menu of menus) {
      const optionInsert = `
        INSERT INTO options (menu_id, name, price) VALUES
        ($1, '샷 추가', 500),
        ($1, '시럽 추가', 0)
      `;
      await client.query(optionInsert, [menu.id]);
    }
    
    console.log('✓ 옵션 데이터 삽입 완료');
    console.log('\n✅ 초기 데이터 삽입이 완료되었습니다.');
    
  } catch (error) {
    console.error('\n❌ 초기 데이터 삽입 실패:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

// 메인 실행 함수
const main = async () => {
  try {
    // 스키마 생성
    await initSchema();
    
    // 초기 데이터 삽입 (선택사항)
    const seed = process.argv.includes('--seed');
    if (seed) {
      await seedData();
    } else {
      console.log('\n💡 초기 데이터를 삽입하려면 --seed 플래그를 추가하세요:');
      console.log('   npm run init-render -- --seed');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 오류 발생:', error);
    process.exit(1);
  }
};

main();

