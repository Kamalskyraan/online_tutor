"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const helper_1 = require("../utils/helper");
class NotificationModel {
    async createInAppNotification(data) {
        await (0, helper_1.executeQuery)(`
    INSERT INTO notifications 
    (sender_id, receiver_id, title, message, type, extra_data, expires_at)
    VALUES (?, ?, ?, ?, ?, ?,  DATE_ADD(NOW(), INTERVAL 30 DAY))
  `, [
            data.sender_id,
            data.receiver_id,
            data.title,
            data.message,
            data.type,
            JSON.stringify(data.extra_data || {}),
        ]);
    }
    async getUserIdFromRole(data) {
        const { tutor_id, student_id } = data;
        let tutor_user_id = null;
        let student_user_id = null;
        if (tutor_id) {
            const tutor = await (0, helper_1.executeQuery)(`SELECT user_id FROM tutor WHERE tutor_id = ?`, [tutor_id]);
            tutor_user_id = (0, helper_1.convertNullToString)(tutor[0]?.user_id);
        }
        if (student_id) {
            const student = await (0, helper_1.executeQuery)(`SELECT user_id FROM student WHERE student_id = ?`, [student_id]);
            student_user_id = (0, helper_1.convertNullToString)(student[0]?.user_id);
        }
        return {
            tutor_user_id,
            student_user_id,
        };
    }
}
exports.NotificationModel = NotificationModel;
//# sourceMappingURL=notification.model.js.map