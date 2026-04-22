import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBarbershops } from "../../utils/getMyBarbershops";
import {
  getBarberById,
  updateBarberStatus,
} from "../../services/barberService";
import EmployeeBarbershopCard from "../../components/barbershop/EmployeeBarbershopCard";

function BarberHome() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const barberId = storedUser?.id;

  const [barbershops, setBarbershops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [shops, barberData] = await Promise.all([
          getMyBarbershops(barberId),
          getBarberById(barberId),
        ]);

        // Si el barbero NO puede trabajar en NINGUNA barbería ahora
        // y no está ya inactivo → forzar inactive para que no aparezca en colas
        const canWorkAnywhere = shops.some((s) => s.canWork);
        const currentStatus = barberData?.currentStatus;

        if (!canWorkAnywhere && currentStatus !== "inactive") {
          try {
            await updateBarberStatus(barberId, {
              currentStatus: "inactive",
              isAccepting: false,
            });
          } catch (e) {
            console.warn("No se pudo forzar inactivo:", e);
          }
        }

        setBarbershops(shops);
      } catch (err) {
        console.error("Error al cargar barberías:", err);
        setError("No se pudieron cargar tus barberías asignadas.");
      } finally {
        setLoading(false);
      }
    };

    if (barberId) load();
  }, [barberId]);

  const handleEnter = (shop) => {
    navigate(`/barber/barbershop/${shop.barbershopId}/workspace`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
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

      {!loading && !error && barbershops.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <span className="material-icons-round text-5xl mb-3 opacity-30">
            search_off
          </span>
          <p className="font-medium text-sm">
            No tienes barberías asignadas actualmente.
          </p>
        </div>
      )}

      {!loading && !error && barbershops.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbershops.map((shop) => (
            <EmployeeBarbershopCard
              key={shop.barbershopId}
              shop={shop}
              actionLabel="Ir a trabajar"
              onAction={() => handleEnter(shop)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BarberHome;
