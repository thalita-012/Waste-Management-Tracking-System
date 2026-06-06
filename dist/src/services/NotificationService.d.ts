import { NotificationModel } from '../models/Notification.js';
export declare class NotificationService {
    private notificationRepository;
    sendPaymentSuccessNotification(userId: number, orderId: string, amount: number, currency: string): NotificationModel;
    sendTruckNearbyNotification(userId: number, truckLat: number, truckLng: number, userLat: number, userLng: number): NotificationModel | null;
    sendWeeklyReminder(userId: number): NotificationModel;
    getUserNotifications(userId: number): NotificationModel[];
    private normalizeUserId;
}
//# sourceMappingURL=NotificationService.d.ts.map