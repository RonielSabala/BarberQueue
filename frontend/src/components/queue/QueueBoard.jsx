function BarbershopQueue() {

 const role = user.role

 return (
   <div>

     <QueueBoard />

     {role === "assistant" && (
       <RegisterClientForm />
     )}

   </div>
 )

}


{/* COLAS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "30px"
          }}
        >

          {barbers.map((barber) => (

            <div
              key={barber.id}
              style={{
                background: "#dfeeee",
                padding: "20px",
                borderRadius: "10px",
                textAlign: "center"
              }}
            >


              <div
                style={{
                  border: "1px solid #70c3c3",
                  borderRadius: "4px",
                  padding: "6px",
                  marginBottom: "20px",
                  background: "#ffffff"
                }}
              >
                Barbero {barber.name}


              </div>

              {barber.current && (

                <div
                  style={{
                    background: "#d4f8d4",
                    border: "2px solid green",
                    padding: "8px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    fontWeight: "bold"
                  }}
                >
                  Atendiendo: {barber.current}
                </div>

              )}

              {barber.queue.map((client, index) => (

                <div
                  key={index}
                  style={{
                    minWidth: "120px",
                    padding: "8px 12px",
                    borderRadius: "20px",
                    border: "1px solid #777",
                    margin: "8px auto",
                    background: "#dfeeee"
                  }}
                >
                  {index + 1}. {client}
                </div>

              ))}

            </div>

          ))}

        </div>
