import api from '../lib/api';
import { 
  LoginData, 
  RegisterData, 
  AuthResponse,
  User,
  UpdateProfileData,
  ChangePasswordData
} from '../types/auth';

class AuthService {
  // ===================== AUTHENTIFICATION =====================
  
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    this.setAuthData(response.data);
    return response.data;
  }

  async register(data: RegisterData): Promise<{ message: string; id: number }> {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  // ===================== GESTION UTILISATEUR =====================
  
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/users/me');
    this.setStoredUser(response.data);
    return response.data;
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.put<User>('/users/me', data);
    this.setStoredUser(response.data);
    return response.data;
  }

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await api.put('/users/me/password', data);
    return response.data;
  }

  // ===================== GESTION DU STORAGE =====================
  
  setAuthData(response: AuthResponse): void {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  setStoredUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getStoredUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  // ===================== UTILS =====================
  
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
}

export default new AuthService();