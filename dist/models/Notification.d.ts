import type { Notification } from '../interfaces/notification.interface.js';
export declare class NotificationModel implements Notification {
    id: number;
    userId: number;
    message: string;
    status: 'READ' | 'UNREAD';
    createAt: Date;
    constructor(data: Notification);
}
