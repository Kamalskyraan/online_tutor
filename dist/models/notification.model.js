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
    async getDeviceType(user_id) {
        const userRes = await (0, helper_1.executeQuery)(`SELECT device_token, device_type 
   FROM users 
   WHERE user_id = ?`, [user_id]);
        const device = userRes?.[0];
        return device;
    }
    async insertNOtifcations(data) {
        const { sender_id, receiver_id, title, message, type, extra_data, sent_to, } = data;
        const result = await (0, helper_1.executeQuery)(`
      INSERT INTO notifications 
      (sender_id, receiver_id, title, message, type, is_read, extra_data, sent_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
            sender_id || null,
            receiver_id,
            title,
            message,
            type || null,
            0,
            extra_data ? JSON.stringify(extra_data) : null,
            sent_to || null,
        ]);
        return result;
    }
}
exports.NotificationModel = NotificationModel;
//# sourceMappingURL=notification.model.js.map