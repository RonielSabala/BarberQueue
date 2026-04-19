import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBarbershopById,
  updateBarbershop,
  updateBarbershopStatus,
  updateBarbershopPhoto,
} from "../../services/barbershopService";

function mapBarbershopError(message) {
  const msg = message?.toLowerCase() || "";
  if (
    msg.includes("email") &&
    (msg.includes("already") ||
      msg.includes("exists") ||
      msg.includes("duplicate"))
  )
    return "El correo electrónico ya está registrado en otra barbería.";
  if (
    msg.includes("phone") &&
    (msg.includes("already") ||
      msg.includes("exists") ||
      msg.includes("duplicate"))
  )
    return "El teléfono ya está registrado en otra barbería.";
  if (
    msg.includes("name") &&
    (msg.includes("already") || msg.includes("exists"))
  )
    return "Ya existe una barbería con ese nombre.";
  if (msg.includes("capacity"))
    return "La capacidad debe ser un número válido mayor a 0.";
  if (msg.includes("time") || msg.includes("opens") || msg.includes("closes"))
    return "El formato de hora no es válido.";
  return message || "Error al actualizar la barbería.";
}

const fallbackImage = "https://via.placeholder.com/500x400?text=Barberia";

function AdminBarbershop() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [barbershop, setBarbershop] = useState(null);
  const [formData, setFormData] = useState({
    barbershopName: "",
    email: "",
    phone: "",
    barbershopAddress: "",
    opensAt: "",
    closesAt: "",
    capacity: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchBarbershop = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getBarbershopById(id);
      setBarbershop(data);
      const loaded = {
        barbershopName: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        barbershopAddress: data.address || "",
        opensAt: data.opensAt || "",
        closesAt: data.closesAt || "",
        capacity: data.capacity ?? "",
      };
      setFormData(loaded);
      setOriginalData(loaded);
      setPhotoUrl(data.photoUrl || "");
    } catch (err) {
      setError(err.message || "Error al cargar la barbería");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBarbershop();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");
      const changedFields = {};
      Object.keys(formData).forEach((key) => {
        if (
          String(formData[key] ?? "").trim() !==
          String(originalData?.[key] ?? "").trim()
        )
          changedFields[key] = formData[key];
      });
      if (Object.keys(changedFields).length === 0) {
        setSuccessMessage("No hay cambios para guardar.");
        return;
      }
      const response = await updateBarbershop(id, changedFields);
      setSuccessMessage(
        response.message || "Barbería actualizada correctamente.",
      );
      await fetchBarbershop();
    } catch (err) {
      setError(mapBarbershopError(err.message));
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingPhoto(true);
      setError("");
      setSuccessMessage("");
      const response = await updateBarbershopPhoto(id, photoUrl);
      setSuccessMessage(response.message || "Foto actualizada correctamente.");
      await fetchBarbershop();
    } catch (err) {
      setError(err.message || "Error al actualizar la foto");
    } finally {
      setSavingPhoto(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setStatusLoading(true);
      setError("");
      setSuccessMessage("");
      const response = await updateBarbershopStatus(id, newStatus);
      setSuccessMessage(response.message || "Estado actualizado.");
      await fetchBarbershop();
    } catch (err) {
      setError(err.message || "Error al cambiar el estado");
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <span className="material-icons-round text-5xl animate-pulse">
            storefront
          </span>
          <p className="text-sm font-medium">Cargando barbería...</p>
        </div>
      </div>
    );
  }

  if (!barbershop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400 shadow-sm">
          No se encontró la barbería.
        </div>
      </div>
    );
  }

  const isActive = barbershop.isActive ?? false;

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition placeholder:text-slate-300";
  const labelCls =
    "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2";

  return (
    <div className="bg-slate-50">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden border-b border-slate-100"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #eff6ff 100%)",
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-end pr-12 opacity-[0.04] pointer-events-none select-none">
          <span
            className="material-icons-round text-slate-900"
            style={{ fontSize: 260 }}
          >
            storefront
          </span>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-10">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <button
              onClick={() => navigate("/admin/home")}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-100 text-sm"
            >
              <span className="material-icons-round text-[18px]">
                arrow_back_ios_new
              </span>
              Volver
            </button>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => navigate(`/admin/barbershop/${id}/dashboard`)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition text-sm shadow-sm"
              >
                <span className="material-icons-round text-[16px]">
                  bar_chart
                </span>
                Dashboard
              </button>
              <button
                onClick={() => navigate(`/barbershops/${id}/queue`)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition text-sm shadow-sm"
              >
                <span className="material-icons-round text-[16px]">
                  sensors
                </span>
                Cola en vivo
              </button>
              <button
                onClick={() => navigate(`/admin/barbershop/${id}/employees`)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-700 transition text-sm shadow-sm"
              >
                <span className="material-icons-round text-[16px]">people</span>
                Empleados
              </button>
            </div>
          </div>

          {/* Title + status */}
          <div className="flex items-end gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none mb-3">
                {barbershop.name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-rose-50 text-rose-700 ring-rose-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-400" : "bg-rose-400"}`}
                  />
                  {isActive ? "Activa" : "Inactiva"}
                </span>
                {barbershop.address && (
                  <span className="text-slate-400 text-sm flex items-center gap-1">
                    <span className="material-icons-round text-[14px]">
                      location_on
                    </span>
                    {barbershop.address}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ALERTS ────────────────────────────────────────────────────────── */}
      {(error || successMessage) && (
        <div className="max-w-6xl mx-auto px-6 pt-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 text-sm">
              {successMessage}
            </div>
          )}
        </div>
      )}

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            {/* Photo preview */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <img
                src={barbershop.image || fallbackImage}
                alt={barbershop.name}
                onError={(e) => {
                  e.target.src = fallbackImage;
                }}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Foto principal
                </p>
                <form
                  onSubmit={handlePhotoSubmit}
                  className="flex flex-col gap-3"
                >
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://..."
                    className={inputCls}
                  />
                  <button
                    type="submit"
                    disabled={savingPhoto}
                    className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition disabled:opacity-50"
                  >
                    <span className="material-icons-round text-[16px]">
                      image
                    </span>
                    {savingPhoto ? "Actualizando..." : "Actualizar foto"}
                  </button>
                </form>
              </div>
            </div>

            {/* Status toggle */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Estado de la barbería
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => handleStatusChange(true)}
                  disabled={statusLoading}
                  className={`py-2.5 rounded-xl text-sm font-bold transition border ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  ✓ Activa
                </button>
                <button
                  onClick={() => handleStatusChange(false)}
                  disabled={statusLoading}
                  className={`py-2.5 rounded-xl text-sm font-bold transition border ${
                    !isActive
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  ✕ Inactiva
                </button>
              </div>
              <p className="text-xs text-slate-400 text-center">
                {isActive
                  ? "La barbería está visible y activa para los clientes."
                  : "La barbería está oculta para los clientes."}
              </p>
            </div>
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 pt-6 pb-2 border-b border-slate-50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Información de la barbería
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                {/* Name */}
                <div>
                  <label className={labelCls}>Nombre de la barbería</label>
                  <input
                    type="text"
                    name="barbershopName"
                    value={formData.barbershopName}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>

                {/* Address */}
                <div>
                  <label className={labelCls}>Dirección</label>
                  <input
                    type="text"
                    name="barbershopAddress"
                    value={formData.barbershopAddress}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Correo electrónico</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Teléfono</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Hora de apertura</label>
                    <input
                      type="time"
                      name="opensAt"
                      value={formData.opensAt}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Hora de cierre</label>
                    <input
                      type="time"
                      name="closesAt"
                      value={formData.closesAt}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Capacity */}
                <div className="max-w-[160px]">
                  <label className={labelCls}>Capacidad</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    className={inputCls}
                  />
                </div>

                <div className="pt-2 border-t border-slate-50">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition disabled:opacity-50 shadow-sm"
                  >
                    <span className="material-icons-round text-[16px]">
                      save
                    </span>
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBarbershop;
