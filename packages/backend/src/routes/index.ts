import { Router } from 'express';
import type { Router as ExpressRouter, Request, Response } from 'express';
import authRoutes from './authRoutes';
import { generalLimiter } from '../middlewares/rateLimiter';

const router: ExpressRouter = Router();

// Rate limiting geral
router.use(generalLimiter);

// Rotas da API
router.use('/auth', authRoutes);

// Rota de health check
router.get('/health', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Super App API funcionando!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

export default router;