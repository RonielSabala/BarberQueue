import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset password for:", email);
  };

  return (
    <AuthLayout tagline="Recupera el acceso a tu cuenta.">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Recuperar contraseña</h2>

        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Enviar enlace</button>

        <p>
          <Link to="/login">Volver al inicio de sesión</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default ForgotPassword;
