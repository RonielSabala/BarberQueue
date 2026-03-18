import { useEffect, useState } from "react";
import ProfilePhotoUpload from "../../components/ProfilePhotoUpload";

function ClientProfile() {
  const [client, setClient] = useState(null);
  const [currentQueue, setCurrentQueue] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // DATOS SIMULADOS

    const mockClient = {
      name: "Juan Pérez",
      email: "juan@email.com",
      phone: "809-000-0000",
    };

    const mockQueue = {
      barbershop: "Barbería El Flow",
      barber: "Carlos",
      position: 2,
      estimatedTime: "15 min",
    };

    const mockHistory = [
      {
        id: 1,
        barbershop: "Classic Barber",
        barber: "Miguel",
        date: "2024-05-10",
      },
      {
        id: 2,
        barbershop: "Urban Cuts",
        barber: "Juan",
        date: "2024-05-01",
      },
    ];

    setClient(mockClient);
    setCurrentQueue(mockQueue);
    setHistory(mockHistory);
  }, []);

  if (!client) return <p>Cargando perfil...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h1>Perfil del Cliente</h1>

      <hr />

      {/* INFO CLIENTE */}

      <ProfilePhotoUpload />

      <h2>Información personal</h2>

      <p>
        <strong>Nombre:</strong> {client.name}
      </p>
      <p>
        <strong>Email:</strong> {client.email}
      </p>
      <p>
        <strong>Teléfono:</strong> {client.phone}
      </p>

      <hr />

      {/* ESTADO EN COLA */}

      <h2>Estado actual en cola</h2>

      {currentQueue ? (
        <div>
          <p>
            <strong>Barbería:</strong> {currentQueue.barbershop}
          </p>
          <p>
            <strong>Barbero:</strong> {currentQueue.barber}
          </p>
          <p>
            <strong>Tu posición:</strong> {currentQueue.position}
          </p>
          <p>
            <strong>Tiempo estimado:</strong> {currentQueue.estimatedTime}
          </p>
        </div>
      ) : (
        <p>No estás en ninguna cola actualmente.</p>
      )}

      <hr />

      {/* HISTORIAL */}

      <h2>Historial de visitas</h2>

      {history.length === 0 ? (
        <p>No tienes visitas registradas.</p>
      ) : (
        history.map((visit) => (
          <div key={visit.id} style={{ marginBottom: "10px" }}>
            <p>
              <strong>{visit.barbershop}</strong> - {visit.barber}
            </p>

            <p>Fecha: {visit.date}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ClientProfile;
