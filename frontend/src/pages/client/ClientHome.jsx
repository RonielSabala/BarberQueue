import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ margin: 0 }}>BarberQueue</h1>

        <Link
          to="/client/profile"
          style={{
            textDecoration: "none",
            backgroundColor: "#f59e0b",
            color: "white",
            padding: "10px 18px",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          Ir a mi perfil
        </Link>
      </div>

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
