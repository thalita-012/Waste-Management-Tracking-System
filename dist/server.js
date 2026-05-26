import dotenv from 'dotenv';
import express from 'express';
import { testConnection } from './config/db.js';
dotenv.config();
const app = express();
const port = Number(process.env.PORT) || 3000;
app.use(express.json());
app.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
    });
});
app.get('/db-test', async (_req, res) => {
    const connected = await testConnection();
    if (!connected) {
        return res.status(500).json({
            success: false,
            message: 'Database connection failed',
        });
    }
    return res.json({
        success: true,
        message: 'Database connected successfully',
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
export default app;
//# sourceMappingURL=server.js.map