import { createContext, useContext, useState } from "react";

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [barbers, setBarbers] = useState([
    {
      id: 1,
      name: "Barbero Juan",
      status: "active",
      current: "Pedro",
      queue: ["Luis", "Carlos"],
    },
    {
      id: 2,
      name: "Barbero Pedro",
      status: "active",
      current: "Andres",
      queue: ["David"],
    },
    {
      id: 3,
      name: "Barbero Jose",
      status: "resting",
      current: null,
      queue: [],
    },
  ]);

  const addClient = (barberId, clientName) => {
    const updatedBarbers = barbers.map((barber) => {
      if (barber.id === barberId) {
        return {
          ...barber,
          queue: [...barber.queue, clientName],
        };
      }

      return barber;
    });

    setBarbers(updatedBarbers);
  };

  const finishService = (barberId) => {
    const updatedBarbers = barbers.map((barber) => {
      if (barber.id === barberId) {
        if (barber.queue.length === 0) {
          return {
            ...barber,
            current: null,
          };
        }

        return {
          ...barber,
          current: barber.queue[0],
          queue: barber.queue.slice(1),
        };
      }

      return barber;
    });

    setBarbers(updatedBarbers);
  };

  return (
    <QueueContext.Provider
      value={{
        barbers,
        addClient,
        finishService,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => useContext(QueueContext);
