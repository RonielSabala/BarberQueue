import { useNavigate } from "react-router-dom";
import UserProfileCard from "../../components/UserProfileCard";
import { useUserProfile } from "../../hooks/useUserProfile";

function BarberProfile() {
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
    handleChange,
    handlePasswordChange,
    handleEditClick,
    handlePasswordClick,
    handleCancel,
    handleSubmitProfile,
    handleSubmitPassword,
  } = useUserProfile();

  const handleStartShift = () => {
    navigate("/barber/dashboard");
  };

  return (
    <UserProfileCard
      title="Perfil del Barbero"
      subtitle="Consulta y actualiza tu información personal antes de iniciar tu jornada."
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
      extraActions={
        <button
          onClick={handleStartShift}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-2xl transition"
        >
          Iniciar jornada
        </button>
      }
    />
  );
}

export default BarberProfile;
