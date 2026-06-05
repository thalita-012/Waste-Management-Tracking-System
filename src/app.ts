import express from 'express';
import paymentRoutes from './routes/paymentRoute.js';
import truckRoutes from './routes/TruckRouter.js';
import notificationRoutes from './routes/NotificationRoutes.js';
import { testConnection } from './config/db.js';
import { errorMiddleware } from './middlewares/ErrorMiddleware.js';
import { authController } from './controllers/AuthController.js';
import { authMiddleware } from './middlewares/AuthMiddleware.js';

const app = express();

app.use(express.json());

app.post('/api/auth/register', (req, res) => authController.register(req, res));
app.post('/api/auth/login', (req, res) => authController.login(req, res));
app.post('/api/auth/forgot-password', (req, res) => authController.forgotPassword(req, res));
app.post('/api/auth/reset-password', (req, res) => authController.resetPassword(req, res));
app.get('/api/auth/profile', authMiddleware, (req, res) => authController.getProfile(req, res));
app.put('/api/auth/profile', authMiddleware, (req, res) => authController.updateProfile(req, res));

app.use('/api/payments', paymentRoutes);
app.use('/api', paymentRoutes);
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

app.use(errorMiddleware);

export default app;
