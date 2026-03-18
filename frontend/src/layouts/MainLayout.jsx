import { useState } from "react";
import { Outlet } from "react-router-dom";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-2 text-white">
            {/* <span className="material-icons-round text-primary">content_cut</span> */}
            BarberQueue
          </h2>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mb-8 ml-1">
            Sistema de Gestión
          </p>

          <nav>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 rounded-xl bg-primary/20 text-primary cursor-pointer transition-colors shadow-inner">
                <span className="material-icons-round">dashboard</span>
                <span className="font-semibold">Dashboard</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 hover:text-white cursor-pointer transition-colors">
                <span className="material-icons-round">storefront</span>
                <span className="font-medium">Barberías</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 hover:text-white cursor-pointer transition-colors">
                <span className="material-icons-round">person</span>
                <span className="font-medium">Perfil</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 hover:text-white cursor-pointer transition-colors">
                <span className="material-icons-round">settings</span>
                <span className="font-medium">Configuración</span>
              </li>
            </ul>
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="mt-auto p-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
              <span className="material-icons-round text-sm">
                support_agent
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Soporte</p>
              <p className="text-xs text-slate-500">v1.0.2</p>
            </div>
          </div>
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
              <span className="text-slate-800 dark:text-slate-200">
                Panel Central
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
              <span className="material-icons-round">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

            <div className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-md">
                U
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block group-hover:text-primary transition-colors">
                Usuario
              </span>
              <span className="material-icons-round text-slate-400 text-sm hidden sm:block">
                expand_more
              </span>
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
