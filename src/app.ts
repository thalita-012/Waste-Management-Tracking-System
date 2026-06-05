import express from 'express';
import authRoutes from './routes/AuthRoutes.js';
import paymentRoutes from './routes/paymentRoute.js';
import truckRoutes from './routes/TruckRouter.js';
import notificationRoutes from './routes/NotificationRoutes.js';
import { testConnection } from './config/db.js';
import { errorMiddleware } from './middlewares/ErrorMiddleware.js';

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', truckRoutes);
app.use('/api/notifications', notificationRoutes);

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

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    routes: {
      health: 'GET /health',
      createPayment: ['POST /api/payments/bakong/create', 'POST /api/payments/create'],
      verifyPayment: 'GET /api/payments/bakong/verify/:orderId',
      paymentQr: 'GET /api/payments/bakong/qr/:orderId',
      bakongAccountCheck: 'GET /api/payments/bakong/account-check',
    },
  });
});

app.use(errorMiddleware);

export default app;
