"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
class NotificationRepository {
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
exports.NotificationRepository = NotificationRepository;
// Store notifications in memory
NotificationRepository.notifications = [];
//# sourceMappingURL=NotificationRepository.js.map