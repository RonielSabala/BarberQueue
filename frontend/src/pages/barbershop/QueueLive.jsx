import { useParams } from "react-router-dom";
import { useQueue } from "../../context/QueueContext";
import QueueColumn from "../../components/queue/QueueColumn";

function QueueLive() {

  const { id } = useParams();
  const { barbers } = useQueue();

  const activeBarbers = barbers.filter((b) => b.status === "active");
  const restingBarbers = barbers.filter((b) => b.status === "resting");

  return (
    <div style={{ padding: "30px" }}>

      <h1>Cola en tiempo real</h1>
      <p>Barbería ID: {id}</p>

      <hr />

      <div
        style={{
          display: "flex",
          gap: "40px",
          alignItems: "flex-start"
        }}
      >

        {/* COLUMNAS DE BARBEROS */}
        {activeBarbers.map((barber) => (
          <QueueColumn
            key={barber.id}
            barber={barber}
          />
        ))}

        {/* BARBEROS DESCANSANDO */}
        <div style={{ minWidth: "200px" }}>

          <h3>Barberos descansando</h3>
          <hr />

          {restingBarbers.length === 0 && (
            <p>Ninguno</p>
          )}

          {restingBarbers.map((barber) => (
            <div key={barber.id}>
              💈 {barber.name} (Descansando)
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default QueueLive;
