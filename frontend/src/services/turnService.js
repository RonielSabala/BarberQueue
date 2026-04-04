import API_URL from "./api";

function getErrorMessage(data, defaultMessage) {
  return data?.message || data?.error || data?.details || defaultMessage;
}

export async function getTurnById(turnId) {
  const response = await fetch(`${API_URL}/turns/${turnId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
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
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 404) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Error al obtener el turno activo del cliente")
    );
  }

  return data;
}

export async function createTurn(turnData) {
  const payload = {
    clientId: Number(turnData.clientId),
    barbershopId: Number(turnData.barbershopId),
  };

  if (turnData.barberId !== null && turnData.barberId !== undefined) {
    payload.barberId = Number(turnData.barberId);
  }

  if (
    Array.isArray(turnData.groupMembers) &&
    turnData.groupMembers.length > 0
  ) {
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
    headers: {
      "Content-Type": "application/json",
    },
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
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    let data = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    throw new Error(getErrorMessage(data, "Error al cancelar el turno"));
  }

  return true;
}
