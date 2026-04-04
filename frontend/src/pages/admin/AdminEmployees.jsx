import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBarbershopEmployees } from "../../services/barbershopService";
import { deleteEmployeePermanently } from "../../services/employeeService";
import "../../styles/admin/AdminEmployees.css";

function AdminEmployees() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBarbershopEmployees(id);
      setEmployees(data);
    } catch (err) {
      console.error("Error al obtener empleados:", err);
      setError(err.message || "Error al cargar los empleados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEmployees();
    }
  }, [id]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.username?.toLowerCase().includes(search.toLowerCase()) ||
        employee.email?.toLowerCase().includes(search.toLowerCase()) ||
        employee.phone?.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "all" ? true : employee.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [employees, search, roleFilter]);

  const formatRole = (role) => {
    if (role === "barber") return "Barbero";
    if (role === "assistant") return "Asistente";
    return role;
  };

  const handleDelete = async (employeeId) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este empleado del sistema? Esta acción eliminará también todas sus asignaciones.",
    );

    if (!confirmed) return;

    try {
      setDeletingId(employeeId);
      setError("");
      setSuccessMessage("");

      await deleteEmployeePermanently(employeeId);

      setSuccessMessage("Empleado eliminado correctamente.");
      await fetchEmployees();
    } catch (err) {
      console.error("Error al eliminar empleado:", err);
      setError(err.message || "Error al eliminar el empleado");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-employees-page">
      <div className="admin-employees-topbar">
        <button
          className="admin-employees-back-btn"
          onClick={() => navigate(`/admin/barbershop/${id}`)}
        >
          ← Volver
        </button>

        <button
          className="admin-employees-create-btn"
          onClick={() => navigate(`/admin/barbershop/${id}/employees/new`)}
        >
          Añadir empleado
        </button>
      </div>

      <div className="admin-employees-header">
        <h1>Empleados BarberQueue</h1>
        <p>Gestiona el personal de la barbería.</p>
      </div>

      {error && <div className="admin-employees-alert error">{error}</div>}
      {successMessage && (
        <div className="admin-employees-alert success">{successMessage}</div>
      )}

      <div className="admin-employees-filters">
        <input
          type="text"
          placeholder="Buscar empleado"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-employees-search"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="admin-employees-role-filter"
        >
          <option value="all">Todos</option>
          <option value="barber">Barbero</option>
          <option value="assistant">Asistente</option>
        </select>
      </div>

      <div className="admin-employees-table-card">
        <div className="admin-employees-table-badge">Empleados</div>

        {loading ? (
          <p className="admin-employees-loading">Cargando empleados...</p>
        ) : filteredEmployees.length === 0 ? (
          <div className="admin-employees-empty">
            No se encontraron empleados para esta barbería.
          </div>
        ) : (
          <div className="admin-employees-table-wrapper">
            <table className="admin-employees-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Horario</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.username}</td>
                    <td>{formatRole(employee.role)}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>
                      {employee.startTime} - {employee.endTime}
                    </td>
                    <td>
                      <div className="employee-table-actions">
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
                          onClick={() => handleDelete(employee.id)}
                          disabled={deletingId === employee.id}
                        >
                          {deletingId === employee.id
                            ? "Eliminando..."
                            : "Eliminar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminEmployees;
