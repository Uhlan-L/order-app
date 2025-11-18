import './Inventory.css';

function Inventory({ inventory, onUpdateStock }) {
  const getStockStatus = (stock) => {
    if (stock === 0) {
      return { text: '품절', className: 'status-out' };
    } else if (stock < 5) {
      return { text: '주의', className: 'status-warning' };
    } else {
      return { text: '정상', className: 'status-normal' };
    }
  };

  const handleIncrease = (menuId) => {
    const item = inventory.find(inv => inv.menuId === menuId);
    if (item) {
      onUpdateStock(menuId, item.stock + 1);
    }
  };

  const handleDecrease = (menuId) => {
    const item = inventory.find(inv => inv.menuId === menuId);
    if (item && item.stock > 0) {
      onUpdateStock(menuId, item.stock - 1);
    }
  };

  return (
    <div className="inventory">
      <h2 className="inventory-title">재고 현황</h2>
      <div className="inventory-cards">
        {inventory.map((item) => {
          const status = getStockStatus(item.stock);
          return (
            <div key={item.menuId} className="inventory-card">
              <h3 className="inventory-menu-name">{item.menuName}</h3>
              <div className="inventory-stock-info">
                <span className="inventory-stock">{item.stock}개</span>
                <span className={`inventory-status ${status.className}`}>
                  {status.text}
                </span>
              </div>
              <div className="inventory-controls">
                <button
                  className="stock-btn decrease-btn"
                  onClick={() => handleDecrease(item.menuId)}
                  disabled={item.stock === 0}
                >
                  -
                </button>
                <button
                  className="stock-btn increase-btn"
                  onClick={() => handleIncrease(item.menuId)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Inventory;

