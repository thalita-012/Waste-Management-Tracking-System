"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const env_js_1 = require("./config/env.js");
const db_js_1 = require("./config/db.js");
const startServer = async () => {
    try {
        const isDatabaseConnected = await (0, db_js_1.testConnection)();
        if (!isDatabaseConnected) {
            console.error('Unable to connect to the database');
            process.exit(1);
        }
        const maxAttempts = 10;
        let server = null;
        let boundPort = null;
        const listenOnce = (port) => new Promise((resolve, reject) => {
            const s = app_js_1.default.listen(port, () => resolve({ server: s, port }));
            s.on('error', (err) => reject(err));
        });
        for (let i = 0; i < maxAttempts; i++) {
            const tryPort = env_js_1.env.port + i;
            try {
                const res = await listenOnce(tryPort);
                server = res.server;
                boundPort = res.port;
                break;
            }
            catch (err) {
                if (err && err.code === 'EADDRINUSE') {
                    // try next port
                    continue;
                }
                console.error('Server listen failed:', err);
                process.exit(1);
            }
        }
        if (!server || !boundPort) {
            console.error(`Failed to bind to any port from ${env_js_1.env.port} to ${env_js_1.env.port + maxAttempts - 1}`);
            process.exit(1);
        }
        process.env.PORT = String(boundPort);
        console.log(`Server is running at http://localhost:${boundPort}`);
        server.on('error', (err) => {
            console.error('Server error:', err);
            process.exit(1);
        });
    }
    catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map