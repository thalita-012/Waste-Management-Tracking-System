import jwt, { type SignOptions } from 'jsonwebtoken';
export declare const generateToken: (payload: object, expiresIn?: SignOptions["expiresIn"]) => string;
export declare const verifyToken: (token: string) => string | jwt.JwtPayload | null;
//# sourceMappingURL=jwt.d.ts.map