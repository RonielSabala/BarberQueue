import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { forgotPassword } from "../../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Debes ingresar tu correo electrónico.");
      return;
    }

    setLoading(true);

    try {
      const data = await forgotPassword(email.trim());
      setMessage(
        data.message ||
          "Te enviamos un código de recuperación a tu correo. Revisa tu bandeja de entrada.",
      );
    } catch (err) {
      console.error("Error en forgot password:", err);
      setError(err.message || "Error al enviar el correo de recuperación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2 className="auth-card-title">Recuperar cuenta</h2>
        <p className="auth-card-desc">
          Ingresa tu correo y te enviaremos un código para restablecer tu
          contraseña.
        </p>

        {error && (
          <div className="auth-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#166534",
              fontSize: "13px",
              fontWeight: 500,
              padding: "12px 16px",
              borderRadius: "12px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>✅</span>
            {message}
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

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
            style={{ marginTop: "8px" }}
          >
            {loading ? "Enviando..." : "Enviar código"}
          </button>
        </form>

        <div className="auth-divider">
          <div className="auth-divider-line"></div>
          <span className="auth-divider-text">o</span>
          <div className="auth-divider-line"></div>
        </div>

        <div className="auth-links">
          <p className="auth-link-row">
            <Link to="/login">← Volver al inicio de sesión</Link>
          </p>
          <p className="auth-link-secondary">
            ¿Ya tienes el código?{" "}
            <Link to="/reset-password">Restablecer contraseña</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;
