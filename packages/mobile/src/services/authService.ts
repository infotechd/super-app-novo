import { apiService } from './api';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types';

class AuthService {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Erro no login');
    }

    return response.data;
  }

  // Registro
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', data);

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Erro no registro');
    }

    return response.data;
  }

  // Obter perfil do usuário
  async getProfile(): Promise<User> {
    const response = await apiService.get<{ user: User }>('/auth/profile');

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Erro ao obter perfil');
    }

    return response.data.user;
  }

  // Verificar saúde da API
  async healthCheck(): Promise<boolean> {
    try {
      const response = await apiService.get('/health');
      return response.success;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();