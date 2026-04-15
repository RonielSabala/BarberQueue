import API_URL from "./api";

function getErrorMessage(data, fallback) {
  if (!data) return fallback;

  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  if (typeof data.details === "string") return data.details;

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors
      .map((item) => item.message || item.msg || item)
      .join(", ");
  }

  if (Array.isArray(data.details) && data.details.length > 0) {
    return data.details
      .map((item) => item.message || item.msg || item)
      .join(", ");
  }

  return fallback;
}

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Error al registrar el cliente")
    );
  }

  return data;
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al iniciar sesión"));
  }

  return data;
}

export async function register(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al registrar usuario"));
  }

  return data;
}


export async function forgotPassword(email) {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Error al enviar la solicitud de recuperación")
    );
  }

  return data;
}

export async function resetPassword(data) {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resetCode: data.resetCode,
      password: data.password,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(result, "Error al restablecer la contraseña")
    );
  }

  return result;
}

// GET /api/auth/google/url
// Obtiene la URL de autenticación de Google desde el backend
export async function getGoogleAuthUrl() {
  const response = await fetch(`${API_URL}/auth/google/url`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Error al obtener la URL de Google")
    );
  }

  // El backend puede devolver { url: "https://..." } o la URL directamente
  return data?.url || data;
}
