import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import config from '../config';
import logger from '../config/logger';

export interface AuthRequest extends Request {
    user?: IUser;
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Token de acesso não fornecido'
            });
            return;
        }

        const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };
        const user = await User.findById(decoded.userId);

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Usuário não encontrado'
            });
            return;
        }

        if (!user.ativo) {
            res.status(401).json({
                success: false,
                message: 'Conta desativada'
            });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error('Erro na autenticação:', error);
        res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
};