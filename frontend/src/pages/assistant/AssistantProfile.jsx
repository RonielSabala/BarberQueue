import { useNavigate } from "react-router-dom";
import UserProfileCard from "../../components/UserProfileCard";
import { useUserProfile } from "../../hooks/useUserProfile";

function AssistantProfile() {
  const navigate = useNavigate();
  const {
    user,
    error,
    successMessage,
    loading,
    saving,
    isEditing,
    isChangingPassword,
    formData,
    passwordData,
    handleFieldChange,
    handlePasswordFieldChange,
    handleEditClick,
    handlePasswordClick,
    handleCancel,
    handleSubmitProfile,
    handleSubmitPassword,
  } = useUserProfile();

  return (
    <UserProfileCard
      title="Perfil del Asistente"
      subtitle="Consulta y actualiza tu información personal registrada en BarberQueue."
      user={user}
      error={error}
      successMessage={successMessage}
      loading={loading}
      saving={saving}
      isEditing={isEditing}
      isChangingPassword={isChangingPassword}
      formData={formData}
      passwordData={passwordData}
      onFieldChange={handleFieldChange}
      onPasswordFieldChange={handlePasswordFieldChange}
      onEditClick={handleEditClick}
      onPasswordClick={handlePasswordClick}
      onCancel={handleCancel}
      onSubmitProfile={handleSubmitProfile}
      onSubmitPassword={handleSubmitPassword}
      extraActions={
        <>
          <button
            onClick={() => navigate("/assistant/home")}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-3 rounded-2xl transition"
          >
            Volver al home
          </button>

          <button
            onClick={() => navigate("/assistant/register-client")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-2xl transition"
          >
            Registrar clientes
          </button>
        </>
      }
    />
  );
}

export default AssistantProfile;
