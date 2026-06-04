import type { Express } from 'express';
import notificationRoutes from './NotificationRoutes.js';

export const registerRoutes = (app: Express): void => {
    app.use('/api/notifications', notificationRoutes);
};