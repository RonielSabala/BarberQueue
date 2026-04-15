import { useEffect, useMemo, useState } from "react";
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

export function mapCheckoutError(message) {
  const msg = message?.toLowerCase() || "";
  if (msg.includes("at_barbershop") || msg.includes("paid") || msg.includes("status")) {
    return "No puedes retirar a este cliente mientras tiene un turno activo. Cancela el turno primero.";
  }
  if (msg.includes("not found") || msg.includes("no encontrado")) {
    return "No se encontró el registro de este cliente en la barbería.";
  }
  return message || "Error al retirar el cliente.";
}

export function useQueueLive(id) {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = storedUser?.id;
  const currentUserRole = storedUser?.role;

  const isClient = currentUserRole === "client";
  const isAssistant = currentUserRole === "assistant";
  const canManageClients =
    currentUserRole === "admin" ||
    currentUserRole === "assistant" ||
    currentUserRole === "barber";

  // ─── Estado cola ────────────────────────────────────────────────────────────
  const [barbers, setBarbers] = useState([]);
  const [restingBarbers, setRestingBarbers] = useState([]);
  const [barbershopName, setBarbershopName] = useState("");
  const [barbershopCapacity, setBarbershopCapacity] = useState(null);
  const [loadingQueue, setLoadingQueue] = useState(true);
  const [queueError, setQueueError] = useState("");

  // ─── Estado clientes ─────────────────────────────────────────────────────────
  const [clientsAtBarbershop, setClientsAtBarbershop] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [clientActionLoading, setClientActionLoading] = useState(false);
  const [clientError, setClientError] = useState("");
  const [clientSuccess, setClientSuccess] = useState("");

  // ─── Estado turno propio ─────────────────────────────────────────────────────
  const [myTurn, setMyTurn] = useState(null);
  const [loadingMyTurn, setLoadingMyTurn] = useState(false);
  const [turnActionLoading, setTurnActionLoading] = useState(false);
  const [turnError, setTurnError] = useState("");
  const [turnSuccess, setTurnSuccess] = useState("");

  // ─── Estado modales ──────────────────────────────────────────────────────────
  const [isTurnModalOpen, setIsTurnModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // ─── Estado checkout assistant ───────────────────────────────────────────────
  const [checkoutActionLoading, setCheckoutActionLoading] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState("");

  // ─── Estado modal grupo cliente ──────────────────────────────────────────────
  const [selectedBarberId, setSelectedBarberId] = useState("");
  const [groupMode, setGroupMode] = useState("single");
  const [groupMembers, setGroupMembers] = useState([{ id: 1, memberName: "", barberId: "" }]);
  const [joiningGroup, setJoiningGroup] = useState(false);
  const [groupError, setGroupError] = useState("");

  // ─── Fetches ─────────────────────────────────────────────────────────────────

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
      setBarbershopCapacity(barbershopData?.capacity ?? null);
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
      if (isNoTurn) setMyTurn(null);
      else setTurnError(err.message || "Error al obtener tu turno");
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

  // ─── Computed ─────────────────────────────────────────────────────────────────

  const activeBarbers = useMemo(
    () => barbers.filter((b) => b.status === "active"),
    [barbers]
  );

  const totalActivos = useMemo(() => {
    const clientIdsInQueue = new Set();
    activeBarbers.forEach((b) => {
      if (b.current?.ownerId) clientIdsInQueue.add(Number(b.current.ownerId));
      b.queue?.forEach((t) => { if (t.ownerId) clientIdsInQueue.add(Number(t.ownerId)); });
    });
    const waitingOnly = clientsAtBarbershop.filter(
      (c) => !clientIdsInQueue.has(Number(c.clientId))
    ).length;
    return clientIdsInQueue.size + waitingOnly;
  }, [activeBarbers, clientsAtBarbershop]);

  const currentUserCheckedIn = useMemo(() => {
    if (!currentUserId) return false;
    const inClientList = clientsAtBarbershop.some(
      (c) => Number(c.clientId) === Number(currentUserId)
    );
    const hasActiveTurnHere =
      myTurn != null && Number(myTurn.barbershopId) === Number(id);
    return inClientList || hasActiveTurnHere;
  }, [clientsAtBarbershop, currentUserId, myTurn, id]);

  const currentBarberName = useMemo(() => {
    if (!myTurn) return "Sin asignar";
    if (myTurn.barberId == null) return "Sin asignar";
    const barber = barbers.find((b) => Number(b.id) === Number(myTurn.barberId));
    return barber?.name || myTurn.barberName || "Sin asignar";
  }, [myTurn, barbers]);

  const estimatedTurnTime = useMemo(() => {
    if (!myTurn) return "Sin turno";
    const status = myTurn.ownerStatus || myTurn.status;
    if (status === "in_service") return "Te están atendiendo ahora";
    if (status === "attended") return "Servicio finalizado — pendiente de pago";
    if (status === "waiting") return "Turno pausado — no perderás tu posición";
    if (myTurn.estimatedTime != null) {
      if (myTurn.estimatedTime === 0) return "Próximo en atención";
      return `~${Math.round(myTurn.estimatedTime)} minutos`;
    }
    if (!myTurn.position || myTurn.position <= 1) return "Próximo en atención";
    return `~${(myTurn.position - 1) * 20} minutos`;
  }, [myTurn]);

  const estimatedGroupTime = useMemo(() => {
    if (!myTurn?.estimatedGroupTime) return null;
    if (myTurn.estimatedGroupTime === 0) return "Todo el grupo siendo atendido";
    return `~${Math.round(myTurn.estimatedGroupTime)} minutos para todo el grupo`;
  }, [myTurn]);

  const isGroupLeader = useMemo(
    () => Boolean(myTurn?.group && Array.isArray(myTurn.group.members)),
    [myTurn]
  );

  const myTurnStatus = myTurn?.ownerStatus || myTurn?.status || null;

  const clientsWithTurns = useMemo(() => {
    const turns = [];
    activeBarbers.forEach((barber) => {
      if (barber.current) turns.push({ ...barber.current, barberName: barber.name });
      barber.queue?.forEach((t) => turns.push({ ...t, barberName: barber.name }));
    });
    return turns;
  }, [activeBarbers]);

  // ─── Helpers grupo ────────────────────────────────────────────────────────────

  const addGroupMember = () =>
    setGroupMembers((prev) => [...prev, { id: Date.now(), memberName: "", barberId: "" }]);

  const removeGroupMember = (memberId) => {
    if (groupMembers.length === 1) {
      setGroupMembers([{ id: 1, memberName: "", barberId: "" }]);
      return;
    }
    setGroupMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const updateGroupMember = (memberId, field, value) =>
    setGroupMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, [field]: value } : m))
    );

  const resetGroupModal = () => {
    setSelectedBarberId("");
    setGroupMode("single");
    setGroupMembers([{ id: 1, memberName: "", barberId: "" }]);
    setGroupError("");
  };

  // ─── Acciones ─────────────────────────────────────────────────────────────────

  const handleCheckIn = async () => {
    try {
      setClientActionLoading(true);
      setClientError("");
      setClientSuccess("");
      if (!currentUserId) { setClientError("Debes iniciar sesión para registrar tu llegada."); return; }
      await checkInBarbershopClient(id, currentUserId);
      setClientSuccess("Tu llegada fue registrada correctamente.");
      await fetchClientsAtBarbershop();
    } catch (err) {
      const msg = err.message?.toLowerCase() || "";
      if (msg.includes("already") || msg.includes("active in") || msg.includes("currently")) {
        setClientError("Ya estás registrado en otra barbería. Debes salir de ella antes de registrarte aquí.");
      } else if (msg.includes("not open") || msg.includes("closed")) {
        setClientError("Esta barbería está cerrada en este momento.");
      } else {
        setClientError(err.message || "Error al registrar tu llegada");
      }
    } finally {
      setClientActionLoading(false);
    }
  };

  const handleSelfCheckOut = async () => {
    try {
      setClientActionLoading(true);
      setClientError("");
      setClientSuccess("");
      await checkOutBarbershopClient(id, currentUserId);
      setClientSuccess("Saliste de la barbería correctamente.");
      setMyTurn(null);
      await Promise.all([fetchClientsAtBarbershop(), fetchQueue()]);
    } catch (err) {
      setClientError(mapCheckoutError(err.message));
    } finally {
      setClientActionLoading(false);
    }
  };

  const handleCancelClientTurn = async (turnId) => {
    try {
      setCheckoutActionLoading(`turn-${turnId}`);
      setCheckoutError("");
      setCheckoutSuccess("");
      await deleteTurn(turnId);
      setCheckoutSuccess("Turno cancelado correctamente.");
      await Promise.all([fetchQueue(), fetchClientsAtBarbershop()]);
    } catch (err) {
      setCheckoutError(err.message || "Error al cancelar el turno");
    } finally {
      setCheckoutActionLoading(null);
    }
  };

  const handleAssistantCheckOut = async (clientId) => {
    try {
      setCheckoutActionLoading(`checkout-${clientId}`);
      setCheckoutError("");
      setCheckoutSuccess("");
      await checkOutBarbershopClient(id, clientId);
      setCheckoutSuccess("Cliente retirado correctamente.");
      await Promise.all([fetchClientsAtBarbershop(), fetchQueue()]);
    } catch (err) {
      setCheckoutError(mapCheckoutError(err.message));
    } finally {
      setCheckoutActionLoading(null);
    }
  };

  const handleOpenJoinModal = (barberId) => {
    resetGroupModal();
    setSelectedBarberId(String(barberId));
    setIsGroupModalOpen(true);
  };

  const handleJoinQueue = async () => {
    try {
      setJoiningGroup(true);
      setGroupError("");
      if (!currentUserId) { setGroupError("Debes iniciar sesión para tomar un turno."); return; }
      if (!currentUserCheckedIn) { setGroupError("Primero debes registrar tu llegada a la barbería."); return; }
      if (myTurn) { setGroupError("Ya tienes un turno activo."); return; }

      let groupMembersPayload = [];
      if (groupMode === "group") {
        const valid = groupMembers.filter((m) => m.memberName.trim());
        if (!valid.length) { setGroupError("Agrega al menos un miembro al grupo."); return; }
        groupMembersPayload = valid.map((m) => ({
          memberName: m.memberName.trim(),
          barberId: m.barberId ? Number(m.barberId) : null,
        }));
      }

      const createdTurns = await createTurn({
        clientId: currentUserId,
        barbershopId: Number(id),
        barberId: selectedBarberId ? Number(selectedBarberId) : null,
        groupMembers: groupMembersPayload,
      });

      const turnsArray = Array.isArray(createdTurns) ? createdTurns : [createdTurns];
      const mainTurn = turnsArray.find((t) => t.ownerType === "client") || turnsArray[0];
      if (mainTurn) setMyTurn(mainTurn);

      setTurnSuccess(groupMode === "group" ? "Grupo registrado correctamente en la cola." : "Te registraste correctamente en la cola del barbero.");
      setIsGroupModalOpen(false);
      resetGroupModal();
      await Promise.all([fetchQueue(), fetchClientsAtBarbershop(), fetchMyTurn()]);
    } catch (err) {
      setGroupError(err.message || "Error al registrarte en la cola");
    } finally {
      setJoiningGroup(false);
    }
  };

  const handleCancelMyTurn = async () => {
    try {
      setTurnActionLoading(true);
      setTurnError("");
      setTurnSuccess("");
      if (!myTurn?.id) { setTurnError("No se encontró un turno activo para cancelar."); return; }
      await deleteTurn(myTurn.id);
      setTurnSuccess("Tu turno fue cancelado correctamente.");
      setMyTurn(null);
      setIsTurnModalOpen(false);
      await Promise.all([fetchQueue(), fetchClientsAtBarbershop(), fetchMyTurn()]);
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
      if (!myTurn?.id) { setTurnError("No se encontró un turno activo."); return; }
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
      if (!myTurn?.id) { setTurnError("No se encontró un turno activo."); return; }
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
      if (!myTurn?.id) { setTurnError("No se encontró un turno para pagar."); return; }
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

  return {
    // Roles
    isClient, isAssistant, canManageClients, currentUserId,

    // Cola
    barbers, activeBarbers, restingBarbers,
    barbershopName, barbershopCapacity,
    loadingQueue, queueError,
    totalActivos, clientsWithTurns,

    // Clientes en barbería
    clientsAtBarbershop, loadingClients,
    clientActionLoading, clientError, clientSuccess,
    currentUserCheckedIn,

    // Mi turno
    myTurn, loadingMyTurn,
    turnActionLoading, turnError, turnSuccess,
    myTurnStatus, isGroupLeader,
    currentBarberName, estimatedTurnTime, estimatedGroupTime,

    // Modales
    isTurnModalOpen, setIsTurnModalOpen,
    isRegisterModalOpen, setIsRegisterModalOpen,
    isCheckoutModalOpen, setIsCheckoutModalOpen,
    isGroupModalOpen, setIsGroupModalOpen,

    // Checkout assistant
    checkoutActionLoading, checkoutError, checkoutSuccess,
    setCheckoutError, setCheckoutSuccess,

    // Grupo cliente
    selectedBarberId, setSelectedBarberId,
    groupMode, setGroupMode,
    groupMembers, groupError,
    joiningGroup,
    addGroupMember, removeGroupMember, updateGroupMember,

    // Fetches
    fetchQueue, fetchClientsAtBarbershop, fetchMyTurn,

    // Acciones
    handleCheckIn, handleSelfCheckOut,
    handleCancelClientTurn, handleAssistantCheckOut,
    handleOpenJoinModal, handleJoinQueue,
    handleCancelMyTurn, handleWaitMyTurn,
    handleUnwaitMyTurn, handlePayMyTurn,
  };
}
