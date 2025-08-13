// src/services/ofertaService.ts
import api from './api';
import { OfertaServico, FiltrosOferta } from '../types/oferta';

export const ofertaService = {
    async buscarOfertas(filtros: FiltrosOferta = {}): Promise<OfertaServico[]> {
        try {
            const params = new URLSearchParams();

            if (filtros.search) params.append('search', filtros.search);
            if (filtros.categoria) params.append('categoria', filtros.categoria);
            if (filtros.precoMin) params.append('precoMin', filtros.precoMin.toString());
            if (filtros.precoMax) params.append('precoMax', filtros.precoMax.toString());
            if (filtros.cidade) params.append('cidade', filtros.cidade);
            if (filtros.estado) params.append('estado', filtros.estado);
            if (filtros.status) params.append('status', filtros.status);

            const response = await api.get(`/ofertas?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar ofertas:', error);
            throw new Error('Não foi possível carregar as ofertas');
        }
    },

    async buscarOfertaPorId(id: string): Promise<OfertaServico> {
        try {
            const response = await api.get(`/ofertas/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar oferta:', error);
            throw new Error('Não foi possível carregar a oferta');
        }
    },

    async criarOferta(oferta: Partial<OfertaServico>): Promise<OfertaServico> {
        try {
            const response = await api.post('/ofertas', oferta);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar oferta:', error);
            throw new Error('Não foi possível criar a oferta');
        }
    },

    async atualizarOferta(id: string, oferta: Partial<OfertaServico>): Promise<OfertaServico> {
        try {
            const response = await api.put(`/ofertas/${id}`, oferta);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar oferta:', error);
            throw new Error('Não foi possível atualizar a oferta');
        }
    },

    async deletarOferta(id: string): Promise<void> {
        try {
            await api.delete(`/ofertas/${id}`);
        } catch (error) {
            console.error('Erro ao deletar oferta:', error);
            throw new Error('Não foi possível deletar a oferta');
        }
    },
};