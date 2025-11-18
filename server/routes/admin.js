import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/admin/dashboard - 대시보드 통계 조회
router.get('/dashboard', async (req, res) => {
  try {
    const statsResult = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE true) as "totalOrders",
        COUNT(*) FILTER (WHERE status = '주문 접수') as "receivedOrders",
        COUNT(*) FILTER (WHERE status = '제조 중') as "inProductionOrders",
        COUNT(*) FILTER (WHERE status = '제조 완료') as "completedOrders"
       FROM orders`
    );

    const stats = statsResult.rows[0];
    
    res.json({
      totalOrders: parseInt(stats.totalOrders),
      receivedOrders: parseInt(stats.receivedOrders),
      inProductionOrders: parseInt(stats.inProductionOrders),
      completedOrders: parseInt(stats.completedOrders)
    });
  } catch (error) {
    console.error('대시보드 통계 조회 오류:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '대시보드 통계를 조회하는 중 오류가 발생했습니다.'
      }
    });
  }
});

// GET /api/admin/inventory - 재고 조회
router.get('/inventory', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id as "menuId", name as "menuName", stock FROM menus ORDER BY id'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('재고 조회 오류:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '재고 정보를 조회하는 중 오류가 발생했습니다.'
      }
    });
  }
});

// PUT /api/admin/inventory/:menuId - 재고 수정
router.put('/inventory/:menuId', async (req, res) => {
  try {
    const { menuId } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock === null) {
      return res.status(400).json({
        error: {
          code: 'BAD_REQUEST',
          message: '재고 수량이 필요합니다.'
        }
      });
    }

    if (stock < 0) {
      return res.status(400).json({
        error: {
          code: 'BAD_REQUEST',
          message: '재고 수량은 0 이상이어야 합니다.'
        }
      });
    }

    const result = await pool.query(
      'UPDATE menus SET stock = $1 WHERE id = $2 RETURNING id as "menuId", name as "menuName", stock',
      [stock, menuId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: '해당 메뉴를 찾을 수 없습니다.'
        }
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('재고 수정 오류:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '재고를 수정하는 중 오류가 발생했습니다.'
      }
    });
  }
});

// GET /api/admin/orders - 주문 목록 조회
router.get('/orders', async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT 
        o.id,
        o.order_date as "orderDate",
        o.status,
        o.total_price as "totalPrice"
      FROM orders o
    `;
    
    const params = [];
    if (status) {
      query += ' WHERE o.status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY o.order_date DESC';
    
    const ordersResult = await pool.query(query, params);
    
    // 각 주문의 항목 조회
    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await pool.query(
          `SELECT 
            oi.menu_id as "menuId",
            m.name as "menuName",
            oi.quantity,
            oi.item_price / oi.quantity as price
           FROM order_items oi
           JOIN menus m ON oi.menu_id = m.id
           WHERE oi.order_id = $1`,
          [order.id]
        );

        const items = await Promise.all(
          itemsResult.rows.map(async (item) => {
            const optionsResult = await pool.query(
              `SELECT 
                o.id as "optionId",
                o.name as "optionName"
               FROM order_item_options oio
               JOIN options o ON oio.option_id = o.id
               JOIN order_items oi ON oio.order_item_id = oi.id
               WHERE oi.order_id = $1 AND oi.menu_id = $2`,
              [order.id, item.menuId]
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

        return {
          id: order.id,
          orderDate: order.orderDate,
          status: order.status,
          items,
          totalPrice: order.totalPrice
        };
      })
    );

    res.json(orders);
  } catch (error) {
    console.error('주문 목록 조회 오류:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '주문 목록을 조회하는 중 오류가 발생했습니다.'
      }
    });
  }
});

// PUT /api/admin/orders/:orderId/status - 주문 상태 변경
router.put('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['주문 접수', '제조 중', '제조 완료'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: {
          code: 'BAD_REQUEST',
          message: `유효하지 않은 상태입니다. 가능한 값: ${validStatuses.join(', ')}`
        }
      });
    }

    const result = await pool.query(
      `UPDATE orders 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING id, order_date as "orderDate", status, total_price as "totalPrice"`,
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: '해당 주문을 찾을 수 없습니다.'
        }
      });
    }

    const order = result.rows[0];

    // 주문 항목 정보도 함께 반환
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

    const items = await Promise.all(
      itemsResult.rows.map(async (item) => {
        const optionsResult = await pool.query(
          `SELECT 
            o.id as "optionId",
            o.name as "optionName"
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
    console.error('주문 상태 변경 오류:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '주문 상태를 변경하는 중 오류가 발생했습니다.'
      }
    });
  }
});

export default router;

