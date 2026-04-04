import API_URL from "./api";

function buildQueryParams(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.append("search", filters.search.trim());
  }

  if (typeof filters.isOpen === "boolean") {
    params.append("isOpen", String(filters.isOpen));
  }

  if (filters.adminId) {
    params.append("adminId", String(filters.adminId));
  }

  return params.toString();
}

function getErrorMessage(data, defaultMessage) {
  return data?.message || data?.error || data?.details || defaultMessage;
}

function mapBarbershopToCard(shop) {
  return {
    id: shop.id,
    adminId: shop.adminId,
    name: shop.barbershopName,
    address: shop.barbershopAddress,
    image: shop.photoUrl,
    photoUrl: shop.photoUrl,
    rating: shop.averageRating,
    open: shop.isOpen,

    barbershopName: shop.barbershopName,
    barbershopAddress: shop.barbershopAddress,
    averageRating: shop.averageRating,
    isOpen: shop.isOpen,
  };
}

function mapBarbershopDetail(shop) {
  return {
    id: shop.id,
    name: shop.barbershopName,
    email: shop.email,
    phone: shop.phone,
    address: shop.barbershopAddress,
    image: shop.photoUrl,
    photoUrl: shop.photoUrl,
    opensAt: shop.opensAt,
    closesAt: shop.closesAt,
    capacity: shop.capacity,
    isActive: shop.isActive,
    isOpen: shop.isOpen,
    rating: shop.averageRating,

    barbershopName: shop.barbershopName,
    barbershopAddress: shop.barbershopAddress,
    averageRating: shop.averageRating,
  };
}

export async function getBarbershops(filters = {}) {
  const queryString = buildQueryParams(filters);
  const url = queryString
    ? `${API_URL}/barbershops?${queryString}`
    : `${API_URL}/barbershops`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al obtener las barberías"));
  }

  return Array.isArray(data) ? data.map(mapBarbershopToCard) : [];
}

export async function getBarbershopById(id) {
  const response = await fetch(`${API_URL}/barbershops/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al obtener la barbería"));
  }

  return mapBarbershopDetail(data);
}

export async function updateBarbershop(id, barbershopData) {
  const response = await fetch(`${API_URL}/barbershops/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      barbershopName: barbershopData.barbershopName,
      email: barbershopData.email,
      phone: barbershopData.phone,
      barbershopAddress: barbershopData.barbershopAddress,
      opensAt: barbershopData.opensAt,
      closesAt: barbershopData.closesAt,
      capacity: Number(barbershopData.capacity),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al actualizar la barbería"));
  }

  return data;
}

export async function updateBarbershopStatus(id, isActive) {
  const response = await fetch(`${API_URL}/barbershops/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isActive,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Error al actualizar el estado de la barbería")
    );
  }

  return data;
}

export async function getBarbershopDashboard(id) {
  const response = await fetch(`${API_URL}/barbershops/${id}/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al obtener el dashboard"));
  }

  return data;
}

export async function createBarbershop(barbershopData) {
  const response = await fetch(`${API_URL}/barbershops`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      adminId: Number(barbershopData.adminId),
      barbershopName: barbershopData.barbershopName,
      email: barbershopData.email,
      phone: barbershopData.phone,
      barbershopAddress: barbershopData.barbershopAddress,
      photoUrl: barbershopData.photoUrl,
      opensAt: barbershopData.opensAt,
      closesAt: barbershopData.closesAt,
      capacity: Number(barbershopData.capacity || 1),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Error al crear la barbería"
    );
  }

  return data;
}

export async function updateBarbershopPhoto(id, photoUrl) {
  const response = await fetch(`${API_URL}/barbershops/${id}/photo`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      photoUrl,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Error al actualizar la foto principal"
    );
  }

  return data;
}

export async function getBarbershopReviews(id) {
  const response = await fetch(`${API_URL}/barbershops/${id}/reviews`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Error al obtener las reseñas"
    );
  }

  return Array.isArray(data) ? data : [];
}

export async function createBarbershopReview(id, reviewData) {
  const response = await fetch(`${API_URL}/barbershops/${id}/reviews`, {
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
      data?.message || data?.error || "Error al crear la reseña"
    );
  }

  return data;
}

export async function deleteBarbershopReview(id, reviewId) {
  const response = await fetch(
    `${API_URL}/barbershops/${id}/reviews/${reviewId}`,
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
      data?.message || data?.error || "Error al eliminar la reseña"
    );
  }

  return true;
}

export async function getBarbershopEmployees(id) {
  const response = await fetch(`${API_URL}/barbershops/${id}/employees`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Error al obtener los empleados"
    );
  }

  return Array.isArray(data) ? data : [];
}

export async function createBarbershopEmployee(id, employeeData) {
  const response = await fetch(`${API_URL}/barbershops/${id}/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: employeeData.username,
      email: employeeData.email,
      phone: employeeData.phone,
      password: employeeData.password,
      role: employeeData.role,
      startTime: employeeData.startTime,
      endTime: employeeData.endTime,
      workingDays: employeeData.workingDays.map(Number),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Error al crear el empleado"
    );
  }

  return data;
}

export async function deleteBarbershopEmployee(id, employeeId) {
  const response = await fetch(
    `${API_URL}/barbershops/${id}/employees/${employeeId}`,
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
      data?.message || data?.error || "Error al eliminar el empleado"
    );
  }

  return true;
}

export async function getBarbershopClients(id) {
  const response = await fetch(`${API_URL}/barbershops/${id}/clients`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Error al obtener los clientes en barbería"
    );
  }

  return Array.isArray(data) ? data : [];
}

export async function checkInBarbershopClient(barbershopId, clientId) {
  const response = await fetch(
    `${API_URL}/barbershops/${barbershopId}/clients/${clientId}`,
    {
      method: "POST",
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
      data?.message || data?.error || "Error al hacer check-in del cliente"
    );
  }

  return true;
}

export async function checkOutBarbershopClient(barbershopId, clientId) {
  const response = await fetch(
    `${API_URL}/barbershops/${barbershopId}/clients/${clientId}`,
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
      data?.message || data?.error || "Error al hacer check-out del cliente"
    );
  }

  return true;
}
