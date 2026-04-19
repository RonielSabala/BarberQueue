const fallbackImage = "https://via.placeholder.com/400x200?text=Barberia";

const DAY_LABELS = {
  1: "Lun",
  2: "Mar",
  3: "Mié",
  4: "Jue",
  5: "Vie",
  6: "Sáb",
  7: "Dom",
};

function formatTime(time) {
  if (!time) return "";
  return time.slice(0, 5); // "08:00:00" → "08:00"
}

/**
 * Card de barbería para el home del barber/assistant.
 *
 * Props:
 *  - shop: objeto de getMyBarbershops()
 *  - actionLabel: texto del botón principal (ej. "Ir a trabajar")
 *  - onAction: función al hacer click en el botón
 */
function EmployeeBarbershopCard({
  shop,
  actionLabel = "Ir a trabajar",
  onAction,
}) {
  const canWork = shop.canWork;

  let blockedReason = null;
  if (!shop.isOpen) {
    blockedReason = "Barbería cerrada";
  } else if (!shop.worksToday) {
    blockedReason = "No trabajas hoy aquí";
  } else if (!shop.inShift) {
    blockedReason = `Fuera de tu horario (${formatTime(shop.startTime)} - ${formatTime(shop.endTime)})`;
  }

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        opacity: canWork ? 1 : 0.75,
        transition: "box-shadow 0.2s",
      }}
    >
      {/* Imagen */}
      <div style={{ position: "relative" }}>
        <img
          src={shop.image || fallbackImage}
          alt={shop.name}
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
          style={{
            width: "100%",
            height: "150px",
            objectFit: "cover",
            backgroundColor: "#f3f3f3",
            display: "block",
          }}
        />
        {/* Badge estado barbería */}
        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "3px 10px",
            borderRadius: "99px",
            fontSize: "12px",
            fontWeight: 700,
            background: shop.isOpen ? "#dcfce7" : "#fee2e2",
            color: shop.isOpen ? "#16a34a" : "#dc2626",
          }}
        >
          {shop.isOpen ? "Abierta" : "Cerrada"}
        </span>
      </div>

      {/* Info */}
      <div
        style={{
          padding: "16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          {shop.name}
        </h3>

        {shop.address && (
          <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
            📍 {shop.address}
          </p>
        )}

        {shop.rating != null && (
          <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
            ⭐ {shop.rating}
          </p>
        )}

        {/* Horario */}
        <p style={{ margin: 0, fontSize: "13px", color: "#475569" }}>
          🕐 {formatTime(shop.startTime)} – {formatTime(shop.endTime)}
        </p>

        {/* Días */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            flexWrap: "wrap",
            marginTop: "2px",
          }}
        >
          {(shop.workingDays || []).map((d) => (
            <span
              key={d}
              style={{
                padding: "2px 8px",
                borderRadius: "99px",
                fontSize: "11px",
                fontWeight: 600,
                background: "#f1f5f9",
                color: "#475569",
              }}
            >
              {DAY_LABELS[d] || d}
            </span>
          ))}
        </div>

        {/* Razón de bloqueo */}
        {!canWork && blockedReason && (
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "12px",
              color: "#ef4444",
              fontWeight: 500,
            }}
          >
            ⚠️ {blockedReason}
          </p>
        )}
      </div>

      {/* Botón */}
      <div style={{ padding: "0 16px 16px" }}>
        <button
          onClick={onAction}
          disabled={!canWork}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            background: canWork ? "#2563eb" : "#e2e8f0",
            color: canWork ? "#fff" : "#94a3b8",
            fontWeight: 700,
            fontSize: "15px",
            cursor: canWork ? "pointer" : "not-allowed",
            transition: "background 0.15s",
          }}
        >
          {canWork ? actionLabel : "No disponible"}
        </button>
      </div>
    </div>
  );
}

export default EmployeeBarbershopCard;
