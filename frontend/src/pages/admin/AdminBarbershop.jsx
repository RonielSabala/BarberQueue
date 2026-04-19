import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBarbershopById,
  updateBarbershop,
  updateBarbershopStatus,
  updateBarbershopPhoto,
} from "../../services/barbershopService";
import "../../styles/admin/AdminBarbershop.css";

// Mapeo de errores del backend a español legible
function mapBarbershopError(message) {
  const msg = message?.toLowerCase() || "";
  if (
    msg.includes("email") &&
    (msg.includes("already") ||
      msg.includes("exists") ||
      msg.includes("duplicate"))
  ) {
    return "El correo electrónico ya está registrado en otra barbería.";
  }
  if (
    msg.includes("phone") &&
    (msg.includes("already") ||
      msg.includes("exists") ||
      msg.includes("duplicate"))
  ) {
    return "El teléfono ya está registrado en otra barbería.";
  }
  if (
    msg.includes("name") &&
    (msg.includes("already") || msg.includes("exists"))
  ) {
    return "Ya existe una barbería con ese nombre.";
  }
  if (msg.includes("capacity")) {
    return "La capacidad debe ser un número válido mayor a 0.";
  }
  if (msg.includes("time") || msg.includes("opens") || msg.includes("closes")) {
    return "El formato de hora no es válido.";
  }
  return message || "Error al actualizar la barbería.";
}

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

  // Guardamos los datos originales para comparar al guardar
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
      console.error("Error al cargar barbería:", err);
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

      // Detectar solo los campos que cambiaron
      const changedFields = {};
      Object.keys(formData).forEach((key) => {
        const current = String(formData[key] ?? "").trim();
        const original = String(originalData?.[key] ?? "").trim();
        if (current !== original) {
          changedFields[key] = formData[key];
        }
      });

      // Si no cambió nada, no llamamos a la API
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
      console.error("Error al actualizar barbería:", err);
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
      setSuccessMessage(
        response.message || "Foto principal actualizada correctamente.",
      );
      await fetchBarbershop();
    } catch (err) {
      console.error("Error al actualizar foto:", err);
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
      setSuccessMessage(
        response.message || "Estado de la barbería actualizado.",
      );
      await fetchBarbershop();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      setError(err.message || "Error al cambiar el estado");
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-barbershop-page">
        <p>Cargando barbería...</p>
      </div>
    );
  }

  if (!barbershop) {
    return (
      <div className="admin-barbershop-page">
        <p>No se encontró la barbería.</p>
      </div>
    );
  }

  return (
    <div className="admin-barbershop-page">
      <div className="admin-barbershop-topbar">
        <button
          onClick={() => navigate("/admin/home")}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 dark:border-slate-700 w-fit"
        >
          <span className="material-icons-round text-xl">
            arrow_back_ios_new
          </span>
          Volver
        </button>

        <div className="admin-barbershop-actions">
          <button
            onClick={() => navigate(`/admin/barbershop/${id}/dashboard`)}
            className="admin-barbershop-dashboard-btn"
          >
            Ver dashboard
          </button>

          <button
            onClick={() => navigate(`/barbershops/${id}/queue`)}
            className="admin-barbershop-queue-btn"
          >
            Ver cola en vivo
          </button>

          <button
            onClick={() => navigate(`/admin/barbershop/${id}/employees`)}
            className="admin-barbershop-employees-btn"
          >
            Gestionar empleados
          </button>
        </div>
      </div>

      {error && <div className="admin-barbershop-alert error">{error}</div>}

      {successMessage && (
        <div className="admin-barbershop-alert success">{successMessage}</div>
      )}

      <div className="admin-barbershop-layout">
        <div className="admin-barbershop-left">
          <div className="admin-barbershop-image-card">
            <img
              src={
                barbershop.image ||
                "https://via.placeholder.com/500x400?text=Barberia"
              }
              alt={barbershop.name}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/500x400?text=Barberia";
              }}
              className="admin-barbershop-image"
            />
          </div>

          <div className="admin-barbershop-photo-card">
            <h3>Foto principal</h3>
            <form onSubmit={handlePhotoSubmit} className="admin-photo-form">
              <label>URL de la imagen</label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://..."
              />
              <button type="submit" disabled={savingPhoto} className="save-btn">
                {savingPhoto ? "Actualizando..." : "Actualizar foto"}
              </button>
            </form>
          </div>

          <div className="admin-barbershop-status-card">
            <h3>Activa/Inactiva</h3>

            <div className="admin-barbershop-status-buttons">
              <button
                onClick={() => handleStatusChange(true)}
                disabled={statusLoading}
                className={`status-btn ${barbershop.isActive ? "status-btn-open active" : ""}`}
              >
                Activa
              </button>

              <button
                onClick={() => handleStatusChange(false)}
                disabled={statusLoading}
                className={`status-btn ${!barbershop.isActive ? "status-btn-closed active" : ""}`}
              >
                Inactiva
              </button>
            </div>

            <div
              className={`admin-barbershop-status-pill ${barbershop.isActive ? "open" : "closed"}`}
            >
              <span className="dot">●</span>
              {barbershop.isActive ? "Activa" : "Inactiva"}
            </div>
          </div>
        </div>

        <div className="admin-barbershop-right">
          <h1>Administrar Barbería</h1>
          <p>Edita la información visible para los clientes.</p>

          <form onSubmit={handleSubmit} className="admin-barbershop-form">
            <div className="form-group">
              <label>Nombre de la barbería</label>
              <input
                type="text"
                name="barbershopName"
                value={formData.barbershopName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                name="barbershopAddress"
                value={formData.barbershopAddress}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Correo</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Hora de apertura</label>
                <input
                  type="time"
                  name="opensAt"
                  value={formData.opensAt}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Hora de cierre</label>
                <input
                  type="time"
                  name="closesAt"
                  value={formData.closesAt}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group form-capacity">
              <label>Capacidad</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="form-submit">
              <button type="submit" disabled={saving} className="save-btn">
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminBarbershop;
