const STATUS_LABELS = {
  at_barbershop: "En barbería",
  on_queue: "En cola",
  waiting: "Pausado",
  in_service: "En servicio",
  attended: "Atendido",
  paid: "Pagado",
};

function MyTurnModal({
  isOpen,
  onClose,
  myTurn,
  myTurnStatus,
  loadingMyTurn,
  turnActionLoading,
  currentBarberName,
  estimatedTurnTime,
  estimatedGroupTime,
  isGroupLeader,
  onWait,
  onUnwait,
  onPay,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Mi turno</h2>
            <p className="text-sm text-slate-500">
              Información actual de tu turno en la barbería.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <span className="material-icons-round">close</span>
          </button>
        </div>

        {loadingMyTurn ? (
          <p className="text-slate-500">Cargando turno...</p>
        ) : !myTurn ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-slate-600">
              No tienes un turno activo en este momento.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase font-bold text-slate-400 mb-1">
                  Cliente
                </p>
                <p className="font-bold text-slate-800">
                  {myTurn.ownerName || myTurn.username}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase font-bold text-slate-400 mb-1">
                  Estado
                </p>
                <p className="font-bold text-slate-800">
                  {STATUS_LABELS[myTurnStatus] || myTurnStatus}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase font-bold text-slate-400 mb-1">
                  Barbero
                </p>
                <p className="font-bold text-slate-800">{currentBarberName}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase font-bold text-slate-400 mb-1">
                  Posición
                </p>
                <p className="font-bold text-slate-800">
                  {myTurn.position ?? "—"}
                  {myTurn.absolutePosition != null &&
                    myTurn.absolutePosition !== myTurn.position && (
                      <span className="text-xs font-normal text-slate-400 ml-2">
                        (absoluta: {myTurn.absolutePosition})
                      </span>
                    )}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase font-bold text-slate-400 mb-1">
                  Tiempo estimado
                </p>
                <p className="font-bold text-slate-800">{estimatedTurnTime}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase font-bold text-slate-400 mb-1">
                  Tipo de turno
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    {isGroupLeader ? "Grupo" : "Individual"}
                  </span>
                  {isGroupLeader && (
                    <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                      Líder de grupo
                    </span>
                  )}
                </div>
              </div>
            </div>

            {isGroupLeader && estimatedGroupTime && (
              <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 flex items-center gap-3">
                <span className="material-icons-round text-blue-500 text-base">
                  group
                </span>
                <p className="text-sm font-semibold text-blue-700">
                  {estimatedGroupTime}
                </p>
              </div>
            )}

            {isGroupLeader && (
              <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Grupo #{myTurn.group.groupId}
                    </p>
                    <p className="text-xs text-slate-500">
                      Estás registrado como líder de grupo.
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    {myTurn.group.members.length} miembro
                    {myTurn.group.members.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-3">
                  {myTurn.group.members.map((member) => {
                    const memberStatus = member.status;
                    const hidePosition = ["attended", "paid"].includes(
                      memberStatus,
                    );
                    return (
                      <div
                        key={member.id}
                        className="rounded-2xl bg-white border border-slate-200 p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <p className="font-bold text-slate-800">
                              {member.memberName}
                            </p>
                            <p className="text-sm text-slate-500">
                              Miembro del grupo
                            </p>
                            {member.estimatedTime != null && !hidePosition && (
                              <p className="text-xs text-slate-400 mt-1">
                                {member.estimatedTime === 0
                                  ? "Siendo atendido"
                                  : `~${Math.round(member.estimatedTime)} min`}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {!hidePosition && (
                              <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                Posición: {member.position ?? "—"}
                              </span>
                            )}
                            <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-bold bg-green-100 text-green-700">
                              {STATUS_LABELS[memberStatus] || memberStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              {myTurnStatus === "on_queue" && (
                <button
                  type="button"
                  onClick={onWait}
                  disabled={turnActionLoading}
                  className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold py-3 rounded-2xl transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <span className="material-icons-round text-base">
                    pause_circle
                  </span>
                  {turnActionLoading ? "Pausando..." : "Salir un momento"}
                </button>
              )}
              {myTurnStatus === "waiting" && (
                <button
                  type="button"
                  onClick={onUnwait}
                  disabled={turnActionLoading}
                  className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 font-bold py-3 rounded-2xl transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <span className="material-icons-round text-base">
                    play_circle
                  </span>
                  {turnActionLoading ? "Volviendo..." : "Volver a la cola"}
                </button>
              )}
              {myTurnStatus === "attended" && (
                <button
                  type="button"
                  onClick={onPay}
                  disabled={turnActionLoading}
                  className="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-2xl transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <span className="material-icons-round text-base">
                    payments
                  </span>
                  {turnActionLoading ? "Procesando..." : "Confirmar pago"}
                </button>
              )}
              {!["in_service", "attended", "paid"].includes(myTurnStatus) && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={turnActionLoading}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-2xl transition disabled:opacity-60"
                >
                  {turnActionLoading ? "Cancelando..." : "Cancelar turno"}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-2xl transition"
              >
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyTurnModal;
