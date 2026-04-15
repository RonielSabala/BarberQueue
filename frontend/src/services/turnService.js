import API_URL from "./api";

function getErrorMessage(data, defaultMessage) {
  return data?.message || data?.error || data?.details || defaultMessage;
}

// Normaliza el response de GET /api/clients/{id}/turn
// Ese endpoint usa: status, username (en lugar de ownerStatus, ownerName)
// y agrega estimatedTime y estimatedGroupTime
function normalizeClientTurn(data) {
  if (!data) return null;

  return {
    ...data,
    // Aliases para compatibilidad con el frontend existente
    ownerStatus: data.ownerStatus ?? data.status ?? null,
    ownerName: data.ownerName ?? data.username ?? null,
    // Campos nuevos
    estimatedTime: data.estimatedTime ?? null,
    estimatedGroupTime: data.estimatedGroupTime ?? null,
    absolutePosition: data.absolutePosition ?? null,
    group: data.group ?? null,
  };
}

export async function getTurnById(turnId) {
  const response = await fetch(`${API_URL}/turns/${turnId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al obtener el turno"));
  }

  return data;
}

export async function getClientActiveTurn(clientId) {
  const response = await fetch(`${API_URL}/clients/${clientId}/turn`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 404) return null;

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Error al obtener el turno activo del cliente")
    );
  }

  return normalizeClientTurn(data);
}

export async function createTurn(turnData) {
  const payload = {
    clientId: Number(turnData.clientId),
    barbershopId: Number(turnData.barbershopId),
  };

  if (turnData.barberId !== null && turnData.barberId !== undefined) {
    payload.barberId = Number(turnData.barberId);
  }

  if (Array.isArray(turnData.groupMembers) && turnData.groupMembers.length > 0) {
    payload.groupMembers = turnData.groupMembers.map((member) => ({
      barberId:
        member.barberId === null || member.barberId === undefined
          ? null
          : Number(member.barberId),
      memberName: member.memberName,
    }));
  }

  const response = await fetch(`${API_URL}/turns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al crear el turno"));
  }

  return data;
}

export async function deleteTurn(turnId) {
  const response = await fetch(`${API_URL}/turns/${turnId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    let data = {};
    try { data = await response.json(); } catch { data = {}; }
    throw new Error(getErrorMessage(data, "Error al cancelar el turno"));
  }

  return true;
}

// PATCH /api/turns/{id}/attend
// Solo funciona si el turno está en in_service
// Pasa a attended → siguiente en cola pasa a in_service
export async function attendTurn(turnId) {
  const response = await fetch(`${API_URL}/turns/${turnId}/attend`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al finalizar el servicio"));
  }

  return data;
}

// PATCH /api/turns/{id}/wait
// Solo funciona si el turno está en on_queue
// Pasa a waiting → mantiene posición pero se salta cuando le toque
export async function waitTurn(turnId) {
  const response = await fetch(`${API_URL}/turns/${turnId}/wait`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al pausar el turno"));
  }

  return data;
}

// PATCH /api/turns/{id}/unwait
// Solo funciona si el turno está en waiting
// Vuelve a on_queue → si posición 1 y no hay in_service → pasa a in_service
export async function unwaitTurn(turnId) {
  const response = await fetch(`${API_URL}/turns/${turnId}/unwait`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al reactivar el turno"));
  }

  return data;
}

// PATCH /api/turns/{id}/pay
// Solo el cliente puede llamarlo
// El turno debe estar en attended
// Individual → pasa a paid
// Grupo → TODOS deben estar en attended para que pasen a paid
export async function payTurn(turnId) {
  const response = await fetch(`${API_URL}/turns/${turnId}/pay`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al registrar el pago"));
  }

  return data;
}
