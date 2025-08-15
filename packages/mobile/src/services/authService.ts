import api from './api';
import { User, RegisterData, LoginData } from '../types/user';

export interface LoginResponse {
    user: User;
    token: string;
}

export const authService = {
    async login(data: LoginData): Promise<LoginResponse> {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    async register(data: RegisterData): Promise<LoginResponse> {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    async getProfile(): Promise<User> {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },

    async forgotPassword(email: string): Promise<void> {
        await api.post('/auth/forgot-password', { email });
    }
};

export default authService;