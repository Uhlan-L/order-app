import { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import Inventory from '../components/Inventory';
import OrderList from '../components/OrderList';
import { 
  getDashboardStats, 
  getInventory, 
  updateInventory, 
  getAdminOrders, 
  updateOrderStatus 
} from '../utils/api';
import './AdminPage.css';

function AdminPage({ onNavigate }) {
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    receivedOrders: 0,
    inProductionOrders: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 병렬로 데이터 로드
        const [statsData, inventoryData, ordersData] = await Promise.all([
          getDashboardStats(),
          getInventory(),
          getAdminOrders()
        ]);
        
        setStats(statsData);
        setInventory(inventoryData);
        setOrders(ordersData);
        setError(null);
      } catch (err) {
        console.error('데이터 로드 실패:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // 주기적으로 데이터 새로고침 (5초마다)
    const interval = setInterval(loadData, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // 주문하기 화면에서 주문이 들어오면 새로고침
  useEffect(() => {
    const handleNewOrder = async () => {
      try {
        const [statsData, ordersData] = await Promise.all([
          getDashboardStats(),
          getAdminOrders()
        ]);
        setStats(statsData);
        setOrders(ordersData);
      } catch (err) {
        console.error('주문 데이터 새로고침 실패:', err);
      }
    };

    window.addEventListener('newOrder', handleNewOrder);
    return () => window.removeEventListener('newOrder', handleNewOrder);
  }, []);

  // 주문 목록 최신순 정렬 (성능 최적화)
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  }, [orders]);

  // 재고 업데이트
  const handleUpdateStock = async (menuId, newStock) => {
    try {
      const updated = await updateInventory(menuId, newStock);
      setInventory(prev => 
        prev.map(item => 
          item.menuId === menuId 
            ? updated
            : item
        )
      );
    } catch (error) {
      console.error('재고 업데이트 실패:', error);
      alert(`재고 업데이트에 실패했습니다: ${error.message}`);
    }
  };

  // 주문 상태 업데이트
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      
      // 주문 목록 업데이트
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? updated
            : order
        )
      );
      
      // 통계 새로고침
      const statsData = await getDashboardStats();
      setStats(statsData);
    } catch (error) {
      console.error('주문 상태 업데이트 실패:', error);
      alert(`주문 상태 변경에 실패했습니다: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <Header currentPage="admin" onNavigate={onNavigate} />
        <div className="admin-content">
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <Header currentPage="admin" onNavigate={onNavigate} />
        <div className="admin-content">
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

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

