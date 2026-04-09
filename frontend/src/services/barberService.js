import API_URL from "./api";

function getErrorMessage(data, defaultMessage) {
  return data?.message || data?.error || data?.details || defaultMessage;
}

export async function getBarberById(barberId) {
  const response = await fetch(`${API_URL}/barbers/${barberId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al obtener el barbero"));
  }

  return data;
}

export async function getBarberDashboard(barberId) {
  const response = await fetch(`${API_URL}/barbers/${barberId}/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Error al obtener el dashboard del barbero")
    );
  }

  return data;
}

export async function updateBarberStatus(barberId, statusData) {
  const response = await fetch(`${API_URL}/barbers/${barberId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentStatus: statusData.currentStatus,
      isAccepting: statusData.isAccepting,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Error al actualizar el estado del barbero")
    );
  }

  return data;
}

export async function getBarberReviews(barberId) {
  const response = await fetch(`${API_URL}/barbers/${barberId}/reviews`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Error al obtener las reseñas del barbero")
    );
  }

  return Array.isArray(data) ? data : [];
}

export async function createBarberReview(barberId, reviewData) {
  const response = await fetch(`${API_URL}/barbers/${barberId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clientId: Number(reviewData.clientId),
      rating: Number(reviewData.rating),
      content: reviewData.content,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Error al crear la reseña del barbero")
    );
  }

  return data;
}

export async function deleteBarberReview(barberId, reviewId) {
  const response = await fetch(
    `${API_URL}/barbers/${barberId}/reviews/${reviewId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    let data = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    throw new Error(
      getErrorMessage(data, "Error al eliminar la reseña del barbero")
    );
  }

  return true;
}
