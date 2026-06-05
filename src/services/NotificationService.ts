import { NotificationModel } from '../models/Notification.js';
import { NotificationRepository } from '../repositories/NotificationRepository.js';
import { DistanceUtil } from '../utils/distance.util.js';

export class NotificationService {
    private notificationRepository = new NotificationRepository();

    sendPaymentSuccessNotification(
        userId: number,
        orderId: string,
        amount: number,
        currency: string
    ): NotificationModel {
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
    sendTruckNearbyNotification(
        userId: number,
        truckLat: number,
        truckLng: number,
        userLat: number,
        userLng: number
    ): NotificationModel | null {

        const distance = DistanceUtil.calculateDistance(
            truckLat,
            truckLng,
            userLat,
            userLng
        );

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
    sendWeeklyReminder(userId: number): NotificationModel {

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
    getUserNotifications(userId: number): NotificationModel[] {
        return this.notificationRepository.findByUser(this.normalizeUserId(userId));
    }

    private normalizeUserId(userId: number): number {
        return Number.isFinite(Number(userId)) && Number(userId) > 0 ? Number(userId) : 1;
    }
}
