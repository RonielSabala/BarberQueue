import { useState, useEffect } from "react";
import { getBarbershops } from "../../services/barbershopService";
import BarbershopCard from "../../components/BarbershopCard";

function ClientHome() {
  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const data = getBarbershops();
    setShops(data);
  }, []);

  const filteredShops = shops.filter((shop) => {
    const matchesSearch = shop.name
      .toLowerCase()
      .includes(search.toLowerCase());

    if (filter === "open") return matchesSearch && shop.open;
    if (filter === "closed") return matchesSearch && !shop.open;

    return matchesSearch;
  });

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>BarberQueue</h1>

      {/* BUSCADOR */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search bar 🔎"
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

      {/* FILTROS */}
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Todas</option>
          <option value="open">Abiertas</option>
          <option value="closed">Cerradas</option>
        </select>
      </div>

      {/* GRID DE BARBERÍAS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredShops.map((shop) => (
          <BarbershopCard key={shop.id} shop={shop} />
        ))}
      </div>
    </div>
  );
}

export default ClientHome;
