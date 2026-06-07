"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const Notification_js_1 = require("../models/Notification.js");
const NotificationRepository_js_1 = require("../repositories/NotificationRepository.js");
const distance_util_js_1 = require("../utils/distance.util.js");
class NotificationService {
    constructor() {
        this.notificationRepository = new NotificationRepository_js_1.NotificationRepository();
    }
    sendPaymentSuccessNotification(userId, orderId, amount, currency) {
        const normalizedUserId = this.normalizeUserId(userId);
        const message = `Payment successful for order ${orderId}: ${amount} ${currency}.`;
        const existingNotification = this.notificationRepository.findByUserAndMessage(normalizedUserId, message);
        if (existingNotification) {
            return existingNotification;
        }
        const notification = new Notification_js_1.NotificationModel({
            id: Date.now(),
            userId: normalizedUserId,
            message,
            status: 'UNREAD',
            createAt: new Date()
        });
        return this.notificationRepository.create(notification);
    }
    // Send notification when truck is nearby
    sendTruckNearbyNotification(userId, truckLat, truckLng, userLat, userLng) {
        const distance = distance_util_js_1.DistanceUtil.calculateDistance(truckLat, truckLng, userLat, userLng);
        if (distance >= 0.05) {
            return null;
        }
        const notification = new Notification_js_1.NotificationModel({
            id: Date.now(),
            userId: this.normalizeUserId(userId),
            message: 'The garbage truck will arrive in 10 minutes.',
            status: 'UNREAD',
            createAt: new Date()
        });
        return this.notificationRepository.create(notification);
    }
    // Send weekly garbage collection reminder
    sendWeeklyReminder(userId) {
        const notification = new Notification_js_1.NotificationModel({
            id: Date.now(),
            userId: this.normalizeUserId(userId),
            message: 'Reminder: Garbage collection is every Monday and Thursday.',
            status: 'UNREAD',
            createAt: new Date()
        });
        return this.notificationRepository.create(notification);
    }
    // Get all notifications for one user
    getUserNotifications(userId) {
        return this.notificationRepository.findByUser(this.normalizeUserId(userId));
    }
    normalizeUserId(userId) {
        return Number.isFinite(Number(userId)) && Number(userId) > 0 ? Number(userId) : 1;
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=NotificationService.js.map