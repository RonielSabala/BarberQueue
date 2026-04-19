import { Navigate, Outlet } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (token && user) {
    let redirectPath = "/";
    if (user.role === "client") redirectPath = "/client/home";
    else if (user.role === "barber") redirectPath = "/barber/home";
    else if (user.role === "assistant") redirectPath = "/assistant/home";
    else if (user.role === "admin") redirectPath = "/admin/home";

    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default PublicRoute;
