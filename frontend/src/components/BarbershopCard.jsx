import { useNavigate } from "react-router-dom";

function BarbershopCard({ shop }) {

  const navigate = useNavigate();

  return (

    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "15px",
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
      }}
    >

      {/* FOTO */}
      <img
        src={shop.image}
        alt={shop.name}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "10px",
          marginBottom: "10px"
        }}
      />

      {/* NOMBRE */}
      <h3 style={{ marginBottom: "8px" }}>
        {shop.name}
      </h3>

      {/* RATING */}
      <p style={{ marginBottom: "6px" }}>
        ⭐ {shop.rating}
      </p>

      {/* ESTADO */}
      <p style={{ marginBottom: "12px" }}>
        Estado:{" "}
        <span
          style={{
            color: shop.open ? "green" : "red",
            fontWeight: "bold"
          }}
        >
          {shop.open ? "Abierta" : "Cerrada"}
        </span>
      </p>

      {/* BOTÓN */}
      <button
        onClick={() => navigate(`/barbershops/${shop.id}`)}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "8px",
          border: "none",
          background: "#f3f3f3",
          cursor: "pointer"
        }}
      >
        Ver barbería
      </button>

    </div>
  );
}

export default BarbershopCard;
