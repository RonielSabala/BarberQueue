import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/admin/AdminEmployees.css";

function AdminEmployees() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [employees] = useState([
    {
      id: 1,
      name: "Juan Valdez",
      role: "Barbero",
      email: "juan@barberqueue.com",
      phone: "809-555-1111",
    },
    {
      id: 2,
      name: "María Montez",
      role: "Asistente",
      email: "maria@barberqueue.com",
      phone: "809-555-2222",
    },
    {
      id: 3,
      name: "Ramón Tavarez",
      role: "Admin",
      email: "ramon@barberqueue.com",
      phone: "809-555-3333",
    },
    {
      id: 4,
      name: "Luis Gómez",
      role: "Barbero",
      email: "luis@barberqueue.com",
      phone: "809-555-4444",
    },
  ]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(search.toLowerCase()) ||
        employee.role.toLowerCase().includes(search.toLowerCase()) ||
        employee.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "all" ||
        employee.role.toLowerCase() === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [employees, search, roleFilter]);

  const handleDelete = (employeeName) => {
    alert(`Aquí luego eliminaremos a ${employeeName} desde backend.`);
  };

  return (
    <div className="admin-employees-page">
      <div className="admin-employees-topbar">
        <button
          className="admin-employees-back"
          onClick={() => navigate(`/admin/barbershop/${id}`)}
        >
          ← Volver
        </button>

        <button
          className="admin-employees-add-btn"
          onClick={() => navigate(`/admin/barbershop/${id}/employees/new`)}
        >
          Añadir empleado
        </button>
      </div>

      <div className="admin-employees-header">
        <h1>Empleados BarberQueue</h1>
        <p>Gestiona el personal de la barbería.</p>
      </div>

      <div className="admin-employees-filters">
        <input
          type="text"
          placeholder="Buscar empleado"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="barbero">Barbero</option>
          <option value="asistente">Asistente</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="admin-employees-table-card">
        <div className="admin-employees-section-label">Empleados</div>

        <div className="admin-employees-table-wrapper">
          <table className="admin-employees-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.name}</td>
                    <td>{employee.role}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>
                      <div className="admin-employees-actions">
                        <button
                          className="edit-btn"
                          onClick={() =>
                            navigate(
                              `/admin/barbershop/${id}/employees/${employee.id}/edit`,
                            )
                          }
                        >
                          Editar
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(employee.name)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-row">
                    No se encontraron empleados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminEmployees;
