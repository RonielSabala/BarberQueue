import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBarberById, getBarberReviews } from "../../services/barberService";
import "../../styles/barber/BarberProfile.css";

function BarberProfile() {
  const navigate = useNavigate();

  const [barber, setBarber] = useState(null);
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

        const data = await getBarberById(barberId);
        setBarber(data);
      } catch (err) {
        console.error("Error al cargar perfil del barbero:", err);
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
        setReviewError("");

        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        const barberId = storedUser?.id;

        if (!barberId) return;

        const data = await getBarberReviews(barberId);
        setReviews(data);
      } catch (err) {
        console.error("Error al cargar reseñas:", err);
        setReviewError(err.message || "Error al cargar las reseñas");
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const getStatusLabel = (status) => {
    if (status === "active") return "Activo";
    if (status === "resting") return "Descansando";
    if (status === "inactive") return "Inactivo";
    return status || "Sin estado";
  };

  const getStatusClass = (status) => {
    if (status === "active") return "active";
    if (status === "resting") return "resting";
    return "inactive";
  };

  const renderStars = (rating) => {
    const safe = Math.max(0, Math.min(5, Math.round(rating || 0)));
    return "⭐".repeat(safe);
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
      <div className="barber-profile-page">
        <p style={{ color: "#7c839e" }}>Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="barber-profile-page">
        <div className="barber-profile-alert error">{error}</div>
      </div>
    );
  }

  if (!barber) {
    return (
      <div className="barber-profile-page">
        <p style={{ color: "#7c839e" }}>
          No se encontró el perfil del barbero.
        </p>
      </div>
    );
  }

  const statusClass = getStatusClass(barber.currentStatus);

  return (
    <div className="barber-profile-page">
      <div className="barber-profile-card">
        {/* ─── Hero ─────────────────────────────────────────────────────────── */}
        <div className="barber-profile-hero">
          {/* Avatar */}
          <div className="barber-profile-avatar-section">
            <div className="barber-profile-avatar">
              <span className="material-icons-round">face</span>
              <div className={`barber-avatar-status-dot ${statusClass}`} />
            </div>
          </div>

          {/* Info */}
          <div className="barber-profile-info-section">
            <h1 className="barber-profile-name">{barber.username}</h1>

            <div className="barber-profile-status-row">
              <span className={`barber-status-pill ${statusClass}`}>
                {getStatusLabel(barber.currentStatus)}
              </span>
              <span
                className={`barber-accepting-pill ${barber.isAccepting ? "accepting" : "not-accepting"}`}
              >
                {barber.isAccepting
                  ? "Aceptando clientes"
                  : "No acepta clientes"}
              </span>
            </div>

            <div className="barber-profile-details-card">
              <div className="barber-detail-item">
                <span className="barber-detail-label">ID</span>
                <span className="barber-detail-value">#{barber.id}</span>
              </div>
              <div className="barber-detail-item">
                <span className="barber-detail-label">Nombre</span>
                <span className="barber-detail-value">{barber.username}</span>
              </div>
              <div className="barber-detail-item">
                <span className="barber-detail-label">Estado</span>
                <span className="barber-detail-value">
                  {getStatusLabel(barber.currentStatus)}
                </span>
              </div>
              <div className="barber-detail-item">
                <span className="barber-detail-label">Disponibilidad</span>
                <span className="barber-detail-value">
                  {barber.isAccepting ? "Aceptando" : "No acepta"}
                </span>
              </div>
            </div>

            <div className="barber-profile-actions">
              <button
                className="start-shift-btn"
                onClick={() => navigate("/barber/dashboard")}
              >
                <span className="material-icons-round" style={{ fontSize: 18 }}>
                  content_cut
                </span>
                Iniciar jornada
              </button>
            </div>
          </div>
        </div>

        {/* ─── Reviews ──────────────────────────────────────────────────────── */}
        <div className="barber-reviews-section">
          <h2 className="barber-reviews-title">
            Reseñas {reviews.length > 0 && <span>({reviews.length})</span>}
          </h2>

          {reviewError && (
            <div className="barber-profile-alert error">{reviewError}</div>
          )}

          {reviewsLoading ? (
            <div className="barber-empty-card">Cargando reseñas...</div>
          ) : reviews.length === 0 ? (
            <div className="barber-empty-card">
              Aún no hay reseñas para este barbero.
            </div>
          ) : (
            <div className="barber-reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="barber-review-card">
                  <div className="barber-review-header">
                    <div>
                      <p className="barber-review-user">{review.username}</p>
                      <p className="barber-review-date">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                    <div className="barber-review-stars">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="barber-review-content">{review.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BarberProfile;
