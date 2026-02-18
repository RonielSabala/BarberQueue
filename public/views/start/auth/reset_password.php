<div class="login-container">
    <div class="login-left">
        <div class="brand-container">
            <img src="/assets/images/logo.png" alt="BarberQueue Logo" class="logo" />
            <p class="brand-tagline">
                Establece tu nueva contraseña.
            </p>
        </div>
    </div>
    <div class="login-right">
        <form class="login-form" method="POST">
            <h2>Restablecer contraseña</h2>
            <input type="password" placeholder="Contraseña actual" name="currentPassword" required />
            <input type="password" placeholder="Nueva contraseña" name="newPassword" required />
            <input type="password" placeholder="Confirmar nueva contraseña" name="confirmPassword" required />
            <div id="message"></div>
            <button type="submit">Actualizar contraseña</button>
            <p>
                <a href="login.php">Volver al inicio de sesión</a>
            </p>
        </form>
    </div>
</div>
