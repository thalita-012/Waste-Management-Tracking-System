import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/AuthService.js';

export interface AuthenticatedRequest extends Request {
  userId?: number;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization || (req.headers['token'] as string) || (req.headers['x-access-token'] as string);
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Missing or invalid authorization token'
      });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    const decoded = authService.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
}
