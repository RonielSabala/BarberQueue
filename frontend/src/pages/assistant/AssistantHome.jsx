import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAssignedBarbershopId } from "../../utils/getAssignedBarbershopId";

function AssistantHome() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const [barbershopId, setBarbershopId] = useState(null);
  const [loadingBarbershop, setLoadingBarbershop] = useState(true);

  useEffect(() => {
    const loadAssignedBarbershop = async () => {
      setLoadingBarbershop(true);
      const assignedId = await getAssignedBarbershopId(storedUser?.id);
      setBarbershopId(assignedId);
      setLoadingBarbershop(false);
    };

    loadAssignedBarbershop();
  }, [storedUser?.id]);

  const handleGoToRegisterClients = () => {
    navigate("/assistant/register-client");
  };

  const handleGoToProfile = () => {
    navigate("/assistant/profile");
  };

  const handleGoToLiveQueue = () => {
    if (!barbershopId) return;
    navigate(`/barbershops/${barbershopId}/queue`);
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
            Panel del Asistente
          </h1>
          <p className="text-slate-500 text-lg">
            Gestiona clientes, consulta la cola en vivo y accede a tu perfil.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <p className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-2">
              Usuario
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              {storedUser?.username || "Asistente"}
            </h2>
            <p className="text-slate-500 mt-1">
              {storedUser?.email || "Sin correo"}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <p className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-2">
              Rol
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              {storedUser?.role || "assistant"}
            </h2>
            <p className="text-slate-500 mt-1">
              Acceso a gestión de clientes y cola en vivo.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <p className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-2">
              Barbería asignada
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              {loadingBarbershop
                ? "Cargando..."
                : barbershopId
                  ? `#${barbershopId}`
                  : "No asignada"}
            </h2>
            <p className="text-slate-500 mt-1">
              {loadingBarbershop
                ? "Buscando asignación..."
                : barbershopId
                  ? "Usaremos esta barbería para la cola en vivo."
                  : "No se encontró barbería asignada para este assistant."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={handleGoToRegisterClients}
            className="bg-primary hover:bg-blue-600 text-white rounded-3xl p-6 text-left shadow-sm transition"
          >
            <p className="text-sm uppercase tracking-wider font-bold opacity-80 mb-2">
              Acción principal
            </p>
            <h3 className="text-2xl font-extrabold mb-2">Registrar clientes</h3>
            <p className="text-sm opacity-90">
              Ir a la cola en vivo de tu barbería con el panel de registro.
            </p>
          </button>

          <button
            onClick={handleGoToLiveQueue}
            disabled={!barbershopId || loadingBarbershop}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 rounded-3xl p-6 text-left shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <p className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-2">
              Navegación
            </p>
            <h3 className="text-2xl font-extrabold mb-2">Ver cola en vivo</h3>
            <p className="text-sm text-slate-500">
              Consulta directamente la cola de la barbería.
            </p>
          </button>

          <button
            onClick={handleGoToProfile}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 rounded-3xl p-6 text-left shadow-sm transition"
          >
            <p className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-2">
              Cuenta
            </p>
            <h3 className="text-2xl font-extrabold mb-2">Ver perfil</h3>
            <p className="text-sm text-slate-500">
              Consulta tu información y accede a opciones de perfil.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssistantHome;
