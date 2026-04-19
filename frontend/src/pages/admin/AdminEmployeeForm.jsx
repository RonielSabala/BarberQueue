import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBarbershopEmployee } from "../../services/barbershopService";
import {
  getEmployeeById,
  updateEmployeeAssignment,
} from "../../services/employeeService";
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

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError("");

        const employee = await getEmployeeById(employeeId);

        const currentAssignment = employee.assignments?.find(
          (assignment) => Number(assignment.barbershopId) === Number(id),
        );

        if (!currentAssignment) {
          setError(
            "No se encontró la asignación de este empleado en esta barbería.",
          );
          return;
        }

        setFormData({
          username: employee.username || "",
          email: employee.email || "",
          phone: employee.phone || "",
          password: "",
          role: currentAssignment.role || employee.role || "",
          startTime: currentAssignment.startTime || "",
          endTime: currentAssignment.endTime || "",
          workingDays: currentAssignment.workingDays || [],
        });
      } catch (err) {
        console.error("Error al cargar empleado:", err);
        setError(err.message || "Error al cargar el empleado");
      } finally {
        setLoading(false);
      }
    };

    if (isEditMode && employeeId && id) {
      fetchEmployee();
    }
  }, [isEditMode, employeeId, id]);

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

      if (isEditMode) {
        const response = await updateEmployeeAssignment(employeeId, id, {
          role: formData.role,
          startTime: formData.startTime,
          endTime: formData.endTime,
          workingDays: formData.workingDays,
        });

        setSuccessMessage(
          response.message || "Empleado actualizado correctamente.",
        );
      } else {
        await createBarbershopEmployee(id, formData);
        setSuccessMessage("Empleado creado correctamente.");
      }

      setTimeout(() => {
        navigate(`/admin/barbershop/${id}/employees`);
      }, 1200);
    } catch (err) {
      console.error("Error al guardar empleado:", err);
      setError(err.message || "Error al guardar el empleado");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-employee-form-page">
        <p>Cargando empleado...</p>
      </div>
    );
  }

  return (
    <div className="admin-employee-form-page">
      <div className="admin-employee-form-topbar">
        <button
          onClick={() => navigate(`/admin/barbershop/${id}/employees`)}
          className="admin-employee-form-back-btn flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 dark:border-slate-700 w-fit"
        >
          <span className="material-icons-round text-xl">
            arrow_back_ios_new
          </span>
          Volver
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
            ? "Actualiza la asignación del empleado en esta barbería."
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
                disabled={isEditMode}
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
                disabled={isEditMode}
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
                disabled={isEditMode}
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  isEditMode
                    ? "No editable desde esta pantalla"
                    : "Mínimo 8 caracteres"
                }
                required={!isEditMode}
                disabled={isEditMode}
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
