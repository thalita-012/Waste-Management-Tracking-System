import type { Request, Response } from 'express';

import { NotificationService } from '../services/NotificationService.js';

export class NotificationController {
  private notificationService = new NotificationService();

  /**
   * Send notification when truck is nearby
   */
  sendNearbyAlert = (req: Request, res: Response): void => {
    const {
      userId,
      truckLat,
      truckLng,
      userLat,
      userLng,
    } = req.body;

    const notification =
      this.notificationService.sendTruckNearbyNotification(
        userId,
        truckLat,
        truckLng,
        userLat,
        userLng
      );

    // Truck is still far away
    if (!notification) {
      res.status(200).json({
        success: false,
        message: 'Truck is still far away',
      });

      return;
    }

    // Notification created successfully
    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      data: notification,
    });
  };

  /**
   * Send weekly garbage collection reminder
   */
  sendWeeklyReminder = (
    req: Request,
    res: Response
  ): void => {
    const { userId } = req.body;

    const notification =
      this.notificationService.sendWeeklyReminder(userId);

    res.status(201).json({
      success: true,
      message: 'Weekly reminder sent successfully',
      data: notification,
    });
  };

  /**
   * Get notifications for current user
   */
  getNotifications = (
    req: Request,
    res: Response
  ): void => {
    const userId = Number(req.params.userId);

    const notifications =
      this.notificationService.getUserNotifications(userId);

    res.status(200).json({
      success: true,
      data: notifications,
    });
  };
}