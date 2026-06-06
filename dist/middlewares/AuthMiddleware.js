import { authService } from '../services/AuthService.js';
export function authMiddleware(req, res, next) {
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
//# sourceMappingURL=AuthMiddleware.js.map