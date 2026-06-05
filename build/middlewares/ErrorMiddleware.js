export const errorMiddleware = (error, _req, res, _next) => {
    res.status(500).json({
        success: false,
        message: error.message,
    });
};
//# sourceMappingURL=ErrorMiddleware.js.map