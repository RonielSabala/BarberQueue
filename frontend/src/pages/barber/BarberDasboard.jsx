import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function BarberDashboard() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("active");
  const [queue, setQueue] = useState([
    "Cliente 1",
    "Cliente 2",
    "Cliente 3",
    "Cliente 4",
  ]);

  const [currentClient, setCurrentClient] = useState(null);

  const attendNext = () => {
    if (queue.length === 0) return;
    const next = queue[0];
    setCurrentClient(next);
    setQueue(queue.slice(1));
  };

  const finishService = () => {
    setCurrentClient(null);
  };

  const endShift = () => {
    setStatus("inactive");
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight mb-1">
              Mi Panel de Control
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Gestiona tus clientes y estado actual
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 min-w-[250px]">
            <div className="flex-grow">
              <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">
                Estado
              </p>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full text-sm py-2 px-3 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-primary focus:border-primary font-bold appearance-none cursor-pointer"
              >
                <option value="active">🟢 Activo</option>
                <option value="resting">🟡 Descansando</option>
                <option value="inactive">🔴 Inactivo</option>
              </select>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <span className="material-icons-round text-slate-400 text-3xl">
              storefront
            </span>
          </div>
        </div>

        {/* Layout Grid columns */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Queue Column */}
          <div className="flex-grow">
            <div className="space-y-4 max-w-2xl">
              {/* Estación del Barbero */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-2 border-2 border-primary/20 flex items-center justify-center">
                  <span className="material-icons-round text-3xl text-slate-400">
                    face
                  </span>
                </div>
                <h3 className="font-bold text-lg">Tu Estación de Trabajo</h3>
                <span className="text-xs font-semibold text-primary uppercase tracking-tighter">
                  Mi Fila
                </span>
              </div>

              {/* Current Client & Queue box */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                {/* Banner de "Siendo atendido" */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 flex items-center gap-2">
                  <span className="material-icons-round text-blue-500 text-sm">
                    content_cut
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                    Siendo Atendido Ahora
                  </span>
                </div>

                {/* Info Cliente Actual */}
                <div className="p-6 flex items-center gap-4 min-h-[100px]">
                  {currentClient ? (
                    <>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="material-icons-round text-primary">
                          person
                        </span>
                      </div>
                      <div className="flex-grow">
                        <span className="text-2xl font-bold">
                          {currentClient}
                        </span>
                        <p className="text-sm text-primary font-semibold">
                          Turno en progreso
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="w-full text-center text-slate-400 py-4 flex flex-col items-center gap-2">
                      <span className="material-icons-round text-4xl opacity-50">
                        chair
                      </span>
                      <p className="italic">
                        No tienes ningún cliente en la silla en este momento
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-dashed border-primary/20 mx-4"></div>

                {/* Cola del barbero */}
                <div className="p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-4 px-2 tracking-wider flex items-center gap-2">
                    <span className="material-icons-round text-sm">groups</span>
                    Próximos en tu fila ({queue.length})
                  </h4>

                  {queue.length > 0 ? (
                    queue.map((client, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-4 px-2 ${index === 0 ? "opacity-100" : "opacity-70"}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-sm">
                          {index + 1}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                          <span className="material-icons-round text-[16px] text-slate-400">
                            person
                          </span>
                        </div>
                        <span className="font-medium flex-grow">{client}</span>
                        {index === 0 && (
                          <span className="text-[10px] tracking-widest font-bold uppercase text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                            Siguiente
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-400 py-6 text-sm">
                      Tu cola está vacía.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Sidebar Column */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                <span className="material-icons-round text-primary">
                  touch_app
                </span>
                Acciones
              </h3>

              <div className="space-y-4">
                <button
                  onClick={attendNext}
                  disabled={queue.length === 0}
                  className="w-full bg-primary hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 h-14 text-white font-bold px-6 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex justify-between items-center group"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-icons-round">front_hand</span>
                    <span>Atender Siguiente</span>
                  </div>
                  <span className="material-icons-round text-white/50 group-hover:text-white transition-colors">
                    arrow_forward
                  </span>
                </button>

                <button
                  onClick={finishService}
                  disabled={!currentClient}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 h-14 text-white font-bold px-6 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex justify-between items-center group"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-icons-round">check_circle</span>
                    <span>Finalizar Servicio</span>
                  </div>
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800 py-2"></div>

                <button
                  onClick={endShift}
                  className="w-full bg-white dark:bg-slate-900 border-2 border-red-500/20 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 font-bold h-12 px-6 rounded-xl transition-all active:scale-[0.98] flex justify-center items-center gap-2"
                >
                  <span className="material-icons-round text-[18px]">
                    power_settings_new
                  </span>
                  <span>Terminar Jornada</span>
                </button>
              </div>
            </div>

            <div className="bg-primary/5 dark:bg-primary/10 rounded-3xl p-6 border border-primary/20">
              <span className="material-icons-round text-primary mb-3 text-3xl">
                lightbulb
              </span>
              <h4 className="font-bold text-primary mb-2">
                Tips de la aplicación
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Utiliza los botones de arriba para gestionar tu turno. Recuerda
                cambiar tu estado a{" "}
                <strong className="text-slate-800 dark:text-slate-200">
                  Descansando
                </strong>{" "}
                si necesitas hacer una pausa.
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="h-20"></div>
    </div>
  );
}

export default BarberDashboard;
