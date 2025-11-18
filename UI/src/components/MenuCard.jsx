import { useState } from 'react';
import CoffeeImage from './CoffeeImage';
import './MenuCard.css';

function MenuCard({ menu, options, onAddToCart }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [imageError, setImageError] = useState(false);

  const handleOptionChange = (optionId) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleAddToCart = () => {
    const selectedOptionsData = options.filter(opt => selectedOptions.includes(opt.id));
    onAddToCart(menu, selectedOptionsData);
    setSelectedOptions([]); // 옵션 초기화
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="menu-card">
      <div className="menu-image">
        {menu.imageUrl && !imageError ? (
          <img 
            src={menu.imageUrl} 
            alt={menu.name}
            onError={handleImageError}
          />
        ) : (
          <CoffeeImage menuName={menu.name} />
        )}
      </div>
      <div className="menu-info">
        <h3 className="menu-name">{menu.name}</h3>
        <p className="menu-price">{menu.price.toLocaleString()}원</p>
        <p className="menu-description">{menu.description}</p>
        <div className="menu-options">
          {options.map(option => (
            <label key={option.id} className="option-label">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleOptionChange(option.id)}
                aria-label={`${option.name} 옵션 ${option.price > 0 ? `(+${option.price.toLocaleString()}원)` : '(무료)'}`}
              />
              <span>
                {option.name} {option.price > 0 ? `(+${option.price.toLocaleString()}원)` : '(+0원)'}
              </span>
            </label>
          ))}
        </div>
        <button 
          className="add-to-cart-btn" 
          onClick={handleAddToCart}
          aria-label={`${menu.name} 장바구니에 추가`}
        >
          담기
        </button>
      </div>
    </div>
  );
}

export default MenuCard;

