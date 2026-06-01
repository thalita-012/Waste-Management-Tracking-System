import jwt, {} from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';
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