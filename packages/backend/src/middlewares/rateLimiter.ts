import { rateLimit } from 'express-rate-limit';

// Rate limiter para autenticação - CORRIGIDO
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 5, // 5 tentativas por IP (novo)
    message: {
        success: false,
        message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
    },
    standardHeaders: 'draft-7', // Novo padrão
    legacyHeaders: false,
    // Removido: max (deprecated)
});

// Rate limiter geral - CORRIGIDO
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 100, // 100 requests por IP (novo)
    message: {
        success: false,
        message: 'Muitas requisições. Tente novamente em 15 minutos.'
    },
    standardHeaders: 'draft-7', // Novo padrão
    legacyHeaders: false,
    // Removido: max (deprecated)
});