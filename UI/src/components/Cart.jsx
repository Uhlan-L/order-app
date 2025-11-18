import './Cart.css';

function Cart({ cartItems, onOrder, onRemoveItem, onClearAll }) {
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const formatItemName = (item) => {
    const optionsText = item.selectedOptions.length > 0
      ? ` (${item.selectedOptions.map(opt => opt.optionName).join(', ')})`
      : '';
    return `${item.menuName}${optionsText} X ${item.quantity}`;
  };

  return (
    <div className="cart">
      <div className="cart-header">
        <h2 className="cart-title">장바구니</h2>
        {cartItems.length > 0 && (
          <button 
            className="clear-all-btn" 
            onClick={onClearAll}
            aria-label="장바구니 전체 비우기"
          >
            전체 취소
          </button>
        )}
      </div>
      <div className="cart-content">
        <div className="cart-items-section">
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <p className="empty-cart">장바구니가 비어있습니다.</p>
            ) : (
              cartItems.map((item, index) => {
                // 고유한 key 생성: menuId + 옵션 ID 조합 + quantity + index
                const uniqueKey = `${item.menuId}-${item.selectedOptions.map(opt => opt.optionId).sort().join('-')}-${item.quantity}-${index}`;
                return (
                  <div key={uniqueKey} className="cart-item">
                    <span className="item-name">{formatItemName(item)}</span>
                    <div className="item-right">
                      <span className="item-price">{item.totalPrice.toLocaleString()}원</span>
                      <button
                        className="remove-item-btn"
                        onClick={() => onRemoveItem(index)}
                        aria-label={`${item.menuName} 삭제`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="cart-summary-section">
          <div className="cart-summary">
            <div className="total-section">
              <span className="total-label">총 금액</span>
              <span className="total-amount">{calculateTotal().toLocaleString()}원</span>
            </div>
            <button 
              className="order-btn" 
              onClick={onOrder}
              disabled={cartItems.length === 0}
            >
              주문하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
