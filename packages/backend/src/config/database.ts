import mongoose from 'mongoose';
import config from './index';
import logger from './logger';

const connectDB = async (): Promise<void> => {
    try {
        logger.info('🔄 Conectando ao MongoDB...', { uri: config.MONGODB_URI });

        // Opcional: se quiser desativar buffer de operações antes da conexão
        // mongoose.set('bufferCommands', false);
        // mongoose.set('bufferTimeoutMS', 0);

        await mongoose.connect(config.MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
            // bufferMaxEntries foi removido no driver v4 e não é suportado
        });

        logger.info('✅ MongoDB conectado com sucesso!', {
            database: mongoose.connection.name
        });

        // Event listeners
        mongoose.connection.on('error', (error) => {
            logger.error('❌ Erro na conexão MongoDB:', error);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('⚠️ Desconectado do MongoDB');
        });

    } catch (error) {
        logger.error('❌ Erro ao conectar MongoDB:', error);
        throw error;
    }
};

export default connectDB;