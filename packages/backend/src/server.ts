import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import config from './config';
import connectDB from './config/database';
import logger from './config/logger';
import routes from './routes';

const app: Express = express();

// Middlewares de segurança
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());

// CORS configurável
app.use(cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging de requests
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info('Request:', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    next();
});

// Rotas
app.use('/api', routes);

// Rota raiz
app.get('/', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Super App API',
        version: '1.0.0',
        status: 'Funcionando!',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth'
        }
    });
});

// Middleware de erro
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = status === 500 ? 'Erro interno do servidor' : err.message;

    logger.error('Erro na aplicação:', {
        status,
        message,
        stack: err.stack,
        url: req.url,
        method: req.method
    });

    res.status(status).json({
        success: false,
        message
    });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint não encontrado'
    });
});

// Bootstrap assíncrono
async function bootstrap() {
    try {
        // Conectar ao banco ANTES de iniciar servidor
        await connectDB();

        const PORT = config.PORT;
        app.listen(PORT, () => {
            logger.info(`🚀 Servidor iniciado com sucesso!`, {
                port: PORT,
                env: config.NODE_ENV,
                cors: config.CORS_ORIGIN
            });
            console.log(`📱 API: http://localhost:${PORT}`);
            console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        logger.error('❌ Falha ao iniciar servidor:', error);
        process.exit(1);
    }
}

// Iniciar aplicação
void bootstrap(); // Explicitly ignore promise

export default app;