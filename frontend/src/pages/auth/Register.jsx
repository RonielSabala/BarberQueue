import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { registerUser } from "../../services/authService";
import logo from "../../assets/logo.png";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser({ username, email, phone, password });
      // Registro exitoso → ir al login
      navigate("/login");
    } catch (err) {
      console.error("Error en register:", err);
      setError(err.message || "Error al crear la cuenta. Intenta de nuevo.");
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
        <h2 className="auth-card-title">Crear cuenta</h2>
        <p className="auth-card-desc">Únete a BarberQueue gratis</p>

        {error && (
          <div className="auth-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              id="username"
              type="text"
              placeholder="tu_nombre"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

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
            <label htmlFor="phone">Teléfono</label>
            <input
              id="phone"
              type="text"
              placeholder="8091234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="tel"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta →"}
          </button>
        </form>

        <div className="auth-divider">
          <div className="auth-divider-line"></div>
          <span className="auth-divider-text">o</span>
          <div className="auth-divider-line"></div>
        </div>

        <div className="auth-links">
          <p className="auth-link-row">
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Register;
