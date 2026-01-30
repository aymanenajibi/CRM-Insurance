import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';
import { 
  AuthState, 
  LoginData, 
  RegisterData, 
  User,
  UpdateProfileData,
  ChangePasswordData
} from '../types/auth';

interface AuthStore extends AuthState {
  // Actions d'authentification
  login: (data: LoginData) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<{ message: string; id: number }>;
  logout: () => void;
  
  // Actions de gestion utilisateur
  fetchCurrentUser: () => Promise<User>;
  updateProfile: (data: UpdateProfileData) => Promise<User>;
  changePassword: (data: ChangePasswordData) => Promise<{ message: string }>;
  
  // Actions utilitaires
  clearError: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // ===================== ÉTAT INITIAL =====================
      user: authService.getStoredUser(),
      token: authService.getToken(),
      isAuthenticated: authService.isAuthenticated(),
      isLoading: false,
      error: null,

      // ===================== ACTIONS =====================
      
      login: async (data: LoginData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authService.login(data);
          
          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          return response;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Email ou mot de passe incorrect';
          
          set({
            isLoading: false,
            error: errorMessage,
          });
          
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await authService.register(data);
          
          set({
            isLoading: false,
            error: null,
          });
          
          return result;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || "Erreur lors de l'inscription";
          
          set({
            isLoading: false,
            error: errorMessage,
          });
          
          throw error;
        }
      },

      logout: () => {
        authService.clearAuthData();
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      fetchCurrentUser: async () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) {
          throw new Error('Non authentifié');
        }
        
        set({ isLoading: true, error: null });
        
        try {
          const user = await authService.getCurrentUser();
          
          set({
            user,
            isLoading: false,
            error: null,
          });
          
          return user;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Erreur lors du chargement du profil';
          
          set({
            isLoading: false,
            error: errorMessage,
          });
          
          throw error;
        }
      },

      updateProfile: async (data: UpdateProfileData) => {
        const { user } = get();
        if (!user) {
          throw new Error('Utilisateur non connecté');
        }
        
        set({ isLoading: true, error: null });
        
        try {
          const updatedUser = await authService.updateProfile(data);
          
          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });
          
          return updatedUser;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Erreur lors de la mise à jour du profil';
          
          set({
            isLoading: false,
            error: errorMessage,
          });
          
          throw error;
        }
      },

      changePassword: async (data: ChangePasswordData) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await authService.changePassword(data);
          
          set({
            isLoading: false,
            error: null,
          });
          
          return result;
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Erreur lors du changement de mot de passe';
          
          set({
            isLoading: false,
            error: errorMessage,
          });
          
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      version: 1,
    }
  )
);

export default useAuthStore;