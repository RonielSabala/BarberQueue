function UserProfileCard({
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
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <span className="material-icons-round text-5xl animate-pulse">
            person
          </span>
          <p className="text-sm font-medium tracking-wide">
            Cargando perfil...
          </p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 max-w-md text-center text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400 text-sm shadow-sm">
          No se encontró información del usuario.
        </div>
      </div>
    );
  }

  const initial = user.username?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/60 overflow-hidden border-b border-slate-100">
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Watermark initial */}
        <div className="absolute inset-0 flex items-center justify-end pr-16 opacity-[0.04] pointer-events-none select-none">
          <span
            className="font-black text-slate-900 leading-none"
            style={{ fontSize: 280 }}
          >
            {initial}
          </span>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-14">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl shrink-0">
              <span className="text-white font-black text-5xl leading-none">
                {initial}
              </span>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none mb-3">
                {user.username}
              </h1>
              <p className="text-slate-400 text-sm font-medium">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Alerts */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 text-sm">
            {successMessage}
          </div>
        )}

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* ── VIEW MODE ─────────────────────────────────────────────────── */}
          {!isEditing && !isChangingPassword && (
            <>
              <div className="p-6 border-b border-slate-50">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5">
                  Información personal
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-400 font-medium mb-1">
                      Nombre de usuario
                    </p>
                    <p className="font-bold text-slate-800">{user.username}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-400 font-medium mb-1">
                      Correo electrónico
                    </p>
                    <p className="font-bold text-slate-800 break-all">
                      {user.email}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-400 font-medium mb-1">
                      Teléfono
                    </p>
                    <p className="font-bold text-slate-800">
                      {user.phone || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 flex flex-wrap gap-3">
                <button
                  onClick={onEditClick}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  <span className="material-icons-round text-[16px]">edit</span>
                  Editar perfil
                </button>
                <button
                  onClick={onPasswordClick}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  <span className="material-icons-round text-[16px]">lock</span>
                  Cambiar contraseña
                </button>
                {extraActions}
              </div>
            </>
          )}

          {/* ── EDIT MODE ─────────────────────────────────────────────────── */}
          {isEditing && (
            <form onSubmit={onSubmitProfile}>
              <div className="p-6 border-b border-slate-50">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5">
                  Editar información
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                      Nombre de usuario
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={onFieldChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={onFieldChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={onFieldChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  <span className="material-icons-round text-[16px]">save</span>
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* ── PASSWORD MODE ─────────────────────────────────────────────── */}
          {isChangingPassword && (
            <form onSubmit={onSubmitPassword} className="max-w-md">
              <div className="p-6 border-b border-slate-50">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5">
                  Cambiar contraseña
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={onPasswordFieldChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={onPasswordFieldChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={onPasswordFieldChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  <span className="material-icons-round text-[16px]">
                    lock_reset
                  </span>
                  {saving ? "Actualizando..." : "Actualizar contraseña"}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfileCard;
