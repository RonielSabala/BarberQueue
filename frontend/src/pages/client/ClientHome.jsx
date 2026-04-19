import { useEffect, useState } from "react";
import { getBarbershops } from "../../services/barbershopService";
import BarbershopCard from "../../components/BarbershopCard";

function ClientHome() {
  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        setError("");

        const filters = {};

        if (search.trim()) {
          filters.search = search.trim();
        }

        if (filter === "open") {
          filters.isOpen = true;
        } else if (filter === "closed") {
          filters.isOpen = false;
        }

        const data = await getBarbershops(filters);
        setShops(data);
      } catch (err) {
        console.error("Error al obtener barberías:", err);
        setError(err.message || "Error al cargar las barberías");
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [search, filter]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm mb-8 gap-4 border border-slate-100 dark:border-slate-700">
        <div className="relative w-full sm:max-w-md">
          <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar barbería..."
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
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-48 h-12 pl-11 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">Todas</option>
            <option value="open">Abiertas</option>
            <option value="closed">Cerradas</option>
          </select>
        </div>
      </div>

      {loading && (
        <p style={{ textAlign: "center", marginTop: "30px" }}>
          Cargando barberías...
        </p>
      )}

      {error && (
        <p style={{ textAlign: "center", marginTop: "30px", color: "red" }}>
          {error}
        </p>
      )}

      {!loading && !error && shops.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "30px" }}>
          No se encontraron barberías.
        </p>
      )}

      {!loading && !error && shops.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {shops.map((shop) => (
            <BarbershopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientHome;
