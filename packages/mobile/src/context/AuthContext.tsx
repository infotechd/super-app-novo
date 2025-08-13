// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthResponse } from '../types/user';
import { authService, LoginData, RegisterData } from '../services/authService';

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
}

// Criar o contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStoredAuth();
    }, []);

    const loadStoredAuth = async () => {
        try {
            const [storedUser, storedToken] = await AsyncStorage.multiGet([
                '@super_app:user',
                '@super_app:token'
            ]);

            if (storedUser[1] && storedToken[1]) {
                setUser(JSON.parse(storedUser[1]));
                setToken(storedToken[1]);
            }
        } catch (error) {
            console.error('Erro ao carregar dados de autenticação:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: LoginData) => {
        try {
            setIsLoading(true);
            const response = await authService.login(data);

            await AsyncStorage.multiSet([
                ['@super_app:user', JSON.stringify(response.user)],
                ['@super_app:token', response.token],
                ['@super_app:refresh_token', response.refreshToken],
            ]);

            setUser(response.user);
            setToken(response.token);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        try {
            setIsLoading(true);
            const response = await authService.register(data);

            await AsyncStorage.multiSet([
                ['@super_app:user', JSON.stringify(response.user)],
                ['@super_app:token', response.token],
                ['@super_app:refresh_token', response.refreshToken],
            ]);

            setUser(response.user);
            setToken(response.token);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();

            await AsyncStorage.multiRemove([
                '@super_app:user',
                '@super_app:token',
                '@super_app:refresh_token',
            ]);

            setUser(null);
            setToken(null);
        } catch (error) {
            console.error('Erro no logout:', error);
        }
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            AsyncStorage.setItem('@super_app:user', JSON.stringify(updatedUser));
        }
    };

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};