import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBarbershops } from "../../services/barbershopService";
import AdminBarbershopCard from "../../components/barbershop/AdminBarbershopCard";

function AdminHome() {
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterOptions = [
    { value: "all", label: "Todas", icon: "storefront" },
    {
      value: "open",
      label: "Abiertas",
      icon: "check_circle",
      iconColor: "text-green-500",
    },
    {
      value: "closed",
      label: "Cerradas",
      icon: "cancel",
      iconColor: "text-red-500",
    },
  ];

  const selectedFilter =
    filterOptions.find((o) => o.value === statusFilter) || filterOptions[0];
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounce: espera 400ms tras dejar de escribir
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 100);
    return () => clearTimeout(timer);
  }, [search]);

  // Mostrar "Cargando..." solo si tarda más de 1s
  useEffect(() => {
    if (!loading) {
      setShowLoading(false);
      return;
    }
    const timer = setTimeout(() => {
      if (loading) setShowLoading(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    const fetchAdminBarbershops = async () => {
      try {
        setLoading(true);
        setError("");

        const filters = { adminId: 1 };
        if (debouncedSearch.trim()) filters.search = debouncedSearch.trim();
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
  }, [debouncedSearch, statusFilter]);

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

      {/* Premium Unified Search Bar (Airbnb / SaaS Style) */}
      <div className="mb-14 w-full max-w-4xl mx-auto mt-4">
        <div className="flex flex-col sm:flex-row items-center bg-white dark:bg-slate-900 sm:rounded-full rounded-[2rem] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_50px_-10px_rgba(0,0,0,0.12)] border border-slate-200/60 dark:border-slate-700/60 transition-all duration-300 p-1.5">
          {/* Search Section */}
          <div className="relative flex-1 w-full flex items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 sm:rounded-full rounded-3xl transition-colors group px-2">
            <div className="absolute left-4 flex items-center justify-center pointer-events-none">
              <span className="material-icons-round text-slate-400 group-focus-within:text-primary transition-colors text-[22px]">
                search
              </span>
            </div>
            <input
              type="text"
              placeholder="Buscar barbería a administrar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-10 pr-4 bg-transparent border-transparent focus:border-transparent focus:ring-0 text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium text-[15px] outline-none"
            />
          </div>

          {/* Vertical Divider */}
          <div className="hidden sm:block h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>

          {/* Filter Section */}
          <div className="relative w-full sm:w-auto flex items-center border-t sm:border-t-0 border-slate-100 dark:border-slate-700 mt-1 sm:mt-0 pt-1 sm:pt-0">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full sm:w-auto h-12 px-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 sm:rounded-full rounded-3xl transition-colors flex items-center justify-between sm:justify-start gap-3 text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 shadow-sm ${selectedFilter.iconColor || "text-slate-500"}`}
                >
                  <span className="material-icons-round text-[18px]">
                    {selectedFilter.icon}
                  </span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-[1px]">
                    Mostrar
                  </span>
                  <span className="font-semibold text-[14px] truncate max-w-[120px]">
                    {selectedFilter.label}
                  </span>
                </div>
              </div>
              <span
                className={`material-icons-round text-slate-400 text-[20px] transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`}
              >
                expand_more
              </span>
            </button>

            {/* Custom Dropdown Menu */}
            {isFilterOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsFilterOpen(false)}
                ></div>
                <div className="absolute top-[110%] right-0 w-full sm:w-72 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-4 duration-200">
                  <div className="px-5 pb-2 pt-2 border-b border-slate-100 dark:border-slate-700/50 mb-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Filtrar resultados
                    </p>
                  </div>
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setStatusFilter(opt.value);
                        setIsFilterOpen(false);
                      }}
                      className="w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                    >
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700/50 group-hover:scale-110 transition-transform shadow-sm ${opt.iconColor || "text-slate-500"}`}
                      >
                        <span className="material-icons-round text-[20px]">
                          {opt.icon}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span
                          className={`block text-[15px] font-bold ${statusFilter === opt.value ? "text-primary" : "text-slate-700 dark:text-slate-200"}`}
                        >
                          {opt.label}
                        </span>
                        <span className="block text-[12px] text-slate-500 mt-0.5 font-medium">
                          {opt.value === "all"
                            ? "Ver todas las opciones"
                            : opt.value === "open"
                              ? "Solo locales disponibles"
                              : "Locales fuera de servicio"}
                        </span>
                      </div>
                      {statusFilter === opt.value && (
                        <span className="material-icons-round text-primary text-[20px]">
                          check_circle
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Estados */}
      {showLoading && (
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
