import { useState } from "react";

function RegisterClient() {

  const [clientName, setClientName] = useState("");
  const [selectedBarber, setSelectedBarber] = useState("");

  const [barbers, setBarbers] = useState([
  { id: 1, name: "Juan", current: "Pedro", queue: ["Luis","Carlos"] },
  { id: 2, name: "Pedro", current: "Mario", queue: ["Andres"] },
  { id: 3, name: "Jose", current: null, queue: ["David"] }
]);

  const handleRegister = () => {

    if (!clientName || !selectedBarber) {
      alert("Completa todos los campos");
      return;
    }

    const updated = barbers.map((barber) => {
      if (barber.name === selectedBarber) {
        return {
          ...barber,
          queue: [...barber.queue, clientName]
        };
      }
      return barber;
    });

    setBarbers(updated);
    setClientName("");
    setSelectedBarber("");
  };


  return (

    <div style={{ padding: "40px" }}>

      <h2 style={{ marginBottom: "30px" }}>
        Cola en vivo Barberia El Flow
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 1fr",
          gap: "40px"
        }}
      >



        {/* FORMULARIO */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            height: "fit-content"
          }}
        >

          <h2 style={{ marginBottom: "20px" }}>
            Registrar cliente
          </h2>

          <p>Nombre del cliente</p>

          <input
            type="text"
            placeholder="Nombre del cliente"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "20px"
            }}
          />

          <p>Barbero asignado</p>

          <select
            value={selectedBarber}
            onChange={(e) => setSelectedBarber(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "20px"
            }}
          >

            <option value="">Seleccionar barbero</option>

            {barbers.map((barber) => (
              <option key={barber.id} value={barber.name}>
                {barber.name}
              </option>
            ))}

          </select>

          <button
            onClick={handleRegister}
            style={{
              width: "100%",
              padding: "10px",
              background: "#eee",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Registrar cliente
          </button>

        </div>

      </div>

    </div>

  );
}

export default RegisterClient;
