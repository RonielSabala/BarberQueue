import logo from "../assets/logo.png";
import "../styles/auth/login.css";

function AuthLayout({ children }) {
  return (
    <div className="auth-container">
      {/* ─── Panel izquierdo ─── */}
      <div className="auth-left">
        <div className="auth-left-inner">
          <h1 className="auth-tagline">
            Gestiona tu tiempo.
            <br />
            <span>Olvida las filas.</span>
          </h1>

          <p className="auth-tagline-sub">
            La plataforma de gestión de colas para barberías modernas.
          </p>
        </div>
      </div>

      {/* ─── Panel derecho ─── */}
      <div className="auth-right">{children}</div>
    </div>
  );
}

export default AuthLayout;
