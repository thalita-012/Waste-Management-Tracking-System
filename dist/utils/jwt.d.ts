interface JwtPayload {
    id: number;
    email: string;
    role?: string;
}
/**
 * Generate JWT Token
 */
export declare const generateToken: (payload: JwtPayload) => string;
/**
 * Verify JWT Token
 */
export declare const verifyToken: (token: string) => JwtPayload;
export {};
