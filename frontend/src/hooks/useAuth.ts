import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import useAuthStore from '../store/authStore';
import { LoginData, RegisterData, UpdateProfileData, ChangePasswordData } from '../types/auth';

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    // État
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    fetchCurrentUser,
    updateProfile,
    changePassword,
    clearError,
  } = useAuthStore();

  // ===================== WRAPPERS =====================
  
  const handleLogin = useCallback(async (data: LoginData) => {
    try {
      const response = await login(data);
      navigate('/dashboard', { replace: true });
      return response;
    } catch (error) {
      throw error;
    }
  }, [login, navigate]);

  const handleRegister = useCallback(async (data: RegisterData) => {
    try {
      const result = await register(data);
      navigate('/signin', { 
        replace: true,
        state: { message: 'Inscription réussie ! Vous pouvez vous connecter.' }
      });
      return result;
    } catch (error) {
      throw error;
    }
  }, [register, navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/signin', { replace: true });
  }, [logout, navigate]);

  const handleUpdateProfile = useCallback(async (data: UpdateProfileData) => {
    try {
      const updatedUser = await updateProfile(data);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }, [updateProfile]);

  const handleChangePassword = useCallback(async (data: ChangePasswordData) => {
    try {
      const result = await changePassword(data);
      return result;
    } catch (error) {
      throw error;
    }
  }, [changePassword]);

  const handleRefreshUser = useCallback(async () => {
    try {
      const user = await fetchCurrentUser();
      return user;
    } catch (error) {
      throw error;
    }
  }, [fetchCurrentUser]);

  // ===================== RETOUR =====================
  
  return {
    // État
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUser: handleRefreshUser,
    updateProfile: handleUpdateProfile,
    changePassword: handleChangePassword,
    clearError,
    
    // Getters
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
    isActive: user?.active === true,
    
    // Utilitaires
    getUserInitial: () => user?.username?.charAt(0).toUpperCase() || 'U',
    getUserColor: () => {
      const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-yellow-500',
        'bg-indigo-500',
        'bg-red-500',
        'bg-teal-500',
      ];
      if (user?.username) {
        const index = user?.username?.charCodeAt(0) % colors.length || 0;
      return colors[index];
      }
      
    },
  };
};