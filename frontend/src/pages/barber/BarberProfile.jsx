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

        if (!barberId) {
          setReviewError("No se encontró el barbero autenticado.");
          return;
        }

        const data = await getBarberReviews(barberId);
        setReviews(data);
      } catch (err) {
        console.error("Error al cargar reseñas del barbero:", err);
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
    if (status === "inactive") return "inactive";
    return "inactive";
  };

  const renderStars = (rating) => {
    const safeRating = Math.max(0, Math.min(5, Math.round(rating || 0)));
    return "⭐".repeat(safeRating);
  };

  const handleStartShift = () => {
    navigate("/barber/dashboard");
  };

  if (loading) {
    return (
      <div className="barber-profile-page">
        <p>Cargando perfil...</p>
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
        <p>No se encontró el perfil del barbero.</p>
      </div>
    );
  }

  return (
    <div className="barber-profile-page">
      <div className="barber-profile-card">
        <div className="barber-profile-main">
          <div className="barber-profile-avatar-section">
            <div className="barber-profile-avatar">
              <span className="material-icons-round">face</span>
            </div>
          </div>

          <div className="barber-profile-info-section">
            <h1 className="barber-profile-name">{barber.username}</h1>

            <div className="barber-profile-status-row">
              <span
                className={`barber-status-pill ${getStatusClass(
                  barber.currentStatus,
                )}`}
              >
                {getStatusLabel(barber.currentStatus)}
              </span>

              <span
                className={`barber-accepting-pill ${
                  barber.isAccepting ? "accepting" : "not-accepting"
                }`}
              >
                {barber.isAccepting
                  ? "Aceptando clientes"
                  : "No acepta clientes"}
              </span>
            </div>

            <div className="barber-profile-details-card">
              <p>
                <strong>ID:</strong> {barber.id}
              </p>
              <p>
                <strong>Nombre:</strong> {barber.username}
              </p>
              <p>
                <strong>Estado actual:</strong>{" "}
                {getStatusLabel(barber.currentStatus)}
              </p>
              <p>
                <strong>Disponibilidad:</strong>{" "}
                {barber.isAccepting
                  ? "Aceptando clientes"
                  : "No acepta clientes"}
              </p>
            </div>

            <div className="barber-profile-actions">
              <button className="start-shift-btn" onClick={handleStartShift}>
                Iniciar jornada
              </button>
            </div>
          </div>
        </div>

        <div className="barber-reviews-section">
          <h2 className="barber-reviews-title">Reseñas del barbero</h2>

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
                      <p className="barber-review-date">{review.createdAt}</p>
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
