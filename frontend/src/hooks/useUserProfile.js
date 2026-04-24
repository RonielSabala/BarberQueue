import { useEffect, useState } from "react";
import {
  getUserById,
  updateUserProfile,
  updateUserPhoto,
  changeUserPassword,
} from "../services/userService";
import { useToast } from "../context/ToastContext";
import { mapApiError } from "../utils/mapApiError";

export function useUserProfile() {
  const toast = useToast();

  const [user, setUser]                             = useState(null);
  const [loading, setLoading]                       = useState(true);
  const [saving, setSaving]                         = useState(false);
  const [savingPhoto, setSavingPhoto]               = useState(false);
  const [isEditing, setIsEditing]                   = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto]         = useState(false);
  const [photoUrlInput, setPhotoUrlInput]           = useState("");

  const [formData, setFormData] = useState({ username: "", email: "", phone: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const userId = storedUser?.id;

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      if (!userId) { toast.error("No se encontró el usuario autenticado."); return; }
      const userData = await getUserById(userId);
      setUser(userData);
      setFormData({ username: userData.username || "", email: userData.email || "", phone: userData.phone || "" });
    } catch (err) {
      toast.error(mapApiError(err.message, "Error al cargar el perfil"));
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
    setIsChangingPassword(false); setIsEditingPhoto(false);
    setIsEditing(true);
  };

  const handlePasswordClick = () => {
    setIsEditing(false); setIsEditingPhoto(false);
    setIsChangingPassword(true);
  };

  const handlePhotoClick = () => {
    setIsEditing(false); setIsChangingPassword(false);
    setPhotoUrlInput(user?.photoUrl || "");
    setIsEditingPhoto(true);
  };

  const handleCancel = () => {
    setIsEditing(false); setIsChangingPassword(false); setIsEditingPhoto(false);
    setPhotoUrlInput("");
    if (user) setFormData({ username: user.username || "", email: user.email || "", phone: user.phone || "" });
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await updateUserProfile(userId, formData);
      toast.success("Perfil actualizado correctamente.");
      setIsEditing(false);
      await fetchUserProfile();
      const updatedUser = { ...storedUser, username: formData.username, email: formData.email };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      toast.error(mapApiError(err.message, "Error al actualizar el perfil"));
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Debes completar todos los campos.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("La nueva contraseña y su confirmación no coinciden.");
      return;
    }
    try {
      setSaving(true);
      const response = await changeUserPassword(userId, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success(response.message || "Contraseña actualizada correctamente.");
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(mapApiError(err.message, "Error al cambiar la contraseña"));
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitPhoto = async (e) => {
    e.preventDefault();
    if (!photoUrlInput.trim()) {
      toast.error("Ingresa una URL de imagen válida.");
      return;
    }
    try {
      setSavingPhoto(true);
      await updateUserPhoto(userId, photoUrlInput.trim());
      toast.success("Foto de perfil actualizada correctamente.");
      setIsEditingPhoto(false);
      await fetchUserProfile();
      const updatedUser = { ...storedUser, photoUrl: photoUrlInput.trim() };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      toast.error(mapApiError(err.message, "Error al actualizar la foto"));
    } finally {
      setSavingPhoto(false);
    }
  };

  return {
    user, loading, saving, savingPhoto,
    isEditing, isChangingPassword, isEditingPhoto,
    formData, passwordData, photoUrlInput, setPhotoUrlInput,
    handleChange, handlePasswordChange,
    handleEditClick, handlePasswordClick, handlePhotoClick,
    handleCancel,
    handleSubmitProfile, handleSubmitPassword, handleSubmitPhoto,
    handleFieldChange: handleChange,
    handlePasswordFieldChange: handlePasswordChange,
  };
}
