import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useUserProfile = () => {
  const { 
    user, 
    updateProfile, 
    changePassword, 
    refreshUser, 
    clearError,
    isAdmin 
  } = useAuth();
  
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpdateProfile = useCallback(async (data: { username?: string; email?: string }) => {
    if (!user) {
      setLocalError('Utilisateur non connecté');
      return;
    }

    try {
      setSaving(true);
      setLocalError(null);
      setSuccess(null);
      clearError();

      // Validation
      if (data.username && data.username.trim().length < 3) {
        throw new Error('Le nom d\'utilisateur doit contenir au moins 3 caractères');
      }

      if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
        throw new Error('Adresse email invalide');
      }

      // Mise à jour
      const updatedUser = await updateProfile(data);
      
      setSuccess('Profil mis à jour avec succès !');
      return updatedUser;

    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Erreur lors de la mise à jour';
      setLocalError(errorMessage);
      throw error;
    } finally {
      setSaving(false);
    }
  }, [user, updateProfile, clearError]);

  const handleChangePassword = useCallback(async (newPassword: string, confirmPassword: string) => {
    if (!user) {
      setLocalError('Utilisateur non connecté');
      return;
    }

    try {
      setSaving(true);
      setLocalError(null);
      setSuccess(null);
      clearError();

      // Validation
      if (newPassword !== confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      if (newPassword.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }

      // Changement
      await changePassword({ new_password: newPassword });
      
      setSuccess('Mot de passe changé avec succès. Vous allez être déconnecté...');

    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Erreur lors du changement de mot de passe';
      setLocalError(errorMessage);
      throw error;
    } finally {
      setSaving(false);
    }
  }, [user, changePassword, clearError]);

  const handleRefreshProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      await refreshUser();
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du profil:', error);
    } finally {
      setSaving(false);
    }
  }, [user, refreshUser]);

  const clearMessages = useCallback(() => {
    setLocalError(null);
    setSuccess(null);
    clearError();
  }, [clearError]);

  return {
    user,
    isAdmin,
    saving,
    error: localError,
    success,
    updateProfile: handleUpdateProfile,
    changePassword: handleChangePassword,
    refreshProfile: handleRefreshProfile,
    clearMessages,
  };
};