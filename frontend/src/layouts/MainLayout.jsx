import { useState } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  const user = userString
    ? JSON.parse(userString)
    : { username: "Usuario", role: "client" };
  const userInitial = user.username
    ? user.username.charAt(0).toUpperCase()
    : "U";

  // Efecto dinámico para notificación (falso por ahora como pide la tarea)
  const hasNotifications = false;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Rutas dinámicas para la cabecera
  const getPageTitle = (pathname) => {
    if (pathname.includes("dashboard")) return "Dashboard";
    if (pathname.includes("profile")) return "Perfil";
    if (pathname.includes("employees")) return "Empleados";
    if (pathname.includes("barbershop")) return "Barberías";
    if (pathname.includes("home")) return "Inicio";
    if (pathname.includes("queue")) return "Fila Virtual";
    return "Panel Central";
  };

  // Menú dinámico basado en el rol del usuario conectado
  const getNavItems = () => {
    const items = [];

    if (user.role === "admin") {
      items.push({ name: "Inicio", path: "/admin/home", icon: "home" });
      items.push({ name: "Perfil", path: "/admin/profile", icon: "person" });
      // Petición: Admin "quitar el apartado de dashboard y configuracion" en el sidebar
    } else if (user.role === "client") {
      items.push({ name: "Inicio", path: "/client/home", icon: "home" });
      items.push({ name: "Perfil", path: "/client/profile", icon: "person" });
    } else if (user.role === "barber") {
      items.push({
        name: "Dashboard",
        path: "/barber/dashboard",
        icon: "dashboard",
      });
      items.push({ name: "Perfil", path: "/barber/profile", icon: "person" });
    } else if (user.role === "assistant") {
      items.push({ name: "Inicio", path: "/assistant/home", icon: "home" });
      items.push({
        name: "Registrar",
        path: "/assistant/register-client",
        icon: "person_add",
      });
    }
    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-2 text-white">
            {/* Se removió la palabra BarberQueue y se dejó un ícono llamativo */}
            <span className="material-icons-round text-primary shadow-sm bg-white/10 p-2 rounded-xl">
              content_cut
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mb-8 ml-1 mt-4">
            Gestión de turnos
          </p>

          <nav>
            <ul className="space-y-3">
              {navItems.map((item) => {
                const isActive = location.pathname.includes(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                        isActive
                          ? "bg-primary/20 text-primary shadow-inner font-semibold"
                          : "hover:bg-slate-800 hover:text-white font-medium"
                      }`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span className="material-icons-round">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="mt-auto p-6 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl mb-4 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 transition-colors font-medium border border-transparent hover:border-red-500/30"
          >
            <span className="material-icons-round text-sm">logout</span>
            <span className="text-sm font-semibold">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* NAVBAR SUPERIOR */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
              onClick={() => setIsSidebarOpen(true)}
            >
              <span className="material-icons-round">menu_open</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-500">
              <span className="material-icons-round text-sm">home</span>
              <span className="material-icons-round text-xs">
                chevron_right
              </span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold text-[15px]">
                {getPageTitle(location.pathname)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
              <span className="material-icons-round">notifications</span>
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
              )}
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

            <div className="relative">
              <div
                className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {userInitial}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block group-hover:text-primary transition-colors">
                  {user.username || "Usuario"}
                </span>
                <span
                  className={`material-icons-round text-slate-400 text-sm hidden sm:block transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                >
                  expand_more
                </span>
              </div>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 transform origin-top-right transition-all">
                    <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 mb-2">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                        Conectado como
                      </p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                        {user.username || "Usuario"}
                      </p>
                      <p className="text-xs text-slate-400 font-medium capitalize mt-0.5">
                        {user.role}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors font-semibold"
                    >
                      <span className="material-icons-round text-[18px]">
                        logout
                      </span>
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* CONTENIDO DINÁMICO */}
        <main className="flex-1 w-full relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
