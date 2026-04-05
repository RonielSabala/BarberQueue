function UserProfileCard({
  title = "Mi Perfil",
  subtitle = "Consulta y actualiza tu información personal.",
  user,
  error,
  successMessage,
  loading,
  saving,
  isEditing,
  isChangingPassword,
  formData,
  passwordData,
  onFieldChange,
  onPasswordFieldChange,
  onEditClick,
  onPasswordClick,
  onCancel,
  onSubmitProfile,
  onSubmitPassword,
  extraActions = null,
}) {
  if (error && !user && !loading) {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-2">Error al cargar el perfil</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <p className="text-slate-500 text-lg">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <p className="text-slate-500 text-lg">
            No se encontró información del usuario.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
          <p className="text-slate-500 mt-1">{subtitle}</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-bold shadow-sm mb-4">
              {user.username?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h2 className="text-2xl font-bold text-slate-800">
              {user.username}
            </h2>

            <p className="text-slate-500 mt-1 break-all">{user.email}</p>

            <span className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              Rol: {user.role}
            </span>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6">
              Información personal
            </h3>

            {!isEditing && !isChangingPassword && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">
                      Nombre de usuario
                    </p>
                    <p className="text-base font-semibold text-slate-800">
                      {user.username}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">
                      Correo electrónico
                    </p>
                    <p className="text-base font-semibold text-slate-800 break-all">
                      {user.email}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">Teléfono</p>
                    <p className="text-base font-semibold text-slate-800">
                      {user.phone}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">Rol</p>
                    <p className="text-base font-semibold text-slate-800">
                      {user.role}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={onEditClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-2xl transition"
                  >
                    Editar perfil
                  </button>

                  <button
                    onClick={onPasswordClick}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-3 rounded-2xl transition"
                  >
                    Cambiar contraseña
                  </button>

                  {extraActions}
                </div>
              </>
            )}

            {isEditing && (
              <form onSubmit={onSubmitProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Nombre de usuario
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={onFieldChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={onFieldChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={onFieldChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-2xl transition disabled:opacity-60"
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>

                  <button
                    type="button"
                    onClick={onCancel}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-3 rounded-2xl transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {isChangingPassword && (
              <form onSubmit={onSubmitPassword}>
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={onPasswordFieldChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={onPasswordFieldChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={onPasswordFieldChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-2xl transition disabled:opacity-60"
                  >
                    {saving ? "Actualizando..." : "Actualizar contraseña"}
                  </button>

                  <button
                    type="button"
                    onClick={onCancel}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-3 rounded-2xl transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileCard;
