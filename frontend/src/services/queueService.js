import API_URL from "./api";

function getErrorMessage(data, fallback) {
  if (!data) return fallback;
  return data.message || data.error || data.details || fallback;
}

function normalizeBarbershopQueueItem(item) {
  const turns = Array.isArray(item?.turns) ? item.turns : [];

  const sortedTurns = [...turns].sort((a, b) => {
    const posA = a?.position ?? 9999;
    const posB = b?.position ?? 9999;
    return posA - posB;
  });

  const current =
    sortedTurns.find((turn) => turn.ownerStatus === "in_service") || null;

  const queue = sortedTurns.filter((turn) =>
    ["on_queue", "waiting"].includes(turn.ownerStatus)
  );

  return {
    id: item.barberId,
    name: item.barberName,
    status: item.barberStatus,
    isAccepting: item.isAccepting,
    current,
    queue,
    turns: sortedTurns,
  };
}

function normalizeSingleBarberQueue(data) {
  const turns = Array.isArray(data?.turns) ? data.turns : [];

  const sortedTurns = [...turns].sort((a, b) => {
    const posA = a?.position ?? 9999;
    const posB = b?.position ?? 9999;
    return posA - posB;
  });

  const current =
    sortedTurns.find((turn) => turn.ownerStatus === "in_service") || null;

  const queue = sortedTurns.filter((turn) =>
    ["on_queue", "waiting"].includes(turn.ownerStatus)
  );

  return {
    barberId: data?.barberId,
    barberName: data?.barberName,
    barberStatus: data?.barberStatus,
    isAccepting: data?.isAccepting,
    current,
    queue,
    turns: sortedTurns,
  };
}

export async function getBarbershopQueue(barbershopId) {
  const response = await fetch(`${API_URL}/queues/barbershop/${barbershopId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Error al obtener la cola de la barbería")
    );
  }

  return Array.isArray(data) ? data.map(normalizeBarbershopQueueItem) : [];
}

export async function getBarberQueue(barberId) {
  const response = await fetch(`${API_URL}/queues/barber/${barberId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Error al obtener la cola del barbero")
    );
  }

  return normalizeSingleBarberQueue(data);
}

// Devuelve los barberos de una barbería que están en resting,
// comparando employees vs los que ya aparecen en la cola (activos).
// activeBarberIds: Set de IDs que ya vienen en la cola
export async function getRestingBarbers(barbershopId, activeBarberIds = new Set()) {
  // 1. Obtener todos los employees de la barbería
  const empResponse = await fetch(
    `${API_URL}/barbershops/${barbershopId}/employees`,
    { method: "GET", headers: { "Content-Type": "application/json" } }
  );

  const employees = await empResponse.json();

  if (!empResponse.ok) {
    throw new Error(
      getErrorMessage(employees, "Error al obtener empleados de la barbería")
    );
  }

  // 2. Filtrar los que NO están en la cola activa (no son active)
  const nonActive = Array.isArray(employees)
    ? employees.filter(
        (emp) => emp.role === "barber" && !activeBarberIds.has(Number(emp.id))
      )
    : [];

  if (nonActive.length === 0) return [];

  // 3. Para cada uno, obtener su currentStatus individual
  const barberProfiles = await Promise.allSettled(
    nonActive.map((emp) =>
      fetch(`${API_URL}/barbers/${emp.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((r) => r.json())
    )
  );

  // 4. Quedarse solo con los que están en resting
  const resting = barberProfiles
    .filter(
      (result) =>
        result.status === "fulfilled" &&
        result.value?.currentStatus === "resting"
    )
    .map((result) => ({
      id: result.value.id,
      name: result.value.username,
      status: "resting",
      isAccepting: false,
      current: null,
      queue: [],
      turns: [],
    }));

  return resting;
}
