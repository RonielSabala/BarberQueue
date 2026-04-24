import AppRoutes from "./routes/AppRoutes.jsx";
import { QueueProvider } from "./context/QueueContext";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ToastProvider>
      <QueueProvider>
        <AppRoutes />
      </QueueProvider>
    </ToastProvider>
  );
}

export default App;
