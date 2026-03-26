import { useNavigate } from "react-router-dom";

function AssistantHome() {
  const navigate = useNavigate();

  // datos simulados por ahora
  const barbershopName = "Barbería El Flow";
  const assistantName = "María";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        textAlign: "center",
      }}
    >
      {/* NOMBRE BARBERIA */}
      <h1 style={{ marginBottom: "40px" }}>{barbershopName}</h1>

      {/* SALUDO */}
      <h2 style={{ marginBottom: "80px", fontWeight: "normal" }}>
        Hola, {assistantName}.
      </h2>

      {/* BOTON */}
      <button
        onClick={() => navigate("/assistant/register-client")}
        style={{
          padding: "14px 40px",
          borderRadius: "30px",
          border: "none",
          background: "#000",
          color: "white",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Agregar clientes
      </button>
    </div>
  );
}

export default AssistantHome;
