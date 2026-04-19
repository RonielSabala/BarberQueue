import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBarbershopDashboard } from "../../services/barbershopService";
import "../../styles/admin/AdminDashboard.css";

function AdminDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBarbershopDashboard(id);
        setDashboard(data);
      } catch (err) {
        console.error("Error al cargar dashboard:", err);
        setError(err.message || "Error al cargar el dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDashboard();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-alert error">{error}</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="admin-dashboard-page">
        <p>No se encontraron datos del dashboard.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-topbar">
        <button
          onClick={() => navigate(`/admin/barbershop/${id}`)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 dark:border-slate-700 w-fit"
        >
          <span className="material-icons-round text-xl">
            arrow_back_ios_new
          </span>
          Volver
        </button>
      </div>

      <div className="admin-dashboard-header">
        <h1>Dashboard de la Barbería</h1>
        <p>Resumen de métricas operativas y de servicio.</p>
      </div>

      <div className="admin-dashboard-grid">
        <div className="dashboard-card">
          <h3>Clientes hoy</h3>
          <p>{dashboard.clientsToday}</p>
        </div>

        <div className="dashboard-card">
          <h3>Clientes esta semana</h3>
          <p>{dashboard.clientsThisWeek}</p>
        </div>

        <div className="dashboard-card">
          <h3>Clientes este mes</h3>
          <p>{dashboard.clientsThisMonth}</p>
        </div>

        <div className="dashboard-card">
          <h3>Tiempo promedio</h3>
          <p>
            {dashboard.averageServiceMinutes !== null
              ? `${dashboard.averageServiceMinutes} min`
              : "Sin datos"}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Rating promedio</h3>
          <p>
            {dashboard.averageRating !== null
              ? `⭐ ${dashboard.averageRating}`
              : "Sin datos"}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Total de reseñas</h3>
          <p>{dashboard.totalReviews}</p>
        </div>

        <div className="dashboard-card">
          <h3>Barberos activos</h3>
          <p>{dashboard.activeBarbers}</p>
        </div>

        <div className="dashboard-card">
          <h3>Clientes en cola</h3>
          <p>{dashboard.queueCount}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
