import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { login } from "../../services/authService";
import logo from "../../assets/logo.png";

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

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "client") navigate("/client/home");
      else if (data.user.role === "barber") navigate("/barber/profile");
      else if (data.user.role === "assistant") navigate("/assistant/home");
      else if (data.user.role === "admin") navigate("/admin/home");
      else navigate("/");
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message || "Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-card-logo-row">
          <img src={logo} alt="BarberQueue" className="auth-card-logo" />
        </div>
        <h2 className="auth-card-title">Bienvenido</h2>
        <p className="auth-card-desc">Inicia sesión para continuar</p>

        {error && (
          <div className="auth-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="auth-forgot-row">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión →"}
          </button>
        </form>

        <div className="auth-divider">
          <div className="auth-divider-line"></div>
          <span className="auth-divider-text">o</span>
          <div className="auth-divider-line"></div>
        </div>

        <div className="auth-links">
          <p className="auth-link-row">
            ¿No tienes cuenta? <Link to="/register">Crear cuenta gratis</Link>
          </p>
          <p className="auth-link-secondary">
            <Link to="/reset-password">Actualizar contraseña</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;
