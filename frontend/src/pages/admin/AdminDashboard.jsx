import "../../styles/admin/AdminDashboard.css";

function AdminDashboard() {
  const stats = {
    dailyClients: 28,
    weeklyClients: 173,
    incomeToday: 18500,
    incomeWeek: 112300,
    averageWait: 18,
    rating: 4.7,
    totalReviews: 126,
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-header">
        <h1>Dashboard ADMIN</h1>
        <p>Resumen general de la barbería</p>
      </div>

      <section className="admin-kpis-section">
        <h2 className="admin-kpis-title">KPIs</h2>

        <div className="admin-kpis-grid">
          <div className="admin-kpi-card admin-kpi-rect">
            <span className="admin-kpi-label">Clientes</span>
            <div className="admin-kpi-main-value">{stats.dailyClients}</div>
            <p className="admin-kpi-detail">
              diarios / <strong>{stats.weeklyClients}</strong> semanales
            </p>
          </div>

          <div className="admin-kpi-card admin-kpi-circle">
            <span className="admin-kpi-label">Ingresos</span>
            <div className="admin-kpi-main-value">
              RD${stats.incomeToday.toLocaleString()}
            </div>
            <p className="admin-kpi-detail">
              hoy / <strong>RD${stats.incomeWeek.toLocaleString()}</strong>{" "}
              semana
            </p>
          </div>

          <div className="admin-kpi-card admin-kpi-rect">
            <span className="admin-kpi-label">Promedio de espera</span>
            <div className="admin-kpi-main-value">{stats.averageWait} min</div>
            <p className="admin-kpi-detail">Tiempo promedio por cliente</p>
          </div>
        </div>

        <div className="admin-rating-card">
          <span className="admin-kpi-label">Rating general ⭐</span>
          <div className="admin-rating-value">{stats.rating}</div>
          <p className="admin-kpi-detail">
            Basado en <strong>{stats.totalReviews}</strong> reseñas
          </p>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
