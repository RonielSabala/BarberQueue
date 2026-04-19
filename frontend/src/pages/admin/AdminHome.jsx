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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
            Barberías
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Administra los locales registrados en el sistema.
          </p>
        </div>

        <button
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
          onClick={() => navigate("/admin/barbershop/new")}
        >
          <span className="material-icons-round">add_circle</span>
          Crear barbería
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm mb-8 gap-4 border border-slate-100 dark:border-slate-700">
        <div className="relative w-full sm:max-w-md">
          <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar barbería a administrar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-slate-700 dark:text-slate-200"
          />
        </div>

        <div className="w-full sm:w-auto relative">
          <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            filter_alt
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 h-12 pl-11 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">Todas</option>
            <option value="open">Abiertas</option>
            <option value="closed">Cerradas</option>
          </select>
        </div>
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
