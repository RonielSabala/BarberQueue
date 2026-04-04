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
                  <label>Calificación</label>
                  <select
                    name="rating"
                    value={reviewForm.rating}
                    onChange={handleReviewChange}
                    className="barbershop-input"
                  >
                    <option value={5}>5 estrellas</option>
                    <option value={4}>4 estrellas</option>
                    <option value={3}>3 estrellas</option>
                    <option value={2}>2 estrellas</option>
                    <option value={1}>1 estrella</option>
                  </select>
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
              <div className="barbershop-empty-card">Cargando reseñas...</div>
            ) : reviews.length === 0 ? (
              <div className="barbershop-empty-card">
                Aún no hay reseñas para esta barbería.
              </div>
            ) : (
              <div className="barbershop-reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="barbershop-review-card">
                    <div className="barbershop-review-header">
                      <div>
                        <p className="barbershop-review-user">
                          {review.username}
                        </p>
                        <p className="barbershop-review-date">
                          {review.createdAt}
                        </p>
                      </div>

                      <div className="barbershop-review-header-right">
                        <div className="barbershop-review-stars">
                          {renderStars(review.rating)}
                        </div>

                        {canDeleteReview(review) && (
                          <button
                            className="barbershop-delete-review-btn"
                            onClick={() => handleDeleteReview(review.id)}
                            disabled={deletingReviewId === review.id}
                          >
                            {deletingReviewId === review.id
                              ? "Eliminando..."
                              : "Eliminar"}
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="barbershop-review-content">
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
