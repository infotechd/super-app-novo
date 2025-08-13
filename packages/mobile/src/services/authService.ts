// src/services/authService.ts
import api from './api';
import { User, AuthResponse } from '../types/user';

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    nome: string;
    email: string;
    password: string;
    telefone?: string;
    tipoUsuario: 'buyer' | 'provider' | 'advertiser';
}

export const authService = {
    async login(data: LoginData): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>('/auth/login', data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao fazer login');
        }
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>('/auth/register', data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao criar conta');
        }
    },

    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Erro no logout:', error);
        }
    },

    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>('/auth/refresh', {
                refreshToken
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao renovar token');
        }
    },

    async forgotPassword(email: string): Promise<void> {
        try {
            await api.post('/auth/forgot-password', { email });
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao enviar email');
        }
    },

    async resetPassword(token: string, password: string): Promise<void> {
        try {
            await api.post('/auth/reset-password', { token, password });
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao resetar senha');
        }
    },
};

// Export default para compatibilidade
export default authService;

// Export nomeado para uso como apiService
export { authService as apiService };