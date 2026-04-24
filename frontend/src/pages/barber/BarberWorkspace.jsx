import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBarberById,
  getBarberDashboard,
  updateBarberStatus,
} from "../../services/barberService";
import { getEmployeeById } from "../../services/employeeService";
import { getBarberQueue } from "../../services/queueService";
import { attendTurn } from "../../services/turnService";
import { Avatar } from "../../components/UserProfileCard";
import { useToast } from "../../context/ToastContext";
import { mapApiError } from "../../utils/mapApiError";

function isWithinSchedule(assignment) {
  if (!assignment) return true;
  const now = new Date();
  const todayDow = now.getDay();
  const backendDow = todayDow === 0 ? 7 : todayDow;
  const workingDays = assignment.workingDays || [];
  if (!workingDays.includes(backendDow)) return false;
  const [startH, startM] = (assignment.startTime || "00:00:00")
    .split(":")
    .map(Number);
  const [endH, endM] = (assignment.endTime || "23:59:00")
    .split(":")
    .map(Number);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return nowMinutes >= startH * 60 + startM && nowMinutes < endH * 60 + endM;
}

function BarberWorkspace() {
  const navigate = useNavigate();
  const { barbershopId } = useParams();
  const toast = useToast();

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const barberId = storedUser?.id;

  const [barber, setBarber] = useState(null);
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingAccepting, setSavingAccepting] = useState(false);
  const [attendLoading, setAttendLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchAll = async () => {
    try {
      setLoading(true);
      if (!barberId) {
        toast.error("No se encontró el barbero autenticado.");
        return;
      }

      const [barberData, queue, employeeData] = await Promise.all([
        getBarberById(barberId),
        getBarberQueue(barberId),
        getEmployeeById(barberId),
      ]);

      const assignment = employeeData?.assignments?.find(
        (a) => Number(a.barbershopId) === Number(barbershopId),
      );
      const withinSchedule = isWithinSchedule(assignment);

      if (!withinSchedule && barberData.currentStatus !== "inactive") {
        try {
          await updateBarberStatus(barberId, {
            currentStatus: "inactive",
            isAccepting: false,
          });
          barberData.currentStatus = "inactive";
          barberData.isAccepting = false;
        } catch (e) {
          console.warn("No se pudo forzar inactivo:", e);
        }
      }

      setBarber(barberData);
      setQueueData(queue);
      setSelectedStatus(barberData?.currentStatus || "");
    } catch (err) {
      toast.error(
        mapApiError(err.message, "Error al cargar el workspace del barbero"),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const currentClient = useMemo(() => queueData?.current || null, [queueData]);
  const waitingQueue = useMemo(
    () => (Array.isArray(queueData?.queue) ? queueData.queue : []),
    [queueData],
  );

  const handleStatusUpdate = async () => {
    try {
      setSavingStatus(true);
      await updateBarberStatus(barberId, {
        currentStatus: selectedStatus,
        isAccepting: selectedStatus === "active",
      });
      toast.success("Estado actualizado correctamente.");
      await fetchAll();
    } catch (err) {
      toast.error(mapApiError(err.message, "Error al actualizar el estado"));
    } finally {
      setSavingStatus(false);
    }
  };

  const handleToggleAccepting = async () => {
    const newValue = !barber?.isAccepting;
    try {
      setSavingAccepting(true);
      await updateBarberStatus(barberId, { isAccepting: newValue });
      toast.success(
        newValue
          ? "Ahora estás aceptando clientes en tu cola."
          : "Tu cola está cerrada.",
      );
      await fetchAll();
    } catch (err) {
      toast.error(
        mapApiError(err.message, "Error al cambiar la disponibilidad"),
      );
    } finally {
      setSavingAccepting(false);
    }
  };

  const handleEndShift = async () => {
    try {
      setSavingStatus(true);
      await updateBarberStatus(barberId, {
        currentStatus: "inactive",
        isAccepting: false,
      });
      toast.success("Jornada finalizada correctamente.");
      await fetchAll();
    } catch (err) {
      toast.error(mapApiError(err.message, "Error al terminar la jornada"));
    } finally {
      setSavingStatus(false);
    }
  };

  const handleAttendTurn = async () => {
    if (!currentClient?.id) {
      toast.error("No hay cliente en servicio para finalizar.");
      return;
    }
    try {
      setAttendLoading(true);
      await attendTurn(currentClient.id);
      toast.success("Servicio finalizado correctamente.");
      await fetchAll();
    } catch (err) {
      toast.error(mapApiError(err.message, "Error al finalizar el servicio"));
    } finally {
      setAttendLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <span className="material-icons-round text-5xl animate-pulse">
            content_cut
          </span>
          <p className="text-sm font-medium">Cargando workspace...</p>
        </div>
      </div>
    );
  }

  if (!barber) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 max-w-md text-center text-sm">
          No se encontró el workspace del barbero.
        </div>
      </div>
    );
  }

  const isAccepting = barber?.isAccepting ?? false;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">
            Área de trabajo
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Gestiona tu jornada, visualiza tu cliente actual y tu fila.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors border border-red-100 shadow-sm disabled:opacity-50 shrink-0"
          onClick={handleEndShift}
          disabled={savingStatus}
        >
          <span className="material-icons-round text-sm">logout</span>
          Terminar jornada
        </button>
      </div>

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
                <Avatar
                  photoUrl={currentClient.photoUrl}
                  username={currentClient.ownerName}
                  size="lg"
                  className="border-4 border-white shadow-sm"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {currentClient.ownerName}
                  </h3>
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
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      turn.ownerStatus === "waiting"
                        ? "bg-amber-200 text-amber-800"
                        : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {turn.position}
                  </div>
                  <Avatar
                    photoUrl={turn.photoUrl}
                    username={turn.ownerName}
                    size="sm"
                    className="shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                      {turn.ownerName}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest mt-0.5 truncate">
                      {turn.ownerStatus === "waiting" ? "Pausado" : "En fila"}
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
