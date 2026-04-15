import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import QueueColumn from "../../components/queue/QueueColumn";
import AssistantRegisterPanel from "../../components/assistant/AssistantRegisterPanel";
import {
  getBarbershopClients,
  getBarbershopById,
  checkInBarbershopClient,
  checkOutBarbershopClient,
} from "../../services/barbershopService";
import {
  getBarbershopQueue,
  getRestingBarbers,
} from "../../services/queueService";
import {
  createTurn,
  deleteTurn,
  getClientActiveTurn,
  waitTurn,
  unwaitTurn,
  payTurn,
} from "../../services/turnService";

const STATUS_LABELS = {
  at_barbershop: "En barbería",
  on_queue: "En cola",
  waiting: "Pausado",
  in_service: "En servicio",
  attended: "Atendido",
  paid: "Pagado",
};

function QueueLive() {
  const { id } = useParams();

  const [barbers, setBarbers] = useState([]);
  const [restingBarbers, setRestingBarbers] = useState([]);
  const [barbershopName, setBarbershopName] = useState("");
  const [loadingQueue, setLoadingQueue] = useState(true);
  const [queueError, setQueueError] = useState("");

  const [clientsAtBarbershop, setClientsAtBarbershop] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [clientActionLoading, setClientActionLoading] = useState(false);
  const [clientError, setClientError] = useState("");
  const [clientSuccess, setClientSuccess] = useState("");

  const [myTurn, setMyTurn] = useState(null);
  const [loadingMyTurn, setLoadingMyTurn] = useState(false);
  const [turnActionLoading, setTurnActionLoading] = useState(false);
  const [turnError, setTurnError] = useState("");
  const [turnSuccess, setTurnSuccess] = useState("");
  const [isTurnModalOpen, setIsTurnModalOpen] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = storedUser?.id;
  const currentUserRole = storedUser?.role;

  const isClient = currentUserRole === "client";
  const isAssistant = currentUserRole === "assistant";
  const canManageClients =
    currentUserRole === "admin" ||
    currentUserRole === "assistant" ||
    currentUserRole === "barber";

  const activeBarbers = barbers.filter((b) => b.status === "active");

  const totalActivos = activeBarbers.reduce(
    (acc, b) => acc + (b.current ? 1 : 0) + (b.queue?.length || 0),
    0,
  );

  // ─── Fetches ───────────────────────────────────────────────────────────────

  const fetchQueue = async () => {
    try {
      setLoadingQueue(true);
      setQueueError("");
      const [queueData, barbershopData] = await Promise.all([
        getBarbershopQueue(id),
        getBarbershopById(id),
      ]);
      setBarbers(queueData);
      setBarbershopName(barbershopData?.name || "");
      const activeIds = new Set(queueData.map((b) => Number(b.id)));
      const resting = await getRestingBarbers(id, activeIds);
      setRestingBarbers(resting);
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

  const fetchMyTurn = async () => {
    if (!isClient || !currentUserId) return;
    try {
      setLoadingMyTurn(true);
      setTurnError("");
      const data = await getClientActiveTurn(currentUserId);
      setMyTurn(data);
    } catch (err) {
      const msg = err.message?.toLowerCase() || "";
      const isNoTurn =
        msg.includes("checked into") ||
        msg.includes("no active") ||
        msg.includes("not found") ||
        msg.includes("no tiene") ||
        msg.includes("barbershop");

      if (isNoTurn) {
        setMyTurn(null);
      } else {
        console.error("Error al obtener mi turno:", err);
        setTurnError(err.message || "Error al obtener tu turno");
      }
    } finally {
      setLoadingMyTurn(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchQueue();
      fetchClientsAtBarbershop();
      if (isClient && currentUserId) fetchMyTurn();
    }
  }, [id, currentUserId, isClient]);

  // ─── Computed ──────────────────────────────────────────────────────────────

  const currentUserCheckedIn = useMemo(() => {
    if (!currentUserId) return false;

    // Está en la lista de clientes en espera general de esta barbería
    const inClientList = clientsAtBarbershop.some(
      (client) => Number(client.clientId) === Number(currentUserId),
    );

    // O tiene un turno activo en esta barbería específica
    const hasActiveTurnHere =
      myTurn !== null &&
      myTurn !== undefined &&
      Number(myTurn.barbershopId) === Number(id);

    return inClientList || hasActiveTurnHere;
  }, [clientsAtBarbershop, currentUserId, myTurn, id]);

  const currentBarberName = useMemo(() => {
    if (!myTurn) return "Sin asignar";
    if (myTurn.barberId === null || myTurn.barberId === undefined)
      return "Sin asignar";
    const barber = barbers.find(
      (item) => Number(item.id) === Number(myTurn.barberId),
    );
    return barber?.name || myTurn.barberName || "Sin asignar";
  }, [myTurn, barbers]);

  const estimatedTurnTime = useMemo(() => {
    if (!myTurn) return "Sin turno";
    const status = myTurn.ownerStatus || myTurn.status;

    if (status === "in_service") return "Te están atendiendo ahora";
    if (status === "attended") return "Servicio finalizado — pendiente de pago";
    if (status === "waiting") return "Turno pausado — no perderás tu posición";

    // Usar estimatedTime del backend si está disponible
    if (myTurn.estimatedTime !== null && myTurn.estimatedTime !== undefined) {
      if (myTurn.estimatedTime === 0) return "Próximo en atención";
      return `~${Math.round(myTurn.estimatedTime)} minutos`;
    }

    // Fallback manual
    if (!myTurn.position || myTurn.position <= 1) return "Próximo en atención";
    const minutes = (myTurn.position - 1) * 20;
    return `~${minutes} minutos`;
  }, [myTurn]);

  // Tiempo estimado del grupo completo (solo líder)
  const estimatedGroupTime = useMemo(() => {
    if (!myTurn?.estimatedGroupTime) return null;
    if (myTurn.estimatedGroupTime === 0) return "Todo el grupo siendo atendido";
    return `~${Math.round(myTurn.estimatedGroupTime)} minutos para todo el grupo`;
  }, [myTurn]);

  const isGroupLeader = useMemo(() => {
    return Boolean(myTurn?.group && Array.isArray(myTurn.group.members));
  }, [myTurn]);

  const myTurnStatus = myTurn?.ownerStatus || myTurn?.status || null;

  // ─── Acciones ──────────────────────────────────────────────────────────────

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
      // Si el backend indica que ya está en otra barbería, mostramos mensaje legible
      const msg = err.message?.toLowerCase() || "";
      const alreadyElsewhere =
        msg.includes("already") ||
        msg.includes("active in") ||
        msg.includes("currently");

      const notOpen =
        msg.includes("not open") ||
        msg.includes("closed") ||
        msg.includes("cerrada");

      if (alreadyElsewhere) {
        setClientError(
          "Ya estás registrado en otra barbería. Debes salir de ella antes de registrarte aquí.",
        );
      } else if (notOpen) {
        setClientError("Esta barbería está cerrada en este momento.");
      } else {
        setClientError(err.message || "Error al registrar tu llegada");
      }
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
      setClientSuccess("Cliente retirado correctamente.");
      await fetchClientsAtBarbershop();
    } catch (err) {
      setClientError(err.message || "Error al retirar el cliente");
    } finally {
      setClientActionLoading(false);
    }
  };

  const handleJoinBarberQueue = async (barberId) => {
    try {
      setTurnActionLoading(true);
      setTurnError("");
      setTurnSuccess("");
      if (!currentUserId) {
        setTurnError("Debes iniciar sesión para tomar un turno.");
        return;
      }
      if (!currentUserCheckedIn) {
        setTurnError("Primero debes registrar tu llegada a la barbería.");
        return;
      }
      if (myTurn) {
        setTurnError("Ya tienes un turno activo.");
        return;
      }
      const createdTurns = await createTurn({
        clientId: currentUserId,
        barbershopId: Number(id),
        barberId: Number(barberId),
      });
      const mainTurn = Array.isArray(createdTurns)
        ? createdTurns.find(
            (turn) =>
              Number(turn.ownerId) === Number(currentUserId) &&
              turn.ownerType === "client",
          )
        : createdTurns;
      if (mainTurn) setMyTurn(mainTurn);
      setTurnSuccess("Te registraste correctamente en la cola del barbero.");
      await Promise.all([
        fetchQueue(),
        fetchClientsAtBarbershop(),
        fetchMyTurn(),
      ]);
    } catch (err) {
      setTurnError(err.message || "Error al registrarte en la cola");
    } finally {
      setTurnActionLoading(false);
    }
  };

  const handleCancelMyTurn = async () => {
    try {
      setTurnActionLoading(true);
      setTurnError("");
      setTurnSuccess("");
      if (!myTurn?.id) {
        setTurnError("No se encontró un turno activo para cancelar.");
        return;
      }
      await deleteTurn(myTurn.id);
      setTurnSuccess("Tu turno fue cancelado correctamente.");
      setMyTurn(null);
      setIsTurnModalOpen(false);
      await Promise.all([
        fetchQueue(),
        fetchClientsAtBarbershop(),
        fetchMyTurn(),
      ]);
    } catch (err) {
      setTurnError(err.message || "Error al cancelar el turno");
    } finally {
      setTurnActionLoading(false);
    }
  };

  const handleWaitMyTurn = async () => {
    try {
      setTurnActionLoading(true);
      setTurnError("");
      setTurnSuccess("");
      if (!myTurn?.id) {
        setTurnError("No se encontró un turno activo.");
        return;
      }
      await waitTurn(myTurn.id);
      setTurnSuccess("Tu turno está pausado. No perderás tu posición.");
      await fetchMyTurn();
      await fetchQueue();
    } catch (err) {
      setTurnError(err.message || "Error al pausar el turno");
    } finally {
      setTurnActionLoading(false);
    }
  };

  const handleUnwaitMyTurn = async () => {
    try {
      setTurnActionLoading(true);
      setTurnError("");
      setTurnSuccess("");
      if (!myTurn?.id) {
        setTurnError("No se encontró un turno activo.");
        return;
      }
      await unwaitTurn(myTurn.id);
      setTurnSuccess("¡De vuelta en cola! Tu posición fue restaurada.");
      await fetchMyTurn();
      await fetchQueue();
    } catch (err) {
      setTurnError(err.message || "Error al reactivar el turno");
    } finally {
      setTurnActionLoading(false);
    }
  };

  const handlePayMyTurn = async () => {
    try {
      setTurnActionLoading(true);
      setTurnError("");
      setTurnSuccess("");
      if (!myTurn?.id) {
        setTurnError("No se encontró un turno para pagar.");
        return;
      }
      await payTurn(myTurn.id);
      setTurnSuccess("¡Pago registrado! Gracias por tu visita.");
      setMyTurn(null);
      setIsTurnModalOpen(false);
      await Promise.all([fetchQueue(), fetchClientsAtBarbershop()]);
    } catch (err) {
      setTurnError(err.message || "Error al registrar el pago");
    } finally {
      setTurnActionLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight mb-1">
              Cola en tiempo real
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {barbershopName || "Sucursal BarberQueue"}
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

        {turnSuccess && (
          <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {turnSuccess}
          </div>
        )}
        {turnError && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {turnError}
          </div>
        )}

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
                  <QueueColumn
                    key={barber.id}
                    barber={barber}
                    showJoinAction={isClient}
                    canJoin={currentUserCheckedIn && !myTurn}
                    joining={turnActionLoading}
                    onJoinQueue={handleJoinBarberQueue}
                  />
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
                {loadingQueue ? (
                  <p className="text-slate-400 text-sm">Cargando...</p>
                ) : restingBarbers.length === 0 ? (
                  <p className="text-slate-400 text-sm italic py-2">
                    Ningún barbero descansando
                  </p>
                ) : (
                  restingBarbers.map((barber) => (
                    <div key={barber.id} className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 grayscale opacity-50 flex items-center justify-center overflow-hidden">
                          <span className="material-icons-round text-slate-400">
                            face
                          </span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white dark:border-slate-900"></div>
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
                <span className="font-bold text-primary">~20 minutos</span> por
                turno.
              </p>
            </div>

            {isAssistant ? (
              <AssistantRegisterPanel
                barbers={activeBarbers}
                barbershopId={id}
                onRegistered={async () => {
                  await Promise.all([fetchQueue(), fetchClientsAtBarbershop()]);
                }}
              />
            ) : (
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
                      Registra tu llegada para aparecer en la espera general de
                      la barbería.
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
                    {currentUserCheckedIn && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsTurnModalOpen(true);
                          fetchMyTurn();
                        }}
                        disabled={loadingMyTurn}
                        className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-2xl transition disabled:opacity-60"
                      >
                        {loadingMyTurn ? "Cargando..." : "Ver mi turno"}
                      </button>
                    )}
                  </div>
                )}

                {canManageClients && !isClient && (
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
                              Estado:{" "}
                              {STATUS_LABELS[client.currentStatus] ||
                                client.currentStatus}
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
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ─── Modal Mi turno ─────────────────────────────────────────────────── */}
      {isTurnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Mi turno</h2>
                <p className="text-sm text-slate-500">
                  Información actual de tu turno en la barbería.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTurnModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-icons-round">close</span>
              </button>
            </div>

            {loadingMyTurn ? (
              <p className="text-slate-500">Cargando turno...</p>
            ) : !myTurn ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-slate-600">
                  No tienes un turno activo en este momento.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase font-bold text-slate-400 mb-1">
                      Cliente
                    </p>
                    <p className="font-bold text-slate-800">
                      {myTurn.ownerName || myTurn.username}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase font-bold text-slate-400 mb-1">
                      Estado
                    </p>
                    <p className="font-bold text-slate-800">
                      {STATUS_LABELS[myTurnStatus] || myTurnStatus}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase font-bold text-slate-400 mb-1">
                      Barbero
                    </p>
                    <p className="font-bold text-slate-800">
                      {currentBarberName}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase font-bold text-slate-400 mb-1">
                      Posición
                    </p>
                    <p className="font-bold text-slate-800">
                      {myTurn.position ?? "—"}
                      {myTurn.absolutePosition != null &&
                        myTurn.absolutePosition !== myTurn.position && (
                          <span className="text-xs font-normal text-slate-400 ml-2">
                            (absoluta: {myTurn.absolutePosition})
                          </span>
                        )}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase font-bold text-slate-400 mb-1">
                      Tiempo estimado
                    </p>
                    <p className="font-bold text-slate-800">
                      {estimatedTurnTime}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase font-bold text-slate-400 mb-1">
                      Tipo de turno
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                        {isGroupLeader ? "Grupo" : "Individual"}
                      </span>
                      {isGroupLeader && (
                        <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                          Líder de grupo
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tiempo estimado del grupo completo — solo líder */}
                {isGroupLeader && estimatedGroupTime && (
                  <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 flex items-center gap-3">
                    <span className="material-icons-round text-blue-500 text-base">
                      group
                    </span>
                    <p className="text-sm font-semibold text-blue-700">
                      {estimatedGroupTime}
                    </p>
                  </div>
                )}

                {isGroupLeader && (
                  <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Grupo #{myTurn.group.groupId}
                        </p>
                        <p className="text-xs text-slate-500">
                          Estás registrado como líder de grupo.
                        </p>
                      </div>
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                        {myTurn.group.members.length} miembro
                        {myTurn.group.members.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {myTurn.group.members.map((member) => {
                        const memberStatus = member.status;
                        const hidePosition = ["attended", "paid"].includes(
                          memberStatus,
                        );
                        return (
                          <div
                            key={member.id}
                            className="rounded-2xl bg-white border border-slate-200 p-4"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div>
                                <p className="font-bold text-slate-800">
                                  {member.memberName}
                                </p>
                                <p className="text-sm text-slate-500">
                                  Miembro del grupo
                                </p>
                                {member.estimatedTime != null &&
                                  !hidePosition && (
                                    <p className="text-xs text-slate-400 mt-1">
                                      {member.estimatedTime === 0
                                        ? "Siendo atendido"
                                        : `~${Math.round(member.estimatedTime)} min`}
                                    </p>
                                  )}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {!hidePosition && (
                                  <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                    Posición: {member.position ?? "—"}
                                  </span>
                                )}
                                <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                  {STATUS_LABELS[memberStatus] || memberStatus}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                  {myTurnStatus === "on_queue" && (
                    <button
                      type="button"
                      onClick={handleWaitMyTurn}
                      disabled={turnActionLoading}
                      className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold py-3 rounded-2xl transition disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      <span className="material-icons-round text-base">
                        pause_circle
                      </span>
                      {turnActionLoading ? "Pausando..." : "Salir un momento"}
                    </button>
                  )}
                  {myTurnStatus === "waiting" && (
                    <button
                      type="button"
                      onClick={handleUnwaitMyTurn}
                      disabled={turnActionLoading}
                      className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 font-bold py-3 rounded-2xl transition disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      <span className="material-icons-round text-base">
                        play_circle
                      </span>
                      {turnActionLoading ? "Volviendo..." : "Volver a la cola"}
                    </button>
                  )}
                  {myTurnStatus === "attended" && (
                    <button
                      type="button"
                      onClick={handlePayMyTurn}
                      disabled={turnActionLoading}
                      className="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-2xl transition disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      <span className="material-icons-round text-base">
                        payments
                      </span>
                      {turnActionLoading ? "Procesando..." : "Confirmar pago"}
                    </button>
                  )}
                  {!["in_service", "attended", "paid"].includes(
                    myTurnStatus,
                  ) && (
                    <button
                      type="button"
                      onClick={handleCancelMyTurn}
                      disabled={turnActionLoading}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-2xl transition disabled:opacity-60"
                    >
                      {turnActionLoading ? "Cancelando..." : "Cancelar turno"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsTurnModalOpen(false)}
                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-2xl transition"
                  >
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="h-20"></div>
    </div>
  );
}

export default QueueLive;
