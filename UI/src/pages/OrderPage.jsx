import { useState, useEffect } from 'react';
import Header from '../components/Header';
import MenuCard from '../components/MenuCard';
import Cart from '../components/Cart';
import { getMenus, getMenuOptions, createOrder } from '../utils/api';
import './OrderPage.css';

function OrderPage({ onNavigate }) {
  const [menuData, setMenuData] = useState([]);
  const [optionsData, setOptionsData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 메뉴 데이터 로드
  useEffect(() => {
    const loadMenus = async () => {
      try {
        setLoading(true);
        const menus = await getMenus();
        setMenuData(menus);
        
        // 각 메뉴의 옵션 로드
        const allOptions = [];
        for (const menu of menus) {
          try {
            const options = await getMenuOptions(menu.id);
            allOptions.push(...options);
          } catch (err) {
            console.error(`메뉴 ${menu.id}의 옵션 로드 실패:`, err);
          }
        }
        setOptionsData(allOptions);
        setError(null);
      } catch (err) {
        console.error('메뉴 로드 실패:', err);
        setError('메뉴를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, []);

  const getOptionsForMenu = (menuId) => {
    return optionsData.filter(opt => opt.menuId === menuId);
  };

  const addToCart = (menu, selectedOptions) => {
    const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    const totalPrice = (menu.price + optionsPrice);

    // 동일한 메뉴와 옵션 조합이 있는지 확인
    const existingItemIndex = cartItems.findIndex(item => {
      if (item.menuId !== menu.id) return false;
      if (item.selectedOptions.length !== selectedOptions.length) return false;
      
      const itemOptionIds = item.selectedOptions.map(opt => opt.optionId).sort();
      const selectedOptionIds = selectedOptions.map(opt => opt.id).sort();
      
      return JSON.stringify(itemOptionIds) === JSON.stringify(selectedOptionIds);
    });

    if (existingItemIndex !== -1) {
      // 기존 아이템 수량 증가
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].totalPrice = 
        updatedItems[existingItemIndex].basePrice * updatedItems[existingItemIndex].quantity;
      setCartItems(updatedItems);
    } else {
      // 새 아이템 추가
      const newItem = {
        menuId: menu.id,
        menuName: menu.name,
        basePrice: totalPrice,
        selectedOptions: selectedOptions.map(opt => ({
          optionId: opt.id,
          optionName: opt.name,
          optionPrice: opt.price
        })),
        quantity: 1,
        totalPrice: totalPrice
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const handleOrder = async () => {
    if (cartItems.length === 0) return;
    
    try {
      // API 형식에 맞게 주문 데이터 변환
      const orderItems = cartItems.map(item => ({
        menuId: item.menuId,
        options: item.selectedOptions.map(opt => opt.optionId),
        quantity: item.quantity
      }));

      // API로 주문 생성
      const order = await createOrder({ items: orderItems });
      
      // 주문 정보를 관리자 화면으로 전달
      const newOrderEvent = new CustomEvent('newOrder', {
        detail: {
          type: 'newOrder',
          order: order
        }
      });
      window.dispatchEvent(newOrderEvent);
      
      // 주문 완료 알림
      alert(`주문이 완료되었습니다!\n총 금액: ${order.totalPrice.toLocaleString()}원`);
      setCartItems([]);
    } catch (error) {
      console.error('주문 생성 실패:', error);
      alert(`주문에 실패했습니다: ${error.message}`);
    }
  };

  // 장바구니에서 특정 아이템 제거
  const handleRemoveItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  // 장바구니 전체 비우기
  const handleClearAll = () => {
    if (cartItems.length === 0) return;
    
    if (window.confirm('장바구니를 모두 비우시겠습니까?')) {
      setCartItems([]);
    }
  };

  if (loading) {
    return (
      <div className="order-page">
        <Header currentPage="order" onNavigate={onNavigate} />
        <div className="order-content">
          <p>메뉴를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-page">
        <Header currentPage="order" onNavigate={onNavigate} />
        <div className="order-content">
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <Header currentPage="order" onNavigate={onNavigate} />
      <div className="order-content">
        <div className="menu-section">
          <h2 className="section-title">메뉴</h2>
          <div className="menu-grid">
            {menuData.map(menu => (
              <MenuCard
                key={menu.id}
                menu={menu}
                options={getOptionsForMenu(menu.id)}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
        <Cart 
          cartItems={cartItems} 
          onOrder={handleOrder}
          onRemoveItem={handleRemoveItem}
          onClearAll={handleClearAll}
        />
      </div>
    </div>
  );
}

export default OrderPage;

