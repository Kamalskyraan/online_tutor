"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const helper_1 = require("../utils/helper");
const notification_model_1 = require("../models/notification.model");
const notifyMdl = new notification_model_1.NotificationModel();
class NotificationController {
}
exports.NotificationController = NotificationController;
_a = NotificationController;
NotificationController.createNotification = async (req, res) => {
    try {
        const { sender_id, receiver_id, title, message, type, extra_data, sent_to, } = req.body;
        if (!receiver_id || !title || !message) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Required fields missing", []);
        }
        const result = await notifyMdl.insertNOtifcations({
            sender_id,
            receiver_id,
            title,
            message,
            type,
            extra_data,
            sent_to,
        });
        return (0, helper_1.sendResponse)(res, 200, 1, result, "Notification created successfully");
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
//# sourceMappingURL=notification.controller.js.map