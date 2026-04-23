import UserProfileCard from "../../components/UserProfileCard";
import { useUserProfile } from "../../hooks/useUserProfile";

function ClientProfile() {
  const {
    user,
    error,
    successMessage,
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
    handleChange,
    handlePasswordChange,
    handleEditClick,
    handlePasswordClick,
    handlePhotoClick,
    handleCancel,
    handleSubmitProfile,
    handleSubmitPassword,
    handleSubmitPhoto,
  } = useUserProfile();

  return (
    <UserProfileCard
      title="Mi Perfil"
      subtitle="Consulta y actualiza tu información personal registrada en BarberQueue."
      user={user}
      error={error}
      successMessage={successMessage}
      loading={loading}
      saving={saving}
      savingPhoto={savingPhoto}
      isEditing={isEditing}
      isChangingPassword={isChangingPassword}
      isEditingPhoto={isEditingPhoto}
      formData={formData}
      passwordData={passwordData}
      photoUrlInput={photoUrlInput}
      setPhotoUrlInput={setPhotoUrlInput}
      onFieldChange={handleChange}
      onPasswordFieldChange={handlePasswordChange}
      onEditClick={handleEditClick}
      onPasswordClick={handlePasswordClick}
      onPhotoClick={handlePhotoClick}
      onCancel={handleCancel}
      onSubmitProfile={handleSubmitProfile}
      onSubmitPassword={handleSubmitPassword}
      onSubmitPhoto={handleSubmitPhoto}
    />
  );
}

export default ClientProfile;
