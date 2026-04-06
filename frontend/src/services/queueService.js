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
    headers: {
      "Content-Type": "application/json",
    },
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
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Error al obtener la cola del barbero")
    );
  }

  return normalizeSingleBarberQueue(data);
}
