import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../services/userService";

function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const id = params.get("id");
    const username = params.get("username");
    const role = params.get("role");
    // Si el backend devuelve la foto en la URL la usamos como fallback inmediato
    const photoFromUrl = params.get("photoUrl") ?? params.get("photo") ?? null;

    if (!token || !id || !role) {
      setError("No se pudo completar el inicio de sesión con Google.");
      return;
    }

    const finalize = async () => {
      // Guardar token ANTES de cualquier fetch para que getAuthHeaders() lo lea
      localStorage.setItem("token", token);

      // Base del usuario con la foto de la URL si viene
      let userToSave = {
        id: Number(id),
        username,
        role,
        photoUrl: photoFromUrl,
      };

      // Intentar enriquecer con el perfil completo del backend
      try {
        const fullUser = await getUserById(Number(id));
        // Usar la foto del backend si existe; si no, mantener la de la URL
        userToSave = {
          ...userToSave,
          ...fullUser,
          id: Number(id),
          role,
          photoUrl: fullUser.photoUrl || photoFromUrl || null,
        };
      } catch {
        // Fallback: conservar lo que tenemos sin bloquear el flujo
      }

      localStorage.setItem("user", JSON.stringify(userToSave));

      if (role === "client") navigate("/client/home", { replace: true });
      else if (role === "barber") navigate("/barber/home", { replace: true });
      else if (role === "assistant")
        navigate("/assistant/home", { replace: true });
      else if (role === "admin") navigate("/admin/home", { replace: true });
      else navigate("/", { replace: true });
    };

    finalize();
  }, [navigate]);

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "DM Sans, sans-serif",
          background: "#f4f6fb",
          gap: "16px",
        }}
      >
        <p style={{ color: "#b91c1c", fontWeight: 600 }}>{error}</p>
        <a
          href="/login"
          style={{ color: "#3b82f6", fontWeight: 700, textDecoration: "none" }}
        >
          Volver al inicio de sesión
        </a>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "DM Sans, sans-serif",
        background: "#f4f6fb",
        gap: "12px",
      }}
    >
      <p style={{ color: "#1a2236", fontWeight: 600, fontSize: "16px" }}>
        Iniciando sesión con Google...
      </p>
      <p style={{ color: "#6b7694", fontSize: "14px" }}>
        Serás redirigido en un momento.
      </p>
    </div>
  );
}

export default AuthCallback;
