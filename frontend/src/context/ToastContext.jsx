import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    ({ message, type = "error", duration = 4000 }) => {
      const id = ++_id;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const success = useCallback(
    (message, duration) => show({ message, type: "success", duration }),
    [show],
  );
  const error = useCallback(
    (message, duration) => show({ message, type: "error", duration }),
    [show],
  );
  const info = useCallback(
    (message, duration) => show({ message, type: "info", duration }),
    [show],
  );

  return (
    <ToastContext.Provider value={{ show, success, error, info, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ── Estilos por tipo ───────────────────────────────────────────────────────
const STYLES = {
  success: {
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-800",
    icon: "check_circle",
    iconColor: "text-emerald-500",
  },
  error: {
    bg: "bg-red-50 border-red-200",
    text: "text-red-800",
    icon: "error",
    iconColor: "text-red-500",
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-800",
    icon: "info",
    iconColor: "text-blue-500",
  },
};

// ── Contenedor de toasts ───────────────────────────────────────────────────
function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({ toast, onDismiss }) {
  const s = STYLES[toast.type] || STYLES.info;
  return (
    <div
      className={`pointer-events-auto w-full flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg ${s.bg} ${s.text} animate-in fade-in slide-in-from-bottom-2 duration-200`}
    >
      <span
        className={`material-icons-round text-[20px] shrink-0 ${s.iconColor}`}
      >
        {s.icon}
      </span>
      <p className="text-sm font-semibold flex-1 text-center">
        {toast.message}
      </p>
      <button
        onClick={() => onDismiss(toast.id)}
        className={`shrink-0 opacity-50 hover:opacity-100 transition-opacity ${s.text}`}
      >
        <span className="material-icons-round text-[18px]">close</span>
      </button>
    </div>
  );
}
