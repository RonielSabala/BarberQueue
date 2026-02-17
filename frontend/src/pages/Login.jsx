import { useState } from "react";
import "../styles/login.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";


function Login() {

  // Estado para guardar lo que el usuario escribe
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Función cuando se envía el formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // evita que la página se recargue

    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="login-container">

      <div className="login-left">
        <div className="brand-container">
         <img src={logo} alt="BarberQueue Logo" className="logo" />
         <p className="brand-tagline">
          Gestiona tu tiempo. Olvida las filas.
         </p>
       </div>
    </div>


      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Iniciar Sesión</h2>

          <input
            type="text"
            placeholder="Correo o Usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Entrar</button>

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
      </div>

    </div>
  );
}

export default Login;
