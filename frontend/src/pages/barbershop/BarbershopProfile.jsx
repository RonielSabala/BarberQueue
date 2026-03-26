import { useNavigate, useParams } from "react-router-dom";
import "../../styles/barbershop/barbershopProfile.css";

function BarbershopProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const barbershop = {
    name: "Barbería 1",
    branch: "Sucursal de Santiago",
    rating: 4,
    queue: 5,
    capacity: 10,
    address: "Av. Los Próceres",
    opens: "8:00 a.m.",
    closes: "5:00 p.m.",
    email: "barberia1@gmail.com",
    phone: "+1 (899) 111-3223",
    status: "Abierto",
  };

  const haircuts = [
    {
      name: "Fade",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033",
    },
    {
      name: "Pompadour",
      image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c",
    },
  ];

  const reviews = [
    {
      name: "Roniel Sabala",
      rating: 4,
      comment: "Uff, la mejor barbería, no bultoken.",
    },
    {
      name: "María López",
      rating: 5,
      comment: "Excelente servicio, siempre salgo contento.",
    },
  ];

  return (
    <div className="barbershop-profile">
      {/* HEADER */}

      <div className="profile-header">
        <div>
          <h1>{barbershop.name}</h1>
          <span className="branch">({barbershop.branch})</span>

          <div className="rating">{"⭐".repeat(barbershop.rating)}</div>
        </div>

        <div className="queue-box">
          <span className="live">● Cola en tiempo real</span>
          <h2>
            {barbershop.queue}/{barbershop.capacity} clientes
          </h2>

          <button
            className="queue-btn"
            onClick={() => navigate(`/barbershops/${id}/queue`)}
          >
            Ver cola en vivo
          </button>
        </div>
      </div>

      {/* MAIN */}

      <div className="profile-main">
        {/* FOTO BARBERÍA */}

        <img
          className="main-photo"
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1"
        />

        {/* TIPOS DE CORTE */}

        <div className="haircuts">
          <h3>Tipos de Cortes</h3>

          <div className="haircut-list">
            {haircuts.map((cut, index) => (
              <div key={index} className="haircut-card">
                <img src={cut.image} />

                <p>{cut.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INFO BARBERÍA */}

      <div className="info-box">
        <p>📍 {barbershop.address}</p>

        <p>
          🕐 {barbershop.opens} - {barbershop.closes}
        </p>

        <p className="status">🟢 {barbershop.status}</p>

        <p>✉️ {barbershop.email}</p>

        <p>📞 {barbershop.phone}</p>
      </div>

      {/* RESEÑAS */}

      <div className="reviews">
        <h2>Reseñas</h2>

        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="avatar"></div>

            <div>
              <strong>{review.name}</strong>

              <div className="rating">{"⭐".repeat(review.rating)}</div>

              <p>{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BarbershopProfile;
