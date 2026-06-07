"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
class NotificationModel {
    constructor(data) {
        this.id = data.id;
        this.userId = data.userId;
        this.message = data.message;
        this.status = data.status;
        this.createAt = data.createAt;
    }
}
exports.NotificationModel = NotificationModel;
//# sourceMappingURL=Notification.js.map