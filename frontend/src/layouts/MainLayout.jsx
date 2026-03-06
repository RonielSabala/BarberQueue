import { Outlet } from "react-router-dom";
import "../styles/mainLayout.css";

function MainLayout() {
  return (
    <div className="main-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">BarberQueue</h2>

        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Barberías</li>
            <li>Perfil</li>
            <li>Configuración</li>
          </ul>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="main-content">

        {/* NAVBAR SUPERIOR */}
        <header className="navbar">
          <h3>Panel</h3>
          <div className="user-info">
            <span>Usuario</span>
          </div>
        </header>

        {/* CONTENIDO DINÁMICO */}
        <main className="content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default MainLayout;
