// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__
    ? 'http://localhost:3000/api'
    : 'https://your-production-api.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('@super_app:token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expirado, fazer logout
            await AsyncStorage.multiRemove([
                '@super_app:token',
                '@super_app:refresh_token',
                '@super_app:user'
            ]);
            // Redirecionar para login se necessário
        }
        return Promise.reject(error);
    }
);

export default api;