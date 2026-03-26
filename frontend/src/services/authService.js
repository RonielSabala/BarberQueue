import API_URL from "./api";

function getErrorMessage(data, defaultMessage) {
  return (
    data?.message ||
    data?.error ||
    data?.details ||
    data?.errors?.password?.[0] ||
    data?.errors?.email?.[0] ||
    data?.errors?.username?.[0] ||
    data?.errors?.phone?.[0] ||
    defaultMessage
  );
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
