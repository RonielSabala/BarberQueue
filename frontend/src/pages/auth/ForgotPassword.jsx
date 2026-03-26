import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { forgotPassword } from "../../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const data = await forgotPassword(email);

      console.log("Respuesta forgot password:", data);

      setSuccessMessage(data.message || "Solicitud enviada correctamente.");
    } catch (err) {
      console.error("Error en forgot password:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout tagline="Recupera el acceso a tu cuenta.">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Recuperar contraseña</h2>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>

        <p>
          <Link to="/login">Volver al inicio de sesión</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default ForgotPassword;
