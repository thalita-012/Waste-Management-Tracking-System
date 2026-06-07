"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NotificationController_js_1 = require("../controllers/NotificationController.js");
const AuthMiddleware_js_1 = require("../middlewares/AuthMiddleware.js");
const router = (0, express_1.Router)();
const notificationController = new NotificationController_js_1.NotificationController();
router.use(AuthMiddleware_js_1.authMiddleware);
router.post('/nearby-alert', notificationController.sendNearbyAlert);
router.post('/weekly-reminder', notificationController.sendWeeklyReminder);
router.get('/me', notificationController.getNotifications);
router.get('/user/:userId', notificationController.getNotifications);
exports.default = router;
//# sourceMappingURL=NotificationRoutes.js.map