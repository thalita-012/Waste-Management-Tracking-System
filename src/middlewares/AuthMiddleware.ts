import type {
    Request,
    Response,
    NextFunction,
} from 'express';

export const authMiddleware = (
    _req: Request,
    _res: Response,
    next: NextFunction
): void => {

    console.log('Authenticated');

    next();
};
