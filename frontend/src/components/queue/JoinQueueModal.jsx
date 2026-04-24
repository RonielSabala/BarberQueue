const STATUS_LABELS = {
  at_barbershop: "En barbería",
  on_queue: "En cola",
  waiting: "Pausado",
  in_service: "En servicio",
  attended: "Atendido",
  paid: "Pagado",
};

function JoinQueueModal({
  isOpen,
  onClose,
  activeBarbers,
  groupMode,
  setGroupMode,
  selectedBarberId,
  setSelectedBarberId,
  groupMembers,
  groupError,
  joiningGroup,
  addGroupMember,
  removeGroupMember,
  updateGroupMember,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Entrar a la cola
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              ¿Vienes solo o en grupo?
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

        {groupError && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {groupError}
          </div>
        )}

        {/* Toggle solo / grupo */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={() => setGroupMode("single")}
            className={`py-3 rounded-2xl font-semibold border transition flex items-center justify-center gap-2 ${groupMode === "single" ? "bg-primary text-white border-primary" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
          >
            <span className="material-icons-round text-base">person</span>
            Solo
          </button>
          <button
            type="button"
            onClick={() => setGroupMode("group")}
            className={`py-3 rounded-2xl font-semibold border transition flex items-center justify-center gap-2 ${groupMode === "group" ? "bg-primary text-white border-primary" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
          >
            <span className="material-icons-round text-base">group</span>
            Grupo
          </button>
        </div>

        {/* Barbero preferido del líder */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Tu barbero preferido
          </label>
          <select
            value={selectedBarberId}
            onChange={(e) => setSelectedBarberId(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          >
            <option value="">Sin preferencia (auto-asignación)</option>
            {activeBarbers
              .filter((b) => b.isAccepting)
              .map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.name}
                </option>
              ))}
          </select>
        </div>

        {/* Miembros del grupo */}
        {groupMode === "group" && (
          <div className="space-y-4 mb-5">
            <p className="text-sm font-semibold text-slate-700">
              Miembros del grupo
            </p>
            {groupMembers.map((member, index) => (
              <div
                key={member.id}
                className="rounded-2xl border border-slate-200 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-700 text-sm">
                    Miembro {index + 1}
                  </p>
                  {groupMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGroupMember(member.id)}
                      className="w-8 h-8 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition"
                    >
                      <span className="material-icons-round text-sm">
                        close
                      </span>
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={member.memberName}
                    onChange={(e) =>
                      updateGroupMember(member.id, "memberName", e.target.value)
                    }
                    placeholder="Nombre del acompañante"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Barbero preferido
                  </label>
                  <select
                    value={member.barberId}
                    onChange={(e) =>
                      updateGroupMember(member.id, "barberId", e.target.value)
                    }
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm bg-white"
                  >
                    <option value="">Sin preferencia</option>
                    {activeBarbers
                      .filter((b) => b.isAccepting)
                      .map((barber) => (
                        <option key={barber.id} value={barber.id}>
                          {barber.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addGroupMember}
              className="w-full border border-dashed border-slate-300 hover:bg-slate-50 text-slate-600 font-semibold py-3 rounded-2xl transition flex items-center justify-center gap-2"
            >
              <span className="material-icons-round text-base">add</span>
              Agregar miembro
            </button>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={joiningGroup}
            className="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-2xl transition disabled:opacity-60"
          >
            {joiningGroup ? "Registrando..." : "Confirmar"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-2xl transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinQueueModal;
