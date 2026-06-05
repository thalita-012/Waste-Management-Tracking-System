import { NotificationModel } from '../models/notification.js';
import { NotificationRepository } from '../repositories/NotificationRepository.js';
import { DistanceUtil } from '../utils/distance.util.js';

export class NotificationService {
    private notificationRepository = new NotificationRepository();

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
            userId: userId,
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
            userId: userId,
            message: 'Reminder: Garbage collection is every Monday and Thursday.',
            status: 'UNREAD',
            createAt: new Date()
        });

        return this.notificationRepository.create(notification);
    }

  // Get all notifications for one user
    getUserNotifications(userId: number): NotificationModel[] {
        return this.notificationRepository.findByUser(userId);
    }
}
