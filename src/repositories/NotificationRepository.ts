import { NotificationModel } from"../models/Notification";

export class NotificationRepository {
    private Notification: NotificationModel[] = [];
    create(notification: NotificationModel): NotificationModel {
        this.notifications: push(notification);
        return notification;
    }

    findByUser(userId:number): NotificationModel[] {

        return this.notifcations.filter(
            (notification) => notifications.userId === userId
        );

    }
}