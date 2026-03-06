import { useState } from "react";
import { useNavigate } from "react-router-dom";


function BarberDashboard() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("active");

  const [queue, setQueue] = useState([
    "Cliente 1",
    "Cliente 2",
    "Cliente 3",
    "Cliente 4"
  ]);

  const [currentClient, setCurrentClient] = useState(null);

  const attendNext = () => {

    if (queue.length === 0) return;

    const next = queue[0];

    setCurrentClient(next);

    setQueue(queue.slice(1));
  };

  const finishService = () => {
    setCurrentClient(null);
  };

  const endShift = () => {
    setStatus("inactive");
  };



  return (
    <div>

      <h1>Dashboard del Barbero</h1>

      <button onClick={() => navigate("/barber/profile")}>
         Volver al perfil
      </button>

      <hr />

      <div>

        <p>Estado:</p>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="active">Activo</option>
          <option value="resting">Descansando</option>
          <option value="inactive">Inactivo</option>
        </select>

      </div>

      <hr />

      <h2>Cliente Actual</h2>

      {currentClient ? (
        <p>{currentClient}</p>
      ) : (
        <p>No hay cliente en servicio</p>
      )}

      <br />

      <button onClick={finishService}>
        Finalizar Servicio
      </button>

      <br />
      <br />

      <button onClick={attendNext}>
        Atender siguiente en la lista
      </button>

      <br />
      <br />

      <button onClick={endShift}>
        Terminar jornada
      </button>

      <hr />

      <h2>Cola actual</h2>

      {queue.map((client, index) => (
        <p key={index}>
          {index + 1}
        </p>
      ))}


    </div>


  );
}

export default BarberDashboard;
