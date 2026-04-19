import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBarbershops } from "../../utils/getMyBarbershops";
import EmployeeBarbershopCard from "../../components/barbershop/EmployeeBarbershopCard";

function BarberHome() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const [barbershops, setBarbershops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const shops = await getMyBarbershops(storedUser?.id);
        setBarbershops(shops);
      } catch (err) {
        console.error("Error al cargar barberías:", err);
        setError("No se pudieron cargar tus barberías asignadas.");
      } finally {
        setLoading(false);
      }
    };

    if (storedUser?.id) load();
  }, [storedUser?.id]);

  const handleEnter = (shop) => {
    // Al entrar a la barbería, el barbero va a su workspace en esa barbería
    navigate(`/barber/barbershop/${shop.barbershopId}/workspace`);
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
            Mis barberías
          </h1>
          <p className="text-slate-500 text-lg">
            Selecciona la barbería donde vas a trabajar hoy.
          </p>
        </div>

        {/* Cards barberías */}
        {loading ? (
          <p className="text-slate-500">Cargando barberías...</p>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
            {error}
          </div>
        ) : barbershops.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No tienes barberías asignadas actualmente.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
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
    </div>
  );
}

export default BarberHome;
