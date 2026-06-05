import { NotificationModel } from '../models/Notification.js';
import { NotificationRepository } from '../repositories/NotificationRepository.js';
import { DistanceUtil } from '../utils/distance.util.js';
export class NotificationService {
    constructor() {
        this.notificationRepository = new NotificationRepository();
    }
    sendPaymentSuccessNotification(userId, orderId, amount, currency) {
        const normalizedUserId = this.normalizeUserId(userId);
        const message = `Payment successful for order ${orderId}: ${amount} ${currency}.`;
        const existingNotification = this.notificationRepository.findByUserAndMessage(normalizedUserId, message);
        if (existingNotification) {
            return existingNotification;
        }
        const notification = new NotificationModel({
            id: Date.now(),
            userId: normalizedUserId,
            message,
            status: 'UNREAD',
            createAt: new Date()
        });
        return this.notificationRepository.create(notification);
    }
    // Send notification when truck is nearby
    sendTruckNearbyNotification(userId, truckLat, truckLng, userLat, userLng) {
        const distance = DistanceUtil.calculateDistance(truckLat, truckLng, userLat, userLng);
        if (distance >= 0.05) {
            return null;
        }
        const notification = new NotificationModel({
            id: Date.now(),
            userId: this.normalizeUserId(userId),
            message: 'The garbage truck will arrive in 10 minutes.',
            status: 'UNREAD',
            createAt: new Date()
        });
        return this.notificationRepository.create(notification);
    }
    // Send weekly garbage collection reminder
    sendWeeklyReminder(userId) {
        const notification = new NotificationModel({
            id: Date.now(),
            userId: this.normalizeUserId(userId),
            message: 'Reminder: Garbage collection is every Monday and Thursday.',
            status: 'UNREAD',
            createAt: new Date()
        });
        return this.notificationRepository.create(notification);
    }
    // Get all notifications for one user
    getUserNotifications(userId) {
        return this.notificationRepository.findByUser(this.normalizeUserId(userId));
    }
    normalizeUserId(userId) {
        return Number.isFinite(Number(userId)) && Number(userId) > 0 ? Number(userId) : 1;
    }
}
//# sourceMappingURL=NotificationService.js.map