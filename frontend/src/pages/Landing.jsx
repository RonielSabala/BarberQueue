import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/landing.css";

function Landing() {
  return (
    <div className="lp">
      {/* ─── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="lp-nav">
        <Link to="/">
          <img src={logo} alt="BarberQueue" className="lp-nav-logo" />
        </Link>
        <Link to="/login" className="lp-nav-btn">
          Iniciar sesión
        </Link>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <img src={logo} alt="BarberQueue" className="lp-hero-logo" />

          <div className="lp-hero-badge">
            <span className="lp-hero-badge-dot"></span>
            Cola en tiempo real · Sin filas · Sin esperas
          </div>

          <h1 className="lp-hero-title">
            Gestiona tu tiempo.
            <br />
            <span className="lp-hero-title-accent">Olvida las filas.</span>
          </h1>

          <p className="lp-hero-subtitle-line">La barbería del futuro.</p>

          <p className="lp-hero-desc">
            BarberQueue digitaliza la experiencia en barberías. Consulta la cola
            en tiempo real, toma tu turno y ahorra tiempo sin moverte de casa.
          </p>

          <div className="lp-hero-actions">
            <Link to="/login" className="lp-btn-primary">
              Iniciar sesión
            </Link>
            <Link to="/register" className="lp-btn-secondary">
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CÓMO FUNCIONA ───────────────────────────────────────────────────── */}
      <section className="lp-section lp-how">
        <div className="lp-section-inner">
          <div className="lp-how-header">
            <span className="lp-section-label">Proceso simple</span>
            <h2 className="lp-section-title">¿Cómo funciona?</h2>
            <p className="lp-section-desc">
              En tres pasos tienes tu turno reservado y puedes llegar justo a
              tiempo a tu corte.
            </p>
          </div>

          <div className="lp-steps">
            <div className="lp-step">
              <div className="lp-step-number">1</div>
              <p className="lp-step-title">Regístrate o inicia sesión</p>
              <p className="lp-step-desc">
                Crea tu cuenta en segundos. Solo necesitas tu correo y una
                contraseña.
              </p>
            </div>

            <div className="lp-step">
              <div className="lp-step-number">2</div>
              <p className="lp-step-title">Elige tu barbería y barbero</p>
              <p className="lp-step-desc">
                Consulta la cola en tiempo real y selecciona el barbero de tu
                preferencia.
              </p>
            </div>

            <div className="lp-step">
              <div className="lp-step-number">3</div>
              <p className="lp-step-title">Llega justo a tiempo</p>
              <p className="lp-step-desc">
                Sigue tu posición en la cola y llega a la barbería cuando sea
                casi tu turno.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PARA CLIENTES / BARBERÍAS ───────────────────────────────────────── */}
      <section className="lp-section lp-roles">
        <div className="lp-section-inner">
          <span className="lp-section-label">
            Una plataforma, dos soluciones
          </span>
          <h2 className="lp-section-title">Diseñado para todos</h2>
          <p className="lp-section-desc">
            Tanto si eres cliente como si administras una barbería, BarberQueue
            tiene todo lo que necesitas.
          </p>

          <div className="lp-roles-grid">
            {/* Para clientes */}
            <div className="lp-role-card">
              <div className="lp-role-card-header">
                <div className="lp-role-icon blue">👤</div>
                <div>
                  <p className="lp-role-card-title">Para clientes</p>
                  <p className="lp-role-card-sub">
                    Ahorra tiempo en cada visita
                  </p>
                </div>
              </div>

              <div className="lp-features">
                <div className="lp-feature">
                  <div className="lp-feature-icon">⏱️</div>
                  <div>
                    <p className="lp-feature-title">Cola en tiempo real</p>
                    <p className="lp-feature-desc">
                      Ve exactamente cuántas personas están antes que tú.
                    </p>
                  </div>
                </div>

                <div className="lp-feature">
                  <div className="lp-feature-icon">✂️</div>
                  <div>
                    <p className="lp-feature-title">Elige tu barbero</p>
                    <p className="lp-feature-desc">
                      Selecciona el barbero de tu preferencia al entrar a la
                      cola.
                    </p>
                  </div>
                </div>

                <div className="lp-feature">
                  <div className="lp-feature-icon">👥</div>
                  <div>
                    <p className="lp-feature-title">Turnos en grupo</p>
                    <p className="lp-feature-desc">
                      Registra a toda tu familia o amigos en un solo turno.
                    </p>
                  </div>
                </div>

                <div className="lp-feature">
                  <div className="lp-feature-icon">⏸️</div>
                  <div>
                    <p className="lp-feature-title">Sal y vuelve</p>
                    <p className="lp-feature-desc">
                      Pausa tu turno temporalmente sin perder tu posición.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Para barberías */}
            <div className="lp-role-card">
              <div className="lp-role-card-header">
                <div className="lp-role-icon navy">🏪</div>
                <div>
                  <p className="lp-role-card-title">Para barberías</p>
                  <p className="lp-role-card-sub">
                    Gestiona tu negocio con eficiencia
                  </p>
                </div>
              </div>

              <div className="lp-features">
                <div className="lp-feature">
                  <div className="lp-feature-icon">📊</div>
                  <div>
                    <p className="lp-feature-title">Dashboard en tiempo real</p>
                    <p className="lp-feature-desc">
                      Visualiza clientes, colas y métricas de tu barbería.
                    </p>
                  </div>
                </div>

                <div className="lp-feature">
                  <div className="lp-feature-icon">💈</div>
                  <div>
                    <p className="lp-feature-title">Gestión de barberos</p>
                    <p className="lp-feature-desc">
                      Administra el estado y disponibilidad de tu equipo.
                    </p>
                  </div>
                </div>

                <div className="lp-feature">
                  <div className="lp-feature-icon">🤝</div>
                  <div>
                    <p className="lp-feature-title">Asistente de registro</p>
                    <p className="lp-feature-desc">
                      El assistant registra clientes y grupos desde la barbería.
                    </p>
                  </div>
                </div>

                <div className="lp-feature">
                  <div className="lp-feature-icon">⭐</div>
                  <div>
                    <p className="lp-feature-title">Reseñas y ratings</p>
                    <p className="lp-feature-desc">
                      Recibe feedback de clientes y mejora tu reputación.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── POR QUÉ BARBERQUEUE ─────────────────────────────────────────────── */}
      <section className="lp-section lp-why">
        <div className="lp-section-inner">
          <div className="lp-why-header">
            <span className="lp-section-label">Ventajas</span>
            <h2 className="lp-section-title">¿Por qué BarberQueue?</h2>
            <p className="lp-section-desc">
              Una solución pensada para que clientes y barberías ganen tiempo y
              mejoren su experiencia.
            </p>
          </div>

          <div className="lp-why-grid">
            <div className="lp-why-card">
              <span className="lp-why-emoji">⚡</span>
              <p className="lp-why-title">Ahorra tiempo</p>
              <p className="lp-why-desc">
                Olvídate de esperar sentado. Sigue tu turno desde donde quieras
                y llega justo cuando te toque.
              </p>
            </div>

            <div className="lp-why-card">
              <span className="lp-why-emoji">📱</span>
              <p className="lp-why-title">Fácil de usar</p>
              <p className="lp-why-desc">
                Interfaz intuitiva pensada para cualquier persona. Sin
                descargas, sin complicaciones.
              </p>
            </div>

            <div className="lp-why-card">
              <span className="lp-why-emoji">📈</span>
              <p className="lp-why-title">Mejor experiencia</p>
              <p className="lp-why-desc">
                Barberías más organizadas, clientes más satisfechos y barberos
                más productivos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ───────────────────────────────────────────────────────── */}
      <section className="lp-cta">
        <div className="lp-cta-inner">
          <h2 className="lp-cta-title">
            Listo para olvidar
            <br />
            <span>las filas?</span>
          </h2>
          <p className="lp-cta-desc">
            Únete a BarberQueue y transforma la experiencia en tu barbería
            favorita hoy mismo.
          </p>
          <Link to="/login" className="lp-cta-btn">
            Comenzar ahora →
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="lp-footer">
        <img src={logo} alt="BarberQueue" className="lp-footer-logo" />
        <p className="lp-footer-text">
          © {new Date().getFullYear()} BarberQueue · Todos los derechos
          reservados
        </p>
      </footer>
    </div>
  );
}

export default Landing;
