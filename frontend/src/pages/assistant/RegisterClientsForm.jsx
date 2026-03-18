import { useState } from "react";
import "../../styles/assistant/registerClient.css";

function RegisterClientsForm() {
  // barberos estáticos (luego vendrán del backend)
  const barbers = [
    { id: 1, name: "Carlos" },
    { id: 2, name: "Miguel" },
    { id: 3, name: "José" },
    { id: 4, name: "Luis" },
  ];

  const [clients, setClients] = useState([{ name: "", barber_id: "" }]);

  const addClient = () => {
    setClients([...clients, { name: "", barber_id: "" }]);
  };

  const removeClient = (index) => {
    if (clients.length === 1) return;

    const updated = clients.filter((_, i) => i !== index);

    setClients(updated);
  };

  const updateClient = (index, field, value) => {
    const updated = [...clients];

    updated[index][field] = value;

    setClients(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/queue/register-group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clients,
        }),
      });

      const data = await response.json();

      console.log("Grupo registrado:", data);

      // limpiar formulario
      setClients([{ name: "", barber_id: "" }]);
    } catch (error) {
      console.error("Error registrando grupo:", error);
    }
  };
  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h1 className="title">Registrar Clientes</h1>
      <p className="subtitle">Agrega clientes a la cola de espera</p>

      {clients.map((client, index) => (
        <div key={index} className="client-card">
          <div className="client-header">Cliente No. {index + 1}</div>

          <label>Nombre cliente</label>

          <input
            type="text"
            placeholder="Nombre del cliente a registrar"
            value={client.name}
            onChange={(e) => updateClient(index, "name", e.target.value)}
          />

          <label>Barbero asignado</label>

          <select
            value={client.barber_id}
            onChange={(e) => updateClient(index, "barber_id", e.target.value)}
          >
            <option value="">N/A</option>

            {barbers.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.name}
              </option>
            ))}
          </select>

          <div className="buttons">
            <button type="button" className="btn-add" onClick={addClient}>
              +
            </button>

            <button
              type="button"
              className="btn-remove"
              onClick={() => removeClient(index)}
            >
              -
            </button>
          </div>
        </div>
      ))}

      <button type="submit" className="confirm-btn">
        Confirmar
      </button>
    </form>
  );
}

export default RegisterClientsForm;
