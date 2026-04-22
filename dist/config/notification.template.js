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
    static reviewReply({ tutor_id, isUpdate }) {
        return {
            title: isUpdate ? "Reply Updated" : "Tutor Replied",
            message: isUpdate
                ? "Reply updated by tutor"
                : "Tutor replied to your review",
            type: "REVIEW_REPLY",
            extra_data: { tutor_id },
        };
    }
    static reviewLike({ review_id }) {
        return {
            title: "New Like",
            message: "liked your review",
            type: "REVIEW_LIKE",
            extra_data: { review_id },
        };
    }
    static studentRequest({ subject, student_name }) {
        return {
            title: "New Request Received",
            message: `student requested to your subject`,
            type: "STUDENT_REQUEST",
            extra_data: { subject, student_name },
        };
    }
}
exports.NotificationTemplates = NotificationTemplates;
//# sourceMappingURL=notification.template.js.map