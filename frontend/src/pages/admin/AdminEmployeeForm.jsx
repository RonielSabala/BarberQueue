import { useState } from "react";
import { createEmployeeWithAssignment } from "../../services/employeeService";
import "../../styles/admin/AdminEmployeeForm.css";

function AdminEmployeesForm() {
  const barbershops = [
    { id: 1, name: "Barbería El Flow" },
    { id: 2, name: "Classic Barber" },
    { id: 3, name: "Urban Cuts" },
  ];

  const roles = [
    { value: "barber", label: "Barbero" },
    { value: "assistant", label: "Asistente" },
    { value: "admin", label: "Administrador" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    barbershopId: "",
    address: "",
    birthDate: "",
    photo: null,
    photoPreview: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      photo: file,
      photoPreview: URL.createObjectURL(file),
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      barbershopId: "",
      address: "",
      birthDate: "",
      photo: null,
      photoPreview: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.role ||
      !formData.barbershopId
    ) {
      alert("Completa los campos obligatorios.");
      return;
    }

    try {
      setLoading(true);

      const result = await createEmployeeWithAssignment(formData);

      console.log("Empleado creado y asignado:", result);

      alert("Empleado agregado correctamente.");
      resetForm();
    } catch (error) {
      console.error("Error al guardar empleado:", error);
      alert("Ocurrió un error al guardar el empleado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-employee-form-wrapper">
      <div className="admin-employee-form-card">
        <h2 className="admin-employee-form-title">Agregar empleado</h2>
        <p className="admin-employee-form-subtitle">
          Completa la información del nuevo empleado
        </p>

        <form className="admin-employee-form" onSubmit={handleSubmit}>
          <div className="admin-employee-form-grid">
            <div className="admin-employee-field">
              <label>Nombre completo</label>
              <input
                type="text"
                name="name"
                placeholder="Ej: Juan Valdez"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="admin-employee-field">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="email"
                placeholder="Ej: juan@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="admin-employee-field">
              <label>Teléfono</label>
              <input
                type="text"
                name="phone"
                placeholder="Ej: 809-000-0000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="admin-employee-field">
              <label>Fecha de nacimiento</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>

            <div className="admin-employee-field">
              <label>Rol</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="">Selecciona un rol</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-employee-field">
              <label>Barbería / sucursal</label>
              <select
                name="barbershopId"
                value={formData.barbershopId}
                onChange={handleChange}
              >
                <option value="">Selecciona una barbería</option>
                {barbershops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-employee-field admin-employee-field-full">
              <label>Dirección</label>
              <input
                type="text"
                name="address"
                placeholder="Ej: Av. Los Próceres, Santiago"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-employee-photo-section">
            <div className="admin-employee-photo-preview">
              {formData.photoPreview ? (
                <img src={formData.photoPreview} alt="Preview empleado" />
              ) : (
                <span>Foto</span>
              )}
            </div>

            <div className="admin-employee-photo-upload">
              <label htmlFor="employee-photo" className="admin-upload-btn">
                Agregar foto
              </label>
              <input
                id="employee-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </div>
          </div>

          <div className="admin-employee-form-actions">
            <button
              type="submit"
              className="admin-save-employee-btn"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar empleado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminEmployeesForm;
