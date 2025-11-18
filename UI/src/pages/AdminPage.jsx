import { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import Inventory from '../components/Inventory';
import OrderList from '../components/OrderList';
import './AdminPage.css';

// 초기 재고 데이터 (메뉴 3개)
const initialInventory = [
  { menuId: 1, menuName: '아메리카노 (ICE)', stock: 10 },
  { menuId: 2, menuName: '아메리카노 (HOT)', stock: 8 },
  { menuId: 3, menuName: '카페라떼', stock: 5 }
];

// 초기 주문 데이터 (예시)
const initialOrders = [
  {
    id: 1,
    orderDate: new Date().toISOString(),
    status: '주문 접수',
    items: [
      {
        menuId: 1,
        menuName: '아메리카노(ICE)',
        options: [{ optionId: 1, optionName: '샷 추가' }],
        quantity: 1,
        price: 4500
      }
    ],
    totalPrice: 4500
  }
];

function AdminPage({ onNavigate }) {
  const [inventory, setInventory] = useState(initialInventory);
  const [orders, setOrders] = useState(initialOrders);

  // 대시보드 통계 계산
  const calculateStats = () => {
    return {
      totalOrders: orders.length,
      receivedOrders: orders.filter(o => o.status === '주문 접수').length,
      inProductionOrders: orders.filter(o => o.status === '제조 중').length,
      completedOrders: orders.filter(o => o.status === '제조 완료').length
    };
  };

  const stats = calculateStats();

  // 주문 목록 최신순 정렬 (성능 최적화)
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  }, [orders]);

  // 재고 업데이트
  const handleUpdateStock = (menuId, newStock) => {
    setInventory(prev => 
      prev.map(item => 
        item.menuId === menuId 
          ? { ...item, stock: newStock }
          : item
      )
    );
  };

  // 주문 상태 업데이트
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  // 주문하기 화면에서 주문이 들어오면 여기로 전달받는 함수 (추후 구현)
  useEffect(() => {
    // 주문하기 화면에서 주문이 생성되면 localStorage나 이벤트를 통해 받을 수 있음
    const handleNewOrder = (event) => {
      if (event.detail && event.detail.type === 'newOrder') {
        const newOrder = {
          id: Date.now(),
          orderDate: new Date().toISOString(),
          status: '주문 접수',
          items: event.detail.items,
          totalPrice: event.detail.totalPrice
        };
        setOrders(prev => [newOrder, ...prev]);
      }
    };

    window.addEventListener('newOrder', handleNewOrder);
    return () => window.removeEventListener('newOrder', handleNewOrder);
  }, []);

  return (
    <div className="admin-page">
      <Header currentPage="admin" onNavigate={onNavigate} />
      <div className="admin-content">
        <Dashboard stats={stats} />
        <Inventory 
          inventory={inventory} 
          onUpdateStock={handleUpdateStock}
        />
        <OrderList 
          orders={sortedOrders} 
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      </div>
    </div>
  );
}

export default AdminPage;

