// src/types/oferta.ts
export interface OfertaServico {
    id: string;
    titulo: string;
    descricao: string;
    preco: number;
    categoria: string;
    informacoesAdicionais?: string;
    imagens?: string[]; // CORRIGIDO: era 'imagem', agora é 'imagens'
    status: 'ativa' | 'inativa' | 'pausada';
    destaque?: boolean;
    prestadorId: string;
    prestador?: {
        id: string;
        nome: string;
        avatar?: string;
        avaliacao?: number;
        totalAvaliacoes?: number;
        descricao?: string;
    };
    localizacao?: {
        endereco: string;
        cidade: string;
        estado: string;
        cep: string;
        latitude?: number;
        longitude?: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface FiltrosOferta {
    search?: string;
    categoria?: string;
    precoMin?: number;
    precoMax?: number;
    cidade?: string;
    estado?: string;
    status?: string;
}