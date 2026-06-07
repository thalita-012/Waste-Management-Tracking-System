"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
const loggerMiddleware = (req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};
exports.loggerMiddleware = loggerMiddleware;
//# sourceMappingURL=LoggerMiddleware.js.map