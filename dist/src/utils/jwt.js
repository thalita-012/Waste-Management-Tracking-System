import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
const JWT_EXPIRES_IN = '7d';
/**
 * Generate JWT Token
 */
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};
/**
 * Verify JWT Token
 */
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
