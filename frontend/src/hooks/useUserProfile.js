import { useEffect, useState } from "react";
import {
  getUserById,
  updateUserProfile,
  changeUserPassword,
} from "../services/userService";

export function useUserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  const fetchUserProfile = async () => {
    try {
      setError("");
      setLoading(true);

      if (!userId) {
        setError("No se encontró el usuario autenticado.");
        return;
      }

      const userData = await getUserById(userId);

      setUser(userData);
      setFormData({
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
    } catch (err) {
      console.error("Error al obtener el perfil:", err);
      setError(err.message || "Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setSuccessMessage("");
    setError("");
    setIsChangingPassword(false);
    setIsEditing(true);
  };

  const handlePasswordClick = () => {
    setSuccessMessage("");
    setError("");
    setIsEditing(false);
    setIsChangingPassword(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setSuccessMessage("");
    setError("");

    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const response = await updateUserProfile(userId, formData);

      setSuccessMessage(response.message || "Perfil actualizado correctamente.");
      setIsEditing(false);

      await fetchUserProfile();

      const updatedUser = {
        ...storedUser,
        username: formData.username,
        email: formData.email,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setError(err.message || "Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      if (!passwordData.currentPassword || !passwordData.newPassword) {
        setError("Debes completar todos los campos.");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("La nueva contraseña y su confirmación no coinciden.");
        return;
      }

      const response = await changeUserPassword(userId, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccessMessage(
        response.message || "Contraseña actualizada correctamente."
      );
      setIsChangingPassword(false);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
      setError(err.message || "Error al cambiar la contraseña");
    } finally {
      setSaving(false);
    }
  };

  return {
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
  };
}
