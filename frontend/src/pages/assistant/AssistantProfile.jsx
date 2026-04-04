import UserProfileCard from "../../components/UserProfileCard";
import { useUserProfile } from "../../hooks/useUserProfile";

function AssistantProfile() {
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
    handleChange,
    handlePasswordChange,
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
      onFieldChange={handleChange}
      onPasswordFieldChange={handlePasswordChange}
      onEditClick={handleEditClick}
      onPasswordClick={handlePasswordClick}
      onCancel={handleCancel}
      onSubmitProfile={handleSubmitProfile}
      onSubmitPassword={handleSubmitPassword}
    />
  );
}

export default AssistantProfile;
