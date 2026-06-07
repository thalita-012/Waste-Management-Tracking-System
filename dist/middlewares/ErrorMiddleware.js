"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (error, _req, res, _next) => {
    res.status(500).json({
        success: false,
        message: error.message,
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=ErrorMiddleware.js.map