function QueueColumn({ barber }) {
  return (
    <div className="space-y-4">
      {/* Target Barber Card */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-2 border-2 border-primary/20 overflow-hidden flex items-center justify-center">
          {/* Using an icon if a real image isn't available in data */}
          <span className="material-icons-round text-3xl text-slate-400">
            face
          </span>
        </div>
        <h3 className="font-bold text-lg">{barber.name}</h3>
        <span className="text-xs font-semibold text-primary uppercase tracking-tighter">
          Barbero {barber.id}
        </span>
      </div>

      {/* Queue Details */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col">
        {/* Banner */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 flex items-center gap-2">
          <span className="material-icons-round text-blue-500 text-sm">
            content_cut
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Siendo Atendido
          </span>
        </div>

        {/* Current Client */}
        <div className="p-4 flex items-center gap-3">
          {barber.current ? (
            <>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                1
              </div>
              <div className="flex-grow flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                  <span className="material-icons-round text-[16px] text-slate-400">
                    person
                  </span>
                </div>
                <span className="font-medium text-sm">{barber.current}</span>
              </div>
            </>
          ) : (
            <div className="text-slate-400 text-sm italic py-2 text-center w-full">
              Silla vacía
            </div>
          )}
        </div>

        <div className="border-t-2 border-dashed border-primary/20 mx-4"></div>

        {/* Following Queue */}
        <div className="p-4 space-y-4 flex-grow min-h-[120px]">
          {barber.queue.length === 0 ? (
            <div className="text-slate-400 text-sm text-center py-4 italic text-xs">
              Sin clientes en fila
            </div>
          ) : (
            barber.queue.map((client, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 ${idx === 0 ? "opacity-100" : "opacity-60"}`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center font-bold text-slate-400 flex-shrink-0">
                  {idx + 2}
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex flex-shrink-0 items-center justify-center">
                  <span className="material-icons-round text-[16px] text-slate-400">
                    person
                  </span>
                </div>
                <span className="text-sm font-medium flex-grow truncate">
                  {client}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default QueueColumn;
