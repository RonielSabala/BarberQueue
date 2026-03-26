import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { login } from "../../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);

      console.log("Respuesta del login:", data);

      // Guardar token y usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirigir según el rol
      if (data.user.role === "client") {
        navigate("/client/home");
      } else if (data.user.role === "barber") {
        navigate("/barber/dashboard");
      } else if (data.user.role === "assistant") {
        navigate("/assistant/dashboard");
      } else if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>

        {error && <p className="error-message">{error}</p>}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Entrar"}
        </button>

        <p className="forgot-link">
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </p>

        <p className="forgot-link">
          <Link to="/reset-password">Actualizar contraseña</Link>
        </p>

        <p>
          ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;
