import API_URL from "./api";

function getErrorMessage(data, defaultMessage) {
  return data?.message || data?.error || data?.details || defaultMessage;
}

function mapQueueBarber(barber) {
  const turns = Array.isArray(barber.turns) ? barber.turns : [];

  const currentTurn =
    turns.find((turn) => turn.ownerStatus === "in_service") ||
    turns.find((turn) => turn.position === 1) ||
    null;

  const queueTurns = currentTurn
    ? turns.filter((turn) => turn.id !== currentTurn.id)
    : turns;

  return {
    id: barber.barberId,
    name: barber.barberName,
    status: barber.barberStatus,
    isAccepting: barber.isAccepting,
    current: currentTurn
      ? {
          id: currentTurn.id,
          ownerId: currentTurn.ownerId,
          ownerName: currentTurn.ownerName,
          ownerType: currentTurn.ownerType,
          ownerStatus: currentTurn.ownerStatus,
          position: currentTurn.position,
          groupId: currentTurn.groupId,
          groupSize: currentTurn.groupSize,
        }
      : null,
    queue: queueTurns.map((turn) => ({
      id: turn.id,
      ownerId: turn.ownerId,
      ownerName: turn.ownerName,
      ownerType: turn.ownerType,
      ownerStatus: turn.ownerStatus,
      position: turn.position,
      groupId: turn.groupId,
      groupSize: turn.groupSize,
    })),
  };
}

export async function getBarbershopQueue(barbershopId) {
  const response = await fetch(
    `${API_URL}/queues/barbershop/${barbershopId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Error al obtener la cola de la barbería")
    );
  }

  return Array.isArray(data) ? data.map(mapQueueBarber) : [];
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

  return mapQueueBarber(data);
}
