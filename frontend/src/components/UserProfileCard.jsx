// ── Helper: Avatar con foto o inicial ────────────────────────────────────
function Avatar({ photoUrl, username, size = "lg", className = "" }) {
  const initial = username?.charAt(0)?.toUpperCase() || "U";
  const sizeMap = {
    sm: "w-9 h-9 text-sm rounded-xl",
    md: "w-12 h-12 text-base rounded-xl",
    lg: "w-28 h-28 text-5xl rounded-3xl",
  };
  const cls = `${sizeMap[size]} flex items-center justify-center shrink-0 overflow-hidden ${className}`;

  if (photoUrl) {
    return (
      <div className={cls}>
        <img
          src={photoUrl}
          alt={username}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  return (
    <div className={`${cls} bg-gradient-to-br from-blue-500 to-blue-600`}>
      <span className="text-white font-black leading-none">{initial}</span>
    </div>
  );
}

function UserProfileCard({
  user,
  loading,
  saving,
  savingPhoto,
  isEditing,
  isChangingPassword,
  isEditingPhoto,
  formData,
  passwordData,
  photoUrlInput,
  setPhotoUrlInput,
  onFieldChange,
  onPasswordFieldChange,
  onEditClick,
  onPasswordClick,
  onPhotoClick,
  onCancel,
  onSubmitProfile,
  onSubmitPassword,
  onSubmitPhoto,
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
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
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
            <div className="relative shrink-0 group">
              <Avatar
                photoUrl={user.photoUrl}
                username={user.username}
                size="lg"
                className="shadow-xl"
              />
              {onPhotoClick && (
                <button
                  onClick={onPhotoClick}
                  className="absolute inset-0 rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <span className="material-icons-round text-white text-2xl">
                    photo_camera
                  </span>
                </button>
              )}
            </div>
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
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* ── VIEW MODE ─────────────────────────────────────────────────── */}
          {!isEditing && !isChangingPassword && !isEditingPhoto && (
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
                {onPhotoClick && (
                  <button
                    onClick={onPhotoClick}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    <span className="material-icons-round text-[16px]">
                      photo_camera
                    </span>
                    Cambiar foto
                  </button>
                )}
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

          {/* ── PHOTO MODE ────────────────────────────────────────────────── */}
          {isEditingPhoto && (
            <form onSubmit={onSubmitPhoto}>
              <div className="p-6 border-b border-slate-50">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5">
                  Cambiar foto de perfil
                </h3>
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="shrink-0">
                    <Avatar
                      photoUrl={photoUrlInput || user.photoUrl}
                      username={user.username}
                      size="lg"
                      className="shadow-md"
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                        URL de la foto
                      </label>
                      <input
                        type="url"
                        value={photoUrlInput}
                        onChange={(e) => setPhotoUrlInput(e.target.value)}
                        placeholder="https://ejemplo.com/mi-foto.jpg"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                      />
                      <p className="text-xs text-slate-400 mt-1.5">
                        Ingresa la URL de una imagen pública. La vista previa se
                        actualiza al escribir.
                      </p>
                    </div>
                    {photoUrlInput && (
                      <button
                        type="button"
                        onClick={() => setPhotoUrlInput("")}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Quitar foto
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={savingPhoto}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  <span className="material-icons-round text-[16px]">save</span>
                  {savingPhoto ? "Guardando..." : "Guardar foto"}
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
                  {["currentPassword", "newPassword", "confirmPassword"].map(
                    (field) => (
                      <div key={field}>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                          {field === "currentPassword"
                            ? "Contraseña actual"
                            : field === "newPassword"
                              ? "Nueva contraseña"
                              : "Confirmar nueva contraseña"}
                        </label>
                        <input
                          type="password"
                          name={field}
                          value={passwordData[field]}
                          onChange={onPasswordFieldChange}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                        />
                      </div>
                    ),
                  )}
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

export { Avatar };
export default UserProfileCard;
