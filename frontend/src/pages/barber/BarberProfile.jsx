import { useNavigate } from "react-router-dom";
import ProfilePhotoUpload from "../../components/ProfilePhotoUpload";

function BarberProfile() {
  const navigate = useNavigate();

  const startShift = () => {
    const barberStatus = "active";

    console.log("Estado del barbero:", barberStatus);

    // aquí luego irá la llamada al backend
    // POST /barber/start-shift

    navigate("/barber/dashboard");
  };

  return (
    <div>
      <h1>Perfil del barbero</h1>

      <hr />

      <div>
        <ProfilePhotoUpload />

        <h2>Nombre del Barbero</h2>

        <p>Email: barber@email.com</p>

        <p>Teléfono: 809-555-1111</p>

        <p>Dirección: Santo Domingo</p>

        <p>Rating: ⭐ 4.8</p>

        <p>Sucursal: Barbería El Flow</p>

        <p>Horario: 9am - 6pm</p>
      </div>

      <br />

      <button onClick={startShift}>Iniciar Jornada</button>
    </div>
  );
}

export default BarberProfile;
