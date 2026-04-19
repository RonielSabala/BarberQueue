import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBarbershop } from "../../services/barbershopService";

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

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const created = await createBarbershop(formData);

      setSuccessMessage("Barbería creada correctamente.");

      setTimeout(() => {
        navigate(`/admin/barbershop/${created.id}`);
      }, 1200);
    } catch (err) {
      console.error("Error al crear barbería:", err);
      setError(err.message || "Error al crear la barbería");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 flex flex-col items-center min-h-[calc(100vh-4rem)] relative">
      <div className="w-full max-w-3xl mb-6">
        <button
          onClick={() => navigate("/admin/home")}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 dark:border-slate-700 w-fit"
        >
          <span className="material-icons-round text-xl">
            arrow_back_ios_new
          </span>
          Volver
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white mb-2">
            Crear Barbería
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Completa la información para registrar una nueva sucursal en el
            sistema.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 flex items-center gap-2">
            <span className="material-icons-round">error</span>
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-100 text-green-600 p-4 rounded-xl text-sm font-bold mb-6 flex items-center gap-2">
            <span className="material-icons-round">check_circle</span>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Nombre de la barbería
            </label>
            <input
              type="text"
              name="barbershopName"
              value={formData.barbershopName}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 dark:text-slate-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Dirección
            </label>
            <input
              type="text"
              name="barbershopAddress"
              value={formData.barbershopAddress}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 dark:text-slate-200"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Correo
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 dark:text-slate-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Teléfono
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 dark:text-slate-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              URL de foto principal
            </label>
            <input
              type="url"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 dark:text-slate-200"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Hora de apertura
              </label>
              <input
                type="time"
                name="opensAt"
                value={formData.opensAt}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 dark:text-slate-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Hora de cierre
              </label>
              <input
                type="time"
                name="closesAt"
                value={formData.closesAt}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 dark:text-slate-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Capacidad
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 dark:text-slate-200"
              />
            </div>
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
                  <span className="material-icons-round">storefront</span>
                  Crear barbería
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
