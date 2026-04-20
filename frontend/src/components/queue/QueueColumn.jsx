const STATUS_LABELS = {
  at_barbershop: "En barbería",
  on_queue: "En cola",
  waiting: "Pausado",
  in_service: "En servicio",
  attended: "Atendido",
  paid: "Pagado",
};

/**
 * QueueColumn
 *
 * Props:
 * - currentUserId: id del usuario logueado (para detectar su propio grupo)
 * - myTurn: objeto del turno del usuario logueado (para saber su groupId)
 */
function QueueColumn({
  barber,
  showJoinAction = false,
  canJoin = false,
  joining = false,
  onJoinQueue,
  currentUserId,
  myTurn,
}) {
  // groupId del usuario logueado — viene en myTurn.group.groupId (no en myTurn.groupId)
  const myGroupId = myTurn?.group?.groupId ?? myTurn?.groupId ?? null;
  const myOwnerId = currentUserId ? Number(currentUserId) : null;

  // ¿este turn pertenece al grupo del usuario logueado?
  const isMyGroup = (turn) => {
    if (!myGroupId) return false;
    const turnGroupId = turn.groupId ?? turn.group?.id ?? null;
    return turnGroupId != null && turnGroupId === myGroupId;
  };

  // ¿este turn es el propio usuario?
  const isMe = (turn) => {
    if (!myOwnerId) return false;
    return Number(turn.ownerId) === myOwnerId;
  };

  const renderTurnStatus = (turn) => {
    const statusLabel = STATUS_LABELS[turn.ownerStatus] || turn.ownerStatus;
    return (
      <span className="text-[11px] text-slate-400 truncate">{statusLabel}</span>
    );
  };

  const turnItemCls = (turn, idx) => {
    const highlight = isMyGroup(turn) || isMe(turn);
    const base =
      "flex items-center gap-3 rounded-xl px-2 py-1.5 transition-all";
    if (highlight) {
      return `${base} border border-blue-200 bg-blue-50/60`;
    }
    return `${base} ${idx === 0 ? "opacity-100" : "opacity-70"}`;
  };

  const numberCls = (turn) => {
    const highlight = isMyGroup(turn) || isMe(turn);
    if (highlight) {
      return "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 bg-blue-100 text-blue-700";
    }
    return "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 bg-slate-200 text-slate-600";
  };

  return (
    <div className="space-y-4">
      {/* ── Barber card ── */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-2 border-2 border-primary/20 overflow-hidden flex items-center justify-center">
          <span className="material-icons-round text-3xl text-slate-400">
            face
          </span>
        </div>

        <h3 className="font-bold text-lg">{barber.name}</h3>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
              barber.status === "active"
                ? "bg-green-100 text-green-700"
                : barber.status === "resting"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-slate-100 text-slate-600"
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
                ? "bg-blue-100 text-blue-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {barber.isAccepting ? "Aceptando" : "No acepta"}
          </span>
        </div>
      </div>

      {/* ── Queue card ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col">
        {/* Header "siendo atendido" */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 flex items-center gap-2">
          <span className="material-icons-round text-blue-500 text-sm">
            content_cut
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Siendo Atendido
          </span>
        </div>

        {/* Cliente en servicio */}
        <div className="p-4 flex items-center gap-3">
          {barber.current ? (
            <>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
                  isMyGroup(barber.current) || isMe(barber.current)
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
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
                  {renderTurnStatus(barber.current)}
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

        {/* Cola de espera */}
        <div className="p-4 space-y-2 flex-grow min-h-[120px]">
          {barber.queue.length === 0 ? (
            <div className="text-slate-400 text-sm text-center py-4 italic text-xs">
              Sin clientes en fila
            </div>
          ) : (
            barber.queue.map((client, idx) => (
              <div key={client.id} className={turnItemCls(client, idx)}>
                <div className={numberCls(client)}>
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
                  {renderTurnStatus(client)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Botón unirse */}
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
