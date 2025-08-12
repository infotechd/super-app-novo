import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, LoginCredentials, RegisterData } from '@/types';
import { authService } from '@/services/authService';
import { storageService } from '@/utils/storage';
import { useToast } from '@/hooks/useToast';
import { MESSAGES } from '@/constants';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { showSuccess, showError } = useToast();

    const isAuthenticated = !!user && !!token;

    // Inicializar autenticação
    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async (): Promise<void> => {
        try {
            setIsLoading(true);

            const savedToken = await storageService.getAuthToken();
            const savedUserData = await storageService.getUserData();

            if (savedToken && savedUserData) {
                const userData = JSON.parse(savedUserData);
                setToken(savedToken);
                setUser(userData);

                // Verificar se token ainda é válido
                try {
                    await authService.getProfile();
                } catch (error) {
                    // Token inválido, limpar dados
                    await logout();
                }
            }
        } catch (error) {
            console.error('Erro ao inicializar autenticação:', error);
            await logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: LoginCredentials): Promise<void> => {
        try {
            setIsLoading(true);

            const authResponse = await authService.login(credentials);

            // Salvar dados
            await storageService.saveAuthToken(authResponse.token);
            await storageService.saveUserData(JSON.stringify(authResponse.user));

            setToken(authResponse.token);
            setUser(authResponse.user);

            showSuccess(MESSAGES.SUCCESS.LOGIN);
        } catch (error: any) {
            showError(error.message || MESSAGES.ERROR.INVALID_CREDENTIALS);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterData): Promise<void> => {
        try {
            setIsLoading(true);

            const authResponse = await authService.register(data);

            // Salvar dados
            await storageService.saveAuthToken(authResponse.token);
            await storageService.saveUserData(JSON.stringify(authResponse.user));

            setToken(authResponse.token);
            setUser(authResponse.user);

            showSuccess(MESSAGES.SUCCESS.REGISTER);
        } catch (error: any) {
            showError(error.message || MESSAGES.ERROR.GENERIC);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            setIsLoading(true);

            // Limpar dados locais
            await storageService.clearAll();

            setToken(null);
            setUser(null);

            showSuccess(MESSAGES.SUCCESS.LOGOUT);
        } catch (error) {
            console.error('Erro no logout:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshUser = async (): Promise<void> => {
        try {
            if (!token) return;

            const userData = await authService.getProfile();
            await storageService.saveUserData(JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            await logout();
        }
    };

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};