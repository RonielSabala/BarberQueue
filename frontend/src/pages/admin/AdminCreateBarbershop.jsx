import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createBarbershop,
  addBarbershopPhotos,
} from "../../services/barbershopService";

function AdminCreateBarbershop() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    adminId: 1,
    barbershopName: "",
    email: "",
    phone: "",
    barbershopAddress: "",
    photoUrl: "",
    opensAt: "",
    closesAt: "",
    capacity: 1,
  });

  // Fotos de galería a agregar al crear
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [newGalleryPhoto, setNewGalleryPhoto] = useState({
    photoUrl: "",
    photoDescription: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddGalleryPhoto = () => {
    if (!newGalleryPhoto.photoUrl.trim()) return;
    setGalleryPhotos((prev) => [
      ...prev,
      { ...newGalleryPhoto, tempId: Date.now() },
    ]);
    setNewGalleryPhoto({ photoUrl: "", photoDescription: "" });
  };

  const handleRemoveGalleryPhoto = (tempId) => {
    setGalleryPhotos((prev) => prev.filter((p) => p.tempId !== tempId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const created = await createBarbershop(formData);

      // Si hay fotos de galería, las agregamos después de crear
      if (galleryPhotos.length > 0) {
        await addBarbershopPhotos(
          created.id,
          galleryPhotos.map(({ photoUrl, photoDescription }) => ({
            photoUrl,
            photoDescription,
          })),
        );
      }

      setSuccessMessage("Barbería creada correctamente.");
      setTimeout(() => {
        navigate(`/admin/barbershop/${created.id}`);
      }, 1200);
    } catch (err) {
      setError(err.message || "Error al crear la barbería");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700";
  const labelCls = "block text-sm font-bold text-slate-700 mb-2";

  return (
    <div className="py-10 px-4 sm:px-6 flex flex-col items-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-3xl mb-6">
        <button
          onClick={() => navigate("/admin/home")}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-100 text-sm"
        >
          <span className="material-icons-round text-xl">
            arrow_back_ios_new
          </span>
          Volver
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 mb-2">
            Crear Barbería
          </h1>
          <p className="text-slate-500 font-medium">
            Completa la información para registrar una nueva sucursal en el
            sistema.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center gap-2">
            <span className="material-icons-round">error</span>
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 border border-green-100 text-green-600 p-4 rounded-xl text-sm font-bold flex items-center gap-2">
            <span className="material-icons-round">check_circle</span>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Información básica */}
          <div>
            <label className={labelCls}>Nombre de la barbería</label>
            <input
              type="text"
              name="barbershopName"
              value={formData.barbershopName}
              onChange={handleChange}
              className={inputCls}
              required
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
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Correo</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputCls}
                required
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
                required
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>URL de foto principal</label>
            <input
              type="url"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="https://..."
              className={inputCls}
              required
            />
            {formData.photoUrl && (
              <img
                src={formData.photoUrl}
                alt="preview"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
                className="mt-2 h-24 w-auto rounded-xl object-cover border border-slate-200"
              />
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className={labelCls}>Hora de apertura</label>
              <input
                type="time"
                name="opensAt"
                value={formData.opensAt}
                onChange={handleChange}
                className={inputCls}
                required
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
                required
              />
            </div>
            <div>
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
          </div>

          {/* ── Galería de fotos ────────────────────────────────────────── */}
          <div className="pt-4 border-t border-slate-100">
            <h2 className="text-sm font-bold text-slate-700 mb-1">
              Fotos de servicios (galería)
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Agrega fotos de cortes, instalaciones o servicios que verán los
              clientes.
            </p>

            {/* Agregar foto */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3 mb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  value={newGalleryPhoto.photoUrl}
                  onChange={(e) =>
                    setNewGalleryPhoto((p) => ({
                      ...p,
                      photoUrl: e.target.value,
                    }))
                  }
                  placeholder="URL de la foto (https://...)"
                  className={`${inputCls} flex-1`}
                />
                <input
                  type="text"
                  value={newGalleryPhoto.photoDescription}
                  onChange={(e) =>
                    setNewGalleryPhoto((p) => ({
                      ...p,
                      photoDescription: e.target.value,
                    }))
                  }
                  placeholder="Descripción"
                  required
                  className={`${inputCls} flex-1`}
                />
                <button
                  type="button"
                  onClick={handleAddGalleryPhoto}
                  disabled={
                    !newGalleryPhoto.photoUrl.trim() ||
                    !newGalleryPhoto.photoDescription.trim()
                  }
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition disabled:opacity-40 shrink-0"
                >
                  <span className="material-icons-round text-[16px]">
                    add_photo_alternate
                  </span>
                  Agregar
                </button>
              </div>
              {newGalleryPhoto.photoUrl && (
                <img
                  src={newGalleryPhoto.photoUrl}
                  alt="preview"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                  className="h-20 w-auto rounded-xl object-cover border border-slate-200"
                />
              )}
            </div>

            {/* Lista de fotos agregadas */}
            {galleryPhotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryPhotos.map((photo) => (
                  <div
                    key={photo.tempId}
                    className="group relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
                  >
                    <img
                      src={photo.photoUrl}
                      alt={photo.photoDescription || "Foto"}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=Foto";
                      }}
                      className="w-full h-28 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                      {photo.photoDescription && (
                        <p className="text-white text-xs font-medium mb-1 line-clamp-1">
                          {photo.photoDescription}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryPhoto(photo.tempId)}
                        className="w-full py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="material-icons-round text-[13px]">
                          delete
                        </span>
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {galleryPhotos.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                <span className="material-icons-round text-3xl mb-1 opacity-30">
                  photo_library
                </span>
                <p className="text-xs">Aún no has agregado fotos de galería.</p>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex justify-center items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="material-icons-round animate-spin">
                    refresh
                  </span>
                  Creando...
                </>
              ) : (
                <>
                  <span className="material-icons-round">storefront</span>Crear
                  barbería
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminCreateBarbershop;
