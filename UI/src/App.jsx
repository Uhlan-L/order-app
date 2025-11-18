import { useState } from 'react'
import OrderPage from './pages/OrderPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('order');

  const handleNavigate = (page) => {
    setCurrentPage(page);
    // 관리자 페이지는 나중에 구현
    if (page === 'admin') {
      alert('관리자 페이지는 준비 중입니다.');
    }
  };

  return (
    <div className="App">
      {currentPage === 'order' && <OrderPage onNavigate={handleNavigate} />}
    </div>
  )
}

export default App

