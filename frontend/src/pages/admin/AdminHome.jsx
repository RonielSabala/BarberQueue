import { useNavigate } from "react-router-dom";
import "../../styles/admin/adminHome.css";

function AdminHome() {
  const navigate = useNavigate();

  const barbershops = [
    {
      id: 1,
      name: "Barbería 1",
      rating: 4,
      status: "Abierto",
      queue: 5,
    },
    {
      id: 2,
      name: "Barbería 2",
      rating: 5,
      status: "Cerrado",
      queue: 0,
    },
    {
      id: 3,
      name: "Barbería 3",
      rating: 3,
      status: "Abierto",
      queue: 2,
    },
  ];

  return (
    <div className="admin-home">
      {/* HEADER */}

      <h1>BarberQueue</h1>

      {/* SEARCH */}

      <div className="search-container">
        <input type="text" placeholder="Buscar barbería a administrar 🔍" />

        <button className="filter-btn">Filtros</button>
      </div>

      {/* GRID */}

      <div className="barbershop-grid">
        {barbershops.map((shop) => (
          <div key={shop.id} className="shop-card">
            <div className="shop-image">foto de la barbería</div>

            <div className="shop-info">
              <p className="shop-name">{shop.name}</p>

              <p>Rating ⭐ {shop.rating}</p>

              <p
                className={`status ${shop.status === "Abierto" ? "open" : "closed"}`}
              >
                {shop.status}
              </p>

              <p>Personas en cola: {shop.queue}</p>
            </div>

            <button
              className="manage-btn"
              onClick={() => navigate(`/admin/barbershop/${shop.id}`)}
            >
              Administrar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminHome;
