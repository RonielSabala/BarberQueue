import { useEffect, useState } from "react";
import {
  getUserById,
  updateUserProfile,
  updateUserPhoto,
  changeUserPassword,
} from "../services/userService";

export function useUserProfile() {
  const [user, setUser]                       = useState(null);
  const [error, setError]                     = useState("");
  const [successMessage, setSuccessMessage]   = useState("");
  const [loading, setLoading]                 = useState(true);
  const [saving, setSaving]                   = useState(false);
  const [savingPhoto, setSavingPhoto]         = useState(false);
  const [isEditing, setIsEditing]             = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto]   = useState(false);
  const [photoUrlInput, setPhotoUrlInput]     = useState("");

  const [formData, setFormData] = useState({ username: "", email: "", phone: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const userId = storedUser?.id;

  const fetchUserProfile = async () => {
    try {
      setError("");
      setLoading(true);
      if (!userId) { setError("No se encontró el usuario autenticado."); return; }
      const userData = await getUserById(userId);
      setUser(userData);
      setFormData({ username: userData.username || "", email: userData.email || "", phone: userData.phone || "" });
    } catch (err) {
      setError(err.message || "Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUserProfile(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setSuccessMessage(""); setError("");
    setIsChangingPassword(false); setIsEditingPhoto(false);
    setIsEditing(true);
  };

  const handlePasswordClick = () => {
    setSuccessMessage(""); setError("");
    setIsEditing(false); setIsEditingPhoto(false);
    setIsChangingPassword(true);
  };

  const handlePhotoClick = () => {
    setSuccessMessage(""); setError("");
    setIsEditing(false); setIsChangingPassword(false);
    setPhotoUrlInput(user?.photoUrl || "");
    setIsEditingPhoto(true);
  };

  const handleCancel = () => {
    setIsEditing(false); setIsChangingPassword(false); setIsEditingPhoto(false);
    setSuccessMessage(""); setError("");
    if (user) setFormData({ username: user.username || "", email: user.email || "", phone: user.phone || "" });
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPhotoUrlInput("");
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true); setError(""); setSuccessMessage("");
      const response = await updateUserProfile(userId, formData);
      setSuccessMessage(response.message || "Perfil actualizado correctamente.");
      setIsEditing(false);
      await fetchUserProfile();
      const updatedUser = { ...storedUser, username: formData.username, email: formData.email };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      setError(err.message || "Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    try {
      setSaving(true); setError(""); setSuccessMessage("");
      if (!passwordData.currentPassword || !passwordData.newPassword) { setError("Debes completar todos los campos."); return; }
      if (passwordData.newPassword !== passwordData.confirmPassword) { setError("La nueva contraseña y su confirmación no coinciden."); return; }
      const response = await changeUserPassword(userId, { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      setSuccessMessage(response.message || "Contraseña actualizada correctamente.");
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message || "Error al cambiar la contraseña");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitPhoto = async (e) => {
    e.preventDefault();
    try {
      setSavingPhoto(true); setError(""); setSuccessMessage("");
      if (!photoUrlInput.trim()) { setError("Ingresa una URL de imagen válida."); return; }
      await updateUserPhoto(userId, photoUrlInput.trim());
      setSuccessMessage("Foto de perfil actualizada correctamente.");
      setIsEditingPhoto(false);
      await fetchUserProfile();
      const updatedUser = { ...storedUser, photoUrl: photoUrlInput.trim() };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      setError(err.message || "Error al actualizar la foto");
    } finally {
      setSavingPhoto(false);
    }
  };

  return {
    user, error, successMessage, loading, saving, savingPhoto,
    isEditing, isChangingPassword, isEditingPhoto,
    formData, passwordData, photoUrlInput, setPhotoUrlInput,
    handleChange, handlePasswordChange,
    handleEditClick, handlePasswordClick, handlePhotoClick,
    handleCancel,
    handleSubmitProfile, handleSubmitPassword, handleSubmitPhoto,
    // aliases para compatibilidad con AssistantProfile
    handleFieldChange: handleChange,
    handlePasswordFieldChange: handlePasswordChange,
  };
}
