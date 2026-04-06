function QueueColumn({
  barber,
  showJoinAction = false,
  canJoin = false,
  joining = false,
  onJoinQueue,
}) {
  const renderTurnMeta = (turn) => {
    const isGroup = Number(turn.groupSize) > 1;

    return (
      <div className="flex flex-wrap items-center gap-2 mt-1">
        <span className="text-[11px] text-slate-400 truncate">
          {turn.ownerStatus === "in_service" ? "En servicio" : turn.ownerStatus}
        </span>

        {turn.ownerType === "member" && (
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300">
            Miembro
          </span>
        )}

        {turn.ownerType === "client" && isGroup && (
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
            Líder de grupo
          </span>
        )}

        {isGroup && (
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            Grupo {turn.groupSize}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-2 border-2 border-primary/20 overflow-hidden flex items-center justify-center">
          <span className="material-icons-round text-3xl text-slate-400">
            face
          </span>
        </div>

        <h3 className="font-bold text-lg">{barber.name}</h3>

        <span className="text-xs font-semibold text-primary uppercase tracking-tighter">
          Barbero {barber.id}
        </span>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
              barber.status === "active"
                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : barber.status === "resting"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            {barber.status === "active"
              ? "Activo"
              : barber.status === "resting"
                ? "Descansando"
                : "Inactivo"}
          </span>

          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
              barber.isAccepting
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {barber.isAccepting ? "Aceptando" : "No acepta"}
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 flex items-center gap-2">
          <span className="material-icons-round text-blue-500 text-sm">
            content_cut
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Siendo Atendido
          </span>
        </div>

        <div className="p-4 flex items-center gap-3">
          {barber.current ? (
            <>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                {barber.current.position ?? 1}
              </div>

              <div className="flex-grow flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                  <span className="material-icons-round text-[16px] text-slate-400">
                    {barber.current.ownerType === "member"
                      ? "groups"
                      : "person"}
                  </span>
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-sm truncate">
                    {barber.current.ownerName}
                  </span>

                  {renderTurnMeta(barber.current)}
                </div>
              </div>
            </>
          ) : (
            <div className="text-slate-400 text-sm italic py-2 text-center w-full">
              Silla vacía
            </div>
          )}
        </div>

        <div className="border-t-2 border-dashed border-primary/20 mx-4"></div>

        <div className="p-4 space-y-4 flex-grow min-h-[120px]">
          {barber.queue.length === 0 ? (
            <div className="text-slate-400 text-sm text-center py-4 italic text-xs">
              Sin clientes en fila
            </div>
          ) : (
            barber.queue.map((client, idx) => (
              <div
                key={client.id}
                className={`flex items-center gap-3 ${
                  idx === 0 ? "opacity-100" : "opacity-70"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center font-bold text-slate-400 flex-shrink-0">
                  {client.position ?? idx + 2}
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex flex-shrink-0 items-center justify-center">
                  <span className="material-icons-round text-[16px] text-slate-400">
                    {client.ownerType === "member" ? "groups" : "person"}
                  </span>
                </div>

                <div className="flex flex-col min-w-0 flex-grow">
                  <span className="text-sm font-medium truncate">
                    {client.ownerName}
                  </span>

                  {renderTurnMeta(client)}
                </div>
              </div>
            ))
          )}
        </div>

        {showJoinAction && (
          <div className="px-4 pb-4">
            <button
              type="button"
              onClick={() => onJoinQueue?.(barber.id)}
              disabled={!canJoin || joining || !barber.isAccepting}
              className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {joining
                ? "Registrando..."
                : barber.isAccepting
                  ? "Entrar a esta cola"
                  : "Barbero no disponible"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QueueColumn;
