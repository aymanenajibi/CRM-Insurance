// stores/userStore.ts
import { create } from 'zustand';
import { User, CreateUserData, UpdateUserData } from '../types/user';
import { userService } from '../';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  selectedUser: User | null;
  
  // Actions
  fetchUsers: () => Promise<void>;
  createUser: (userData: CreateUserData) => Promise<void>;
  updateUser: (userId: number, userData: UpdateUserData) => Promise<void>;
  updateUserStatus: (userId: number, active: boolean) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  resetPassword: (userId: number, newPassword: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  selectedUser: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await userService.getAllUsers();
      set({ users, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || "Erreur lors du chargement des utilisateurs",
        loading: false 
      });
    }
  },

  createUser: async (userData: CreateUserData) => {
    set({ loading: true, error: null });
    try {
      const newUser = await userService.createUser(userData);
      set(state => ({ 
        users: [...state.users, newUser],
        loading: false 
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || "Erreur lors de la création",
        loading: false 
      });
      throw error;
    }
  },

  updateUser: async (userId: number, userData: UpdateUserData) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await userService.updateUser(userId, userData);
      set(state => ({
        users: state.users.map(user => 
          user.id === userId ? updatedUser : user
        ),
        loading: false,
        selectedUser: null
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || "Erreur lors de la mise à jour",
        loading: false 
      });
      throw error;
    }
  },

  updateUserStatus: async (userId: number, active: boolean) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await userService.updateUserStatus(userId, active);
      set(state => ({
        users: state.users.map(user => 
          user.id === userId ? updatedUser : user
        ),
        loading: false,
        selectedUser: null
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || "Erreur lors du changement de statut",
        loading: false 
      });
      throw error;
    }
  },

  deleteUser: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      await userService.deleteUser(userId);
      set(state => ({
        users: state.users.filter(user => user.id !== userId),
        loading: false,
        selectedUser: null
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || "Erreur lors de la suppression",
        loading: false 
      });
      throw error;
    }
  },

  resetPassword: async (userId: number, newPassword: string) => {
    set({ loading: true, error: null });
    try {
      await userService.resetPassword(userId, newPassword);
      set({ loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || "Erreur lors de la réinitialisation",
        loading: false 
      });
      throw error;
    }
  },

  setSelectedUser: (user: User | null) => {
    set({ selectedUser: user });
  },

  clearError: () => {
    set({ error: null });
  }
}));