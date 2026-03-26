import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import "../../styles/admin/AdminBarbershop.css";

function AdminBarbershop() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "Barbería 1",
    branch: "Sucursal de Santiago",
    address: "Av. Los Próceres",
    email: "barberia1@gmail.com",
    phone: "+1 (899) 111-3223",
    opensAt: "08:00",
    closesAt: "17:00",
    status: "open",
    capacity: 10,
    photo:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Guardar cambios barbería:", id, formData);
    alert("Cambios guardados correctamente (modo estático).");
  };

  return (
    <div className="admin-barbershop-page">
      <div className="admin-barbershop-header">
        <button className="back-btn" onClick={() => navigate("/admin/home")}>
          ← Volver
        </button>

        <div className="header-actions">
          <button
            className="queue-btn"
            onClick={() => navigate(`/barbershops/${id}/queue`)}
          >
            Ver cola en vivo
          </button>

          <button
            className="admin-employees-btn"
            onClick={() => navigate(`/admin/barbershop/${id}/employees`)}
          >
            Gestionar empleados
          </button>
        </div>
      </div>

      <div className="admin-barbershop-grid">
        <div className="admin-left-panel">
          <div className="photo-card">
            <img
              src={formData.photo}
              alt={formData.name}
              className="barbershop-main-photo"
            />
          </div>

          <div className="status-card">
            <p className="status-label">Estado actual</p>

            <div className="status-toggle-group">
              <button
                type="button"
                className={`toggle-btn ${formData.status === "open" ? "active-open" : ""}`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, status: "open" }))
                }
              >
                Abierta
              </button>

              <button
                type="button"
                className={`toggle-btn ${formData.status === "closed" ? "active-closed" : ""}`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, status: "closed" }))
                }
              >
                Cerrada
              </button>
            </div>

            <span
              className={`status-badge ${
                formData.status === "open" ? "open" : "closed"
              }`}
            >
              {formData.status === "open" ? "● Abierta" : "● Cerrada"}
            </span>
          </div>
        </div>

        <div className="admin-right-panel">
          <div className="form-card">
            <h1>Administrar Barbería</h1>
            <p className="admin-barbershop-subtitle">
              Edita la información visible para los clientes.
            </p>

            <div className="admin-form-grid">
              <div className="form-group full">
                <label>Nombre de la barbería</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full">
                <label>Sucursal</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full">
                <label>Dirección</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

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

              <div className="form-group full">
                <label>Capacidad máxima</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                />
              </div>

              <div className="form-group full">
                <label>URL de foto principal</label>
                <input
                  type="text"
                  name="photo"
                  value={formData.photo}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="admin-form-actions">
              <button
                className="cancel-btn"
                type="button"
                onClick={() => navigate("/admin/home")}
              >
                Cancelar
              </button>

              <button className="save-btn" type="button" onClick={handleSave}>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBarbershop;
