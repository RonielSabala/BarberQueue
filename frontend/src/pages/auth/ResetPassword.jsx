import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

function ResetPassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentPassword) {
      setMessage("Debes ingresar tu contraseña actual.");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Las nuevas contraseñas no coinciden.");
      return;
    }

    setMessage("Contraseña actualizada correctamente. Redirigiendo...");

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <AuthLayout tagline="Establece tu nueva contraseña.">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Restablecer contraseña</h2>

        <input
          type="password"
          placeholder="Contraseña actual"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {message && <p className="message">{message}</p>}

        <button type="submit">Actualizar contraseña</button>

        <p>
          <Link to="/login">Volver al inicio de sesión</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;
