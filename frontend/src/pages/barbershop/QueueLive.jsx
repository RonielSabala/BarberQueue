import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import QueueColumn from "../../components/queue/QueueColumn";
import {
  getBarbershopClients,
  checkInBarbershopClient,
  checkOutBarbershopClient,
} from "../../services/barbershopService";
import { getBarbershopQueue } from "../../services/queueService";

function QueueLive() {
  const { id } = useParams();

  const [barbers, setBarbers] = useState([]);
  const [loadingQueue, setLoadingQueue] = useState(true);
  const [queueError, setQueueError] = useState("");

  const [clientsAtBarbershop, setClientsAtBarbershop] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [clientActionLoading, setClientActionLoading] = useState(false);
  const [clientError, setClientError] = useState("");
  const [clientSuccess, setClientSuccess] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = storedUser?.id;
  const currentUserRole = storedUser?.role;

  const isClient = currentUserRole === "client";
  const canManageClients =
    currentUserRole === "admin" ||
    currentUserRole === "assistant" ||
    currentUserRole === "barber";

  const activeBarbers = barbers.filter((b) => b.status === "active");
  const restingBarbers = barbers.filter((b) => b.status === "resting");

  const totalActivos = activeBarbers.reduce(
    (acc, b) => acc + (b.current ? 1 : 0) + (b.queue?.length || 0),
    0,
  );

  const fetchQueue = async () => {
    try {
      setLoadingQueue(true);
      setQueueError("");

      const data = await getBarbershopQueue(id);
      setBarbers(data);
    } catch (err) {
      console.error("Error al obtener cola de barbería:", err);
      setQueueError(err.message || "Error al cargar la cola");
    } finally {
      setLoadingQueue(false);
    }
  };

  const fetchClientsAtBarbershop = async () => {
    try {
      setLoadingClients(true);
      setClientError("");

      const data = await getBarbershopClients(id);
      setClientsAtBarbershop(data);
    } catch (err) {
      console.error("Error al obtener clientes en barbería:", err);
      setClientError(err.message || "Error al cargar los clientes en barbería");
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchQueue();
      fetchClientsAtBarbershop();
    }
  }, [id]);

  const currentUserCheckedIn = useMemo(() => {
    if (!currentUserId) return false;

    return clientsAtBarbershop.some(
      (client) => Number(client.clientId) === Number(currentUserId),
    );
  }, [clientsAtBarbershop, currentUserId]);

  const handleCheckIn = async () => {
    try {
      setClientActionLoading(true);
      setClientError("");
      setClientSuccess("");

      if (!currentUserId) {
        setClientError("Debes iniciar sesión para registrar tu llegada.");
        return;
      }

      await checkInBarbershopClient(id, currentUserId);

      setClientSuccess("Tu llegada fue registrada correctamente.");
      await fetchClientsAtBarbershop();
    } catch (err) {
      console.error("Error en check-in:", err);
      setClientError(
        err.message || "Error al registrar tu llegada en la barbería",
      );
    } finally {
      setClientActionLoading(false);
    }
  };

  const handleCheckOut = async (clientId) => {
    try {
      setClientActionLoading(true);
      setClientError("");
      setClientSuccess("");

      await checkOutBarbershopClient(id, clientId);

      setClientSuccess("Cliente retirado de la barbería correctamente.");
      await fetchClientsAtBarbershop();
    } catch (err) {
      console.error("Error en check-out:", err);
      setClientError(err.message || "Error al retirar el cliente");
    } finally {
      setClientActionLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight mb-1">
              Cola en tiempo real
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Sucursal BarberQueue · ID: {id}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Clientes Activos
              </p>
              <p className="text-2xl font-display font-bold text-primary">
                {totalActivos}{" "}
                <span className="text-slate-300 dark:text-slate-700">/ 20</span>
              </p>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-800"></div>
            <span className="material-icons-round text-slate-400 text-3xl">
              groups
            </span>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex-grow">
            {queueError && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                {queueError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingQueue ? (
                <p className="text-slate-500">Cargando cola...</p>
              ) : activeBarbers.length === 0 ? (
                <p className="text-slate-500">No hay barberos activos.</p>
              ) : (
                activeBarbers.map((barber) => (
                  <QueueColumn key={barber.id} barber={barber} />
                ))
              )}
            </div>

            <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                <span className="material-icons-round text-primary">
                  hourglass_empty
                </span>
                Espera General
              </h2>

              {loadingClients ? (
                <p className="text-slate-400 text-sm">Cargando clientes...</p>
              ) : clientsAtBarbershop.length === 0 ? (
                <p className="text-slate-400 text-sm italic">
                  No hay clientes registrados en espera general.
                </p>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {clientsAtBarbershop.map((client) => (
                    <div
                      key={client.clientId}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        <span className="material-icons-round text-slate-400">
                          person
                        </span>
                      </div>
                      <span className="text-xs font-medium text-slate-500 text-center max-w-[80px] break-words">
                        {client.username}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-full xl:w-80 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-icons-round text-slate-400">
                  hotel
                </span>
                Descansando
              </h3>
              <div className="space-y-4">
                {restingBarbers.length === 0 ? (
                  <p className="text-slate-400 text-sm italic py-2">
                    Ningún barbero descansando
                  </p>
                ) : (
                  restingBarbers.map((barber) => (
                    <div
                      key={barber.id}
                      className="flex items-center gap-4 group"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 grayscale opacity-50 flex items-center justify-center overflow-hidden">
                          <span className="material-icons-round text-slate-400">
                            face
                          </span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-slate-300 dark:bg-slate-700 rounded-full border-2 border-white dark:border-slate-900"></div>
                      </div>
                      <div>
                        <p className="font-bold text-slate-400">
                          {barber.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Regreso pendiente...
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-primary/10 dark:bg-primary/5 rounded-3xl p-6 border border-primary/20">
              <span className="material-icons-round text-primary mb-2 text-2xl">
                info
              </span>
              <h4 className="font-bold text-primary mb-2">
                Estimación de espera
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                El tiempo promedio de servicio actual es de{" "}
                <span className="font-bold text-primary">~25 minutos</span> por
                turno.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-icons-round text-slate-400">
                  storefront
                </span>
                Clientes en barbería
              </h3>

              {clientError && (
                <p className="text-sm text-red-500 mb-3">{clientError}</p>
              )}

              {clientSuccess && (
                <p className="text-sm text-green-600 mb-3">{clientSuccess}</p>
              )}

              {isClient && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">
                    Registra tu llegada para aparecer en la espera general de la
                    barbería.
                  </p>

                  {currentUserCheckedIn ? (
                    <div className="rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-green-700 text-sm font-medium">
                      Ya estás registrado dentro de la barbería.
                    </div>
                  ) : (
                    <button
                      onClick={handleCheckIn}
                      disabled={clientActionLoading}
                      className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-2xl transition disabled:opacity-60"
                    >
                      {clientActionLoading
                        ? "Registrando..."
                        : "Registrar llegada"}
                    </button>
                  )}
                </div>
              )}

              {canManageClients && (
                <div className="space-y-3">
                  {loadingClients ? (
                    <p className="text-slate-400 text-sm">
                      Cargando clientes...
                    </p>
                  ) : clientsAtBarbershop.length === 0 ? (
                    <p className="text-slate-400 text-sm italic">
                      No hay clientes dentro de la barbería.
                    </p>
                  ) : (
                    clientsAtBarbershop.map((client) => (
                      <div
                        key={client.clientId}
                        className="flex items-center justify-between gap-3 border border-slate-100 rounded-2xl p-3"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">
                            {client.username}
                          </p>
                          <p className="text-xs text-slate-500">
                            Estado: {client.currentStatus}
                          </p>
                        </div>

                        <button
                          onClick={() => handleCheckOut(client.clientId)}
                          disabled={clientActionLoading}
                          className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-2 rounded-xl transition disabled:opacity-60"
                        >
                          Check-out
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {!isClient && !canManageClients && (
                <p className="text-slate-400 text-sm italic">
                  No tienes permisos para gestionar clientes en esta barbería.
                </p>
              )}
            </div>

            <button className="w-full bg-primary hover:bg-blue-600 text-white font-bold h-14 px-6 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              Ver ticket
            </button>
          </div>
        </div>
      </main>
      <div className="h-20"></div>
    </div>
  );
}

export default QueueLive;
