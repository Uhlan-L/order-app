import './Cart.css';

function Cart({ cartItems, onOrder }) {
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
      <h2 className="cart-title">장바구니</h2>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart">장바구니가 비어있습니다.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <span className="item-name">{formatItemName(item)}</span>
                <span className="item-price">{item.totalPrice.toLocaleString()}원</span>
              </div>
            ))
          )}
        </div>
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
  );
}

export default Cart;

