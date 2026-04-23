import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBarbershopById,
  getBarbershopReviews,
  createBarbershopReview,
  deleteBarbershopReview,
  getBarbershopPhotos,
} from "../../services/barbershopService";
import { Avatar } from "../../components/UserProfileCard";

const fallbackHero = "https://via.placeholder.com/1200x300?text=Barberia";

// ── Modal de confirmación para eliminar reseña ─────────────────────────────
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
          <p className="text-sm text-slate-500 leading-relaxed">
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

function BarbershopProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [barbershop, setBarbershop] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, content: "" });

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = storedUser?.id;
  const currentUserRole = storedUser?.role;

  const fetchBarbershop = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getBarbershopById(id);
      setBarbershop(data);
    } catch (err) {
      setError(err.message || "Error al cargar la barbería");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const data = await getBarbershopReviews(id);
      setReviews(data);
    } catch (err) {
      setReviewError(err.message || "Error al cargar las reseñas");
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBarbershop();
      fetchReviews();
      getBarbershopPhotos(id)
        .then(setPhotos)
        .catch(() => setPhotos([]));
    }
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      setSubmittingReview(true);
      setReviewError("");
      setReviewSuccess("");
      if (!currentUserId) {
        setReviewError("Debes iniciar sesión para dejar una reseña.");
        return;
      }
      await createBarbershopReview(id, {
        clientId: currentUserId,
        rating: reviewForm.rating,
        content: reviewForm.content,
      });
      setReviewSuccess("Reseña publicada correctamente.");
      setReviewForm({ rating: 5, content: "" });
      await fetchReviews();
    } catch (err) {
      setReviewError(err.message || "Error al enviar la reseña");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;
    try {
      setDeletingReviewId(reviewToDelete);
      await deleteBarbershopReview(id, reviewToDelete);
      setReviewSuccess("Reseña eliminada correctamente.");
      setReviewToDelete(null);
      await fetchReviews();
    } catch (err) {
      setReviewError(err.message || "Error al eliminar la reseña");
      setReviewToDelete(null);
    } finally {
      setDeletingReviewId(null);
    }
  };

  const canDeleteReview = (review) => {
    if (!storedUser) return false;
    return (
      currentUserRole === "admin" ||
      Number(review.clientId) === Number(currentUserId)
    );
  };

  const renderStars = (rating) => {
    const n = Math.max(0, Math.min(5, Math.round(rating || 0)));
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < n ? "text-amber-400" : "text-slate-200"}>
        ★
      </span>
    ));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <span className="material-icons-round text-5xl animate-pulse">
            storefront
          </span>
          <p className="text-sm font-medium">Cargando barbería...</p>
        </div>
      </div>
    );
  }

  if (error || !barbershop) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 max-w-md text-center text-sm">
          {error || "No se encontró la barbería."}
        </div>
      </div>
    );
  }

  const isOpen = barbershop.isOpen ?? barbershop.isActive ?? false;
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <>
      {reviewToDelete && (
        <DeleteReviewModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setReviewToDelete(null)}
          deleting={deletingReviewId !== null}
        />
      )}

      <div className="bg-slate-50 min-h-screen">
        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden">
          <img
            src={barbershop.image || fallbackHero}
            alt={barbershop.name}
            onError={(e) => {
              e.target.src = fallbackHero;
            }}
            className="w-full h-56 sm:h-72 object-cover"
          />
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />

          {/* Info sobre la imagen */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
            <div className="max-w-5xl mx-auto flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mb-2">
                  {barbershop.name}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
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
                    {isOpen ? "Abierta" : "Cerrada"}
                  </span>
                  {barbershop.address && (
                    <span className="text-white/70 text-xs flex items-center gap-1">
                      <span className="material-icons-round text-[14px]">
                        location_on
                      </span>
                      {barbershop.address}
                    </span>
                  )}
                  {avgRating && (
                    <span className="text-amber-400 text-sm font-bold flex items-center gap-1">
                      ★ {avgRating}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {currentUserRole === "admin" && (
                  <button
                    onClick={() =>
                      navigate(`/admin/barbershop/${barbershop.id}`)
                    }
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-700 transition shadow-lg text-sm"
                  >
                    <span className="material-icons-round text-[18px]">
                      settings
                    </span>
                    Administrar
                  </button>
                )}
                <button
                  onClick={() =>
                    navigate(`/barbershops/${barbershop.id}/queue`)
                  }
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition shadow-lg text-sm"
                >
                  <span className="material-icons-round text-[18px] text-red-500">
                    sensors
                  </span>
                  Ver cola en vivo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTENT ───────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Correo", value: barbershop.email, icon: "email" },
              { label: "Teléfono", value: barbershop.phone, icon: "phone" },
              {
                label: "Horario",
                value: `${barbershop.opensAt?.slice(0, 5)} – ${barbershop.closesAt?.slice(0, 5)}`,
                icon: "schedule",
              },
              {
                label: "Capacidad",
                value: `${barbershop.capacity} personas`,
                icon: "chair",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-icons-round text-slate-400 text-[16px]">
                    {item.icon}
                  </span>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    {item.label}
                  </p>
                </div>
                <p className="font-bold text-slate-800 text-sm">
                  {item.value || "—"}
                </p>
              </div>
            ))}
          </div>

          {/* Fotos de servicios */}
          {photos.length > 0 && (
            <section>
              <h2 className="text-xl font-black text-slate-800 mb-4">
                Fotos de servicios
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={photo.photoUrl}
                      alt={photo.photoDescription || "Foto"}
                      className="w-full h-40 object-cover"
                    />
                    {photo.photoDescription && (
                      <div className="p-3">
                        <p className="font-bold text-slate-800 text-sm">
                          {photo.photoDescription}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reseñas */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-black text-slate-800">Reseñas</h2>
              {reviews.length > 0 && (
                <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full">
                  {reviews.length}
                </span>
              )}
            </div>

            {/* Formulario */}
            {currentUserRole === "client" && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
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

                  {/* Estrellas */}
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

                  {/* Comentario */}
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Comentario
                    </p>
                    <textarea
                      name="content"
                      value={reviewForm.content}
                      onChange={(e) =>
                        setReviewForm((p) => ({
                          ...p,
                          content: e.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Escribe tu experiencia..."
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition resize-none placeholder:text-slate-300"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition disabled:opacity-50"
                  >
                    <span className="material-icons-round text-[16px]">
                      send
                    </span>
                    {submittingReview ? "Publicando..." : "Publicar reseña"}
                  </button>
                </form>
              </div>
            )}

            {/* Lista de reseñas */}
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
                <p className="font-bold text-slate-400 text-sm">
                  Aún no hay reseñas para esta barbería.
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
                        <div className="flex gap-0.5 text-base">
                          {renderStars(review.rating)}
                        </div>
                        {canDeleteReview(review) && (
                          <button
                            onClick={() => setReviewToDelete(review.id)}
                            disabled={deletingReviewId === review.id}
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
          </section>
        </div>
      </div>
    </>
  );
}

export default BarbershopProfile;
