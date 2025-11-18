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
                <div className="order-price">{order.totalPrice.toLocaleString()}원</div>
              </div>
              <div className="order-action">
                {getStatusButton(order)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OrderList;

