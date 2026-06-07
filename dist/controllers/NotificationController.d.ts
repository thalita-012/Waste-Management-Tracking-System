import type { Request, Response } from 'express';
export declare class NotificationController {
    private notificationService;
    /**
     * Send notification when truck is nearby
     */
    sendNearbyAlert: (req: Request, res: Response) => void;
    /**
     * Send weekly garbage collection reminder
     */
    sendWeeklyReminder: (req: Request, res: Response) => void;
    /**
     * Get notifications for current user
     */
    getNotifications: (req: Request, res: Response) => void;
}
