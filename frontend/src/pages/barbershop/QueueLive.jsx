import { useParams } from "react-router-dom";
import { useQueueLive } from "../../hooks/useQueueLive";
import QueueColumn from "../../components/queue/QueueColumn";
import AssistantRegisterPanel from "../../components/assistant/AssistantRegisterPanel";
import JoinQueueModal from "../../components/queue/JoinQueueModal";
import MyTurnModal from "../../components/queue/MyTurnModal";
import CheckoutModal from "../../components/queue/CheckoutModal";

const STATUS_LABELS = {
  at_barbershop: "En barbería",
  on_queue: "En cola",
  waiting: "Pausado",
  in_service: "En servicio",
  attended: "Atendido",
  paid: "Pagado",
};

// ── Modal de capacidad excedida ────────────────────────────────────────────
function CapacityModal({ capacity, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(15,23,42,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center">
            <span className="material-icons-round text-amber-500 text-3xl">
              person_off
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 text-center">
          <h2 className="text-lg font-black text-slate-800 mb-2">
            Barbería llena
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Esta barbería tiene una capacidad máxima de{" "}
            <span className="font-bold text-slate-700">
              {capacity} personas
            </span>{" "}
            y actualmente está llena. Si vienes en grupo, tu grupo no puede
            registrarse porque superaría el límite. Intenta de nuevo cuando haya
            espacio disponible.
          </p>
        </div>

        {/* Action */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors text-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

function QueueLive() {
  const { id } = useParams();
  const q = useQueueLive(id);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* ─── Header ─── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight mb-1">
              Cola en tiempo real
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {q.barbershopName || "Sucursal BarberQueue"}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Clientes Activos
              </p>
              <p className="text-2xl font-display font-bold text-primary">
                {q.totalActivos}{" "}
                <span className="text-slate-300 dark:text-slate-700">
                  / {q.barbershopCapacity ?? "—"}
                </span>
              </p>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-800"></div>
            <span className="material-icons-round text-slate-400 text-3xl">
              groups
            </span>
          </div>
        </div>

        {/* ─── Alertas globales ─── */}
        {q.turnSuccess && (
          <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {q.turnSuccess}
          </div>
        )}
        {q.turnError && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {q.turnError}
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-8">
          {/* ─── Cola principal ─── */}
          <div className="flex-grow">
            {q.queueError && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                {q.queueError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {q.loadingQueue ? (
                <p className="text-slate-500">Cargando cola...</p>
              ) : q.activeBarbers.length === 0 ? (
                <p className="text-slate-500">No hay barberos activos.</p>
              ) : (
                q.activeBarbers.map((barber) => (
                  <QueueColumn
                    key={barber.id}
                    barber={barber}
                    showJoinAction={q.isClient}
                    canJoin={q.currentUserCheckedIn && !q.myTurn}
                    joining={q.turnActionLoading || q.joiningGroup}
                    onJoinQueue={q.handleOpenJoinModal}
                    currentUserId={q.currentUserId}
                    myTurn={q.myTurn}
                  />
                ))
              )}
            </div>

            {/* Espera general */}
            <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                <span className="material-icons-round text-primary">
                  hourglass_empty
                </span>
                Espera General
              </h2>
              {q.loadingClients ? (
                <p className="text-slate-400 text-sm">Cargando clientes...</p>
              ) : q.clientsAtBarbershop.length === 0 ? (
                <p className="text-slate-400 text-sm italic">
                  No hay clientes registrados en espera general.
                </p>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {q.clientsAtBarbershop.map((client) => (
                    <div
                      key={client.clientId}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        <span className="material-icons-round text-slate-400">
                          person
                        </span>
                      </div>
                      <span className="text-xs font-medium text-slate-500 text-center max-w-[80px] break-words">
                        {client.username}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ─── Sidebar derecho ─── */}
          <div className="w-full xl:w-80 space-y-6">
            {/* Descansando */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-icons-round text-slate-400">
                  hotel
                </span>
                Descansando
              </h3>
              <div className="space-y-4">
                {q.loadingQueue ? (
                  <p className="text-slate-400 text-sm">Cargando...</p>
                ) : q.restingBarbers.length === 0 ? (
                  <p className="text-slate-400 text-sm italic py-2">
                    Ningún barbero descansando
                  </p>
                ) : (
                  q.restingBarbers.map((barber) => (
                    <div key={barber.id} className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 grayscale opacity-50 flex items-center justify-center overflow-hidden">
                          <span className="material-icons-round text-slate-400">
                            face
                          </span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white dark:border-slate-900"></div>
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

            {/* Estimación */}
            <div className="bg-primary/10 dark:bg-primary/5 rounded-3xl p-6 border border-primary/20">
              <span className="material-icons-round text-primary mb-2 text-2xl">
                info
              </span>
              <h4 className="font-bold text-primary mb-2">
                Estimación de espera
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                El tiempo promedio de servicio actual es de{" "}
                <span className="font-bold text-primary">~20 minutos</span> por
                turno.
              </p>
            </div>

            {/* Panel assistant */}
            {q.isAssistant ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => q.setIsRegisterModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-2xl shadow-sm transition"
                >
                  <span className="material-icons-round text-base">
                    person_add
                  </span>
                  Registrar cliente
                </button>
                <button
                  type="button"
                  onClick={() => {
                    q.setCheckoutError("");
                    q.setCheckoutSuccess("");
                    q.setIsCheckoutModalOpen(true);
                    q.fetchClientsAtBarbershop();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-2xl shadow-sm transition"
                >
                  <span className="material-icons-round text-slate-500">
                    exit_to_app
                  </span>
                  Gestionar salidas
                </button>
              </div>
            ) : (
              /* Panel cliente */
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="material-icons-round text-slate-400">
                    storefront
                  </span>
                  Clientes en barbería
                </h3>

                {q.clientError && (
                  <p className="text-sm text-red-500 mb-3">{q.clientError}</p>
                )}
                {q.clientSuccess && (
                  <p className="text-sm text-green-600 mb-3">
                    {q.clientSuccess}
                  </p>
                )}

                {q.isClient && (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">
                      Registra tu llegada para aparecer en la espera general de
                      la barbería.
                    </p>
                    {q.currentUserCheckedIn ? (
                      <>
                        <div className="rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-green-700 text-sm font-medium">
                          Ya estás registrado dentro de la barbería.
                        </div>
                        <button
                          type="button"
                          onClick={q.handleSelfCheckOut}
                          disabled={q.clientActionLoading}
                          className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold py-3 rounded-2xl transition disabled:opacity-60"
                        >
                          <span className="material-icons-round text-base">
                            logout
                          </span>
                          {q.clientActionLoading
                            ? "Saliendo..."
                            : "Salir de la barbería"}
                        </button>
                      </>
                    ) : q.atCapacity ? (
                      <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-amber-700 text-sm font-medium text-center">
                        <span className="material-icons-round text-base align-middle mr-1">
                          groups_off
                        </span>
                        Barbería llena — capacidad máxima alcanzada.
                      </div>
                    ) : (
                      <button
                        onClick={q.handleCheckIn}
                        disabled={q.clientActionLoading}
                        className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-2xl transition disabled:opacity-60"
                      >
                        {q.clientActionLoading
                          ? "Registrando..."
                          : "Registrar llegada"}
                      </button>
                    )}
                    {q.currentUserCheckedIn && (
                      <button
                        type="button"
                        onClick={() => {
                          q.setIsTurnModalOpen(true);
                          q.fetchMyTurn();
                        }}
                        disabled={q.loadingMyTurn}
                        className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-2xl transition disabled:opacity-60"
                      >
                        {q.loadingMyTurn ? "Cargando..." : "Ver mi turno"}
                      </button>
                    )}
                  </div>
                )}

                {q.canManageClients && !q.isClient && !q.isAssistant && (
                  <div className="space-y-3">
                    {q.loadingClients ? (
                      <p className="text-slate-400 text-sm">
                        Cargando clientes...
                      </p>
                    ) : q.clientsAtBarbershop.length === 0 ? (
                      <p className="text-slate-400 text-sm italic">
                        No hay clientes dentro de la barbería.
                      </p>
                    ) : (
                      q.clientsAtBarbershop.map((client) => (
                        <div
                          key={client.clientId}
                          className="flex items-center justify-between gap-3 border border-slate-100 rounded-2xl p-3"
                        >
                          <div>
                            <p className="font-semibold text-slate-800">
                              {client.username}
                            </p>
                            <p className="text-xs text-slate-500">
                              {STATUS_LABELS[client.currentStatus] ||
                                client.currentStatus}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              q.handleAssistantCheckOut(client.clientId)
                            }
                            disabled={
                              q.checkoutActionLoading ===
                              `checkout-${client.clientId}`
                            }
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-2 rounded-xl transition disabled:opacity-60"
                          >
                            Retirar
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ─── Modales ─── */}
      {q.isCapacityModalOpen && (
        <CapacityModal
          capacity={q.barbershopCapacity}
          onClose={() => q.setIsCapacityModalOpen(false)}
        />
      )}

      <JoinQueueModal
        isOpen={q.isGroupModalOpen}
        onClose={() => q.setIsGroupModalOpen(false)}
        activeBarbers={q.activeBarbers}
        groupMode={q.groupMode}
        setGroupMode={q.setGroupMode}
        selectedBarberId={q.selectedBarberId}
        setSelectedBarberId={q.setSelectedBarberId}
        groupMembers={q.groupMembers}
        groupError={q.groupError}
        joiningGroup={q.joiningGroup}
        addGroupMember={q.addGroupMember}
        removeGroupMember={q.removeGroupMember}
        updateGroupMember={q.updateGroupMember}
        onConfirm={q.handleJoinQueue}
      />

      <MyTurnModal
        isOpen={q.isTurnModalOpen}
        onClose={() => q.setIsTurnModalOpen(false)}
        myTurn={q.myTurn}
        myTurnStatus={q.myTurnStatus}
        loadingMyTurn={q.loadingMyTurn}
        turnActionLoading={q.turnActionLoading}
        currentBarberName={q.currentBarberName}
        estimatedTurnTime={q.estimatedTurnTime}
        estimatedGroupTime={q.estimatedGroupTime}
        isGroupLeader={q.isGroupLeader}
        onWait={q.handleWaitMyTurn}
        onUnwait={q.handleUnwaitMyTurn}
        onPay={q.handlePayMyTurn}
        onCancel={q.handleCancelMyTurn}
      />

      <CheckoutModal
        isOpen={q.isCheckoutModalOpen}
        onClose={() => q.setIsCheckoutModalOpen(false)}
        clientsWithTurns={q.clientsWithTurns}
        clientsAtBarbershop={q.clientsAtBarbershop}
        loadingQueue={q.loadingQueue}
        loadingClients={q.loadingClients}
        checkoutError={q.checkoutError}
        checkoutSuccess={q.checkoutSuccess}
        checkoutActionLoading={q.checkoutActionLoading}
        onCancelTurn={q.handleCancelClientTurn}
        onCheckOut={q.handleAssistantCheckOut}
      />

      {q.isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Registrar cliente
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Registra un cliente existente o nuevo en la cola.
                </p>
              </div>
              <button
                type="button"
                onClick={() => q.setIsRegisterModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <AssistantRegisterPanel
              barbers={q.activeBarbers}
              barbershopId={id}
              onClose={() => q.setIsRegisterModalOpen(false)}
              onRegistered={async () => {
                await Promise.all([
                  q.fetchQueue(),
                  q.fetchClientsAtBarbershop(),
                ]);
              }}
            />
          </div>
        </div>
      )}

      <div className="h-20"></div>
    </div>
  );
}

export default QueueLive;
