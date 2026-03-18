import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

function Login() {
  const [emailOrUser, setEmailOrUser] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Email/Usuario:", emailOrUser);
    console.log("Password:", password);
  };

  return (
    <AuthLayout>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>

        <input
          type="text"
          placeholder="Correo o Usuario"
          value={emailOrUser}
          onChange={(e) => setEmailOrUser(e.target.value)}
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
    </AuthLayout>
  );
}

export default Login;
