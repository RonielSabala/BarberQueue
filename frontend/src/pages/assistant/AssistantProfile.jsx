import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePhotoUpload from "../../components/ProfilePhotoUpload";

function AssistantProfile() {
  const navigate = useNavigate();

  const [assistant, setAssistant] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const mockAssistant = {
      name: "María",
      email: "maria@email.com",
      phone: "809-555-8888",
      address: "Santo Domingo, RD",
      barbershop: "Barbería El Flow",
    };

    setAssistant(mockAssistant);
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  if (!assistant) return <p>Cargando perfil...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h1>Perfil del Asistente</h1>

      <hr />

      {/* FOTO PERFIL */}

      <ProfilePhotoUpload />

      <hr />

      {/* INFO */}

      <p>
        <strong>Nombre:</strong> {assistant.name}
      </p>

      <p>
        <strong>Email:</strong> {assistant.email}
      </p>

      <p>
        <strong>Teléfono:</strong> {assistant.phone}
      </p>

      <p>
        <strong>Dirección:</strong> {assistant.address}
      </p>

      <p>
        <strong>Barbería:</strong> {assistant.barbershop}
      </p>

      <br />

      <button onClick={() => navigate("/assistant/home")}>
        Volver al inicio
      </button>
    </div>
  );
}

export default AssistantProfile;
