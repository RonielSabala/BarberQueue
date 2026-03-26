import { useParams } from "react-router-dom";
import { useQueue } from "../../context/QueueContext";
import QueueColumn from "../../components/queue/QueueColumn";

function QueueLive() {
  const { id } = useParams();
  const { barbers = [] } = useQueue() || {};

  const activeBarbers = barbers.filter((b) => b.status === "active");
  const restingBarbers = barbers.filter((b) => b.status === "resting");

  const totalActivos = activeBarbers.reduce(
    (acc, b) => acc + (b.current ? 1 : 0) + (b.queue?.length || 0),
    0,
  );

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight mb-1">
              Cola en tiempo real
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Sucursal BarberQueue · ID: {id}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Clientes Activos
              </p>
              <p className="text-2xl font-display font-bold text-primary">
                {totalActivos}{" "}
                <span className="text-slate-300 dark:text-slate-700">/ 20</span>
              </p>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-800"></div>
            <span className="material-icons-round text-slate-400 text-3xl">
              groups
            </span>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeBarbers.length === 0 ? (
                <p className="text-slate-500">No hay barberos activos.</p>
              ) : (
                activeBarbers.map((barber) => (
                  <QueueColumn key={barber.id} barber={barber} />
                ))
              )}
            </div>

            <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                <span className="material-icons-round text-primary">
                  hourglass_empty
                </span>
                Espera General
              </h2>

              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-icons-round text-slate-400">
                      person
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    Cliente #
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-80 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-icons-round text-slate-400">
                  hotel
                </span>
                Descansando
              </h3>
              <div className="space-y-4">
                {restingBarbers.length === 0 ? (
                  <p className="text-slate-400 text-sm italic py-2">
                    Ningún barbero descansando
                  </p>
                ) : (
                  restingBarbers.map((barber) => (
                    <div
                      key={barber.id}
                      className="flex items-center gap-4 group"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 grayscale opacity-50 flex items-center justify-center overflow-hidden">
                          <span className="material-icons-round text-slate-400">
                            face
                          </span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-slate-300 dark:bg-slate-700 rounded-full border-2 border-white dark:border-slate-900"></div>
                      </div>
                      <div>
                        <p className="font-bold text-slate-400">
                          {barber.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Regreso pendiente...
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-primary/10 dark:bg-primary/5 rounded-3xl p-6 border border-primary/20">
              <span className="material-icons-round text-primary mb-2 text-2xl">
                info
              </span>
              <h4 className="font-bold text-primary mb-2">
                Estimación de espera
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                El tiempo promedio de servicio actual es de{" "}
                <span className="font-bold text-primary">~25 minutos</span> por
                turno.
              </p>
            </div>

            <button className="w-full bg-primary hover:bg-blue-600 text-white font-bold h-14 px-6 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              Ver ticket
            </button>
          </div>
        </div>
      </main>
      <div className="h-20"></div>
    </div>
  );
}

export default QueueLive;
