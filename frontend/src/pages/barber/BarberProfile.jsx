import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBarberById,
  getBarberReviews,
  getBarberDashboard,
  createBarberReview,
  deleteBarberReview,
} from "../../services/barberService";
import { getUserById, updateUserPhoto } from "../../services/userService";
import { Avatar } from "../../components/UserProfileCard";

// ── Modal cambiar foto ─────────────────────────────────────────────────────
function EditPhotoModal({ currentUrl, onConfirm, onCancel, saving }) {
  const [photoUrl, setPhotoUrl] = useState(currentUrl || "");
  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition placeholder:text-slate-300";
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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 border-b border-slate-50">
          <h2 className="text-lg font-black text-slate-800">
            Cambiar foto de perfil
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ingresa la URL de tu nueva foto.
          </p>
        </div>
        <div className="p-6 space-y-4">
          {photoUrl && (
            <img
              src={photoUrl}
              alt="preview"
              onError={(e) => {
                e.target.style.display = "none";
              }}
              className="w-28 h-28 rounded-3xl object-cover border border-slate-200 mx-auto block"
            />
          )}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              URL de la foto
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
              className={inputCls}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 px-6 pb-6">
          <button
            onClick={() => onConfirm(photoUrl)}
            disabled={saving || !photoUrl.trim()}
            className="w-full py-3 bg-slate-900 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-sm"
          >
            {saving ? "Guardando..." : "Guardar foto"}
          </button>
          <button
            onClick={onCancel}
            disabled={saving}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
function DeleteReviewModal({ onConfirm, onCancel, deleting }) {
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
              rate_review
            </span>
          </div>
        </div>
        <div className="px-6 pb-6 text-center">
          <h2 className="text-lg font-black text-slate-800 mb-2">
            ¿Eliminar reseña?
          </h2>
          <p className="text-sm text-slate-500">
            Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="flex flex-col gap-2 px-6 pb-6">
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-sm"
          >
            {deleting ? "Eliminando..." : "Sí, eliminar reseña"}
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

function BarberProfile() {
  const { barberId: paramBarberId } = useParams(); // presente solo en ruta de cliente
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentRole = storedUser?.role;
  const currentId = storedUser?.id;

  // Si hay param en la URL usamos ese; si no, usamos el id del usuario logueado
  const barberId = paramBarberId ?? currentId;
  const isClient = currentRole === "client";
  const isSelf = !paramBarberId; // el barbero viendo su propio perfil

  const [barber, setBarber] = useState(null);
  const [barberPhotoUrl, setBarberPhotoUrl] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, content: "" });

  // ── Edición de foto (solo isSelf) ──────────────────────────────────────
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const handleSavePhoto = async (newUrl) => {
    try {
      setSavingPhoto(true);
      setPhotoError("");
      await updateUserPhoto(currentId, newUrl);
      setBarberPhotoUrl(newUrl);
      setIsEditingPhoto(false);
      // Actualizar localStorage
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      if (stored)
        localStorage.setItem(
          "user",
          JSON.stringify({ ...stored, photoUrl: newUrl }),
        );
    } catch (err) {
      setPhotoError(err.message || "Error al actualizar la foto");
    } finally {
      setSavingPhoto(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const data = await getBarberReviews(barberId);
      setReviews(data);
    } catch (err) {
      setReviewError(err.message || "Error al cargar las reseñas");
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");
        if (!barberId) {
          setError("No se encontró el barbero.");
          return;
        }
        const [barberData, dashboardData, userData] = await Promise.all([
          getBarberById(barberId),
          getBarberDashboard(barberId),
          getUserById(barberId).catch(() => null),
        ]);
        setBarber(barberData);
        setDashboard(dashboardData);
        setBarberPhotoUrl(userData?.photoUrl || null);
      } catch (err) {
        setError(err.message || "Error al cargar el perfil del barbero");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    fetchReviews();
  }, [barberId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setReviewError("");
      setReviewSuccess("");
      await createBarberReview(barberId, {
        clientId: currentId,
        rating: reviewForm.rating,
        content: reviewForm.content,
      });
      setReviewSuccess("Reseña publicada correctamente.");
      setReviewForm({ rating: 5, content: "" });
      await fetchReviews();
    } catch (err) {
      setReviewError(err.message || "Error al enviar la reseña");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;
    try {
      setDeletingId(reviewToDelete);
      await deleteBarberReview(barberId, reviewToDelete);
      setReviewSuccess("Reseña eliminada correctamente.");
      setReviewToDelete(null);
      await fetchReviews();
    } catch (err) {
      setReviewError(err.message || "Error al eliminar la reseña");
      setReviewToDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  const canDeleteReview = (review) =>
    currentRole === "admin" || Number(review.clientId) === Number(currentId);

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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <span className="material-icons-round text-5xl animate-pulse">
            face
          </span>
          <p className="text-sm font-medium">Cargando perfil...</p>
        </div>
      </div>
    );

  if (error || !barber)
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 max-w-md text-center text-sm">
          {error || "No se encontró el perfil del barbero."}
        </div>
      </div>
    );

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
    <>
      {reviewToDelete && (
        <DeleteReviewModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setReviewToDelete(null)}
          deleting={deletingId !== null}
        />
      )}
      {isEditingPhoto && (
        <EditPhotoModal
          currentUrl={barberPhotoUrl}
          onConfirm={handleSavePhoto}
          onCancel={() => setIsEditingPhoto(false)}
          saving={savingPhoto}
        />
      )}

      <div className="min-h-screen bg-slate-50">
        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/60 overflow-hidden border-b border-slate-100">
          <div className="absolute inset-0 flex items-center justify-end pr-12 opacity-[0.04] pointer-events-none select-none">
            <span
              className="material-icons-round text-slate-800"
              style={{ fontSize: 300 }}
            >
              content_cut
            </span>
          </div>
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
              <div className="relative shrink-0 group">
                <Avatar
                  photoUrl={barberPhotoUrl}
                  username={barber.username}
                  size="lg"
                  className="shadow-2xl border border-slate-200"
                />
                <div
                  className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full border-[3px] border-white ${statusCfg.dot} shadow-md`}
                />
                {isSelf && (
                  <button
                    onClick={() => setIsEditingPhoto(true)}
                    className="absolute inset-0 rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <span className="material-icons-round text-white text-2xl">
                      photo_camera
                    </span>
                  </button>
                )}
              </div>
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
                  {isSelf && (
                    <button
                      onClick={() => setIsEditingPhoto(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ring-1 bg-slate-100 text-slate-600 ring-slate-200 hover:bg-slate-200 transition-colors"
                    >
                      <span
                        className="material-icons-round"
                        style={{ fontSize: 12 }}
                      >
                        photo_camera
                      </span>
                      Cambiar foto
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI STRIP ───────────────────────────────────────────────────── */}
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

        {/* ── REVIEWS ─────────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-12 space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-800">Reseñas</h2>
            {reviews.length > 0 && (
              <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full">
                {reviews.length}
              </span>
            )}
          </div>

          {/* Formulario — solo para clientes */}
          {isClient && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 pt-5 pb-2 border-b border-slate-50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Deja tu reseña
                </p>
              </div>
              <form onSubmit={handleSubmitReview} className="p-6 space-y-5">
                {reviewError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                    {reviewError}
                  </div>
                )}
                {reviewSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-3 text-sm">
                    {reviewSuccess}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Calificación
                  </p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setReviewForm((p) => ({ ...p, rating: star }))
                        }
                        className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                      >
                        <span
                          className={
                            reviewForm.rating >= star
                              ? "text-amber-400"
                              : "text-slate-200"
                          }
                        >
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Comentario
                  </p>
                  <textarea
                    value={reviewForm.content}
                    onChange={(e) =>
                      setReviewForm((p) => ({ ...p, content: e.target.value }))
                    }
                    rows={3}
                    required
                    placeholder="Escribe tu experiencia..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition resize-none placeholder:text-slate-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition disabled:opacity-50"
                >
                  <span className="material-icons-round text-[16px]">send</span>
                  {submitting ? "Publicando..." : "Publicar reseña"}
                </button>
              </form>
            </div>
          )}

          {/* Lista reseñas */}
          {reviewsLoading ? (
            <div className="flex items-center gap-3 text-slate-400 py-8">
              <span className="material-icons-round animate-spin">
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
                Las reseñas aparecerán aquí.
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
                      <Avatar
                        photoUrl={review.photoUrl}
                        username={review.username}
                        size="sm"
                      />
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-none mb-0.5">
                          {review.username}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex gap-0.5 text-lg">
                        {renderStars(review.rating)}
                      </div>
                      {canDeleteReview(review) && (
                        <button
                          onClick={() => setReviewToDelete(review.id)}
                          disabled={deletingId === review.id}
                          className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          <span className="material-icons-round text-[14px]">
                            delete
                          </span>
                        </button>
                      )}
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
    </>
  );
}

export default BarberProfile;
