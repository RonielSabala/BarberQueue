import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBarbershopEmployees,
  getBarbershopById,
} from "../../services/barbershopService";
import { deleteEmployeePermanently } from "../../services/employeeService";
import { Avatar } from "../../components/UserProfileCard";
import { useToast } from "../../context/ToastContext";
import { mapApiError } from "../../utils/mapApiError";

// ── Modal de confirmación ──────────────────────────────────────────────────
function DeleteConfirmModal({ employee, onConfirm, onCancel, deleting }) {
  if (!employee) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(15,23,42,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-8 pb-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
            <span className="material-icons-round text-red-500 text-3xl">
              person_remove
            </span>
          </div>
        </div>
        <div className="px-6 pb-6 text-center">
          <h2 className="text-lg font-black text-slate-800 mb-2">
            ¿Eliminar empleado?
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Estás a punto de eliminar a{" "}
            <span className="font-bold text-slate-700">
              {employee.username}
            </span>{" "}
            del sistema. Esta acción eliminará también todas sus asignaciones y
            no se puede deshacer.
          </p>
        </div>
        <div className="flex flex-col gap-2 px-6 pb-6">
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-sm"
          >
            {deleting ? "Eliminando..." : "Sí, eliminar empleado"}
          </button>
          <button
            onClick={onCancel}
            disabled={deleting}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ───────────────────────────────────────────────────────
function AdminEmployees() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [employees, setEmployees] = useState([]);
  const [barbershopName, setBarbershopName] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getBarbershopEmployees(id);
      setEmployees(data);
    } catch (err) {
      toast.error(mapApiError(err.message, "Error al cargar los empleados"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchEmployees();
    getBarbershopById(id)
      .then((shop) => setBarbershopName(shop.name || shop.barbershopName || ""))
      .catch(() => {});
  }, [id]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = search.toLowerCase();
      const matchesSearch =
        emp.username?.toLowerCase().includes(q) ||
        emp.email?.toLowerCase().includes(q) ||
        emp.phone?.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" ? true : emp.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [employees, search, roleFilter]);

  const formatRole = (role) => {
    if (role === "barber") return "Barbero";
    if (role === "assistant") return "Asistente";
    return role;
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;
    try {
      setDeletingId(employeeToDelete.id);
      await deleteEmployeePermanently(employeeToDelete.id);
      toast.success("Empleado eliminado correctamente.");
      setEmployeeToDelete(null);
      await fetchEmployees();
    } catch (err) {
      toast.error(mapApiError(err.message, "Error al eliminar el empleado"));
      setEmployeeToDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <DeleteConfirmModal
        employee={employeeToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setEmployeeToDelete(null)}
        deleting={deletingId !== null}
      />

      <div className="bg-slate-50">
        {/* ── HERO ── */}
        <div
          className="relative overflow-hidden border-b border-slate-100"
          style={{
            background:
              "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #eff6ff 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.25]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-end pr-12 opacity-[0.04] pointer-events-none select-none">
            <span
              className="material-icons-round text-slate-900"
              style={{ fontSize: 240 }}
            >
              people
            </span>
          </div>

          <div className="relative max-w-6xl mx-auto px-6 py-10">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <button
                  onClick={() => navigate(`/admin/barbershop/${id}`)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition-colors text-sm font-medium mb-3"
                >
                  <span className="material-icons-round text-[16px]">
                    arrow_back
                  </span>
                  Volver a la barbería
                </button>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none mb-2">
                  Empleados
                </h1>
                {barbershopName && (
                  <p className="text-slate-400 text-sm flex items-center gap-1">
                    <span className="material-icons-round text-[14px]">
                      storefront
                    </span>
                    {barbershopName}
                  </p>
                )}
              </div>
              <button
                onClick={() =>
                  navigate(`/admin/barbershop/${id}/employees/new`)
                }
                className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors shadow-sm text-sm"
              >
                <span className="material-icons-round text-[18px]">
                  person_add
                </span>
                Añadir empleado
              </button>
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm mb-6 gap-4 border border-slate-100">
            <div className="relative w-full sm:max-w-md">
              <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar empleado..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm text-slate-700"
              />
            </div>
            <div className="w-full sm:w-auto relative">
              <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                filter_alt
              </span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full sm:w-48 h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-700 cursor-pointer"
              >
                <option value="all">Todos</option>
                <option value="barber">Barbero</option>
                <option value="assistant">Asistente</option>
              </select>
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
                <span className="material-icons-round animate-pulse text-3xl">
                  badge
                </span>
                <p className="text-sm font-medium">Cargando empleados...</p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <span className="material-icons-round text-5xl mb-3 opacity-30">
                  person_search
                </span>
                <p className="font-medium text-sm">
                  No se encontraron empleados para esta barbería.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-5 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="text-left px-5 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="text-left px-5 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="text-left px-5 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider">
                        Teléfono
                      </th>
                      <th className="text-left px-5 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider">
                        Horario
                      </th>
                      <th className="text-right px-5 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp, i) => (
                      <tr
                        key={emp.id}
                        className={`hover:bg-slate-50 transition-colors ${i < filteredEmployees.length - 1 ? "border-b border-slate-50" : ""}`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              photoUrl={emp.photoUrl}
                              username={emp.username}
                              size="sm"
                            />
                            <span className="font-bold text-slate-800">
                              {emp.username}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${emp.role === "barber" ? "bg-blue-50 text-blue-700" : "bg-indigo-50 text-indigo-700"}`}
                          >
                            {formatRole(emp.role)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {emp.email}
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {emp.phone}
                        </td>
                        <td className="px-5 py-4 text-slate-500 font-mono text-xs">
                          {emp.startTime?.slice(0, 5)} –{" "}
                          {emp.endTime?.slice(0, 5)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/barbershop/${id}/employees/${emp.id}/edit`,
                                )
                              }
                              className="flex items-center justify-center w-8 h-8 bg-amber-300 hover:bg-amber-400 text-white rounded-lg transition-colors"
                            >
                              <span className="material-icons-round text-[14px]">
                                edit
                              </span>
                            </button>
                            <button
                              onClick={() => setEmployeeToDelete(emp)}
                              disabled={deletingId === emp.id}
                              className="flex items-center justify-center w-8 h-8 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <span className="material-icons-round text-[14px]">
                                delete
                              </span>
                              {deletingId === emp.id ? "Eliminando..." : ""}
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
      </div>
    </>
  );
}

export default AdminEmployees;
