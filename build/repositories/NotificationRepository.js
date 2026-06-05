import { NotificationModel } from '../models/Notification.js';
export class NotificationRepository {
    /**
     * Create and save a notification
     */
    create(notification) {
        NotificationRepository.notifications.push(notification);
        return notification;
    }
    /**
     * Find all notifications by user ID
     */
    findByUser(userId) {
        return NotificationRepository.notifications.filter((notification) => notification.userId === userId);
    }
    findByUserAndMessage(userId, message) {
        return NotificationRepository.notifications.find((notification) => notification.userId === userId && notification.message === message);
    }
}
// Store notifications in memory
NotificationRepository.notifications = [];
//# sourceMappingURL=NotificationRepository.js.map