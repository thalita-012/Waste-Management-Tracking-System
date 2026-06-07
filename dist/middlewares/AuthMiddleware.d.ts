import type { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    userId?: number;
    body?: any;
    headers?: any;
}
export declare function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): Response<any, Record<string, any>>;
