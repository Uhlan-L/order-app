import './Dashboard.css';

function Dashboard({ stats }) {
  return (
    <div className="dashboard">
      <h2 className="dashboard-title">관리자 대시보드</h2>
      <div className="dashboard-stats">
        <div className="stat-card highlight-card">
          <div className="stat-label">총 주문</div>
          <div className="stat-value">{stats.totalOrders}</div>
        </div>
        <div className="stat-card highlight-card">
          <div className="stat-label">주문 접수</div>
          <div className="stat-value">{stats.receivedOrders}</div>
        </div>
        <div className="stat-card highlight-card">
          <div className="stat-label">제조 중</div>
          <div className="stat-value">{stats.inProductionOrders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">제조 완료</div>
          <div className="stat-value">{stats.completedOrders}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
