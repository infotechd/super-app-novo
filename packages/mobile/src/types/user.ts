// src/types/user.ts
export interface User {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
    tipoUsuario: 'buyer' | 'provider' | 'advertiser' | 'admin';
    avatar?: string;
    descricao?: string;
    avaliacao?: number;
    totalAvaliacoes?: number;
    verificado?: boolean;
    ativo: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}