import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBarbershopById,
  updateBarbershop,
  updateBarbershopStatus,
  updateBarbershopPhoto,
  getBarbershopPhotos,
  addBarbershopPhotos,
  deleteBarbershopPhoto,
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

// ── Modal editar foto (delete + add) ─────────────────────────────────────
function EditPhotoModal({ photo, onConfirm, onCancel, saving }) {
  const [photoUrl, setPhotoUrl] = useState(photo.photoUrl);
  const [photoDescription, setPhotoDescription] = useState(
    photo.photoDescription || "",
  );

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition placeholder:text-slate-300";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(15,23,42,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 border-b border-slate-50">
          <h2 className="text-lg font-black text-slate-800">Editar foto</h2>
          <p className="text-xs text-slate-400 mt-1">
            Actualiza la URL o la descripción de la foto.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Preview */}
          {photoUrl && (
            <img
              src={photoUrl}
              alt="preview"
              onError={(e) => {
                e.target.style.display = "none";
              }}
              className="w-full h-40 object-cover rounded-2xl border border-slate-100"
            />
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              URL de la foto
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Descripción
            </label>
            <input
              type="text"
              value={photoDescription}
              onChange={(e) => setPhotoDescription(e.target.value)}
              placeholder="Ej: Fade clásico"
              required
              className={inputCls}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 px-6 pb-6">
          <button
            onClick={() => onConfirm({ photoUrl, photoDescription })}
            disabled={saving || !photoUrl.trim() || !photoDescription.trim()}
            className="w-full py-3 bg-slate-900 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-sm"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
          <button
            onClick={onCancel}
            disabled={saving}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
function DeletePhotoModal({ onConfirm, onCancel, deleting }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(15,23,42,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-8 pb-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
            <span className="material-icons-round text-red-500 text-3xl">
              hide_image
            </span>
          </div>
        </div>
        <div className="px-6 pb-6 text-center">
          <h2 className="text-lg font-black text-slate-800 mb-2">
            ¿Eliminar foto?
          </h2>
          <p className="text-sm text-slate-500">
            Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="flex flex-col gap-2 px-6 pb-6">
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-sm"
          >
            {deleting ? "Eliminando..." : "Sí, eliminar foto"}
          </button>
          <button
            onClick={onCancel}
            disabled={deleting}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

const fallbackImage = "https://via.placeholder.com/500x400?text=Barberia";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition placeholder:text-slate-300";
const labelCls =
  "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2";

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

  // ── Galería ────────────────────────────────────────────────────────────
  const [photos, setPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState(null);
  const [photoToEdit, setPhotoToEdit] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    photoUrl: "",
    photoDescription: "",
  });
  const [addingPhoto, setAddingPhoto] = useState(false);

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

  const fetchPhotos = async () => {
    try {
      setPhotosLoading(true);
      const data = await getBarbershopPhotos(id);
      setPhotos(data);
    } catch {
      setPhotos([]);
    } finally {
      setPhotosLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBarbershop();
      fetchPhotos();
    }
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

  const handleEditPhotoConfirm = async ({ photoUrl, photoDescription }) => {
    if (!photoToEdit) return;
    try {
      setEditingPhoto(true);
      // Delete old + add new (no PATCH endpoint available)
      await deleteBarbershopPhoto(id, photoToEdit.id);
      await addBarbershopPhotos(id, [{ photoUrl, photoDescription }]);
      setSuccessMessage("Foto actualizada correctamente.");
      setPhotoToEdit(null);
      await fetchPhotos();
    } catch (err) {
      setError(err.message || "Error al editar la foto");
      setPhotoToEdit(null);
    } finally {
      setEditingPhoto(false);
    }
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!newPhoto.photoUrl.trim()) return;
    try {
      setAddingPhoto(true);
      setError("");
      setSuccessMessage("");
      await addBarbershopPhotos(id, [
        {
          photoUrl: newPhoto.photoUrl.trim(),
          photoDescription: newPhoto.photoDescription.trim(),
        },
      ]);
      setSuccessMessage("Foto agregada correctamente.");
      setNewPhoto({ photoUrl: "", photoDescription: "" });
      await fetchPhotos();
    } catch (err) {
      setError(err.message || "Error al agregar la foto");
    } finally {
      setAddingPhoto(false);
    }
  };

  const handleDeletePhotoConfirm = async () => {
    if (!photoToDelete) return;
    try {
      setDeletingPhotoId(photoToDelete);
      await deleteBarbershopPhoto(id, photoToDelete);
      setSuccessMessage("Foto eliminada correctamente.");
      setPhotoToDelete(null);
      await fetchPhotos();
    } catch (err) {
      setError(err.message || "Error al eliminar la foto");
      setPhotoToDelete(null);
    } finally {
      setDeletingPhotoId(null);
    }
  };

  if (loading)
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

  if (!barbershop)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400 shadow-sm">
          No se encontró la barbería.
        </div>
      </div>
    );

  const isActive = barbershop.isActive ?? false;

  return (
    <>
      {photoToDelete && (
        <DeletePhotoModal
          onConfirm={handleDeletePhotoConfirm}
          onCancel={() => setPhotoToDelete(null)}
          deleting={deletingPhotoId !== null}
        />
      )}
      {photoToEdit && (
        <EditPhotoModal
          photo={photoToEdit}
          onConfirm={handleEditPhotoConfirm}
          onCancel={() => setPhotoToEdit(null)}
          saving={editingPhoto}
        />
      )}

      <div className="bg-slate-50">
        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden border-b border-slate-100"
          style={{
            background:
              "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #eff6ff 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.25]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-end pr-12 opacity-[0.04] pointer-events-none select-none">
            <span
              className="material-icons-round text-slate-900"
              style={{ fontSize: 260 }}
            >
              storefront
            </span>
          </div>

          <div className="relative max-w-6xl mx-auto px-6 py-10">
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
                  <span className="material-icons-round text-[16px]">
                    people
                  </span>
                  Empleados
                </button>
              </div>
            </div>

            <div className="flex items-end gap-4 flex-wrap">
              <div>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none mb-3">
                  {barbershop.name}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ${isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-rose-50 text-rose-700 ring-rose-200"}`}
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
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-5">
              {/* Foto principal */}
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
                  <p className={labelCls}>Foto principal</p>
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

              {/* Estado */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <p className={labelCls}>Estado de la barbería</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={() => handleStatusChange(true)}
                    disabled={statusLoading}
                    className={`py-2.5 rounded-xl text-sm font-bold transition border ${isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"}`}
                  >
                    ✓ Activa
                  </button>
                  <button
                    onClick={() => handleStatusChange(false)}
                    disabled={statusLoading}
                    className={`py-2.5 rounded-xl text-sm font-bold transition border ${!isActive ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"}`}
                  >
                    ✕ Inactiva
                  </button>
                </div>
                <p className="text-xs text-slate-400 text-center">
                  {isActive
                    ? "La barbería está visible para los clientes."
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
                <form
                  onSubmit={handleSubmit}
                  className="p-6 flex flex-col gap-5"
                >
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

          {/* ── GALERÍA DE FOTOS ──────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Galería de fotos
                </p>
                <p className="text-sm text-slate-500">
                  Fotos de los servicios y el local que verán los clientes.
                </p>
              </div>
              <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full">
                {photos.length}
              </span>
            </div>

            <div className="p-6 space-y-6">
              {/* Formulario agregar foto */}
              <form
                onSubmit={handleAddPhoto}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-100"
              >
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Agregar foto
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    value={newPhoto.photoUrl}
                    onChange={(e) =>
                      setNewPhoto((p) => ({ ...p, photoUrl: e.target.value }))
                    }
                    placeholder="URL de la foto (https://...)"
                    required
                    className={`${inputCls} flex-1`}
                  />
                  <input
                    type="text"
                    value={newPhoto.photoDescription}
                    onChange={(e) =>
                      setNewPhoto((p) => ({
                        ...p,
                        photoDescription: e.target.value,
                      }))
                    }
                    placeholder="Descripción"
                    required
                    className={`${inputCls} flex-1`}
                  />
                  <button
                    type="submit"
                    disabled={
                      addingPhoto ||
                      !newPhoto.photoUrl.trim() ||
                      !newPhoto.photoDescription.trim()
                    }
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition disabled:opacity-50 shrink-0"
                  >
                    <span className="material-icons-round text-[16px]">
                      add_photo_alternate
                    </span>
                    {addingPhoto ? "Agregando..." : "Agregar"}
                  </button>
                </div>
                {/* Preview */}
                {newPhoto.photoUrl && (
                  <div className="mt-3">
                    <img
                      src={newPhoto.photoUrl}
                      alt="preview"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                      className="h-24 w-auto rounded-xl object-cover border border-slate-200"
                    />
                  </div>
                )}
              </form>

              {/* Grid de fotos */}
              {photosLoading ? (
                <div className="flex items-center gap-3 text-slate-400 py-4">
                  <span className="material-icons-round animate-spin">
                    autorenew
                  </span>
                  <p className="text-sm">Cargando fotos...</p>
                </div>
              ) : photos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                  <span className="material-icons-round text-4xl mb-2 opacity-30">
                    photo_library
                  </span>
                  <p className="text-sm font-medium">
                    No hay fotos en la galería todavía.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img
                        src={photo.photoUrl}
                        alt={photo.photoDescription || "Foto"}
                        onError={(e) => {
                          e.target.src = fallbackImage;
                        }}
                        className="w-full h-36 object-cover"
                      />
                      {/* Overlay con descripción y botón eliminar */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        {photo.photoDescription && (
                          <p className="text-white text-xs font-medium leading-tight mb-2 line-clamp-2">
                            {photo.photoDescription}
                          </p>
                        )}
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setPhotoToEdit(photo)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl transition-colors backdrop-blur-sm"
                          >
                            <span className="material-icons-round text-[13px]">
                              edit
                            </span>
                            Editar
                          </button>
                          <button
                            onClick={() => setPhotoToDelete(photo.id)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors"
                          >
                            <span className="material-icons-round text-[13px]">
                              delete
                            </span>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminBarbershop;
