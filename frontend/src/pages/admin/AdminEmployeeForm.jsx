import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createBarbershopEmployee,
  getBarbershopById,
} from "../../services/barbershopService";
import {
  getAllEmployees,
  assignExistingEmployee,
  getEmployeeById,
  updateEmployeeAssignment,
} from "../../services/employeeService";
import { useToast } from "../../context/ToastContext";
import { mapApiError } from "../../utils/mapApiError";

const DAYS = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 7, label: "Domingo" },
];

const ROLE_LABELS = { barber: "Barbero", assistant: "Asistente" };

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition placeholder:text-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed";
const labelCls =
  "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2";

function AdminEmployeeForm() {
  const { id, employeeId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEditMode = useMemo(() => Boolean(employeeId), [employeeId]);

  const [mode, setMode] = useState("new");
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
  const [allEmployees, setAllEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [existingSchedule, setExistingSchedule] = useState({
    startTime: "",
    endTime: "",
    workingDays: [],
  });
  const [barbershopName, setBarbershopName] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getBarbershopById(id)
      .then((shop) =>
        setBarbershopName(
          shop.name || shop.barbershopName || `Barbería #${id}`,
        ),
      )
      .catch(() => setBarbershopName(`Barbería #${id}`));
  }, [id]);

  useEffect(() => {
    if (!isEditMode || !employeeId || !id) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const employee = await getEmployeeById(employeeId);
        const assignment = employee.assignments?.find(
          (a) => Number(a.barbershopId) === Number(id),
        );
        if (!assignment) {
          toast.error(
            "No se encontró la asignación de este empleado en esta barbería.",
          );
          return;
        }
        setFormData({
          username: employee.username || "",
          email: employee.email || "",
          phone: employee.phone || "",
          password: "",
          role: assignment.role || employee.role || "",
          startTime: assignment.startTime || "",
          endTime: assignment.endTime || "",
          workingDays: assignment.workingDays || [],
        });
      } catch (err) {
        toast.error(mapApiError(err.message, "Error al cargar el empleado"));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [isEditMode, employeeId, id]);

  useEffect(() => {
    if (mode !== "existing" || isEditMode) return;
    const fetch = async () => {
      try {
        setLoadingEmployees(true);
        const emps = await getAllEmployees();
        setAllEmployees(emps);
      } catch (err) {
        toast.error(
          mapApiError(err.message, "Error al cargar la lista de empleados"),
        );
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetch();
  }, [mode, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (dayValue, isExisting = false) => {
    const setter = isExisting ? setExistingSchedule : setFormData;
    setter((prev) => {
      const exists = prev.workingDays.includes(dayValue);
      return {
        ...prev,
        workingDays: exists
          ? prev.workingDays.filter((d) => d !== dayValue)
          : [...prev.workingDays, dayValue].sort((a, b) => a - b),
      };
    });
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSelectedEmployee(null);
    setEmployeeSearch("");
    setExistingSchedule({ startTime: "", endTime: "", workingDays: [] });
  };

  const filteredEmployees = allEmployees.filter((emp) => {
    const q = employeeSearch.toLowerCase();
    return (
      emp.username?.toLowerCase().includes(q) ||
      emp.email?.toLowerCase().includes(q)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      if (isEditMode) {
        if (!formData.role) {
          toast.error("Debes seleccionar un rol.");
          return;
        }
        if (!formData.workingDays.length) {
          toast.error("Debes seleccionar al menos un día de trabajo.");
          return;
        }
        await updateEmployeeAssignment(employeeId, id, {
          role: formData.role,
          startTime: formData.startTime,
          endTime: formData.endTime,
          workingDays: formData.workingDays,
        });
        toast.success("Empleado actualizado correctamente.");
      } else if (mode === "new") {
        if (!formData.role) {
          toast.error("Debes seleccionar un rol.");
          return;
        }
        if (!formData.workingDays.length) {
          toast.error("Debes seleccionar al menos un día de trabajo.");
          return;
        }
        await createBarbershopEmployee(id, formData);
        toast.success("Empleado creado correctamente.");
      } else {
        if (!selectedEmployee) {
          toast.error("Debes seleccionar un empleado de la lista.");
          return;
        }
        if (!existingSchedule.workingDays.length) {
          toast.error("Debes seleccionar al menos un día de trabajo.");
          return;
        }
        await assignExistingEmployee(id, selectedEmployee.id, existingSchedule);
        toast.success("Empleado asignado correctamente a la barbería.");
      }

      setTimeout(() => navigate(`/admin/barbershop/${id}/employees`), 1200);
    } catch (err) {
      toast.error(mapApiError(err.message, "Error al guardar el empleado"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <span className="material-icons-round text-5xl animate-pulse">
            badge
          </span>
          <p className="text-sm font-medium">Cargando empleado...</p>
        </div>
      </div>
    );
  }

  const submitLabel = saving
    ? isEditMode
      ? "Guardando..."
      : mode === "existing"
        ? "Asignando..."
        : "Creando..."
    : isEditMode
      ? "Guardar cambios"
      : mode === "existing"
        ? "Asignar empleado"
        : "Agregar empleado";

  return (
    <div className="bg-slate-50 min-h-screen">
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
            badge
          </span>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-10">
          <button
            onClick={() => navigate(`/admin/barbershop/${id}/employees`)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-100 text-sm mb-8"
          >
            <span className="material-icons-round text-[18px]">
              arrow_back_ios_new
            </span>
            Volver
          </button>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none mb-2">
            {isEditMode ? "Editar empleado" : "Agregar empleado"}
          </h1>
          <p className="text-slate-400 text-sm">
            {isEditMode
              ? `Actualiza la asignación del empleado en ${barbershopName}.`
              : "Selecciona si el empleado es nuevo en el sistema o ya existe."}
          </p>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {!isEditMode && (
          <div className="flex mb-6 bg-slate-100 rounded-2xl p-1 w-fit gap-1">
            {["new", "existing"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleModeChange(m)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === m ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {m === "new" ? "Empleado nuevo" : "Empleado existente"}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* ── MODO NUEVO / EDICIÓN ── */}
            {(isEditMode || mode === "new") && (
              <div className="p-6 space-y-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">
                  Información del empleado
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Nombre completo</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Ej: Juan Valdez"
                      required
                      disabled={isEditMode}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Correo electrónico</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Ej: juan@email.com"
                      required
                      disabled={isEditMode}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Teléfono</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Ej: 8091234567"
                      required
                      disabled={isEditMode}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Contraseña</label>
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
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Rol</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className={inputCls}
                    >
                      <option value="">Selecciona un rol</option>
                      <option value="barber">Barbero</option>
                      <option value="assistant">Asistente</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Barbería / sucursal</label>
                    <input
                      type="text"
                      value={barbershopName || `Barbería #${id}`}
                      disabled
                      readOnly
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Hora de entrada</label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Hora de salida</label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Días de trabajo</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {DAYS.map((day) => (
                      <button
                        type="button"
                        key={day.value}
                        onClick={() => handleDayToggle(day.value, false)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${formData.workingDays.includes(day.value) ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── MODO EXISTENTE ── */}
            {!isEditMode && mode === "existing" && (
              <div className="p-6 space-y-5">
                <div>
                  <label className={labelCls}>Buscar empleado</label>
                  <div className="relative">
                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                      search
                    </span>
                    <input
                      type="text"
                      value={employeeSearch}
                      onChange={(e) => {
                        setEmployeeSearch(e.target.value);
                        setSelectedEmployee(null);
                      }}
                      placeholder="Buscar por nombre o correo..."
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>

                {loadingEmployees ? (
                  <div className="flex items-center gap-2 text-slate-400 py-4">
                    <span className="material-icons-round animate-spin text-lg">
                      autorenew
                    </span>
                    <p className="text-sm">Cargando empleados...</p>
                  </div>
                ) : (
                  <div className="border border-slate-100 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                    {filteredEmployees.length === 0 ? (
                      <div className="flex flex-col items-center py-8 text-slate-400">
                        <span className="material-icons-round text-3xl mb-2 opacity-30">
                          person_search
                        </span>
                        <p className="text-sm">No se encontraron empleados.</p>
                      </div>
                    ) : (
                      filteredEmployees.map((emp, i) => {
                        const isSelected = selectedEmployee?.id === emp.id;
                        const barbershops = emp.assignments
                          ?.map(
                            (a) =>
                              a.barbershopName || `Barbería #${a.barbershopId}`,
                          )
                          .join(", ");
                        return (
                          <div
                            key={emp.id}
                            onClick={() =>
                              setSelectedEmployee(isSelected ? null : emp)
                            }
                            className={`flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer transition-colors ${i > 0 ? "border-t border-slate-50" : ""} ${isSelected ? "bg-slate-900" : "hover:bg-slate-50"}`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? "bg-white/20" : "bg-slate-100"}`}
                              >
                                <span
                                  className={`material-icons-round text-[16px] ${isSelected ? "text-white" : "text-slate-400"}`}
                                >
                                  person
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p
                                  className={`font-bold text-sm leading-none mb-0.5 ${isSelected ? "text-white" : "text-slate-800"}`}
                                >
                                  {emp.username}
                                </p>
                                <p
                                  className={`text-xs truncate ${isSelected ? "text-slate-300" : "text-slate-400"}`}
                                >
                                  {emp.email}
                                </p>
                                {barbershops && (
                                  <p
                                    className={`text-xs mt-0.5 truncate ${isSelected ? "text-slate-400" : "text-slate-300"}`}
                                  >
                                    📍 {barbershops}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {emp.role && (
                                <span
                                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
                                >
                                  {ROLE_LABELS[emp.role] || emp.role}
                                </span>
                              )}
                              {isSelected && (
                                <span className="material-icons-round text-white text-[18px]">
                                  check_circle
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {selectedEmployee && (
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                    <span className="material-icons-round text-emerald-500 text-[18px]">
                      check_circle
                    </span>
                    <p className="text-sm text-slate-600">
                      <span className="font-bold text-slate-800">
                        {selectedEmployee.username}
                      </span>{" "}
                      será asignado a{" "}
                      <span className="font-bold text-slate-800">
                        {barbershopName}
                      </span>
                      .
                    </p>
                  </div>
                )}

                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-5">
                  Horario en esta barbería
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Hora de entrada</label>
                    <input
                      type="time"
                      value={existingSchedule.startTime}
                      onChange={(e) =>
                        setExistingSchedule((p) => ({
                          ...p,
                          startTime: e.target.value,
                        }))
                      }
                      required
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Hora de salida</label>
                    <input
                      type="time"
                      value={existingSchedule.endTime}
                      onChange={(e) =>
                        setExistingSchedule((p) => ({
                          ...p,
                          endTime: e.target.value,
                        }))
                      }
                      required
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Días de trabajo</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {DAYS.map((day) => (
                      <button
                        type="button"
                        key={day.value}
                        onClick={() => handleDayToggle(day.value, true)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${existingSchedule.workingDays.includes(day.value) ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors disabled:opacity-50 shadow-sm"
              >
                <span className="material-icons-round text-[16px]">
                  {isEditMode
                    ? "save"
                    : mode === "existing"
                      ? "person_add"
                      : "add"}
                </span>
                {submitLabel}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/admin/barbershop/${id}/employees`)}
                className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold px-5 py-3 rounded-xl text-sm transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminEmployeeForm;
