import API_URL from "./api";

export async function getBarberProfile(id) {

  const response = await fetch(`${API_URL}/barbers/${id}`);

  return await response.json();
}

export async function startShift(barberId) {

  const response = await fetch(`${API_URL}/barber/start-shift`, {
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

export async function finishService(barberId) {

  const response = await fetch(`${API_URL}/barber/finish-service`, {
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
