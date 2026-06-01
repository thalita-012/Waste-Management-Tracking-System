<<<<<<< HEAD
import {} from 'express';
export const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({
        success: false,
        message,
    });
};
=======
export {};
>>>>>>> b7808adb37a07e5f45a60d6aaf8cba3683e41758
//# sourceMappingURL=ErrorMiddleware.js.map