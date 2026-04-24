import { useMemo, useState } from "react";
import { getUsers } from "../../services/userService";
import { registerUser } from "../../services/authService";
import { checkInBarbershopClient } from "../../services/barbershopService";
import { createTurn } from "../../services/turnService";

function AssistantRegisterPanel({
  barbers = [],
  barbershopId,
  onRegistered,
  onClose,
}) {
  const [clientMode, setClientMode] = useState("existing");
  const [queueMode, setQueueMode] = useState("single");

  const [email, setEmail] = useState("");
  const [clientUser, setClientUser] = useState(null);
  const [searchingClient, setSearchingClient] = useState(false);

  const [newClientData, setNewClientData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [leaderBarberId, setLeaderBarberId] = useState("");
  const [groupMembers, setGroupMembers] = useState([
    { id: 1, memberName: "", barberId: "" },
  ]);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const availableBarbers = useMemo(
    () => (Array.isArray(barbers) ? barbers : []),
    [barbers],
  );

  const resetMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  const resetForm = () => {
    setEmail("");
    setClientUser(null);
    setNewClientData({ username: "", email: "", phone: "", password: "" });
    setLeaderBarberId("");
    setGroupMembers([{ id: 1, memberName: "", barberId: "" }]);
  };

  const handleClientModeChange = (mode) => {
    setClientMode(mode);
    resetMessages();
    setClientUser(null);
    setEmail("");
    setNewClientData({ username: "", email: "", phone: "", password: "" });
  };

  const handleQueueModeChange = (mode) => {
    setQueueMode(mode);
    resetMessages();
    if (mode === "single")
      setGroupMembers([{ id: 1, memberName: "", barberId: "" }]);
  };

  const handleNewClientFieldChange = (e) => {
    const { name, value } = e.target;
    setNewClientData((prev) => ({ ...prev, [name]: value }));
  };

  const addGroupMember = () =>
    setGroupMembers((prev) => [
      ...prev,
      { id: Date.now(), memberName: "", barberId: "" },
    ]);

  const removeGroupMember = (id) => {
    if (groupMembers.length === 1) {
      setGroupMembers([{ id: 1, memberName: "", barberId: "" }]);
      return;
    }
    setGroupMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const updateGroupMember = (id, field, value) =>
    setGroupMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );

  const handleSearchClient = async () => {
    try {
      setSearchingClient(true);
      resetMessages();
      setClientUser(null);
      if (!email.trim()) {
        setError("Debes escribir el correo del cliente.");
        return;
      }
      const users = await getUsers({ email: email.trim(), role: "client" });
      if (!users.length) {
        setError("No se encontró un cliente con ese correo.");
        return;
      }
      setClientUser(users[0]);
      setSuccessMessage("Cliente encontrado correctamente.");
    } catch (err) {
      setError(err.message || "Error al buscar el cliente");
    } finally {
      setSearchingClient(false);
    }
  };

  const resolveClient = async () => {
    if (clientMode === "existing") {
      if (!clientUser?.id)
        throw new Error("Primero debes validar el correo del cliente.");
      return clientUser;
    }
    const { username, email: newEmail, phone, password } = newClientData;
    if (
      !username.trim() ||
      !newEmail.trim() ||
      !phone.trim() ||
      !password.trim()
    ) {
      throw new Error("Debes completar todos los datos del nuevo cliente.");
    }
    return await registerUser({
      username: username.trim(),
      email: newEmail.trim(),
      phone: phone.trim(),
      password: password.trim(),
    });
  };

  const buildGroupMembersPayload = () => {
    if (queueMode === "single") return [];
    const valid = groupMembers.filter((m) => m.memberName.trim());
    if (!valid.length)
      throw new Error(
        "Si vas a registrar un grupo, debes agregar al menos un miembro.",
      );
    return valid.map((m) => ({
      memberName: m.memberName.trim(),
      barberId: m.barberId ? Number(m.barberId) : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      resetMessages();
      if (!barbershopId) {
        setError("No se encontró la barbería asignada.");
        return;
      }
      const resolvedClient = await resolveClient();
      const clientId = resolvedClient?.id;
      if (!clientId) throw new Error("No se pudo obtener el id del cliente.");
      const groupMembersPayload = buildGroupMembersPayload();

      try {
        await checkInBarbershopClient(barbershopId, clientId);
      } catch (checkInErr) {
        const msg = checkInErr.message?.toLowerCase() || "";
        const alreadyInside =
          msg.includes("already") ||
          msg.includes("existe") ||
          msg.includes("registrado") ||
          msg.includes("ya");
        if (!alreadyInside) throw checkInErr;
      }

      await createTurn({
        clientId,
        barbershopId: Number(barbershopId),
        barberId: leaderBarberId ? Number(leaderBarberId) : null,
        groupMembers: groupMembersPayload,
      });

      setSuccessMessage("Cliente registrado correctamente en la cola.");
      resetForm();
      if (onRegistered) await onRegistered();
    } catch (err) {
      setError(
        err.message ||
          "No se pudo registrar el cliente. Verifica los datos e inténtalo de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
          <span className="material-icons-round text-red-500 text-base mt-0.5 flex-shrink-0">
            error_outline
          </span>
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 flex items-start gap-2">
          <span className="material-icons-round text-green-500 text-base mt-0.5 flex-shrink-0">
            check_circle_outline
          </span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tipo de cliente */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-3">
          Tipo de cliente
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleClientModeChange("existing")}
            className={`h-11 rounded-2xl font-semibold border transition ${clientMode === "existing" ? "bg-primary text-white border-primary" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
          >
            Existente
          </button>
          <button
            type="button"
            onClick={() => handleClientModeChange("new")}
            className={`h-11 rounded-2xl font-semibold border transition ${clientMode === "new" ? "bg-primary text-white border-primary" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
          >
            Nuevo
          </button>
        </div>
      </div>

      {/* Tipo de registro */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-3">
          Tipo de registro
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleQueueModeChange("single")}
            className={`h-11 rounded-2xl font-semibold border transition ${queueMode === "single" ? "bg-blue-700 text-white border-blue-700" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
          >
            Solo
          </button>
          <button
            type="button"
            onClick={() => handleQueueModeChange("group")}
            className={`h-11 rounded-2xl font-semibold border transition ${queueMode === "group" ? "bg-blue-700 text-white border-blue-700" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
          >
            Grupo
          </button>
        </div>
      </div>

      {/* Datos del cliente */}
      {clientMode === "existing" ? (
        <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
          <label className="block text-sm font-semibold text-slate-700">
            Correo del cliente
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearchClient();
              }
            }}
            placeholder="correo@cliente.com"
            className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={handleSearchClient}
            disabled={searchingClient}
            className="w-full bg-primary hover:bg-blue-600 text-white font-bold h-11 rounded-2xl disabled:opacity-60"
          >
            {searchingClient ? "Buscando..." : "Validar cliente"}
          </button>
          {clientUser && (
            <div className="rounded-2xl bg-green-50 border border-green-200 p-3 flex items-center gap-3">
              <span className="material-icons-round text-green-500">
                verified_user
              </span>
              <div>
                <p className="font-bold text-slate-800 text-sm">
                  {clientUser.username}
                </p>
                <p className="text-xs text-slate-500">{clientUser.email}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
          {[
            {
              label: "Nombre de usuario",
              name: "username",
              type: "text",
              placeholder: "Nombre completo",
            },
            {
              label: "Correo",
              name: "email",
              type: "email",
              placeholder: "correo@cliente.com",
            },
            {
              label: "Teléfono",
              name: "phone",
              type: "text",
              placeholder: "8091234567",
            },
            {
              label: "Contraseña inicial",
              name: "password",
              type: "text",
              placeholder: "Crear contraseña",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={newClientData[field.name]}
                onChange={handleNewClientFieldChange}
                placeholder={field.placeholder}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          ))}
        </div>
      )}

      {/* Formulario de turno */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Barbero para cliente líder
          </label>
          <select
            value={leaderBarberId}
            onChange={(e) => setLeaderBarberId(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Sin preferencia</option>
            {availableBarbers.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.name}
              </option>
            ))}
          </select>
        </div>

        {queueMode === "group" && (
          <div className="space-y-3">
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
                      className="w-8 h-8 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center"
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
                    Barbero asignado
                  </label>
                  <select
                    value={member.barberId}
                    onChange={(e) =>
                      updateGroupMember(member.id, "barberId", e.target.value)
                    }
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm bg-white"
                  >
                    <option value="">Sin preferencia</option>
                    {availableBarbers.map((barber) => (
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
              className="w-full border border-dashed border-slate-300 hover:bg-slate-50 text-slate-600 font-semibold h-11 rounded-2xl flex items-center justify-center gap-2"
            >
              <span className="material-icons-round text-base">add</span>
              Agregar miembro
            </button>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold h-12 rounded-2xl disabled:opacity-60"
          >
            {submitting ? "Registrando..." : "Confirmar"}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold h-12 rounded-2xl"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AssistantRegisterPanel;
