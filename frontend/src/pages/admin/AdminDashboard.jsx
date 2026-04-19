import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBarbershopById,
  getBarbershopEmployees,
  getBarbershopReviews,
  getBarbershopClients,
} from "../../services/barbershopService";
import ReviewsModal from "../../components/barbershop/ReviewsModal";

const DAY_LABELS = {
  1: "Lun",
  2: "Mar",
  3: "Mié",
  4: "Jue",
  5: "Vie",
  6: "Sáb",
  7: "Dom",
};

function EmployeesModal({ title, employees, color, onClose }) {
  if (!employees) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(15,23,42,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-800">{title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {employees.length} en esta barbería
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <span className="material-icons-round text-slate-500 text-[18px]">
              close
            </span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {employees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <span className="material-icons-round text-4xl mb-2 opacity-30">
                person_off
              </span>
              <p className="text-sm">No hay empleados en esta categoría.</p>
            </div>
          ) : (
            employees.map((emp) => (
              <div
                key={emp.id}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center shrink-0`}
                  >
                    <span className="material-icons-round text-[18px]">
                      person
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm leading-none mb-0.5">
                      {emp.username}
                    </p>
                    <p className="text-xs text-slate-400">{emp.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500 pl-12">
                  <span className="flex items-center gap-1">
                    <span className="material-icons-round text-[13px] text-slate-400">
                      schedule
                    </span>
                    {emp.startTime?.slice(0, 5)} – {emp.endTime?.slice(0, 5)}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-icons-round text-[13px] text-slate-400">
                      phone
                    </span>
                    {emp.phone}
                  </span>
                </div>
                {emp.workingDays?.length > 0 && (
                  <div className="flex gap-1 mt-2 pl-12 flex-wrap">
                    {emp.workingDays.map((d) => (
                      <span
                        key={d}
                        className="bg-white border border-slate-200 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      >
                        {DAY_LABELS[d] || d}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showReviews, setShowReviews] = useState(false);
  const [showBarbers, setShowBarbers] = useState(false);
  const [showAssistants, setShowAssistants] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");
        const [shopData, empData, revData, cliData] = await Promise.all([
          getBarbershopById(id),
          getBarbershopEmployees(id),
          getBarbershopReviews(id),
          getBarbershopClients(id),
        ]);
        setShop(shopData);
        setEmployees(Array.isArray(empData) ? empData : []);
        setReviews(Array.isArray(revData) ? revData : []);
        setClients(Array.isArray(cliData) ? cliData : []);
      } catch (err) {
        setError(err.message || "Error al cargar el dashboard");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAll();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <span className="material-icons-round text-5xl animate-pulse">
            bar_chart
          </span>
          <p className="text-sm font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 max-w-md text-center text-sm">
          {error}
        </div>
      </div>
    );
  }

  const barbers = employees.filter((e) => e.role === "barber");
  const assistants = employees.filter((e) => e.role === "assistant");
  const totalEmp = employees.length;
  const clientsNow = clients.length;
  const totalReviews = reviews.length;
  const isOpen = shop?.isActive ?? false;
  const avgRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
        ).toFixed(1)
      : null;

  const Metric = ({ label, value, icon, color, onClick, badge }) => (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 transition-all ${onClick ? "cursor-pointer hover:shadow-md hover:border-slate-200 active:scale-[0.98]" : "hover:shadow-md"}`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center shrink-0`}
        >
          <span className="material-icons-round text-[18px]">{icon}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {badge != null && (
            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
          {onClick && (
            <span className="material-icons-round text-slate-300 text-[15px]">
              chevron_right
            </span>
          )}
        </div>
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
        <p className="text-3xl font-black text-slate-800 leading-none">
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {showReviews && (
        <ReviewsModal reviews={reviews} onClose={() => setShowReviews(false)} />
      )}
      {showBarbers && (
        <EmployeesModal
          title="Barberos"
          employees={barbers}
          color="bg-blue-50 text-blue-500"
          onClose={() => setShowBarbers(false)}
        />
      )}
      {showAssistants && (
        <EmployeesModal
          title="Asistentes"
          employees={assistants}
          color="bg-indigo-50 text-indigo-500"
          onClose={() => setShowAssistants(false)}
        />
      )}

      <div className="bg-slate-50">
        {/* ── HERO claro — igual que el resto de páginas ────────────────── */}
        <div
          className="relative overflow-hidden border-b border-slate-100"
          style={{
            background:
              "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f0fdf4 100%)",
          }}
        >
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.25]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-end pr-12 opacity-[0.04] pointer-events-none select-none">
            <span
              className="material-icons-round text-slate-900"
              style={{ fontSize: 260 }}
            >
              bar_chart
            </span>
          </div>

          <div className="relative max-w-6xl mx-auto px-6 py-10">
            <button
              onClick={() => navigate(`/admin/barbershop/${id}`)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-100 text-sm mb-8"
            >
              <span className="material-icons-round text-[18px]">
                arrow_back_ios_new
              </span>
              Volver
            </button>

            <p className="text-slate-400 text-xs uppercase tracking-[0.25em] font-semibold mb-2">
              Dashboard
            </p>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none mb-3">
              {shop?.name || "Barbería"}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ${
                  isOpen
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-rose-50 text-rose-700 ring-rose-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-400" : "bg-rose-400"}`}
                />
                {isOpen ? "Activa" : "Inactiva"}
              </span>
              {shop?.address && (
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <span className="material-icons-round text-[13px]">
                    location_on
                  </span>
                  {shop.address}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── MÉTRICAS ─────────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          {/* En este momento */}
          <section>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">
                En este momento
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Metric
                label="Clientes en barbería"
                value={clientsNow}
                icon="storefront"
                color="bg-emerald-50 text-emerald-500"
              />
              <Metric
                label="Capacidad"
                value={`${clientsNow} / ${shop?.capacity ?? "—"}`}
                icon="chair"
                color="bg-violet-50 text-violet-500"
                badge={
                  shop?.capacity
                    ? `${Math.round((clientsNow / shop.capacity) * 100)}%`
                    : null
                }
              />
              <Metric
                label="Total empleados"
                value={totalEmp}
                icon="badge"
                color="bg-slate-100 text-slate-500"
              />
            </div>
          </section>

          {/* Personal */}
          <section>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <span className="material-icons-round text-blue-500 text-[15px]">
                  people
                </span>
              </div>
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Personal
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <Metric
                label="Barberos"
                value={barbers.length}
                icon="content_cut"
                color="bg-blue-50 text-blue-500"
                onClick={
                  barbers.length > 0 ? () => setShowBarbers(true) : undefined
                }
              />
              <Metric
                label="Asistentes"
                value={assistants.length}
                icon="support_agent"
                color="bg-indigo-50 text-indigo-500"
                onClick={
                  assistants.length > 0
                    ? () => setShowAssistants(true)
                    : undefined
                }
              />
            </div>
          </section>

          {/* Opiniones */}
          <section>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                <span className="material-icons-round text-amber-500 text-[15px]">
                  star
                </span>
              </div>
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Opiniones
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <Metric
                label="Total de reseñas"
                value={totalReviews}
                icon="rate_review"
                color="bg-rose-50 text-rose-500"
                onClick={
                  totalReviews > 0 ? () => setShowReviews(true) : undefined
                }
              />
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-3">
                  <span className="material-icons-round text-[18px]">star</span>
                </div>
                <p className="text-xs text-slate-400 font-medium mb-1">
                  Rating promedio
                </p>
                {avgRating ? (
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-black text-slate-800 leading-none">
                      {avgRating}
                    </p>
                    <div className="flex gap-0.5 mb-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={
                            parseFloat(avgRating) > i
                              ? "text-amber-400"
                              : "text-slate-200"
                          }
                          style={{ fontSize: 16 }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-3xl font-black text-slate-300 leading-none">
                    —
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Clientes presentes */}
          {clients.length > 0 && (
            <section>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <span className="material-icons-round text-emerald-500 text-[15px]">
                    person_pin
                  </span>
                </div>
                <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  Clientes presentes
                </h2>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden max-w-2xl">
                {clients.map((client, i) => (
                  <div
                    key={client.clientId}
                    className={`flex items-center gap-3 px-5 py-3.5 ${i < clients.length - 1 ? "border-b border-slate-50" : ""}`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <span className="material-icons-round text-slate-400 text-[16px]">
                        person
                      </span>
                    </div>
                    <p className="font-bold text-slate-800 text-sm flex-1">
                      {client.username}
                    </p>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                      En barbería
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
