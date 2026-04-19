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

function BarberWorkspace() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const barberId = storedUser?.id;

  const [barber, setBarber] = useState(null);
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

      const [barberData, queue] = await Promise.all([
        getBarberById(barberId),
        getBarberQueue(barberId),
      ]);

      setBarber(barberData);
      setQueueData(queue);
      setSelectedStatus(barberData?.currentStatus || "");
    } catch (err) {
      console.error("Error al cargar workspace del barbero:", err);
      setError(err.message || "Error al cargar el workspace del barbero");
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

  const getAcceptingValueByStatus = (status) => status === "active";

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

  const handleToggleAccepting = async () => {
    const newValue = !barber?.isAccepting;

    try {
      setSavingAccepting(true);
      setError("");
      setSuccessMessage("");

      await updateBarberStatus(barberId, { isAccepting: newValue });

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
        <p>Cargando workspace...</p>
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">
          Área de trabajo
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Gestiona tu jornada, visualiza tu cliente actual y tu fila.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl font-medium">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl font-medium">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Estado + Recepción */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-icons-round text-slate-400">
                  tune
                </span>
                Estado general
              </h2>
              <div className="flex gap-3 mt-4">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="active">🟢 Activo</option>
                  <option value="resting">🟡 Descansando</option>
                  <option value="inactive">🔴 Inactivo</option>
                </select>
                <button
                  type="button"
                  className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm disabled:opacity-50"
                  onClick={handleStatusUpdate}
                  disabled={savingStatus || !selectedStatus}
                >
                  Guardar
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-center">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                <span className="material-icons-round text-slate-400">
                  front_hand
                </span>
                Recepción de clientes
              </h2>
              <p className="text-sm text-slate-500 mb-4 h-10">
                {isAccepting
                  ? "Permitiendo nuevos clientes a tu fila"
                  : "Bloqueando nuevos clientes"}
              </p>
              <button
                type="button"
                className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm ${
                  isAccepting
                    ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                    : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                }`}
                onClick={handleToggleAccepting}
                disabled={savingAccepting}
              >
                <span className="material-icons-round text-[18px]">
                  {isAccepting ? "lock_open" : "lock"}
                </span>
                {savingAccepting
                  ? "Actualizando..."
                  : isAccepting
                    ? "Cerrar mi fila"
                    : "Abrir mi fila"}
              </button>
            </div>
          </div>

          {/* Cliente actual */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="material-icons-round text-slate-400">
                content_cut
              </span>
              Cliente actual en servicio
            </h2>

            {currentClient ? (
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="w-20 h-20 bg-primary/10 border-4 border-white dark:border-slate-800 rounded-full flex items-center justify-center text-primary shadow-sm">
                  <span className="material-icons-round text-4xl">
                    {currentClient.ownerType === "member" ? "groups" : "person"}
                  </span>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {currentClient.ownerName}
                  </h3>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      {currentClient.ownerType}
                    </span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      {currentClient.ownerStatus}
                    </span>
                    {Number(currentClient.groupSize) > 1 && (
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        Grupo {currentClient.groupSize}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="w-full sm:w-auto mt-4 sm:mt-0 flex flex-col items-center justify-center gap-1 bg-primary hover:bg-blue-600 text-white px-6 py-4 rounded-xl font-bold transition-colors shadow-md disabled:opacity-50"
                  onClick={handleAttendTurn}
                  disabled={attendLoading}
                >
                  <span className="material-icons-round">check_circle</span>
                  {attendLoading ? "Finalizando..." : "Terminar Servicio"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3 py-10 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400">
                <span className="material-icons-round text-5xl opacity-50">
                  event_seat
                </span>
                <p className="font-medium">
                  No hay cliente en servicio ahora mismo.
                </p>
              </div>
            )}
          </div>

          {/* Terminar jornada */}
          <div className="flex justify-end">
            <button
              className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors border border-red-100 shadow-sm disabled:opacity-50"
              onClick={handleEndShift}
              disabled={savingStatus}
            >
              <span className="material-icons-round text-sm">logout</span>
              Terminar mi jornada
            </button>
          </div>
        </div>

        {/* Fila virtual */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col h-[600px]">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-icons-round text-slate-400">
                format_list_numbered
              </span>
              Mi Fila Virtual
            </div>
            <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded-full font-bold">
              {waitingQueue.length}
            </span>
          </h2>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {waitingQueue.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <span className="material-icons-round text-4xl mb-2 opacity-50">
                  inbox
                </span>
                <p className="text-sm">No hay nadie esperando.</p>
              </div>
            ) : (
              waitingQueue.map((turn) => (
                <div
                  key={turn.id}
                  className={`flex items-center gap-4 p-3 rounded-xl border ${
                    turn.ownerStatus === "waiting"
                      ? "border-amber-200 bg-amber-50 dark:bg-amber-900/10"
                      : "border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      turn.ownerStatus === "waiting"
                        ? "bg-amber-200 text-amber-800"
                        : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {turn.position}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                      {turn.ownerName}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest mt-0.5 truncate">
                      {turn.ownerStatus === "waiting" ? "Pausado" : "En fila"}
                      {Number(turn.groupSize) > 1
                        ? ` · Grupo ${turn.groupSize}`
                        : ""}
                    </p>
                  </div>
                  {turn.ownerType === "member" && (
                    <span
                      className="material-icons-round text-slate-300"
                      title="Miembro de grupo"
                    >
                      groups
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarberWorkspace;
