import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 스키마 파일 읽기 및 실행
export const initDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // SQL 문을 세미콜론으로 분리하여 실행
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    for (const statement of statements) {
      if (statement) {
        await pool.query(statement);
      }
    }
    
    console.log('데이터베이스 스키마가 성공적으로 생성되었습니다.');
    return true;
  } catch (error) {
    console.error('데이터베이스 스키마 생성 실패:', error.message);
    return false;
  }
};

// 초기 데이터 삽입 (선택사항)
export const seedDatabase = async () => {
  try {
    // 메뉴 데이터 확인
    const menuCheck = await pool.query('SELECT COUNT(*) FROM menus');
    if (parseInt(menuCheck.rows[0].count) > 0) {
      console.log('이미 데이터가 존재합니다. 시드 데이터를 건너뜁니다.');
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
    
    const menuResult = await pool.query(menuInsert);
    console.log('메뉴 데이터가 삽입되었습니다.');

    // 옵션 데이터 삽입
    const menus = menuResult.rows;
    for (const menu of menus) {
      const optionInsert = `
        INSERT INTO options (menu_id, name, price) VALUES
        ($1, '샷 추가', 500),
        ($1, '시럽 추가', 0)
      `;
      await pool.query(optionInsert, [menu.id]);
    }
    
    console.log('옵션 데이터가 삽입되었습니다.');
    console.log('초기 데이터 삽입이 완료되었습니다.');
  } catch (error) {
    console.error('초기 데이터 삽입 실패:', error.message);
  }
};

