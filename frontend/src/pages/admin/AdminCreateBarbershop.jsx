import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBarbershop } from "../../services/barbershopService";
import "../../styles/admin/AdminCreateBarbershop.css";

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
    <div className="admin-create-barbershop-page">
      <div className="admin-create-barbershop-topbar">
        <button
          onClick={() => navigate("/admin/home")}
          className="admin-create-back-btn"
        >
          ← Volver
        </button>
      </div>

      {error && <div className="admin-create-alert error">{error}</div>}

      {successMessage && (
        <div className="admin-create-alert success">{successMessage}</div>
      )}

      <div className="admin-create-card">
        <h1>Crear Barbería</h1>
        <p>Completa la información para registrar una nueva sucursal.</p>

        <form onSubmit={handleSubmit} className="admin-create-form">
          <div className="form-group">
            <label>Nombre de la barbería</label>
            <input
              type="text"
              name="barbershopName"
              value={formData.barbershopName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="barbershopAddress"
              value={formData.barbershopAddress}
              onChange={handleChange}
              required
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
                required
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>URL de foto principal</label>
            <input
              type="text"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="https://..."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Hora de apertura</label>
              <input
                type="time"
                name="opensAt"
                value={formData.opensAt}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Hora de cierre</label>
              <input
                type="time"
                name="closesAt"
                value={formData.closesAt}
                onChange={handleChange}
                required
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
              {saving ? "Creando..." : "Crear barbería"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminCreateBarbershop;
