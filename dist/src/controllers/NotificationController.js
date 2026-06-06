import { NotificationService } from '../services/NotificationService.js';
export class NotificationController {
    constructor() {
        this.notificationService = new NotificationService();
        /**
         * Send notification when truck is nearby
         */
        this.sendNearbyAlert = (req, res) => {
            const { userId, truckLat, truckLng, userLat, userLng, } = req.body;
            const notification = this.notificationService.sendTruckNearbyNotification(userId, truckLat, truckLng, userLat, userLng);
            // Truck is still far away
            if (!notification) {
                res.status(200).json({
                    success: false,
                    message: 'Truck is still far away',
                });
                return;
            }
            // Notification created successfully
            res.status(201).json({
                success: true,
                message: 'Notification sent successfully',
                data: notification,
            });
        };
        /**
         * Send weekly garbage collection reminder
         */
        this.sendWeeklyReminder = (req, res) => {
            const { userId } = req.body;
            const notification = this.notificationService.sendWeeklyReminder(userId);
            res.status(201).json({
                success: true,
                message: 'Weekly reminder sent successfully',
                data: notification,
            });
        };
        /**
         * Get notifications for current user
         */
        this.getNotifications = (req, res) => {
            const userId = Number(req.params.userId || req.query.userId || req.body?.userId || 1);
            const notifications = this.notificationService.getUserNotifications(userId);
            res.status(200).json({
                success: true,
                data: notifications,
            });
        };
    }
}
