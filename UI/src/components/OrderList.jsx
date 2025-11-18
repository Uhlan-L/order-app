import './OrderList.css';

function OrderList({ orders, onUpdateOrderStatus }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  const formatOrderItems = (items) => {
    return items.map(item => {
      const optionsText = item.options && item.options.length > 0
        ? ` (${item.options.map(opt => opt.optionName).join(', ')})`
        : '';
      return `${item.menuName}${optionsText} x ${item.quantity}`;
    }).join(', ');
  };

  const getStatusButton = (order) => {
    switch (order.status) {
      case '주문 접수':
        return (
          <button
            className="status-btn"
            onClick={() => onUpdateOrderStatus(order.id, '제조 중')}
          >
            제조 시작
          </button>
        );
      case '제조 중':
        return (
          <button
            className="status-btn"
            onClick={() => onUpdateOrderStatus(order.id, '제조 완료')}
          >
            제조 완료
          </button>
        );
      case '제조 완료':
        return (
          <span className="status-completed">완료</span>
        );
      default:
        return (
          <button
            className="status-btn"
            onClick={() => onUpdateOrderStatus(order.id, '주문 접수')}
          >
            주문 접수
          </button>
        );
    }
  };

  // 통계 계산
  const totalAmount = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrderCount = orders.length;
  const completedOrderCount = orders.filter(order => order.status === '제조 완료').length;
  
  // 완료된 주문의 재고 건수 계산 (완료된 주문의 모든 아이템 수량 합계)
  const completedStockCount = orders
    .filter(order => order.status === '제조 완료')
    .reduce((sum, order) => {
      const itemCount = order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
      return sum + itemCount;
    }, 0);

  return (
    <div className="order-list">
      <h2 className="order-list-title">주문 현황</h2>
      <div className="order-list-content">
        {orders.length === 0 ? (
          <p className="empty-orders">주문이 없습니다.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-info">
                <div className="order-date">{formatDate(order.orderDate)}</div>
                <div className="order-items">{formatOrderItems(order.items)}</div>
              </div>
              <div className="order-action">
                <span className="order-price">{order.totalPrice.toLocaleString()}원</span>
                {getStatusButton(order)}
              </div>
            </div>
          ))
        )}
      </div>
      {orders.length > 0 && (
        <div className="order-summary">
          <div className="summary-item">
            <span className="summary-label">총 주문 금액:</span>
            <span className="summary-value">{totalAmount.toLocaleString()}원</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">주문 건수:</span>
            <span className="summary-value">{totalOrderCount}건 (완료: {completedOrderCount}건)</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">완료된 재고 건수:</span>
            <span className="summary-value">{completedStockCount}건</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderList;

