import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/menus - 메뉴 목록 조회
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description, price, image_url as "imageUrl" FROM menus ORDER BY id'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('메뉴 조회 오류:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '메뉴 목록을 조회하는 중 오류가 발생했습니다.'
      }
    });
  }
});

// GET /api/menus/:menuId/options - 메뉴별 옵션 조회
router.get('/:menuId/options', async (req, res) => {
  try {
    const { menuId } = req.params;
    
    const result = await pool.query(
      'SELECT id, menu_id as "menuId", name, price FROM options WHERE menu_id = $1 ORDER BY id',
      [menuId]
    );
    
    if (result.rows.length === 0) {
      // 메뉴 존재 여부 확인
      const menuCheck = await pool.query('SELECT id FROM menus WHERE id = $1', [menuId]);
      if (menuCheck.rows.length === 0) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: '해당 메뉴를 찾을 수 없습니다.'
          }
        });
      }
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('옵션 조회 오류:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '옵션 목록을 조회하는 중 오류가 발생했습니다.'
      }
    });
  }
});

export default router;

