import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { resetPassword } from "../../services/authService";

function ResetPassword() {
  const navigate = useNavigate();

  const [resetCode, setResetCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!resetCode.trim()) {
      setError("Debes ingresar el código de recuperación.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const data = await resetPassword({
        resetCode: Number(resetCode),
        password,
      });

      setMessage(
        data.message ||
          "Contraseña restablecida correctamente. Redirigiendo...",
      );

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Error en reset password:", err);
      setError(err.message || "Error al restablecer la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2 className="auth-card-title">Nueva contraseña</h2>
        <p className="auth-card-desc">
          Ingresa el código que recibiste y tu nueva contraseña.
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
            <label htmlFor="resetCode">Código de recuperación</label>
            <input
              id="resetCode"
              type="text"
              placeholder="Ej: 123456"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Nueva contraseña</label>
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

          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repite tu nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
            style={{ marginTop: "8px" }}
          >
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </button>
        </form>

        <div className="auth-links" style={{ marginTop: "8px" }}>
          <p className="auth-link-row">
            <Link to="/login">← Volver al inicio de sesión</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default ResetPassword;
