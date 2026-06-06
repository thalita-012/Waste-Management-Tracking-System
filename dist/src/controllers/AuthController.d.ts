import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/AuthMiddleware.js';
export declare class AuthController {
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    forgotPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    resetPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProfile(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getProfile(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
export declare const authController: AuthController;
//# sourceMappingURL=AuthController.d.ts.map