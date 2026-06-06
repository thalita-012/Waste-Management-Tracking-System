import { authService } from '../services/AuthService.js';
export function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization || req.headers['token'] || req.headers['x-access-token'];
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
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
}
