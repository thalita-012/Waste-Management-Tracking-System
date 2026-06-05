import app from './app.js';
import { env } from './config/env.js';
import { testConnection } from './config/db.js';
const startServer = async () => {
    try {
        const isDatabaseConnected = await testConnection();
        if (!isDatabaseConnected) {
            console.error('Unable to connect to the database');
            process.exit(1);
        }
        app.listen(env.port, () => {
            console.log(`Server is running at http://localhost:${env.port}`);
        });
    }
    catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map