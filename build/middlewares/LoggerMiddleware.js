export const loggerMiddleware = (req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};
//# sourceMappingURL=LoggerMiddleware.js.map