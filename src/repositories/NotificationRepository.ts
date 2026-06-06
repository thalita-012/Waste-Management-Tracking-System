import { NotificationModel } from '../models/Notification.js';

export class NotificationRepository {
  // Store notifications in memory
  private static notifications: NotificationModel[] = [];

  /**
   * Create and save a notification
   */
  create(notification: NotificationModel): NotificationModel {
    NotificationRepository.notifications.push(notification);

    return notification;
  }

  /**
   * Find all notifications by user ID
   */
  findByUser(userId: number): NotificationModel[] {
    return NotificationRepository.notifications.filter(
      (notification) => notification.userId === userId
    );
  }

  findByUserAndMessage(userId: number, message: string): NotificationModel | undefined {
    return NotificationRepository.notifications.find(
      (notification) => notification.userId === userId && notification.message === message
    );
  }
}
