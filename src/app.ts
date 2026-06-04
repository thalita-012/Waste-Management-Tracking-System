import express from 'express';
import { registerRoutes } from './routes/index.js';
import { errorMiddleware } from './middlewares/ErrorMiddleware.js';
import { loggerMiddleware } from './middlewares/LoggerMiddleware.js';
import { uptime } from 'process';
import { time, timeStamp } from 'console';

const app = express();

// Built-in Middleware
app.use(express.json());

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
app.get('/api/test', (_req, res)=>{
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