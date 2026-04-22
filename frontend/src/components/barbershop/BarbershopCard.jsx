import { useNavigate } from "react-router-dom";

const fallbackImage = "https://via.placeholder.com/400x200?text=Barberia";

function BarbershopCard({ shop }) {
  const navigate = useNavigate();
  const isOpen = shop.isActive ?? shop.open ?? false;

  return (
    <div
      onClick={() => navigate(`/barbershops/${shop.id}`)}
      className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Imagen */}
      <img
        src={shop.image || fallbackImage}
        alt={shop.name}
        onError={(e) => {
          e.target.src = fallbackImage;
        }}
        className="w-full h-[150px] object-cover bg-slate-100"
      />

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-bold text-lg text-slate-900 leading-snug mb-2 line-clamp-2"
          title={shop.name}
        >
          {shop.name}
        </h3>

        <p className="text-sm text-slate-500 mb-1">
          ⭐ {shop.rating ?? "Sin rating"}
        </p>

        <p
          className={`text-sm font-bold mb-4 ${isOpen ? "text-green-600" : "text-red-500"}`}
        >
          {isOpen ? "Abierta" : "Cerrada"}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/barbershops/${shop.id}/queue`);
          }}
          className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors text-sm shadow-sm"
        >
          <span className="material-icons-round text-red-500 text-[16px]">
            sensors
          </span>
          Ver cola en vivo
        </button>
      </div>
    </div>
  );
}

export default BarbershopCard;
