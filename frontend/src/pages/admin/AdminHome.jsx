import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBarbershops } from "../../services/barbershopService";
import "../../styles/admin/adminHome.css";

function AdminHome() {
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminBarbershops = async () => {
      try {
        setLoading(true);
        setError("");

        const filters = {
          adminId: 1,
        };

        if (search.trim()) {
          filters.search = search.trim();
        }

        if (statusFilter === "open") {
          filters.isOpen = true;
        } else if (statusFilter === "closed") {
          filters.isOpen = false;
        }

        const data = await getBarbershops(filters);
        setShops(data);
      } catch (err) {
        console.error("Error al obtener barberías del admin:", err);
        setError(err.message || "Error al cargar las barberías");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminBarbershops();
  }, [search, statusFilter]);

  return (
    <div className="admin-home">
      <h1>BarberQueue</h1>

      <div className="admin-home-top-actions">
        <button
          className="create-barbershop-btn"
          onClick={() => navigate("/admin/barbershop/new")}
        >
          + Crear barbería
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar barbería a administrar 🔍"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter-btn"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todas</option>
          <option value="open">Abiertas</option>
          <option value="closed">Cerradas</option>
        </select>
      </div>

      {loading && <p>Cargando barberías...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && shops.length === 0 && (
        <p>No se encontraron barberías para este administrador.</p>
      )}

      {!loading && !error && shops.length > 0 && (
        <div className="barbershop-grid">
          {shops.map((shop) => (
            <div key={shop.id} className="shop-card">
              <img
                src={
                  shop.image ||
                  "https://via.placeholder.com/400x200?text=Barberia"
                }
                alt={shop.name}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x200?text=Barberia";
                }}
                className="shop-image"
              />

              <div className="shop-info">
                <p className="shop-name">{shop.name}</p>

                <p>Rating ⭐ {shop.rating ?? "Sin rating"}</p>

                <p className={`status ${shop.open ? "open" : "closed"}`}>
                  {shop.open ? "Abierta" : "Cerrada"}
                </p>

                <p>Personas en cola: N/D</p>
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
      )}
    </div>
  );
}

export default AdminHome;
