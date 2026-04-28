"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const helper_1 = require("../utils/helper");
const common_model_1 = require("./common.model");
const cmnMdl = new common_model_1.commonModel();
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
    async getNotifications(data) {
        const { receiver_id, page = 1, limit = 10 } = data;
        const offset = (page - 1) * limit;
        const notifications = await (0, helper_1.executeQuery)(`
    SELECT 
      n.id,
      n.sender_id,
      n.receiver_id,
      n.title,
      n.message,
      n.type,
      n.is_read,
      n.extra_data,
      n.sent_to,
      DATE_FORMAT(n.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,

      u.user_name,
      u.profile_img

    FROM notifications n
    LEFT JOIN users u ON u.user_id = n.sender_id

    WHERE n.receiver_id = ? AND n.is_deleted = 0
    ORDER BY n.id DESC
    LIMIT ? OFFSET ?
    `, [receiver_id, Number(limit), Number(offset)]);
        const totalResult = await (0, helper_1.executeQuery)(`SELECT COUNT(*) as total FROM notifications WHERE receiver_id = ? AND is_deleted = 0`, [receiver_id]);
        const total = totalResult[0]?.total || 0;
        const formattedData = await Promise.all(notifications.map(async (n) => {
            let profileImg = [];
            if (n.profile_img) {
                const ids = String(n.profile_img)
                    .split(",")
                    .map((id) => Number(id.trim()))
                    .filter(Boolean);
                if (ids.length > 0) {
                    profileImg = await cmnMdl.getUploadFiles(ids);
                }
            }
            return {
                ...n,
                extra_data: n.extra_data ? JSON.parse(n.extra_data) : null,
                profile_img: profileImg,
            };
        }));
        return {
            data: formattedData,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async removeAllNotify(data) {
        const { ids, receiver_id, action } = data;
        if (action === "undo") {
            const rows = await (0, helper_1.executeQuery)(`
      SELECT id
      FROM notifications
      WHERE receiver_id = ? AND is_deleted = 1
      ORDER BY updated_at DESC
      LIMIT 1
      `, [receiver_id]);
            if (!rows.length) {
                throw new Error("No deleted notifications found");
            }
            await (0, helper_1.executeQuery)(`
      UPDATE notifications
      SET is_deleted = 0
      WHERE id = ? AND receiver_id = ?
      `, [rows[0].id, receiver_id]);
        }
        await (0, helper_1.executeQuery)(`
    DELETE FROM notifications
    WHERE receiver_id = ? AND is_deleted = 1
    `, [receiver_id]);
        if (ids && ids.length > 0) {
            if (ids.length === 1) {
                return await (0, helper_1.executeQuery)(`
        UPDATE notifications
        SET is_deleted = 1, updated_at = NOW()
        WHERE id = ? AND receiver_id = ?
        `, [ids[0], receiver_id]);
            }
            return await (0, helper_1.executeQuery)(`
      DELETE FROM notifications
      WHERE id IN (?) AND receiver_id = ?
      `, [ids, receiver_id]);
        }
        return await (0, helper_1.executeQuery)(`
    UPDATE notifications
    SET is_deleted = 1, updated_at = NOW()
    WHERE receiver_id = ? AND is_deleted = 0
    `, [receiver_id]);
    }
    async checkLastNotification(receiver_id) {
        const rows = await (0, helper_1.executeQuery)(`
    SELECT is_view
    FROM notifications
    WHERE receiver_id = ? AND is_deleted = 0
    ORDER BY created_at DESC
    LIMIT 1
    `, [receiver_id]);
        if (!rows.length)
            return 1;
        return rows[0].is_view === 1 ? 1 : 0;
    }
    async updateAllView(receiver_id) {
        return await (0, helper_1.executeQuery)(`
    UPDATE notifications
    SET is_view = 1
    WHERE receiver_id = ? AND is_deleted = 0
    `, [receiver_id]);
    }
    async setNotificationRead(id) {
        const result = await (0, helper_1.executeQuery)(`UPDATE notifications SET is_read = 1 WHERE id = ?`, [id]);
        return result;
    }
}
exports.NotificationModel = NotificationModel;
//# sourceMappingURL=notification.model.js.map