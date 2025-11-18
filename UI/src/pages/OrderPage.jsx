import { useState } from 'react';
import Header from '../components/Header';
import MenuCard from '../components/MenuCard';
import Cart from '../components/Cart';
import './OrderPage.css';

// 임의의 커피 메뉴 데이터
const menuData = [
  {
    id: 1,
    name: '아메리카노(ICE)',
    price: 4000,
    description: '간단한 설명...',
    imageUrl: '/images/coffee-ice.jpg' // 아이스커피 이미지
  },
  {
    id: 2,
    name: '아메리카노(HOT)',
    price: 4000,
    description: '간단한 설명...',
    imageUrl: '/images/coffee-hot.jpg' // 주황색 머그잔 이미지
  },
  {
    id: 3,
    name: '카페라떼',
    price: 5000,
    description: '간단한 설명...',
    imageUrl: '/images/coffee-latte.jpg' // 라떼 이미지
  },
  {
    id: 4,
    name: '카푸치노',
    price: 5000,
    description: '간단한 설명...',
    imageUrl: '/images/coffee-cappuccino.jpg' // 카푸치노 이미지
  },
  {
    id: 5,
    name: '바닐라라떼',
    price: 5500,
    description: '간단한 설명...',
    imageUrl: '/images/coffee-latte.jpg' // 라떼 이미지 재사용
  },
  {
    id: 6,
    name: '카라멜마키아토',
    price: 5500,
    description: '간단한 설명...',
    imageUrl: '/images/coffee-latte.jpg' // 라떼 이미지 재사용
  }
];

// 옵션 데이터
const optionsData = [
  { id: 1, menuId: 1, name: '샷 추가', price: 500 },
  { id: 2, menuId: 1, name: '시럽 추가', price: 0 },
  { id: 3, menuId: 2, name: '샷 추가', price: 500 },
  { id: 4, menuId: 2, name: '시럽 추가', price: 0 },
  { id: 5, menuId: 3, name: '샷 추가', price: 500 },
  { id: 6, menuId: 3, name: '시럽 추가', price: 0 },
  { id: 7, menuId: 4, name: '샷 추가', price: 500 },
  { id: 8, menuId: 4, name: '시럽 추가', price: 0 },
  { id: 9, menuId: 5, name: '샷 추가', price: 500 },
  { id: 10, menuId: 5, name: '시럽 추가', price: 0 },
  { id: 11, menuId: 6, name: '샷 추가', price: 500 },
  { id: 12, menuId: 6, name: '시럽 추가', price: 0 }
];

function OrderPage({ onNavigate }) {
  const [cartItems, setCartItems] = useState([]);

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

  const handleOrder = () => {
    if (cartItems.length === 0) return;
    
    const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // 주문 정보를 관리자 화면으로 전달
    const orderItems = cartItems.map(item => ({
      menuId: item.menuId,
      menuName: item.menuName,
      options: item.selectedOptions,
      quantity: item.quantity,
      price: item.totalPrice / item.quantity // 개당 가격
    }));

    // 커스텀 이벤트로 주문 정보 전달
    const newOrderEvent = new CustomEvent('newOrder', {
      detail: {
        type: 'newOrder',
        items: orderItems,
        totalPrice: totalPrice
      }
    });
    window.dispatchEvent(newOrderEvent);
    
    // 주문 완료 알림
    alert(`주문이 완료되었습니다!\n총 금액: ${totalPrice.toLocaleString()}원`);
    setCartItems([]);
  };

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
        <Cart cartItems={cartItems} onOrder={handleOrder} />
      </div>
    </div>
  );
}

export default OrderPage;

