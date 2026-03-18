import AppRoutes from "./routes/AppRoutes.jsx";
import { QueueProvider } from "./context/QueueContext";

function App() {
  return (
    <QueueProvider>
      <AppRoutes />
    </QueueProvider>
  );
}

export default App;
