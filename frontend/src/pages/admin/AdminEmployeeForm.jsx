import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBarbershopEmployee } from "../../services/barbershopService";
import "../../styles/admin/AdminEmployeeForm.css";

const DAYS = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 7, label: "Domingo" },
];

function AdminEmployeeForm() {
  const { id, employeeId } = useParams();
  const navigate = useNavigate();

  const isEditMode = useMemo(() => Boolean(employeeId), [employeeId]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    startTime: "",
    endTime: "",
    workingDays: [],
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

  const handleDayToggle = (dayValue) => {
    setFormData((prev) => {
      const exists = prev.workingDays.includes(dayValue);

      return {
        ...prev,
        workingDays: exists
          ? prev.workingDays.filter((day) => day !== dayValue)
          : [...prev.workingDays, dayValue].sort((a, b) => a - b),
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditMode) {
      setError("La edición de empleados todavía no está conectada.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      if (!formData.role) {
        setError("Debes seleccionar un rol.");
        return;
      }

      if (formData.workingDays.length === 0) {
        setError("Debes seleccionar al menos un día de trabajo.");
        return;
      }

      await createBarbershopEmployee(id, formData);

      setSuccessMessage("Empleado creado correctamente.");

      setTimeout(() => {
        navigate(`/admin/barbershop/${id}/employees`);
      }, 1200);
    } catch (err) {
      console.error("Error al crear empleado:", err);
      setError(err.message || "Error al crear el empleado");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-employee-form-page">
      <div className="admin-employee-form-topbar">
        <button
          className="admin-employee-form-back-btn"
          onClick={() => navigate(`/admin/barbershop/${id}/employees`)}
        >
          ← Volver
        </button>
      </div>

      {error && <div className="admin-employee-form-alert error">{error}</div>}
      {successMessage && (
        <div className="admin-employee-form-alert success">
          {successMessage}
        </div>
      )}

      <div className="admin-employee-form-card">
        <h1>{isEditMode ? "Editar empleado" : "Agregar empleado"}</h1>
        <p>
          {isEditMode
            ? "Actualiza la información del empleado."
            : "Completa la información del nuevo empleado."}
        </p>

        <form onSubmit={handleSubmit} className="admin-employee-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre completo</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ej: Juan Valdez"
                required
              />
            </div>

            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ej: juan@email.com"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ej: 8091234567"
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                required={!isEditMode}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rol</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un rol</option>
                <option value="barber">Barbero</option>
                <option value="assistant">Asistente</option>
              </select>
            </div>

            <div className="form-group">
              <label>Barbería / sucursal</label>
              <input type="text" value={`Barbería #${id}`} disabled readOnly />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Hora de entrada</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Hora de salida</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Días de trabajo</label>
            <div className="working-days-grid">
              {DAYS.map((day) => (
                <button
                  type="button"
                  key={day.value}
                  className={`day-chip ${
                    formData.workingDays.includes(day.value) ? "selected" : ""
                  }`}
                  onClick={() => handleDayToggle(day.value)}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-submit">
            <button type="submit" disabled={saving} className="save-btn">
              {saving
                ? isEditMode
                  ? "Guardando..."
                  : "Creando..."
                : isEditMode
                  ? "Guardar cambios"
                  : "Agregar empleado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminEmployeeForm;
