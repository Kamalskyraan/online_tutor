import { convertNullToString, executeQuery } from "../utils/helper";

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
}
