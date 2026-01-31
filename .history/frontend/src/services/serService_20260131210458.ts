// services/userService.ts
import api from "../lib/api";
import { User, CreateUserData, UpdateUserData } from "../types/user";

class UserService {
  // Récupérer tous les utilisateurs
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>("/users/");
    return response.data;
  }

  // Créer un utilisateur
  async createUser(userData: CreateUserData): Promise<User> {
    const response = await api.post<User>("/users/", userData);
    return response.data;
  }

  // Mettre à jour un utilisateur (admin ou self)
  async updateUser(userId: number, userData: UpdateUserData): Promise<User> {
    const response = await api.put<User>(`/users/${userId}`, userData);
    return response.data;
  }

  // Mettre à jour un utilisateur (admin seulement)
  async updateUserAdmin(userId: number, userData: UpdateUserData): Promise<User> {
    const response = await api.put<User>(`/users/${userId}/admin`, userData);
    return response.data;
  }

  // Changer le statut d'un utilisateur
  async updateUserStatus(userId: number, status: boolean): Promise<User> {
    const response = await api.put<User>(`/users/${userId}/activate?active=${status}`, {});
    return response.data;
  }

  // Réinitialiser le mot de passe
  async resetPassword(userId: number, newPassword: string): Promise<void> {
    await api.put(`/users/${userId}/reset-password`, {
      new_password: newPassword
    });
  }

  // Supprimer un utilisateur
  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/users/${userId}`);
  }
}

export const userService = new UserService();