import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

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
import BarberDashboard from "../pages/barber/BarberDasboard";

//assistant
import RegisterClientsForm from "../pages/assistant/RegisterClientsForm";
import AssistantProfile from "../pages/assistant/AssistantProfile";

function AppRoutes() {
  return (
    <Routes>
      {/* LANDING */}
      <Route path="/" element={<Landing />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* APP (con layout) */}
      <Route element={<MainLayout />}>
        {/*Client*/}
        <Route path="/client/home" element={<ClientHome />} />
        <Route path="/client/profile" element={<ClientProfile />} />

        {/*Barbershop*/}
        <Route path="/barbershops/:id" element={<BarbershopProfile />} />
        <Route path="/barbershops/:id/queue" element={<QueueLive />} />

        {/*Admin*/}
        <Route path="/admin/home" element={<AdminHome />} />
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

        {/*Barber*/}
        <Route path="/barber/profile" element={<BarberProfile />} />
        <Route path="/barber/dashboard" element={<BarberDashboard />} />

        {/*Assistant*/}
        <Route path="/assistant/home" element={<AssistantHome />} />
        <Route
          path="/assistant/register-client"
          element={<RegisterClientsForm />}
        />
        <Route path="/assistant/profile" element={<AssistantProfile />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  );
}

export default AppRoutes;
