import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBarberById,
  getBarberReviews,
  getBarberDashboard,
} from "../../services/barberService";

function BarberProfile() {
  const navigate = useNavigate();

  const [barber, setBarber] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    const fetchBarberProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        const barberId = storedUser?.id;
        if (!barberId) {
          setError("No se encontró el barbero autenticado.");
          return;
        }
        const [barberData, dashboardData] = await Promise.all([
          getBarberById(barberId),
          getBarberDashboard(barberId),
        ]);
        setBarber(barberData);
        setDashboard(dashboardData);
      } catch (err) {
        setError(err.message || "Error al cargar el perfil del barbero");
      } finally {
        setLoading(false);
      }
    };
    fetchBarberProfile();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        const barberId = storedUser?.id;
        if (!barberId) return;
        const data = await getBarberReviews(barberId);
        setReviews(data);
      } catch (err) {
        setReviewError(err.message || "Error al cargar las reseñas");
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const getStatusConfig = (status) => {
    if (status === "active")
      return {
        label: "Activo",
        dot: "bg-emerald-400",
        badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      };
    if (status === "resting")
      return {
        label: "Descansando",
        dot: "bg-amber-400",
        badge: "bg-amber-50 text-amber-700 ring-amber-200",
      };
    return {
      label: "Inactivo",
      dot: "bg-slate-400",
      badge: "bg-slate-100 text-slate-500 ring-slate-200",
    };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("es-DO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const renderStars = (rating) => {
    const n = Math.max(0, Math.min(5, Math.round(rating || 0)));
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < n ? "text-amber-400" : "text-slate-200"}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <span className="material-icons-round text-5xl animate-pulse">
            face
          </span>
          <p className="text-sm font-medium tracking-wide">
            Cargando perfil...
          </p>
        </div>
      </div>
    );
  }

  if (error || !barber) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 max-w-md text-center text-sm">
          {error || "No se encontró el perfil del barbero."}
        </div>
      </div>
    );
  }

  const statusCfg = getStatusConfig(barber.currentStatus);

  const kpis = [
    {
      label: "Clientes atendidos",
      value: dashboard?.totalAttendedClients ?? 0,
      icon: "groups",
      light: "bg-blue-50 text-blue-500",
    },
    {
      label: "Tiempo promedio",
      value: dashboard?.averageServiceMinutes
        ? `${dashboard.averageServiceMinutes} min`
        : "—",
      icon: "timer",
      light: "bg-violet-50 text-violet-500",
    },
    {
      label: "Rating promedio",
      value:
        dashboard?.averageRating != null ? `${dashboard.averageRating} ★` : "—",
      icon: "star",
      light: "bg-amber-50 text-amber-500",
    },
    {
      label: "Miembro desde",
      value: formatDate(dashboard?.joinDate),
      icon: "calendar_today",
      light: "bg-emerald-50 text-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/60 overflow-hidden border-b border-slate-100">
        {/* Decorative watermark */}
        <div className="absolute inset-0 flex items-center justify-end pr-12 opacity-[0.04] pointer-events-none select-none">
          <span
            className="material-icons-round text-slate-800"
            style={{ fontSize: 300 }}
          >
            content_cut
          </span>
        </div>
        {/* Grid texture */}

        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 py-14">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center shadow-2xl">
                <span
                  className="material-icons-round text-slate-400"
                  style={{ fontSize: 58 }}
                >
                  face
                </span>
              </div>
              <div
                className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full border-[3px] border-white ${statusCfg.dot} shadow-md`}
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none mb-5">
                {barber.username}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ${statusCfg.badge}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                  />
                  {statusCfg.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ${
                    barber.isAccepting
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-rose-50 text-rose-700 ring-rose-200"
                  }`}
                >
                  <span
                    className="material-icons-round"
                    style={{ fontSize: 12 }}
                  >
                    {barber.isAccepting ? "lock_open" : "lock"}
                  </span>
                  {barber.isAccepting ? "Aceptando clientes" : "Cola cerrada"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI STRIP ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 -mt-5 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map((kpi, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div
                className={`w-9 h-9 rounded-xl ${kpi.light} flex items-center justify-center mb-3`}
              >
                <span className="material-icons-round text-[18px]">
                  {kpi.icon}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mb-0.5">
                {kpi.label}
              </p>
              <p className="text-2xl font-black text-slate-800 leading-tight">
                {kpi.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── REVIEWS ───────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-black text-slate-800">Reseñas</h2>
          {reviews.length > 0 && (
            <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full">
              {reviews.length}
            </span>
          )}
        </div>

        {reviewError && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-4 text-sm">
            {reviewError}
          </div>
        )}

        {reviewsLoading ? (
          <div className="flex items-center gap-3 text-slate-400 py-8">
            <span className="material-icons-round animate-spin text-lg">
              autorenew
            </span>
            <p className="text-sm">Cargando reseñas...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
            <span className="material-icons-round text-5xl text-slate-200 mb-3 block">
              rate_review
            </span>
            <p className="font-bold text-slate-400">Aún no hay reseñas.</p>
            <p className="text-sm text-slate-300 mt-1">
              Las reseñas de tus clientes aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <span className="material-icons-round text-slate-400 text-[18px]">
                        person
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm leading-none mb-0.5">
                        {review.username}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-lg shrink-0">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BarberProfile;
