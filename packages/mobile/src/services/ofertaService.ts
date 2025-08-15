import api from './api';
import { OfertaServico, CreateOfertaInput, OfertaFilters } from '../types/oferta';

export interface OfertasResponse {
    ofertas: OfertaServico[];
    total: number;
    page: number;
    totalPages: number;
}

export const ofertaService = {
    async getOfertas(filters?: OfertaFilters, page = 1, limit = 10): Promise<OfertasResponse> {
        const params = new URLSearchParams();

        if (filters?.categoria) params.append('categoria', filters.categoria);
        if (filters?.precoMin) params.append('precoMin', filters.precoMin.toString());
        if (filters?.precoMax) params.append('precoMax', filters.precoMax.toString());
        if (filters?.cidade) params.append('cidade', filters.cidade);
        if (filters?.estado) params.append('estado', filters.estado);
        if (filters?.busca) params.append('busca', filters.busca);

        params.append('page', page.toString());
        params.append('limit', limit.toString());

        const response = await api.get(`/ofertas?${params.toString()}`);
        return response.data;
    },

    async getOfertaById(id: string): Promise<OfertaServico> {
        const response = await api.get(`/ofertas/${id}`);
        return response.data;
    },

    async createOferta(data: CreateOfertaInput): Promise<OfertaServico> {
        const response = await api.post('/ofertas', data);
        return response.data;
    },

    async updateOferta(id: string, data: Partial<CreateOfertaInput>): Promise<OfertaServico> {
        const response = await api.put(`/ofertas/${id}`, data);
        return response.data;
    },

    async deleteOferta(id: string): Promise<void> {
        await api.delete(`/ofertas/${id}`);
    },

    async getMinhasOfertas(): Promise<OfertaServico[]> {
        const response = await api.get('/ofertas/minhas');
        return response.data;
    }
};

export default ofertaService;