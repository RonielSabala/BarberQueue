import API_URL from "./api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function getErrorMessage(data, defaultMessage) {
  return (
    data?.message ||
    data?.error ||
    data?.details ||
    data?.errors?.username?.[0] ||
    data?.errors?.email?.[0] ||
    data?.errors?.phone?.[0] ||
    data?.errors?.currentPassword?.[0] ||
    data?.errors?.newPassword?.[0] ||
    defaultMessage
  );
}

export async function getUserById(id) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al obtener el perfil"));
  }

  return data;
}

export async function updateUserProfile(id, userData) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al actualizar el perfil"));
  }

  return data;
}

export async function changeUserPassword(id, passwordData) {
  const response = await fetch(`${API_URL}/users/${id}/password`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al cambiar la contraseña"));
  }

  return data;
}
