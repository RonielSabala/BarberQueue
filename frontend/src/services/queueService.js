import API_URL from "./api";

export async function getLiveQueue(barbershopId) {

  const response = await fetch(`${API_URL}/barbershops/${barbershopId}/queue`);

  return await response.json();
}

export async function joinQueue(barberId, clientName) {

  const response = await fetch(`${API_URL}/queue/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      barber_id: barberId,
      client_name: clientName
    })
  });

  return await response.json();
}

export async function nextClient(barberId) {

  const response = await fetch(`${API_URL}/queue/next`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      barber_id: barberId
    })
  });

  return await response.json();
}
