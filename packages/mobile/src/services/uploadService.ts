// src/services/uploadService.ts
import api from './api';

export interface UploadResult {
    url: string;
    filename: string;
    size: number;
}

export const uploadService = {
    async uploadImage(uri: string): Promise<UploadResult> {
        try {
            const formData = new FormData();

            // Criar objeto de arquivo para upload
            const file = {
                uri,
                type: 'image/jpeg',
                name: `image_${Date.now()}.jpg`,
            } as any;

            formData.append('file', file);

            const response = await api.post('/upload/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Erro no upload:', error);
            throw new Error('Não foi possível fazer upload da imagem');
        }
    },

    async uploadMultipleImages(uris: string[]): Promise<UploadResult[]> {
        try {
            const uploadPromises = uris.map(uri => this.uploadImage(uri));
            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error('Erro no upload múltiplo:', error);
            throw new Error('Não foi possível fazer upload das imagens');
        }
    },
};