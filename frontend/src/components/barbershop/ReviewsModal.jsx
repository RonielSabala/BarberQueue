function ReviewsModal({ reviews, onClose }) {
  if (!reviews) return null;

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

  const renderStars = (rating) => {
    const n = Math.max(0, Math.min(5, Math.round(rating || 0)));
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < n ? "text-amber-400" : "text-slate-200"}>
        ★
      </span>
    ));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-800">Reseñas</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {reviews.length} reseña{reviews.length !== 1 ? "s" : ""} en total
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

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <span className="material-icons-round text-4xl mb-2 opacity-30">
                rate_review
              </span>
              <p className="text-sm">Aún no hay reseñas.</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-100"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <span className="material-icons-round text-slate-400 text-[16px]">
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
                  <div className="flex gap-0.5 text-base shrink-0">
                    {renderStars(review.rating)}
                  </div>
                </div>
                {review.content && (
                  <p className="text-sm text-slate-500 leading-relaxed pl-[42px]">
                    {review.content}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewsModal;
