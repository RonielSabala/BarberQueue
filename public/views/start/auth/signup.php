<div class="login-container">
    <div class="login-left">
        <div class="brand-container">
            <img src="/assets/images/logo.png" alt="BarberQueue Logo" class="logo" />
            <p class="brand-tagline">
                Gestiona tu tiempo. Olvida las filas.
            </p>
        </div>
    </div>
    <div class="login-right">
        <form class="login-form" method="POST" action="/signup">
            <h2>Crear Cuenta</h2>
            <input type="text" name="name" placeholder="Nombre completo" required />
            <input type="email" name="email" placeholder="Correo" required />
            <input type="password" name="password" placeholder="Contraseña" required />
            <button type="submit">Registrarse</button>
            <p>
                ¿Ya tienes cuenta?
                <a href="login">Iniciar sesión</a>
            </p>
        </form>
    </div>
</div>
