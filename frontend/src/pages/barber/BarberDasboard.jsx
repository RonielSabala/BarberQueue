import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBarberById,
  getBarberDashboard,
  updateBarberStatus,
} from "../../services/barberService";
import { getBarberQueue } from "../../services/queueService";
import { attendTurn } from "../../services/turnService";
import "../../styles/barber/BarberDashboard.css";

function BarberDashboard() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const barberId = storedUser?.id;

  const [barber, setBarber] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [queueData, setQueueData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingAccepting, setSavingAccepting] = useState(false);
  const [attendLoading, setAttendLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");

      if (!barberId) {
        setError("No se encontró el barbero autenticado.");
        return;
      }

      const [barberData, dashboardData, queue] = await Promise.all([
        getBarberById(barberId),
        getBarberDashboard(barberId),
        getBarberQueue(barberId),
      ]);

      setBarber(barberData);
      setDashboard(dashboardData);
      setQueueData(queue);
      setSelectedStatus(barberData?.currentStatus || "");
    } catch (err) {
      console.error("Error al cargar dashboard del barbero:", err);
      setError(err.message || "Error al cargar el dashboard del barbero");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const currentClient = useMemo(() => queueData?.current || null, [queueData]);

  const waitingQueue = useMemo(() => {
    return Array.isArray(queueData?.queue) ? queueData.queue : [];
  }, [queueData]);

  const getStatusLabel = (status) => {
    if (status === "active") return "Activo";
    if (status === "resting") return "Descansando";
    if (status === "inactive") return "Inactivo";
    return status || "Sin estado";
  };

  const getAcceptingValueByStatus = (status) => status === "active";

  // Actualiza currentStatus + isAccepting según el estado seleccionado
  const handleStatusUpdate = async () => {
    try {
      setSavingStatus(true);
      setError("");
      setSuccessMessage("");

      const response = await updateBarberStatus(barberId, {
        currentStatus: selectedStatus,
        isAccepting: getAcceptingValueByStatus(selectedStatus),
      });

      setSuccessMessage(
        response.message || "Estado actualizado correctamente.",
      );
      await fetchAll();
    } catch (err) {
      console.error("Error al actualizar estado del barbero:", err);
      setError(err.message || "Error al actualizar el estado");
    } finally {
      setSavingStatus(false);
    }
  };

  // Toggle independiente de isAccepting — no cambia currentStatus
  const handleToggleAccepting = async () => {
    const newValue = !barber?.isAccepting;

    try {
      setSavingAccepting(true);
      setError("");
      setSuccessMessage("");

      await updateBarberStatus(barberId, {
        isAccepting: newValue,
      });

      setSuccessMessage(
        newValue
          ? "Ahora estás aceptando clientes en tu cola."
          : "Tu cola está cerrada. No se registrarán nuevos clientes.",
      );
      await fetchAll();
    } catch (err) {
      console.error("Error al cambiar disponibilidad:", err);
      setError(err.message || "Error al cambiar la disponibilidad");
    } finally {
      setSavingAccepting(false);
    }
  };

  const handleGoToProfile = () => navigate("/barber/profile");

  const handleEndShift = async () => {
    try {
      setSavingStatus(true);
      setError("");
      setSuccessMessage("");

      const response = await updateBarberStatus(barberId, {
        currentStatus: "inactive",
        isAccepting: false,
      });

      setSuccessMessage(
        response.message || "Jornada finalizada correctamente.",
      );
      await fetchAll();
    } catch (err) {
      console.error("Error al terminar jornada:", err);
      setError(err.message || "Error al terminar la jornada");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleAttendTurn = async () => {
    if (!currentClient?.id) {
      setError("No hay cliente en servicio para finalizar.");
      return;
    }

    try {
      setAttendLoading(true);
      setError("");
      setSuccessMessage("");

      await attendTurn(currentClient.id);

      setSuccessMessage(
        "Servicio finalizado correctamente. El siguiente cliente pasó a in_service.",
      );
      await fetchAll();
    } catch (err) {
      console.error("Error al finalizar servicio:", err);
      setError(err.message || "Error al finalizar el servicio");
    } finally {
      setAttendLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="barber-dashboard-page">
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (error && !barber) {
    return (
      <div className="barber-dashboard-page">
        <div className="barber-dashboard-alert error">{error}</div>
      </div>
    );
  }

  const isAccepting = barber?.isAccepting ?? false;

  return (
    <div className="barber-dashboard-page">
      <div className="barber-dashboard-header">
        <div>
          <h1>Dashboard del Barbero</h1>
          <p>Gestiona tu jornada, visualiza tu cliente actual y tu cola.</p>
        </div>

        <button
          className="barber-dashboard-back-btn"
          onClick={handleGoToProfile}
        >
          Ir al perfil
        </button>
      </div>

      {error && <div className="barber-dashboard-alert error">{error}</div>}
      {successMessage && (
        <div className="barber-dashboard-alert success">{successMessage}</div>
      )}

      <div className="barber-dashboard-kpis">
        <div className="barber-kpi-card">
          <p className="barber-kpi-label">Clientes atendidos</p>
          <p className="barber-kpi-value">
            {dashboard?.totalAttendedClients ?? 0}
          </p>
        </div>
        <div className="barber-kpi-card">
          <p className="barber-kpi-label">Tiempo promedio (minutos)</p>
          <p className="barber-kpi-value small">
            {dashboard?.averageServiceMinutes || "Sin datos"}
          </p>
        </div>
        <div className="barber-kpi-card">
          <p className="barber-kpi-label">Rating promedio</p>
          <p className="barber-kpi-value">
            {dashboard?.averageRating != null
              ? `⭐ ${dashboard.averageRating}`
              : "Sin datos"}
          </p>
        </div>
        <div className="barber-kpi-card">
          <p className="barber-kpi-label">Fecha de ingreso</p>
          <p className="barber-kpi-value small">
            {dashboard?.joinDate || "Sin datos"}
          </p>
        </div>
      </div>

      <div className="barber-dashboard-main-grid">
        <div className="barber-dashboard-left">
          {/* ─── Estado actual ─── */}
          <div className="barber-dashboard-card compact-status-card">
            <h2>Estado actual</h2>

            <div className="barber-status-summary-grid">
              <div className="barber-status-mini-card">
                <span className="barber-status-mini-label">Estado</span>
                <span className="barber-status-mini-value">
                  {getStatusLabel(barber?.currentStatus)}
                </span>
              </div>
              <div className="barber-status-mini-card">
                <span className="barber-status-mini-label">Cola</span>
                <span className="barber-status-mini-value">
                  {isAccepting ? "Abierta" : "Cerrada"}
                </span>
              </div>
            </div>

            <div className="barber-status-form-inline">
              <select
                id="barber-status-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="barber-status-select"
              >
                <option value="active">Activo</option>
                <option value="resting">Descansando</option>
                <option value="inactive">Inactivo</option>
              </select>

              <button
                type="button"
                className="barber-save-status-btn"
                onClick={handleStatusUpdate}
                disabled={savingStatus || !selectedStatus}
              >
                {savingStatus ? "Guardando..." : "Actualizar estado"}
              </button>
            </div>
          </div>

          {/* ─── Control de cola — toggle independiente ─── */}
          <div className="barber-dashboard-card">
            <h2>Control de cola</h2>
            <p className="barber-queue-control-desc">
              {isAccepting
                ? "Tu cola está abierta. Los clientes pueden registrarse contigo."
                : "Tu cola está cerrada. No se aceptarán nuevos clientes."}
            </p>

            <button
              type="button"
              className={`barber-accepting-toggle ${isAccepting ? "accepting" : "not-accepting"}`}
              onClick={handleToggleAccepting}
              disabled={savingAccepting}
            >
              <span className="material-icons-round">
                {isAccepting ? "lock_open" : "lock"}
              </span>
              {savingAccepting
                ? "Actualizando..."
                : isAccepting
                  ? "Cerrar mi cola"
                  : "Abrir mi cola"}
            </button>
          </div>

          {/* ─── Cliente actual ─── */}
          <div className="barber-dashboard-card">
            <h2>Cliente actual</h2>

            {currentClient ? (
              <div className="barber-current-client-premium">
                <div className="barber-current-client-avatar large">
                  <span className="material-icons-round">person</span>
                </div>
                <div className="barber-current-client-info">
                  <p className="barber-current-client-name">
                    {currentClient.ownerName}
                  </p>
                  <div className="barber-current-client-tags">
                    <span className="client-tag blue">
                      {currentClient.ownerType}
                    </span>
                    <span className="client-tag green">
                      {currentClient.ownerStatus}
                    </span>
                    {Number(currentClient.groupSize) > 1 && (
                      <span className="client-tag amber">
                        Grupo {currentClient.groupSize}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="barber-empty-state-box">
                <span className="material-icons-round">event_busy</span>
                <p>No hay cliente en servicio.</p>
              </div>
            )}
          </div>

          {/* ─── Acciones ─── */}
          <div className="barber-dashboard-card">
            <h2>Acciones de la jornada</h2>

            <div className="barber-actions-grid">
              <button
                className="barber-action-card finish-service"
                type="button"
                onClick={handleAttendTurn}
                disabled={attendLoading || !currentClient}
                title={
                  !currentClient
                    ? "No hay cliente en servicio"
                    : "Marcar servicio como finalizado"
                }
              >
                <span className="material-icons-round">content_cut</span>
                <div>
                  <strong>Finalizar servicio</strong>
                  <p>
                    {attendLoading
                      ? "Finalizando..."
                      : currentClient
                        ? `Atendiendo a ${currentClient.ownerName}`
                        : "Sin cliente activo"}
                  </p>
                </div>
              </button>

              <button
                className="barber-action-card end-shift"
                type="button"
                onClick={handleEndShift}
                disabled={savingStatus}
              >
                <span className="material-icons-round">logout</span>
                <div>
                  <strong>Terminar jornada</strong>
                  <p>Cerrar jornada del día</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ─── Cola ─── */}
        <div className="barber-dashboard-right">
          <div className="barber-queue-column-card">
            <div className="barber-queue-column-header">
              <h2>Cola actual</h2>
              <p>{queueData?.barberName || barber?.username || "Barbero"}</p>
            </div>

            <div className="barber-queue-column-body">
              {currentClient ? (
                <div className="barber-queue-turn current">
                  <span className="barber-queue-turn-position">
                    {currentClient.position ?? 1}
                  </span>
                  <div className="barber-queue-turn-info">
                    <p>{currentClient.ownerName}</p>
                    <span>
                      En servicio
                      {Number(currentClient.groupSize) > 1
                        ? ` · Grupo ${currentClient.groupSize}`
                        : ""}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="barber-queue-empty">
                  No hay cliente en servicio.
                </div>
              )}

              {waitingQueue.length === 0 ? (
                <div className="barber-queue-empty">
                  No hay clientes en espera.
                </div>
              ) : (
                waitingQueue.map((turn) => (
                  <div
                    key={turn.id}
                    className={`barber-queue-turn${turn.ownerStatus === "waiting" ? " waiting" : ""}`}
                  >
                    <span className="barber-queue-turn-position">
                      {turn.position}
                    </span>
                    <div className="barber-queue-turn-info">
                      <p>{turn.ownerName}</p>
                      <span>
                        {turn.ownerType} · {turn.ownerStatus}
                        {turn.ownerStatus === "waiting" ? " ⏸ pausado" : ""}
                        {turn.groupSize ? ` · Grupo ${turn.groupSize}` : ""}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarberDashboard;
