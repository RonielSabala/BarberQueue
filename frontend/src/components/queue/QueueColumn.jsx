function QueueColumn({ barber }) {

  return (
    <div
      style={{
        background: "#d6e6e8",
        padding: "20px",
        borderRadius: "10px",
        minWidth: "200px"
      }}
    >

      <h3>{barber.name}</h3>
      <hr />

      {barber.current && (
        <div
          style={{
            background: "#c8f5c8",
            border: "2px solid green",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "12px",
            textAlign: "center"
          }}
        >
          Atendiendo: {barber.current}
        </div>
      )}

      {barber.queue.length === 0 && (
        <p>Sin clientes</p>
      )}

      {barber.queue.map((client, index) => (

        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            gap: "8px"
          }}
        >

          <span
            style={{
              background: "#4da3ff",
              color: "white",
              borderRadius: "4px",
              padding: "2px 6px",
              fontSize: "12px"
            }}
          >
            {index + 1}
          </span>

          <span>{client}</span>

        </div>

      ))}

    </div>
  );
}

export default QueueColumn;
