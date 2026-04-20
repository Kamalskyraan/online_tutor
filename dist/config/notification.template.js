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
    static lead({ lead_type, search_subject }) {
        return {
            title: "New Lead Received",
            message: lead_type === "search"
                ? `A student searched for ${search_subject || "a subject"}`
                : "A student viewed your profile",
            type: "LEAD",
            extra_data: { lead_type, search_subject },
        };
    }
}
exports.NotificationTemplates = NotificationTemplates;
//# sourceMappingURL=notification.template.js.map