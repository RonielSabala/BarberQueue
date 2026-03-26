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

    if (!resetCode) {
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

      console.log("Respuesta reset password:", data);

      setMessage(
        data.message ||
          "Contraseña restablecida correctamente. Redirigiendo...",
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Error en reset password:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout tagline="Establece tu nueva contraseña.">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Restablecer contraseña</h2>

        <input
          type="text"
          placeholder="Código de recuperación"
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value)}
        />

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Actualizando..." : "Actualizar contraseña"}
        </button>

        <p>
          <Link to="/login">Volver al inicio de sesión</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;
