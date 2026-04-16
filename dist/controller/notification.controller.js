"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const helper_1 = require("../utils/helper");
class NotificationController {
}
exports.NotificationController = NotificationController;
_a = NotificationController;
NotificationController.getNotification = async (req, res) => {
    try {
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
//# sourceMappingURL=notification.controller.js.map