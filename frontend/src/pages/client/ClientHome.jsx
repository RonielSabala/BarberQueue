import { useEffect, useState } from "react";
import { getBarbershops } from "../../services/barbershopService";
import BarbershopCard from "../../components/BarbershopCard";

function ClientHome() {
  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        setError("");

        const filters = {};

        if (search.trim()) {
          filters.search = search.trim();
        }

        if (filter === "open") {
          filters.isOpen = true;
        } else if (filter === "closed") {
          filters.isOpen = false;
        }

        const data = await getBarbershops(filters);
        setShops(data);
      } catch (err) {
        console.error("Error al obtener barberías:", err);
        setError(err.message || "Error al cargar las barberías");
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [search, filter]);

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>BarberQueue</h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar barbería 🔎"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "300px",
            padding: "10px",
            borderRadius: "20px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Todas</option>
          <option value="open">Abiertas</option>
          <option value="closed">Cerradas</option>
        </select>
      </div>

      {loading && (
        <p style={{ textAlign: "center", marginTop: "30px" }}>
          Cargando barberías...
        </p>
      )}

      {error && (
        <p style={{ textAlign: "center", marginTop: "30px", color: "red" }}>
          {error}
        </p>
      )}

      {!loading && !error && shops.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "30px" }}>
          No se encontraron barberías.
        </p>
      )}

      {!loading && !error && shops.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {shops.map((shop) => (
            <BarbershopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientHome;
