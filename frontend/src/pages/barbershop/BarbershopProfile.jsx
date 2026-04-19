import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBarbershopById,
  getBarbershopReviews,
  createBarbershopReview,
  deleteBarbershopReview,
} from "../../services/barbershopService";
import "../../styles/barbershop/BarbershopProfile.css";

function BarbershopProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [barbershop, setBarbershop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    content: "",
  });

  const mockCuts = [
    {
      id: 1,
      name: "Fade clásico",
      image:
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      name: "Corte moderno",
      image:
        "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "Barba y perfilado",
      image:
        "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = storedUser?.id;
  const currentUserRole = storedUser?.role;

  const fetchBarbershop = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBarbershopById(id);
      setBarbershop(data);
    } catch (err) {
      console.error("Error al obtener detalle de barbería:", err);
      setError(err.message || "Error al cargar la barbería");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      setReviewError("");

      const data = await getBarbershopReviews(id);
      setReviews(data);
    } catch (err) {
      console.error("Error al obtener reseñas:", err);
      setReviewError(err.message || "Error al cargar las reseñas");
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBarbershop();
      fetchReviews();
    }
  }, [id]);

  const renderStars = (rating) => {
    const safeRating = Math.max(0, Math.min(5, Math.round(rating || 0)));
    return "⭐".repeat(safeRating);
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStarClick = (rating) => {
    setReviewForm((prev) => ({
      ...prev,
      rating,
    }));
  };

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

      setReviewSuccess("Reseña enviada correctamente.");
      setReviewForm({
        rating: 5,
        content: "",
      });

      await fetchReviews();
    } catch (err) {
      console.error("Error al crear reseña:", err);
      setReviewError(err.message || "Error al enviar la reseña");
    } finally {
      setSubmittingReview(false);
    }
  };

  const canDeleteReview = (review) => {
    if (!storedUser) return false;

    const isAdmin = currentUserRole === "admin";
    const isAuthor = Number(review.clientId) === Number(currentUserId);

    return isAdmin || isAuthor;
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar esta reseña?",
    );

    if (!confirmed) return;

    try {
      setDeletingReviewId(reviewId);
      setReviewError("");
      setReviewSuccess("");

      await deleteBarbershopReview(id, reviewId);

      setReviewSuccess("Reseña eliminada correctamente.");
      await fetchReviews();
    } catch (err) {
      console.error("Error al eliminar reseña:", err);
      setReviewError(err.message || "Error al eliminar la reseña");
    } finally {
      setDeletingReviewId(null);
    }
  };

  if (loading) {
    return (
      <div className="barbershop-profile-page">
        <p>Cargando barbería...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="barbershop-profile-page">
        <p className="barbershop-profile-error">{error}</p>
      </div>
    );
  }

  if (!barbershop) {
    return (
      <div className="barbershop-profile-page">
        <p>No se encontró la barbería.</p>
      </div>
    );
  }

  return (
    <div className="barbershop-profile-page">
      <div className="barbershop-profile-card">
        <img
          src={
            barbershop.image ||
            "https://via.placeholder.com/1200x300?text=Barberia"
          }
          alt={barbershop.name}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/1200x300?text=Barberia";
          }}
          className="barbershop-profile-hero"
        />

        <div className="barbershop-profile-content">
          <div className="barbershop-profile-header">
            <div>
              <h1 className="barbershop-profile-title">{barbershop.name}</h1>

              <p className="barbershop-profile-meta">📍 {barbershop.address}</p>

              <p className="barbershop-profile-meta">
                ⭐ {barbershop.rating ?? "Sin rating"}
              </p>
            </div>

            <div className="barbershop-profile-actions">
              <div
                className={`barbershop-profile-status ${
                  barbershop.isOpen ? "open" : "closed"
                }`}
              >
                {barbershop.isOpen ? "Abierta" : "Cerrada"}
              </div>

              <button
                onClick={() => navigate(`/barbershops/${barbershop.id}/queue`)}
                className="barbershop-profile-queue-btn"
              >
                🔴 Ver cola en vivo
              </button>
            </div>
          </div>

          <div className="barbershop-profile-info-grid">
            <div className="barbershop-info-box">
              <p className="barbershop-info-label">Correo</p>
              <p className="barbershop-info-value">{barbershop.email}</p>
            </div>

            <div className="barbershop-info-box">
              <p className="barbershop-info-label">Teléfono</p>
              <p className="barbershop-info-value">{barbershop.phone}</p>
            </div>

            <div className="barbershop-info-box">
              <p className="barbershop-info-label">Horario</p>
              <p className="barbershop-info-value">
                {barbershop.opensAt} - {barbershop.closesAt}
              </p>
            </div>

            <div className="barbershop-info-box">
              <p className="barbershop-info-label">Capacidad</p>
              <p className="barbershop-info-value">{barbershop.capacity}</p>
            </div>

            <div className="barbershop-info-box">
              <p className="barbershop-info-label">Estado en sistema</p>
              <p className="barbershop-info-value">
                {barbershop.isActive ? "Activa" : "Inactiva"}
              </p>
            </div>
          </div>

          <div className="barbershop-profile-section">
            <h2 className="barbershop-profile-section-title">
              Tipos de cortes
            </h2>

            <div className="barbershop-cuts-grid">
              {mockCuts.map((cut) => (
                <div key={cut.id} className="barbershop-cut-card">
                  <img
                    src={cut.image}
                    alt={cut.name}
                    className="barbershop-cut-image"
                  />

                  <div className="barbershop-cut-body">
                    <p className="barbershop-cut-name">{cut.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="barbershop-profile-section">
            <h2 className="barbershop-profile-section-title">Reseñas</h2>

            <div className="barbershop-review-form-card">
              <h3 className="barbershop-review-form-title">Deja tu reseña</h3>

              {reviewError && (
                <p className="barbershop-review-message error">{reviewError}</p>
              )}

              {reviewSuccess && (
                <p className="barbershop-review-message success">
                  {reviewSuccess}
                </p>
              )}

              <form onSubmit={handleSubmitReview}>
                <div className="barbershop-form-group">
                  <label className="block mb-3 text-center">Calificación</label>
                  <div className="flex justify-center gap-3 mt-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          reviewForm.rating >= star
                            ? "bg-amber-50 text-amber-500 scale-110 shadow-sm border border-amber-100"
                            : "bg-slate-50 text-slate-300 hover:bg-slate-100 border border-transparent"
                        }`}
                      >
                        <span className="material-icons-round text-3xl text-inherit">
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="barbershop-form-group">
                  <label>Comentario</label>
                  <textarea
                    name="content"
                    value={reviewForm.content}
                    onChange={handleReviewChange}
                    rows="4"
                    placeholder="Escribe tu experiencia..."
                    className="barbershop-textarea"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="barbershop-submit-btn"
                >
                  {submittingReview ? "Enviando..." : "Publicar reseña"}
                </button>
              </form>
            </div>

            {reviewsLoading ? (
              <div className="text-center py-8 text-slate-500">
                Cargando reseñas...
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-slate-500 italic">
                Aún no hay reseñas para esta barbería.
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {review.username}
                          </p>
                          <div className="text-xs tracking-widest text-amber-500">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {review.createdAt}
                        </p>
                      </div>

                      {canDeleteReview(review) && (
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                          onClick={() => handleDeleteReview(review.id)}
                          disabled={deletingReviewId === review.id}
                        >
                          <span className="material-icons-round text-[16px]">
                            delete
                          </span>
                          <span className="hidden sm:inline">
                            {deletingReviewId === review.id
                              ? "Eliminando..."
                              : "Eliminar"}
                          </span>
                        </button>
                      )}
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {review.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarbershopProfile;
