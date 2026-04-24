import API_URL from "./api";

function getErrorMessage(data, fallback) {
  if (!data) return fallback;
  return data.message || data.error || data.details || fallback;
}

function normalizeTurns(turns) {
  const sorted = [...turns]
    .sort((a, b) => (a?.position ?? 9999) - (b?.position ?? 9999))
    .map((t) => ({ ...t, photoUrl: t.ownerPhotoUrl ?? t.photoUrl ?? null }));

  const current = sorted.find((t) => t.ownerStatus === "in_service") || null;
  const queue   = sorted.filter((t) => ["on_queue", "waiting"].includes(t.ownerStatus));

  return { current, queue, turns: sorted };
}

function normalizeBarbershopQueueItem(item) {
  const turns = Array.isArray(item?.turns) ? item.turns : [];
  const { current, queue, turns: sortedTurns } = normalizeTurns(turns);

  return {
    id: item.barberId,
    name: item.barberName,
    photoUrl: item.barberPhotoUrl ?? null,
    status: item.barberStatus,
    isAccepting: item.isAccepting,
    current,
    queue,
    turns: sortedTurns,
  };
}

function normalizeSingleBarberQueue(data) {
  const turns = Array.isArray(data?.turns) ? data.turns : [];
  const { current, queue, turns: sortedTurns } = normalizeTurns(turns);

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
    throw new Error(getErrorMessage(data, "Error al obtener la cola de la barbería"));
  }

  return Array.isArray(data) ? data.map(normalizeBarbershopQueueItem) : [];
}

export async function getBarberQueue(barberId) {
  const response = await fetch(`${API_URL}/queues/barber/${barberId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 404) {
    return {
      barberId,
      barberName: null,
      barberStatus: null,
      isAccepting: null,
      current: null,
      queue: [],
      turns: [],
    };
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al obtener la cola del barbero"));
  }

  return normalizeSingleBarberQueue(data);
}

export async function getRestingBarbers(barbershopId, activeBarberIds = new Set()) {
  const empResponse = await fetch(
    `${API_URL}/barbershops/${barbershopId}/employees`,
    { method: "GET", headers: { "Content-Type": "application/json" } }
  );

  const employees = await empResponse.json();

  if (!empResponse.ok) {
    throw new Error(getErrorMessage(employees, "Error al obtener empleados de la barbería"));
  }

  const nonActive = Array.isArray(employees)
    ? employees.filter((emp) => emp.role === "barber" && !activeBarberIds.has(Number(emp.id)))
    : [];

  if (nonActive.length === 0) return [];

  const barberProfiles = await Promise.allSettled(
    nonActive.map((emp) =>
      fetch(`${API_URL}/barbers/${emp.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((r) => r.json())
    )
  );

  return barberProfiles
    .filter((result) => result.status === "fulfilled" && result.value?.currentStatus === "resting")
    .map((result) => ({
      id: result.value.id,
      name: result.value.username,
      status: "resting",
      isAccepting: false,
      current: null,
      queue: [],
      turns: [],
    }));
}
