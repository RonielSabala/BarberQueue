import { useState } from "react";
import "../../styles/barber/barberDashboard.css";

function BarberDashboard() {
  const [status, setStatus] = useState("active");

  const [queue, setQueue] = useState([
    "Juan Pérez",
    "Carlos Mejía",
    "Luis Martínez",
    "Pedro Gómez",
  ]);

  const currentClient = queue.length > 0 ? queue[0] : "Sin clientes";

  const finishService = () => {
    if (queue.length === 0) return;

    const updatedQueue = [...queue];
    updatedQueue.shift();

    setQueue(updatedQueue);
  };

  const endDay = () => {
    setStatus("inactive");
  };

  return (
    <div className="barber-dashboard">
      <h1>Dashboard de Barbero</h1>

      {/* ESTADO */}

      <div className="status-card">
        <label>Estado</label>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Activo</option>
          <option value="resting">Descansando</option>
          <option value="inactive">Inactivo</option>
        </select>

        <span className={`status ${status}`}>
          ● {status === "active" && "Activo"}
          {status === "resting" && "Descansando"}
          {status === "inactive" && "Inactivo"}
        </span>
      </div>

      <div className="dashboard-main">
        {/* CLIENTE ACTUAL */}

        <div className="client-card">
          <h3>Cliente Actual</h3>

          <h2>{currentClient}</h2>

          <button className="finish-btn" onClick={finishService}>
            Finalizar Servicio
          </button>

          <button className="next-btn">Atender Siguiente en la lista</button>
        </div>

        {/* COLA */}

        <div className="queue-card">
          <h3>Cola Actual</h3>

          {queue.map((client, index) => (
            <div
              key={index}
              className={`queue-item ${index === 0 ? "current" : ""}`}
            >
              <span className="number">{index + 1}</span>

              {client}
            </div>
          ))}
        </div>
      </div>

      {/* TERMINAR JORNADA */}

      <button className="end-day-btn" onClick={endDay}>
        Terminar Jornada
      </button>
    </div>
  );
}

export default BarberDashboard;
