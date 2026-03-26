import logo from "../assets/logo.png";
import "../styles/auth/login.css";

function AuthLayout({
  children,
  tagline = "Gestiona tu tiempo. Olvida las filas.",
}) {
  return (
    <div className="login-container">
      <div className="login-left">
        <div className="brand-container">
          <img src={logo} alt="BarberQueue Logo" className="logo" />
          <p className="brand-tagline">{tagline}</p>
        </div>
      </div>

      <div className="login-right">{children}</div>
    </div>
  );
}

export default AuthLayout;
