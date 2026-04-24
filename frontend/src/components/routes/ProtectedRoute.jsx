import { Navigate, Outlet } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    // Si no hay sesión iniciada, redirige al login
    return <Navigate to="/login" replace />;
  }

  // Verifica si el rol del usuario está permitido para esta ruta
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Determina a dónde redirigir en función de su rol real
    let redirectPath = "/";
    if (user.role === "client") redirectPath = "/client/home";
    else if (user.role === "barber") redirectPath = "/barber/home";
    else if (user.role === "assistant") redirectPath = "/assistant/home";
    else if (user.role === "admin") redirectPath = "/admin/home";

    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
