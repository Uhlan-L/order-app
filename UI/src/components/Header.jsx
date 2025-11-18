import './Header.css';

function Header({ currentPage, onNavigate }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">COZY</div>
        <nav className="nav-buttons">
          <button 
            className={`nav-btn ${currentPage === 'order' ? 'active' : ''}`}
            onClick={() => onNavigate('order')}
          >
            주문하기
          </button>
          <button 
            className={`nav-btn ${currentPage === 'admin' ? 'active' : ''}`}
            onClick={() => onNavigate('admin')}
          >
            관리자
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;

