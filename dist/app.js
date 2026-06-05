
import express from 'express';
import paymentRoutes from './routes/paymentRoute.js';
import { testConnection } from './config/db.js';
import { errorMiddleware } from './middlewares/ErrorMiddleware.js';

import express from 'express';
import { registerRoutes } from './routes/index.js';
import { errorMiddleware } from './middlewares/ErrorMiddleware.js';
import { loggerMiddleware } from './middlewares/LoggerMiddleware.js';
import { uptime } from 'process';
import { time, timeStamp } from 'console';

const app = express();
// Built-in Middleware
app.use(express.json());

app.use(express.static('public'));
app.use('/api/payments', paymentRoutes);
app.use('/api', paymentRoutes);
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
app.use(errorMiddleware);

import express from "express";
import paymentRoutes from "./routes/paymentRoute.js";
import truckRoutes from "./routes/TruckRouter.js";
import { testConnection } from "./config/db.js";
const app = express();
app.use(express.json());
app.get("/health", (_req, res) => {
    res.json({ success: true, message: "Server is running" });
});
app.get("/db-test", async (_req, res) => {
    const connected = await testConnection();
    if (!connected) {
        return res.status(500).json({ success: false, message: "Database connection failed" });
    }
    return res.json({ success: true, message: "Database connected successfully" });
});
app.use("/api/payments", paymentRoutes);
app.use("/api", truckRoutes);

// Custom Middleware
app.use(loggerMiddleware);
app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'Waste Management Tracking API Running',
    });
});
// Health Check
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        uptime: process.uptime(),
        timeStamp: new Date(),
    });
});
// test api
app.get('/api/test', (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Testing it working",
        uptime: process.uptime(),
        timeStamp: new Date(),
    });
});
// Register Routes
registerRoutes(app);
// Error Middleware
app.use(errorMiddleware);

export default app;
//# sourceMappingURL=app.js.map