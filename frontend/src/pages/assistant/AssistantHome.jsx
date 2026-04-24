import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBarbershops } from "../../utils/getMyBarbershops";
import EmployeeBarbershopCard from "../../components/barbershop/EmployeeBarbershopCard";
import { useToast } from "../../context/ToastContext";
import { mapApiError } from "../../utils/mapApiError";

function AssistantHome() {
  const navigate = useNavigate();
  const toast = useToast();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const [barbershops, setBarbershops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const shops = await getMyBarbershops(storedUser?.id);
        setBarbershops(shops);
      } catch (err) {
        toast.error(
          mapApiError(
            err.message,
            "No se pudieron cargar tus barberías asignadas.",
          ),
        );
      } finally {
        setLoading(false);
      }
    };

    if (storedUser?.id) load();
  }, [storedUser?.id]);

  const handleEnter = (shop) => {
    navigate(`/assistant/barbershop/${shop.barbershopId}/queue`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-slate-900">
            Mis barberías
          </h1>
          <p className="text-slate-500 mt-1">
            Selecciona la barbería donde vas a trabajar hoy.
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
          <span className="material-icons-round animate-pulse text-3xl">
            storefront
          </span>
          <p className="text-sm font-medium">Cargando barberías...</p>
        </div>
      )}

      {!loading && barbershops.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <span className="material-icons-round text-5xl mb-3 opacity-30">
            search_off
          </span>
          <p className="font-medium text-sm">
            No tienes barberías asignadas actualmente.
          </p>
        </div>
      )}

      {!loading && barbershops.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbershops.map((shop) => (
            <EmployeeBarbershopCard
              key={shop.barbershopId}
              shop={shop}
              actionLabel="Trabajar aquí"
              onAction={() => handleEnter(shop)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AssistantHome;
