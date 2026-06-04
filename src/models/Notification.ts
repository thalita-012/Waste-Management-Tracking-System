import type { Notification } from '../interfaces/notification.interface.js';

export class NotificationModel implements Notification {
    id: number;
    userId: number;
    message: string;
    status: 'READ' | 'UNREAD';
    createAt: Date;

    constructor(data: Notification) {
        this.id = data.id;
        this.userId = data.userId;
        this.message = data.message;
        this.status = data.status;
        this.createAt = data.createAt;
    }
}