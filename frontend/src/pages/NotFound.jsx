import { useNavigate } from "react-router-dom";
import "../styles/NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      navigate("/");
      return;
    }
    if (user.role === "client") navigate("/client/home");
    else if (user.role === "barber") navigate("/barber/profile");
    else if (user.role === "assistant") navigate("/assistant/home");
    else if (user.role === "admin") navigate("/admin/home");
    else navigate("/");
  };

  return (
    <div className="nf-page">
      {/* Blobs de fondo */}
      <div className="nf-blob-1" />
      <div className="nf-blob-2" />

      {/* Elementos flotantes temáticos barbería */}
      <span className="nf-deco nf-deco-1">✂️</span>
      <span className="nf-deco nf-deco-2">💈</span>
      <span className="nf-deco nf-deco-3">🪒</span>
      <span className="nf-deco nf-deco-4">✂️</span>
      <span className="nf-deco nf-deco-5">💈</span>
      <span className="nf-deco nf-deco-6">🪒</span>

      <div className="nf-card">
        <div className="nf-badge">⚠️ Error 404</div>

        {/* 4 — silla — 4 */}
        <div className="nf-number-row">
          <span className="nf-digit">4</span>

          <div className="nf-chair-wrapper">
            {/* Silla de barbero SVG */}
            <svg
              className="nf-chair-svg"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Base / pie */}
              <rect x="42" y="82" width="16" height="6" rx="3" fill="#1a2236" />
              <rect
                x="30"
                y="88"
                width="40"
                height="5"
                rx="2.5"
                fill="#1a2236"
              />

              {/* Pata central */}
              <rect x="47" y="68" width="6" height="16" rx="3" fill="#253047" />

              {/* Asiento */}
              <rect
                x="22"
                y="58"
                width="56"
                height="12"
                rx="6"
                fill="#1a2236"
              />

              {/* Respaldo */}
              <rect
                x="28"
                y="28"
                width="44"
                height="32"
                rx="8"
                fill="#f07c0c"
              />

              {/* Detalle respaldo */}
              <rect
                x="36"
                y="36"
                width="28"
                height="16"
                rx="5"
                fill="#e06b00"
                opacity="0.5"
              />

              {/* Apoyabrazos izquierdo */}
              <rect x="18" y="52" width="12" height="6" rx="3" fill="#253047" />
              <rect
                x="18"
                y="42"
                width="5"
                height="12"
                rx="2.5"
                fill="#253047"
              />

              {/* Apoyabrazos derecho */}
              <rect x="70" y="52" width="12" height="6" rx="3" fill="#253047" />
              <rect
                x="77"
                y="42"
                width="5"
                height="12"
                rx="2.5"
                fill="#253047"
              />

              {/* Cabecera */}
              <rect
                x="32"
                y="22"
                width="36"
                height="10"
                rx="5"
                fill="#253047"
              />

              {/* Pequeño detalle naranja en cabecera */}
              <rect
                x="44"
                y="24"
                width="12"
                height="5"
                rx="2.5"
                fill="#f07c0c"
                opacity="0.6"
              />
            </svg>
          </div>

          <span className="nf-digit">4</span>
        </div>

        <h1 className="nf-title">¡Esta silla está vacía!</h1>
        <p className="nf-desc">
          La página que buscas no existe o fue movida.
          <br />
          Pero no te preocupes — <span>tu turno sigue en pie.</span>
        </p>

        <div className="nf-actions">
          <button className="nf-btn-primary" onClick={handleGoBack}>
            Volver al inicio
          </button>
          <button className="nf-btn-secondary" onClick={() => navigate("/")}>
            Ir al landing
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
