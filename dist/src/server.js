import app from './app.js';
import { env } from './config/env.js';
import { testConnection } from './config/db.js';
const maxPortAttempts = 10;
const listenOnPort = (port, attempt = 0) => {
    const server = app.listen(port, () => {
        const address = server.address();
        const actualPort = address?.port || port;
        console.log(`API listening on http://localhost:${actualPort}`);
    });
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            if (env.nodeEnv !== 'production' && attempt < maxPortAttempts) {
                const nextPort = port + 1;
                console.warn(`Port ${port} is already in use. Trying port ${nextPort}...`);
                listenOnPort(nextPort, attempt + 1);
                return;
            }
            console.error(`Port ${port} is already in use: http://localhost:${port}`);
            console.error('Stop the other process or set a different PORT in .env.');
            process.exit(1);
        }
        console.error('Server listen failed:', error);
        process.exit(1);
    });
};
const startServer = async () => {
    try {
        console.log(`Starting server on port ${env.port}...`);
        const isDatabaseConnected = await testConnection();
        if (!isDatabaseConnected) {
            console.error('Unable to connect to the database');
            process.exit(1);
        }
        listenOnPort(env.port);
    }
    catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
};
startServer();
