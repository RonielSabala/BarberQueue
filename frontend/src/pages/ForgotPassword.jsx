import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/login.css";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset password for:", email);
  };

  return (
    <div className="login-container">

      {/* LADO IZQUIERDO */}
      <div className="login-left">
        <div className="brand-container">
          <img src={logo} alt="BarberQueue Logo" className="logo" />
          <p className="brand-tagline">
            Recupera el acceso a tu cuenta.
          </p>
        </div>
      </div>

      {/* LADO DERECHO */}
      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Recuperar contraseña</h2>

          <input
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">
            Enviar enlace
          </button>

          <p>
            <Link to="/login">Volver al inicio de sesión</Link>
          </p>

        </form>
      </div>

    </div>
  );
}

export default ForgotPassword;
