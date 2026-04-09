import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAssignedBarbershopId } from "../../utils/getAssignedBarbershopId";

function RegisterClientsForm() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const [barbershopId, setBarbershopId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssignedBarbershop = async () => {
      setLoading(true);

      const assignedId = await getAssignedBarbershopId(storedUser?.id);
      setBarbershopId(assignedId);

      if (assignedId) {
        navigate(`/barbershops/${assignedId}/queue`, { replace: true });
      }

      setLoading(false);
    };

    loadAssignedBarbershop();
  }, [navigate, storedUser?.id]);

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
          Redirigiendo...
        </h1>
        <p className="text-slate-500 mb-6">
          Te estamos llevando a la cola en vivo de tu barbería para registrar
          clientes.
        </p>

        {loading && (
          <p className="text-slate-500 font-medium mb-4">
            Buscando la barbería asignada...
          </p>
        )}

        {!loading && !barbershopId && (
          <>
            <p className="text-red-500 font-medium mb-4">
              No se encontró una barbería asignada para este assistant.
            </p>
            <button
              onClick={() => navigate("/assistant/home")}
              className="bg-primary hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-2xl"
            >
              Volver al home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default RegisterClientsForm;
