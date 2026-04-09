import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../services/userService";
import { registerUser } from "../../services/authService";
import { checkInBarbershopClient } from "../../services/barbershopService";
import { createTurn } from "../../services/turnService";

function AssistantRegisterPanel({ barbers = [], barbershopId, onRegistered }) {
  const navigate = useNavigate();

  const [clientMode, setClientMode] = useState("existing"); // existing | new
  const [queueMode, setQueueMode] = useState("single"); // single | group

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

  const availableBarbers = useMemo(() => {
    return Array.isArray(barbers) ? barbers : [];
  }, [barbers]);

  const resetMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  const resetForm = () => {
    setEmail("");
    setClientUser(null);
    setNewClientData({
      username: "",
      email: "",
      phone: "",
      password: "",
    });
    setLeaderBarberId("");
    setGroupMembers([{ id: 1, memberName: "", barberId: "" }]);
  };

  const handleClientModeChange = (mode) => {
    setClientMode(mode);
    resetMessages();
    setClientUser(null);
    setEmail("");
    setNewClientData({
      username: "",
      email: "",
      phone: "",
      password: "",
    });
  };

  const handleQueueModeChange = (mode) => {
    setQueueMode(mode);
    resetMessages();

    if (mode === "single") {
      setGroupMembers([{ id: 1, memberName: "", barberId: "" }]);
    }
  };

  const handleNewClientFieldChange = (e) => {
    const { name, value } = e.target;
    setNewClientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addGroupMember = () => {
    setGroupMembers((prev) => [
      ...prev,
      { id: Date.now(), memberName: "", barberId: "" },
    ]);
  };

  const removeGroupMember = (id) => {
    if (groupMembers.length === 1) {
      setGroupMembers([{ id: 1, memberName: "", barberId: "" }]);
      return;
    }

    setGroupMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const updateGroupMember = (id, field, value) => {
    setGroupMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, [field]: value } : member,
      ),
    );
  };

  const handleSearchClient = async () => {
    try {
      setSearchingClient(true);
      resetMessages();
      setClientUser(null);

      if (!email.trim()) {
        setError("Debes escribir el correo del cliente.");
        return;
      }

      const users = await getUsers({
        email: email.trim(),
        role: "client",
      });

      if (!users.length) {
        setError("No se encontró un cliente con ese correo.");
        return;
      }

      setClientUser(users[0]);
      setSuccessMessage("Cliente encontrado correctamente.");
    } catch (err) {
      console.error("Error al buscar cliente:", err);
      setError(err.message || "Error al buscar el cliente");
    } finally {
      setSearchingClient(false);
    }
  };

  const resolveClient = async () => {
    if (clientMode === "existing") {
      if (!clientUser?.id) {
        throw new Error("Primero debes validar el correo del cliente.");
      }

      return clientUser;
    }

    if (
      !newClientData.username.trim() ||
      !newClientData.email.trim() ||
      !newClientData.phone.trim() ||
      !newClientData.password.trim()
    ) {
      throw new Error("Debes completar todos los datos del nuevo cliente.");
    }

    const createdClient = await registerUser({
      username: newClientData.username.trim(),
      email: newClientData.email.trim(),
      phone: newClientData.phone.trim(),
      password: newClientData.password.trim(),
    });

    return createdClient;
  };

  const buildGroupMembersPayload = () => {
    if (queueMode === "single") return [];

    const validMembers = groupMembers.filter((member) =>
      member.memberName.trim(),
    );

    if (!validMembers.length) {
      throw new Error(
        "Si vas a registrar un grupo, debes agregar al menos un miembro.",
      );
    }

    return validMembers.map((member) => ({
      memberName: member.memberName.trim(),
      barberId: member.barberId ? Number(member.barberId) : null,
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

      if (!clientId) {
        throw new Error("No se pudo obtener el id del cliente.");
      }

      const groupMembersPayload = buildGroupMembersPayload();

      await checkInBarbershopClient(barbershopId, clientId);

      await createTurn({
        clientId,
        barbershopId: Number(barbershopId),
        barberId: leaderBarberId ? Number(leaderBarberId) : null,
        groupMembers: groupMembersPayload,
      });

      setSuccessMessage("Cliente registrado correctamente en la cola.");
      resetForm();

      if (onRegistered) {
        await onRegistered();
      }
    } catch (err) {
      console.error(
        "No se pudo registrar el cliente. Verifica los datos e inténtalo de nuevo.",
        err,
      );
      setError(
        err.message ||
          "No se pudo registrar el cliente. Verifica los datos e inténtalo de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display font-bold text-lg text-slate-900">
            Registrar clientes
          </h3>
          <p className="text-sm text-slate-500">
            Flujo exclusivo para assistant.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/assistant/home")}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => navigate("/assistant/profile")}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold"
          >
            Perfil
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <div className="rounded-2xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700">
        Desde aquí puedes registrar un cliente existente o un cliente nuevo, y
        luego meterlo a la cola solo o en grupo.
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Tipo de cliente
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleClientModeChange("existing")}
              className={`h-12 rounded-2xl font-semibold border transition ${
                clientMode === "existing"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Cliente existente
            </button>

            <button
              type="button"
              onClick={() => handleClientModeChange("new")}
              className={`h-12 rounded-2xl font-semibold border transition ${
                clientMode === "new"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Cliente nuevo
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Tipo de registro
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleQueueModeChange("single")}
              className={`h-12 rounded-2xl font-semibold border transition ${
                queueMode === "single"
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Cliente solo
            </button>

            <button
              type="button"
              onClick={() => handleQueueModeChange("group")}
              className={`h-12 rounded-2xl font-semibold border transition ${
                queueMode === "group"
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Grupo
            </button>
          </div>
        </div>
      </div>

      {clientMode === "existing" ? (
        <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Correo del cliente
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@cliente.com"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            type="button"
            onClick={handleSearchClient}
            disabled={searchingClient}
            className="w-full bg-primary hover:bg-blue-600 text-white font-bold h-12 rounded-2xl disabled:opacity-60"
          >
            {searchingClient ? "Buscando..." : "Validar cliente"}
          </button>

          {clientUser && (
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <p className="font-bold text-slate-800">{clientUser.username}</p>
              <p className="text-sm text-slate-500">{clientUser.email}</p>
              <p className="text-sm text-slate-500">{clientUser.phone}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nombre del cliente
            </label>
            <input
              type="text"
              name="username"
              value={newClientData.username}
              onChange={handleNewClientFieldChange}
              placeholder="Nombre completo"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Correo
            </label>
            <input
              type="email"
              name="email"
              value={newClientData.email}
              onChange={handleNewClientFieldChange}
              placeholder="correo@cliente.com"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Teléfono
            </label>
            <input
              type="text"
              name="phone"
              value={newClientData.phone}
              onChange={handleNewClientFieldChange}
              placeholder="8091234567"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Contraseña
            </label>
            <input
              type="text"
              name="password"
              value={newClientData.password}
              onChange={handleNewClientFieldChange}
              placeholder="Crear contraseña inicial"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl border border-slate-200 p-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Barbero para cliente líder
          </label>
          <select
            value={leaderBarberId}
            onChange={(e) => setLeaderBarberId(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">N/A</option>
            {availableBarbers.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.name}
              </option>
            ))}
          </select>
        </div>

        {queueMode === "group" && (
          <div className="space-y-4">
            {groupMembers.map((member, index) => (
              <div
                key={member.id}
                className="rounded-2xl border border-slate-200 p-4 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-bold text-slate-800">
                    Miembro No. {index + 1}
                  </h4>

                  <button
                    type="button"
                    onClick={() => removeGroupMember(member.id)}
                    className="w-10 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xl font-bold"
                  >
                    -
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre del miembro
                  </label>
                  <input
                    type="text"
                    value={member.memberName}
                    onChange={(e) =>
                      updateGroupMember(member.id, "memberName", e.target.value)
                    }
                    placeholder="Nombre del acompañante"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Barbero asignado
                  </label>
                  <select
                    value={member.barberId}
                    onChange={(e) =>
                      updateGroupMember(member.id, "barberId", e.target.value)
                    }
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">N/A</option>
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
              className="w-full border border-dashed border-slate-300 hover:bg-slate-50 text-slate-700 font-bold h-12 rounded-2xl"
            >
              + Agregar miembro al grupo
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-14 rounded-2xl shadow-sm disabled:opacity-60"
        >
          {submitting ? "Registrando..." : "Confirmar"}
        </button>
      </form>
    </div>
  );
}

export default AssistantRegisterPanel;
