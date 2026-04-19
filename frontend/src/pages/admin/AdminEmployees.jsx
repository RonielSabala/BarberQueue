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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <button
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors mb-2"
            onClick={() => navigate(`/admin/barbershop/${id}`)}
          >
            <span className="material-icons-round text-sm">arrow_back</span>
            Volver a la barbería
          </button>
          <h1 className="text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
            Empleados
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Gestiona el personal de la barbería.
          </p>
        </div>

        <button
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
          onClick={() => navigate(`/admin/barbershop/${id}/employees/new`)}
        >
          <span className="material-icons-round">person_add</span>
          Añadir empleado
        </button>
      </div>

      {error && <div className="admin-employees-alert error">{error}</div>}
      {successMessage && (
        <div className="admin-employees-alert success">{successMessage}</div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm mb-8 gap-4 border border-slate-100 dark:border-slate-700">
        <div className="relative w-full sm:max-w-md">
          <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar empleado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-slate-700 dark:text-slate-200"
          />
        </div>

        <div className="w-full sm:w-auto relative">
          <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            filter_alt
          </span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-48 h-12 pl-11 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">Todos</option>
            <option value="barber">Barbero</option>
            <option value="assistant">Asistente</option>
          </select>
        </div>
      </div>

      <div className="admin-employees-table-card">
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
                      <div className="flex items-center gap-2">
                        <button
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors text-sm"
                          onClick={() =>
                            navigate(
                              `/admin/barbershop/${id}/employees/${employee.id}/edit`,
                            )
                          }
                        >
                          Editar
                        </button>

                        <button
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors text-sm flex items-center justify-center disabled:opacity-50"
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
