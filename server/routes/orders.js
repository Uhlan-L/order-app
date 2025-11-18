import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// POST /api/orders - 주문 생성
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { items } = req.body;
    
    // 요청 검증
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: {
          code: 'BAD_REQUEST',
          message: '주문 항목이 필요합니다.'
        }
      });
    }

    // 트랜잭션 시작
    await client.query('BEGIN');

    let totalPrice = 0;
    const orderItems = [];

    // 각 주문 항목 처리
    for (const item of items) {
      const { menuId, options = [], quantity } = item;

      if (!menuId || !quantity || quantity < 1) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: {
            code: 'BAD_REQUEST',
            message: '유효하지 않은 주문 항목입니다.'
          }
        });
      }

      // 메뉴 정보 조회
      const menuResult = await client.query(
        'SELECT id, name, price, stock FROM menus WHERE id = $1',
        [menuId]
      );

      if (menuResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: {
            code: 'BAD_REQUEST',
            message: `메뉴 ID ${menuId}를 찾을 수 없습니다.`
          }
        });
      }

      const menu = menuResult.rows[0];

      // 재고 확인
      if (menu.stock < quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: {
            code: 'BAD_REQUEST',
            message: `${menu.name}의 재고가 부족합니다. (현재 재고: ${menu.stock}개)`
          }
        });
      }

      // 옵션 가격 계산
      let optionsPrice = 0;
      if (options.length > 0) {
        const optionsResult = await client.query(
          'SELECT id, name, price FROM options WHERE id = ANY($1::int[]) AND menu_id = $2',
          [options, menuId]
        );

        if (optionsResult.rows.length !== options.length) {
          await client.query('ROLLBACK');
          return res.status(400).json({
            error: {
              code: 'BAD_REQUEST',
              message: '유효하지 않은 옵션이 포함되어 있습니다.'
            }
          });
        }

        optionsPrice = optionsResult.rows.reduce((sum, opt) => sum + parseInt(opt.price), 0);
      }

      const itemPrice = (parseInt(menu.price) + optionsPrice) * quantity;
      totalPrice += itemPrice;

      orderItems.push({
        menuId,
        menuName: menu.name,
        options: options.length > 0 
          ? await Promise.all(
              options.map(async (optId) => {
                const optResult = await client.query(
                  'SELECT id, name FROM options WHERE id = $1',
                  [optId]
                );
                return {
                  optionId: optResult.rows[0].id,
                  optionName: optResult.rows[0].name
                };
              })
            )
          : [],
        quantity,
        price: itemPrice / quantity // 개당 가격
      });
    }

    // 주문 생성
    const orderResult = await client.query(
      `INSERT INTO orders (order_date, status, total_price) 
       VALUES (NOW(), '주문 접수', $1) 
       RETURNING id, order_date as "orderDate", status, total_price as "totalPrice"`,
      [totalPrice]
    );

    const order = orderResult.rows[0];

    // 주문 항목 생성 및 재고 차감
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const orderItem = orderItems[i];
      
      // OrderItems 테이블에 삽입
      const orderItemResult = await client.query(
        `INSERT INTO order_items (order_id, menu_id, quantity, item_price)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [order.id, item.menuId, item.quantity, orderItem.price * item.quantity]
      );

      const orderItemId = orderItemResult.rows[0].id;

      // 옵션 저장
      if (item.options && item.options.length > 0) {
        for (const optionId of item.options) {
          await client.query(
            'INSERT INTO order_item_options (order_item_id, option_id) VALUES ($1, $2)',
            [orderItemId, optionId]
          );
        }
      }

      // 재고 차감
      await client.query(
        'UPDATE menus SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.menuId]
      );
    }

    // 트랜잭션 커밋
    await client.query('COMMIT');

    res.status(201).json({
      id: order.id,
      orderDate: order.orderDate,
      status: order.status,
      items: orderItems,
      totalPrice: order.totalPrice
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('주문 생성 오류:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '주문을 생성하는 중 오류가 발생했습니다.'
      }
    });
  } finally {
    client.release();
  }
});

// GET /api/orders/:orderId - 주문 정보 조회
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // 주문 정보 조회
    const orderResult = await pool.query(
      `SELECT id, order_date as "orderDate", status, total_price as "totalPrice"
       FROM orders WHERE id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: '해당 주문을 찾을 수 없습니다.'
        }
      });
    }

    const order = orderResult.rows[0];

    // 주문 항목 조회
    const itemsResult = await pool.query(
      `SELECT 
        oi.menu_id as "menuId",
        m.name as "menuName",
        oi.quantity,
        oi.item_price / oi.quantity as price
       FROM order_items oi
       JOIN menus m ON oi.menu_id = m.id
       WHERE oi.order_id = $1`,
      [orderId]
    );

    // 각 항목의 옵션 조회
    const items = await Promise.all(
      itemsResult.rows.map(async (item) => {
        const optionsResult = await pool.query(
          `SELECT 
            o.id as "optionId",
            o.name as "optionName",
            o.price as "optionPrice"
           FROM order_item_options oio
           JOIN options o ON oio.option_id = o.id
           JOIN order_items oi ON oio.order_item_id = oi.id
           WHERE oi.order_id = $1 AND oi.menu_id = $2`,
          [orderId, item.menuId]
        );

        return {
          menuId: item.menuId,
          menuName: item.menuName,
          options: optionsResult.rows,
          quantity: item.quantity,
          price: parseFloat(item.price)
        };
      })
    );

    res.json({
      id: order.id,
      orderDate: order.orderDate,
      status: order.status,
      items,
      totalPrice: order.totalPrice
    });
  } catch (error) {
    console.error('주문 조회 오류:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '주문 정보를 조회하는 중 오류가 발생했습니다.'
      }
    });
  }
});

export default router;

