import { convertNullToString, executeQuery } from "../utils/helper";
import { commonModel } from "./common.model";

const cmnMdl = new commonModel();
export class NotificationModel {
  async createInAppNotification(data: any) {
    await executeQuery(
      `
    INSERT INTO notifications 
    (sender_id, receiver_id, title, message, type, extra_data, expires_at)
    VALUES (?, ?, ?, ?, ?, ?,  DATE_ADD(NOW(), INTERVAL 30 DAY))
  `,
      [
        data.sender_id,
        data.receiver_id,
        data.title,
        data.message,
        data.type,
        JSON.stringify(data.extra_data || {}),
      ],
    );
  }

  async getUserIdFromRole(data: any) {
    const { tutor_id, student_id } = data;

    let tutor_user_id: string | null = null;
    let student_user_id: string | null = null;

    if (tutor_id) {
      const tutor: any[] = await executeQuery(
        `SELECT user_id FROM tutor WHERE tutor_id = ?`,
        [tutor_id],
      );

      tutor_user_id = convertNullToString(tutor[0]?.user_id);
    }

    if (student_id) {
      const student: any[] = await executeQuery(
        `SELECT user_id FROM student WHERE student_id = ?`,
        [student_id],
      );

      student_user_id = convertNullToString(student[0]?.user_id);
    }

    return {
      tutor_user_id,
      student_user_id,
    };
  }

  async getDeviceType(user_id?: string) {
    const userRes: any = await executeQuery(
      `SELECT device_token, device_type 
   FROM users 
   WHERE user_id = ?`,
      [user_id],
    );

    const device = userRes?.[0];
    return device;
  }

  async insertNOtifcations(data: any) {
    const {
      sender_id,
      receiver_id,
      title,
      message,
      type,
      extra_data,
      sent_to,
    } = data;
    const result: any = await executeQuery(
      `
      INSERT INTO notifications 
      (sender_id, receiver_id, title, message, type, is_read, extra_data, sent_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        sender_id || null,
        receiver_id,
        title,
        message,
        type || null,
        0,
        extra_data ? JSON.stringify(extra_data) : null,
        sent_to || null,
      ],
    );

    return result;
  }

  async getNotifications(data: any) {
    const { receiver_id, page = 1, limit = 10 } = data;

    const offset = (page - 1) * limit;

    const notifications = await executeQuery(
      `
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
      n.created_at,

      u.user_name,
      u.profile_img

    FROM notifications n
    LEFT JOIN users u ON u.user_id = n.sender_id

    WHERE n.receiver_id = ? AND n.is_deleted = 0
    ORDER BY n.id DESC
    LIMIT ? OFFSET ?
    `,
      [receiver_id, Number(limit), Number(offset)],
    );

    const totalResult: any = await executeQuery(
      `SELECT COUNT(*) as total FROM notifications WHERE receiver_id = ?`,
      [receiver_id],
    );

    const total = totalResult[0]?.total || 0;

    const formattedData = await Promise.all(
      notifications.map(async (n: any) => {
        let profileImg: any[] = [];

        if (n.profile_img) {
          const ids = String(n.profile_img)
            .split(",")
            .map((id: string) => Number(id.trim()))
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
      }),
    );

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

  async removeAllNotify(data: any) {
    const { ids, receiver_id, action } = data;

    if (action === "undo") {
      const rows: any = await executeQuery(
        `
      SELECT id
      FROM notifications
      WHERE receiver_id = ? AND is_deleted = 1
      ORDER BY updated_at DESC
      LIMIT 1
      `,
        [receiver_id],
      );

      if (!rows.length) {
        throw new Error("No deleted notifications found");
      }

      await executeQuery(
        `
      UPDATE notifications
      SET is_deleted = 0
      WHERE id = ? AND receiver_id = ?
      `,
        [rows[0].id, receiver_id],
      );
    }

    await executeQuery(
      `
    DELETE FROM notifications
    WHERE receiver_id = ? AND is_deleted = 1
    `,
      [receiver_id],
    );

    if (ids && ids.length > 0) {
      if (ids.length === 1) {
        return await executeQuery(
          `
        UPDATE notifications
        SET is_deleted = 1, updated_at = NOW()
        WHERE id = ? AND receiver_id = ?
        `,
          [ids[0], receiver_id],
        );
      }

      return await executeQuery(
        `
      DELETE FROM notifications
      WHERE id IN (?) AND receiver_id = ?
      `,
        [ids, receiver_id],
      );
    }

    return await executeQuery(
      `
    UPDATE notifications
    SET is_deleted = 1, updated_at = NOW()
    WHERE receiver_id = ? AND is_deleted = 0
    `,
      [receiver_id],
    );
  }

  async checkLastNotification(receiver_id: string) {
    const rows: any = await executeQuery(
      `
    SELECT is_view
    FROM notifications
    WHERE receiver_id = ? AND is_deleted = 0
    ORDER BY created_at DESC
    LIMIT 1
    `,
      [receiver_id],
    );

    if (!rows.length) return 1;

    return rows[0].is_view === 1 ? 1 : 0;
  }
  async updateAllView(receiver_id: string) {
    return await executeQuery(
      `
    UPDATE notifications
    SET is_view = 1
    WHERE receiver_id = ? AND is_deleted = 0
    `,
      [receiver_id],
    );
  }
}
