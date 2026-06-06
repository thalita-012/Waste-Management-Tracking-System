import { NotificationModel } from '../models/Notification.js';
export declare class NotificationRepository {
    private static notifications;
    /**
     * Create and save a notification
     */
    create(notification: NotificationModel): NotificationModel;
    /**
     * Find all notifications by user ID
     */
    findByUser(userId: number): NotificationModel[];
    findByUserAndMessage(userId: number, message: string): NotificationModel | undefined;
}
//# sourceMappingURL=NotificationRepository.d.ts.map