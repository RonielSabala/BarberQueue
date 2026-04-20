import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBarbershops } from "../../services/barbershopService";
import AdminBarbershopCard from "../../components/barbershop/AdminBarbershopCard";

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

        const filters = { adminId: 1 };
        if (search.trim()) filters.search = search.trim();
        if (statusFilter === "open") filters.isOpen = true;
        else if (statusFilter === "closed") filters.isOpen = false;

        const data = await getBarbershops(filters);
        setShops(data);
      } catch (err) {
        setError(err.message || "Error al cargar las barberías");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminBarbershops();
  }, [search, statusFilter]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
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

      {/* Filtros */}
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

      {/* Estados */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
          <span className="material-icons-round animate-pulse text-3xl">
            storefront
          </span>
          <p className="text-sm font-medium">Cargando barberías...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && shops.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <span className="material-icons-round text-5xl mb-3 opacity-30">
            search_off
          </span>
          <p className="font-medium text-sm">No se encontraron barberías.</p>
        </div>
      )}

      {!loading && !error && shops.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <AdminBarbershopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminHome;
