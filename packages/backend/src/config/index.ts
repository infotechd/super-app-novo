import dotenv from 'dotenv';
import path from 'path';

// Carregar .env.example PRIMEIRO
dotenv.config({ path: path.join(__dirname, '../../.env.example') });

export interface AppConfig {
    NODE_ENV: string;
    PORT: number;
    MONGODB_URI: string;
    JWT_SECRET: string;
    CORS_ORIGIN: string[];
    LOG_LEVEL: string;
}

// Validar variáveis obrigatórias
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingVars = requiredEnvVars.filter(key => !process.env[key]);

if (missingVars.length > 0) {
    console.error('❌ Variáveis de ambiente obrigatórias não encontradas:');
    missingVars.forEach(key => console.error(`   - ${key}`));
    process.exit(1);
}

// Configuração validada
export const config: AppConfig = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    MONGODB_URI: process.env.MONGODB_URI!,
    JWT_SECRET: process.env.JWT_SECRET!,
    CORS_ORIGIN: (process.env.CORS_ORIGIN || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
    LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

// Fallback para CORS em desenvolvimento
if (config.CORS_ORIGIN.length === 0) {
    config.CORS_ORIGIN = [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:19006'
    ];
}

export const isDevelopment = () => config.NODE_ENV === 'development';
export const isProduction = () => config.NODE_ENV === 'production';

export default config;