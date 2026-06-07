import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/AuthService.js';

// This interface extends the Express Request type
export interface AuthenticatedRequest extends Request {
  userId?: number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Missing or invalid authorization token'
      });
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Cast the request to AuthenticatedRequest to add userId
    (req as AuthenticatedRequest).userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
}