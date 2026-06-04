import jwt, {} from 'jsonwebtoken';
import { env } from '../config/env.js';
const JWT_SECRET = env.jwtSecret;
export const generateToken = (payload, expiresIn = '1d') => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
};
//# sourceMappingURL=jwt.js.map