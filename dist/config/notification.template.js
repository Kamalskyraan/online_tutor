"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplates = void 0;
class NotificationTemplates {
    static review({ isUpdate, tutor_id, rating }) {
        return {
            title: isUpdate ? "Review Updated" : "New Review ",
            message: isUpdate
                ? "A student updated their review"
                : "You received a new review",
            type: "REVIEW",
            extra_data: { tutor_id, rating },
        };
    }
}
exports.NotificationTemplates = NotificationTemplates;
//# sourceMappingURL=notification.template.js.map