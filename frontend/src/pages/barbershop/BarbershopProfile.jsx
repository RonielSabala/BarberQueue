import { useParams, Link } from "react-router-dom";

function BarbershopProfile() {
  const { id } = useParams();

  // datos simulados (luego vendrán del backend)
  const shop = {
    id: id,
    name: "Barbería 1",
    rating: 4.8,
    address: "Av. Los Próceres",
    schedule: "6:00 a.m - 5:00 p.m",
    status: "Abierto",
    email: "barberia1@gmail.com",
    phone: "+1 (809) 111-3233",
    queueStats: "5 / 10 clientes",
    services: [
      "Fade",
      "Beard Trim",
      "Classic Cut"
    ],
    reviews: [
      {
        id: 1,
        user: "Roniel Sabala",
        rating: 4,
        comment: "uff, la mejor barbería"
      }
    ]
  };

  return (
    <div>

      {/* HEADER */}
      <h1>{shop.name}</h1>

      <p>⭐ Rating: {shop.rating}</p>

      <Link to={`/barbershops/${shop.id}/queue`}>
        <button>Cola en tiempo real</button>
      </Link>

      <p>{shop.queueStats}</p>

      <hr />

      {/* INFO BARBERIA */}
      <h2>Información</h2>

      <p>📍 Dirección: {shop.address}</p>

      <p>🕒 Horario: {shop.schedule}</p>

      <p>🟢 Estado: {shop.status}</p>

      <p>📧 Email: {shop.email}</p>

      <p>📞 Teléfono: {shop.phone}</p>

      <hr />

      {/* TIPOS DE CORTE */}
      <h2>Tipos de cortes</h2>

      {shop.services.map((service, index) => (
        <p key={index}>💈 {service}</p>
      ))}

      <hr />

      {/* RESEÑAS */}
      <h2>Reseñas</h2>

      {shop.reviews.map((review) => (
        <div key={review.id}>

          <p>⭐ {review.rating}</p>

          <p>{review.user}</p>

          <p>{review.comment}</p>

          <hr />

        </div>
      ))}

    </div>
  );
}

export default BarbershopProfile;
