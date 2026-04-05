import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AssistantRegisterPanel({ barbers = [] }) {
  const navigate = useNavigate();

  const [clients, setClients] = useState([{ id: 1, name: "", barberId: "" }]);

  const addClient = () => {
    setClients((prev) => [...prev, { id: Date.now(), name: "", barberId: "" }]);
  };

  const removeClient = (id) => {
    if (clients.length === 1) return;
    setClients((prev) => prev.filter((client) => client.id !== id));
  };

  const updateClient = (id, field, value) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === id ? { ...client, [field]: value } : client,
      ),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Registro asistido pendiente de integración:", clients);

    alert(
      "La navegación ya quedó lista. Cuando backend confirme el endpoint de registro asistido, conectamos este formulario.",
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display font-bold text-lg text-slate-900">
            Registrar clientes
          </h3>
          <p className="text-sm text-slate-500">
            Flujo exclusivo para assistant.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/assistant/home")}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => navigate("/assistant/profile")}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold"
          >
            Perfil
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700">
        Usa este panel para registrar clientes o grupos desde la cola en vivo.
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {clients.map((client, index) => (
          <div
            key={client.id}
            className="rounded-2xl border border-slate-200 p-4 space-y-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-bold text-slate-800">
                Cliente No. {index + 1}
              </h4>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addClient}
                  className="w-10 h-10 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xl font-bold"
                >
                  +
                </button>

                <button
                  type="button"
                  onClick={() => removeClient(client.id)}
                  className="w-10 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xl font-bold disabled:opacity-60"
                  disabled={clients.length === 1}
                >
                  -
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nombre cliente
              </label>
              <input
                type="text"
                value={client.name}
                onChange={(e) =>
                  updateClient(client.id, "name", e.target.value)
                }
                placeholder="Nombre del cliente a registrar"
                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Barbero asignado
              </label>
              <select
                value={client.barberId}
                onChange={(e) =>
                  updateClient(client.id, "barberId", e.target.value)
                }
                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">N/A</option>
                {barbers.map((barber) => (
                  <option key={barber.id} value={barber.id}>
                    {barber.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-14 rounded-2xl shadow-sm"
        >
          Confirmar
        </button>
      </form>
    </div>
  );
}

export default AssistantRegisterPanel;
