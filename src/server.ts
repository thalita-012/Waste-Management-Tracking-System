import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { testConnection } from './config/db.js';

dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Middleware
app.use(express.json());

// Health Check Route
app.get('/health', (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: 'Server is running successfully',
  });
});

// Database Connection Test Route
app.get('/db-test', async (_req: Request, res: Response) => {
  try {
    const connected = await testConnection();

    if (!connected) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Database connected successfully',
    });
  } catch (error) {
    console.error('Database Test Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export default app;