import { Router } from 'express';

import { NotificationController } from '../controllers/NotificationController.js';
import { authMiddleware } from '../middlewares/AuthMiddleware.js';

const router = Router();
const notificationController = new NotificationController();

/*
|--------------------------------------------------------------------------
| Notification Routes
|--------------------------------------------------------------------------
*/

// Protect all notification routes
router.use(authMiddleware);

/**
 * Send nearby truck alert notification
 * POST /notifications/nearby-alert
 */
router.post(
  '/nearby-alert',
  notificationController.sendNearbyAlert
);

/**
 * Send weekly reminder notification
 * POST /notifications/weekly-reminder
 */
router.post(
  '/weekly-reminder',
  notificationController.sendWeeklyReminder
);

/**
 * Get current user notifications
 * GET /notifications/me
 */
router.get(
  '/me',
  notificationController.getNotifications
);



export default router;