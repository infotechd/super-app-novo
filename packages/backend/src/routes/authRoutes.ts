import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth';
import { authLimiter } from '../middlewares/rateLimiter';
import { validate } from '../middlewares/validation';
import { registerSchema, loginSchema } from '../validation/authValidation';

const router: ExpressRouter = Router();

// Rotas públicas com rate limiting
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);

// Rotas protegidas
router.get('/profile', authMiddleware, getProfile);

export default router;