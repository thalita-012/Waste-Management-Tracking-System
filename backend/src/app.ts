import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { testConnection } from './config/db.js';
import { authController } from './controllers/AuthController.js';
import { authMiddleware } from './middlewares/AuthMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendSourcePath = path.resolve(__dirname, '..', '..', 'frontend');
const frontendBuildPath = path.join(frontendSourcePath, 'dist');
const frontendPath = fs.existsSync(path.join(frontendBuildPath, 'index.html'))
  ? frontendBuildPath
  : frontendSourcePath;

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.static(frontendPath));

// Auth routes
app.post('/api/auth/register', (req, res) => authController.register(req, res));
app.post('/api/auth/login', (req, res) => authController.login(req, res));
app.post('/api/auth/forgot-password', (req, res) => authController.forgotPassword(req, res));
app.post('/api/auth/reset-password', (req, res) => authController.resetPassword(req, res));
app.get('/api/auth/profile', authMiddleware, (req, res) => authController.getProfile(req, res));
app.put('/api/auth/profile', authMiddleware, (req, res) => authController.updateProfile(req, res));

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

app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

export default app;
