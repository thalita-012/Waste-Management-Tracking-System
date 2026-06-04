import { NotificationModel } from '../models/notification.js';

export class NotificationRepository {
  // Store notifications in memory
  private notifications: NotificationModel[] = [];

  /**
   * Create and save a notification
   */
  create(notification: NotificationModel): NotificationModel {
    this.notifications.push(notification);

    return notification;
  }

  /**
   * Find all notifications by user ID
   */
  findByUser(userId: number): NotificationModel[] {
    return this.notifications.filter(
      (notification) => notification.userId === userId
    );
  }
}
