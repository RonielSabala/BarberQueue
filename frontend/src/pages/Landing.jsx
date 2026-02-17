import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/landing.css";

function Landing() {
  return (
    <div className="landing-container">

      <div className="landing-content">
        <img src={logo} alt="BarberQueue Logo" className="landing-logo" />

        <h1 className="landing-title">
          Gestiona tu tiempo.
        </h1>

        <h2 className="landing-subtitle">
          Olvida las filas.
        </h2>

        <p className="landing-description">
          BarberQueue digitaliza la experiencia en barberías.
          Consulta la cola en tiempo real y ahorra tiempo.
        </p>

        <Link to="/login" className="landing-button">
          Iniciar sesión
        </Link>
      </div>

    </div>
  );
}

export default Landing;
