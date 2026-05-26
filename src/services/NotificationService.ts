import { NotificationModel } from "../models/notification";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { DistanceUtil } from "../utils/distance.util";

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

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

    // Example: notify if truck is close
    if (distance < 0.05) {
      const notification = new NotificationModel({
        id: Date.now(),
        userId,
        message: "The garbage truck will arrive in 10 minutes.",
        status: "UNREAD",
        createdAt: new Date(),
      });

      return this.notificationRepository.create(notification);
    }

    return null;
  }

  sendWeeklyReminder(userId: number): NotificationModel {
    const notification = new NotificationModel({
      id: Date.now(),
      userId,
      message: "Reminder: Garbage collection is every Monday and Thursday.",
      status: "UNREAD",
      createdAt: new Date(),
    });

    return this.notificationRepository.create(notification);
  }

  getUserNotifications(userId: number) {
    return this.notificationRepository.findByUser(userId);
  }
}