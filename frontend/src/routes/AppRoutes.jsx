import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/routes/ProtectedRoute";

import PublicRoute from "../components/routes/PublicRoute";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ResetPassword from "../pages/auth/ResetPassword";
import ForgotPassword from "../pages/auth/ForgotPassword";

// Public
import Landing from "../pages/Landing";

// System
import ClientHome from "../pages/client/ClientHome";
import AdminHome from "../pages/admin/AdminHome";
import AssistantHome from "../pages/assistant/AssistantHome";
import BarberHome from "../pages/barber/BarberHome";

// MainLayout
import BarbershopProfile from "../pages/barbershop/BarbershopProfile";
import QueueLive from "../pages/barbershop/QueueLive";

//admin
import AdminBarbershop from "../pages/admin/AdminBarbershop";
import AdminEmployees from "../pages/admin/AdminEmployees";
import AdminEmployeeForm from "../pages/admin/AdminEmployeeForm";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminCreateBarbershop from "../pages/admin/AdminCreateBarbershop";

//client
import ClientProfile from "../pages/client/ClientProfile";

//barber
import BarberProfile from "../pages/barber/BarberProfile";
import BarberWorkspace from "../pages/barber/BarberWorkspace";

//assistant
import RegisterClientsForm from "../pages/assistant/RegisterClientsForm";
import AssistantProfile from "../pages/assistant/AssistantProfile";

//Google authentication
import AuthCallback from "../pages/auth/AuthCallback";

//404 ERROR
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        {/* LANDING */}
        <Route path="/" element={<Landing />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* APP (con layout) */}
      <Route element={<MainLayout />}>
        {/*Client*/}
        <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
          <Route path="/client/home" element={<ClientHome />} />
          <Route path="/client/profile" element={<ClientProfile />} />
        </Route>

        {/*Barbershop (Public/Shared inside App)*/}
        <Route path="/barbershops/:id" element={<BarbershopProfile />} />
        <Route path="/barbershops/:id/queue" element={<QueueLive />} />

        {/*Admin*/}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/profile" element={<ClientProfile />} />
          <Route path="/admin/barbershop/:id" element={<AdminBarbershop />} />
          <Route
            path="/admin/barbershop/:id/employees"
            element={<AdminEmployees />}
          />
          <Route
            path="/admin/barbershop/:id/employees/new"
            element={<AdminEmployeeForm />}
          />
          <Route
            path="/admin/barbershop/:id/employees/:employeeId/edit"
            element={<AdminEmployeeForm />}
          />
          <Route
            path="/admin/barbershop/:id/dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="/admin/barbershop/new"
            element={<AdminCreateBarbershop />}
          />
        </Route>

        {/*Barber*/}
        <Route element={<ProtectedRoute allowedRoles={["barber"]} />}>
          <Route path="/barber/home" element={<BarberHome />} />
          <Route path="/barber/profile" element={<BarberProfile />} />
          {/* Workspace dentro de una barbería específica */}
          <Route
            path="/barber/barbershop/:barbershopId/workspace"
            element={<BarberWorkspace />}
          />
        </Route>

        {/*Assistant*/}
        <Route element={<ProtectedRoute allowedRoles={["assistant"]} />}>
          <Route path="/assistant/home" element={<AssistantHome />} />
          <Route path="/assistant/profile" element={<AssistantProfile />} />
          {/* Cola en vivo y registro dentro de una barbería específica */}
          <Route
            path="/assistant/barbershop/:barbershopId/queue"
            element={<QueueLive />}
          />
          <Route
            path="/assistant/barbershop/:barbershopId/register-client"
            element={<RegisterClientsForm />}
          />
        </Route>
      </Route>

      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
