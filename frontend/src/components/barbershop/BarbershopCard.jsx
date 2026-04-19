import { useNavigate } from "react-router-dom";

function BarbershopCard({ shop }) {
  const navigate = useNavigate();

  const fallbackImage = "https://via.placeholder.com/400x200?text=Barberia";

  // isActive = estado controlado por admin (abierta/cerrada manualmente)
  // open = alias de isActive que viene del mapper
  const isOpen = shop.isActive ?? shop.open ?? false;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "15px",
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
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
          borderRadius: "10px",
          marginBottom: "10px",
          backgroundColor: "#f3f3f3",
        }}
      />

      <h3
        style={{
          marginBottom: "8px",
          fontSize: "20px",
          lineHeight: "1.3",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minHeight: "52px",
          wordBreak: "break-word",
        }}
        title={shop.name}
      >
        {shop.name}
      </h3>

      <p style={{ marginBottom: "6px" }}>⭐ {shop.rating ?? "Sin rating"}</p>

      <p style={{ marginBottom: "12px" }}>
        Estado:{" "}
        <span style={{ color: isOpen ? "green" : "red", fontWeight: "bold" }}>
          {isOpen ? "Abierta" : "Cerrada"}
        </span>
      </p>

      <button
        onClick={() => navigate(`/barbershops/${shop.id}`)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          background: "#f3f3f3",
          cursor: "pointer",
          marginTop: "auto",
        }}
      >
        Ver barbería
      </button>
    </div>
  );
}

export default BarbershopCard;
