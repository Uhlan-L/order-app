// API 호출 유틸리티 함수

//const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = 'https://order-app-backend-1fxk.onrender.com/api';

// GET 요청
export const get = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || '요청에 실패했습니다.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API GET 오류:', error);
    throw error;
  }
};

// POST 요청
export const post = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || '요청에 실패했습니다.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API POST 오류:', error);
    throw error;
  }
};

// PUT 요청
export const put = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || '요청에 실패했습니다.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API PUT 오류:', error);
    throw error;
  }
};

// API 엔드포인트별 함수들

// 메뉴 관련
export const getMenus = () => get('/menus');
export const getMenuOptions = (menuId) => get(`/menus/${menuId}/options`);

// 주문 관련
export const createOrder = (orderData) => post('/orders', orderData);
export const getOrder = (orderId) => get(`/orders/${orderId}`);

// 관리자 관련
export const getDashboardStats = () => get('/admin/dashboard');
export const getInventory = () => get('/admin/inventory');
export const updateInventory = (menuId, stock) => put(`/admin/inventory/${menuId}`, { stock });
export const getAdminOrders = (status) => {
  const endpoint = status ? `/admin/orders?status=${status}` : '/admin/orders';
  return get(endpoint);
};
export const updateOrderStatus = (orderId, status) => 
  put(`/admin/orders/${orderId}/status`, { status });

