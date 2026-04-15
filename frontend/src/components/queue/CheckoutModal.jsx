const STATUS_LABELS = {
  at_barbershop: "En barbería",
  on_queue: "En cola",
  waiting: "Pausado",
  in_service: "En servicio",
  attended: "Atendido",
  paid: "Pagado",
};

function CheckoutModal({
  isOpen,
  onClose,
  clientsWithTurns,
  clientsAtBarbershop,
  loadingQueue,
  loadingClients,
  checkoutError,
  checkoutSuccess,
  checkoutActionLoading,
  onCancelTurn,
  onCheckOut,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Gestionar salidas
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Cancela turnos o retira clientes de la barbería.
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

        {checkoutError && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {checkoutError}
          </div>
        )}
        {checkoutSuccess && (
          <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {checkoutSuccess}
          </div>
        )}

        {/* ─── Tabla 1: Clientes en turnos ─── */}
        <div className="mb-6">
          <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="material-icons-round text-base text-amber-500">
              content_cut
            </span>
            Clientes en turnos
          </h3>
          {loadingQueue ? (
            <p className="text-slate-400 text-sm">Cargando...</p>
          ) : clientsWithTurns.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
              <p className="text-slate-400 text-sm">
                No hay clientes en cola actualmente.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {clientsWithTurns.map((turn) => (
                <div
                  key={turn.id}
                  className="flex items-center justify-between gap-3 border border-slate-100 rounded-2xl p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <span className="material-icons-round text-amber-600 text-sm">
                        person
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">
                        {turn.ownerName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {STATUS_LABELS[turn.ownerStatus] || turn.ownerStatus} ·{" "}
                        {turn.barberName}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCancelTurn(turn.id)}
                    disabled={checkoutActionLoading === `turn-${turn.id}`}
                    className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold px-3 py-2 rounded-xl transition disabled:opacity-60 flex-shrink-0 text-sm"
                  >
                    <span className="material-icons-round text-sm">
                      {checkoutActionLoading === `turn-${turn.id}`
                        ? "hourglass_empty"
                        : "cancel"}
                    </span>
                    {checkoutActionLoading === `turn-${turn.id}`
                      ? "..."
                      : "Cancelar"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── Tabla 2: Espera general ─── */}
        <div>
          <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="material-icons-round text-base text-slate-400">
              hourglass_empty
            </span>
            Espera general
          </h3>
          {loadingClients ? (
            <p className="text-slate-400 text-sm">Cargando...</p>
          ) : clientsAtBarbershop.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
              <p className="text-slate-400 text-sm">
                No hay clientes en espera general.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {clientsAtBarbershop.map((client) => (
                <div
                  key={client.clientId}
                  className="flex items-center justify-between gap-3 border border-slate-100 rounded-2xl p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <span className="material-icons-round text-slate-400 text-sm">
                        person
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">
                        {client.username}
                      </p>
                      <p className="text-xs text-slate-500">
                        {STATUS_LABELS[client.currentStatus] ||
                          client.currentStatus}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCheckOut(client.clientId)}
                    disabled={
                      checkoutActionLoading === `checkout-${client.clientId}`
                    }
                    className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-2 rounded-xl transition disabled:opacity-60 flex-shrink-0 text-sm"
                  >
                    <span className="material-icons-round text-sm">
                      {checkoutActionLoading === `checkout-${client.clientId}`
                        ? "hourglass_empty"
                        : "exit_to_app"}
                    </span>
                    {checkoutActionLoading === `checkout-${client.clientId}`
                      ? "..."
                      : "Retirar"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-6 py-3 rounded-2xl transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;
