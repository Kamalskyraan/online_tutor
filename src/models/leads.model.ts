import { NotificationTemplates } from "../config/notification.template";
import { Help } from "../interface/interface";
import { sendPushNotification } from "../service/firebase.service";
import { executeQuery } from "../utils/helper";
import { commonModel } from "./common.model";
import { EduModel } from "./education.model";
import { NotificationModel } from "./notification.model";
import { TutorModel } from "./tutor.model";

const cmnMdl = new commonModel();
const tutMdl = new TutorModel();
const eduMdl = new EduModel();
const notifMdl = new NotificationModel();
export class LeadsModel {
  async insertLead(data: {
    tutor_id?: string;
    student_id?: string;
    lead_type: "search" | "profile";
    search_subject?: string;
  }) {
    const {
      tutor_id,
      student_id = null,
      lead_type,
      search_subject = null,
    } = data;

    let search_address: string | null = null;

    if (student_id) {
      const studentRes: any = await executeQuery(
        `SELECT u.district
       FROM student s
       LEFT JOIN users u ON u.user_id = s.user_id
       WHERE s.student_id = ?`,
        [student_id],
      );

      search_address = studentRes?.[0]?.district || null;
    }

    const existing: any = await executeQuery(
      `
    SELECT id 
    FROM tutor_leads
    WHERE tutor_id = ?
      AND student_id <=> ?   
      AND lead_type = ?
      AND search_subject <=> ?
      AND DATE(created_at) = CURDATE()
    LIMIT 1
    `,
      [tutor_id, student_id, lead_type, search_subject],
    );

    if (existing.length > 0) {
      return;
    }

    await executeQuery(
      `INSERT INTO tutor_leads 
     (tutor_id, student_id, lead_type, search_subject, search_address)
     VALUES (?, ?, ?, ?, ?)`,
      [tutor_id, student_id, lead_type, search_subject, search_address],
    );

    const notif = NotificationTemplates.lead({
      lead_type,
      search_subject,
    });
    const userId = await notifMdl.getUserIdFromRole({ tutor_id, student_id });

    await notifMdl.insertNOtifcations({
      sender_id: userId.student_user_id,
      receiver_id: userId.tutor_user_id,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      extra_data: notif.extra_data,
      sent_to: "tutor",
    });

    if (!userId?.tutor_user_id) return;
    const user_id = userId.tutor_user_id;
    // await sendPushNotification(user_id, notif);
  }

  async fetchLeads(filters: any) {
    const {
      tutor_id,
      lead_id,
      from_date,
      to_date,
      subject_name,
      locations,
      leads_type,
      page = 1,
      limit = 10,
    } = filters;

    const offset = (page - 1) * limit;

    let where = `WHERE tl.tutor_id = ?`;
    let params: any[] = [tutor_id];

    if (lead_id) {
      where += ` AND tl.id = ?`;
      params.push(lead_id);
    }

    if (leads_type) {
      where += ` AND tl.lead_type = ?`;
      params.push(leads_type);
    }

    if (locations) {
      const locationArray = Array.isArray(locations)
        ? locations
        : locations.split(",");

      const cleaned = locationArray
        .map((loc: string) => loc.trim())
        .filter((loc: string) => loc);

      if (cleaned.length) {
        const likeConditions = cleaned
          .map(() => `tl.search_address LIKE ?`)
          .join(" OR ");

        where += ` AND (${likeConditions})`;

        cleaned.forEach((loc: string) => {
          params.push(`%${loc}%`);
        });
      }
    }

    if (from_date && to_date) {
      if (from_date === to_date) {
        where += ` AND DATE(tl.created_at) = ?`;
        params.push(from_date);
      } else {
        where += ` AND DATE(tl.created_at) BETWEEN ? AND ?`;
        params.push(from_date, to_date);
      }
    }

    const result: any[] = await executeQuery(
      `SELECT 
    tl.*,
    s.student_id,
    s.user_id,
    s.stream_id,
    u.dob,
    u.user_name,
    u.is_show_num,
    u.gender,
    u.mobile,
    u.email,
    u.area,
    u.district,
    u.state,
    u.pincode,
    u.profile_img
  FROM tutor_leads tl
  LEFT JOIN student s ON s.student_id = tl.student_id
  LEFT JOIN users u ON u.user_id = s.user_id
  ${where}
  ORDER BY tl.created_at DESC
  LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)],
    );

    if (!result.length) {
      return {
        data: [],
        pagination: { total: 0, page, limit, totalPages: 0 },
      };
    }

    const profileImgIds = result
      .map((row) => Number(row.profile_img))
      .filter((id) => !isNaN(id) && id > 0);

    let fileMap: any = {};

    if (profileImgIds.length > 0) {
      const files = await cmnMdl.getUploadFiles([...new Set(profileImgIds)]);

      fileMap = files.reduce((acc: any, file: any) => {
        acc[file.id] = file;
        return acc;
      }, {});
    }

    let finalData = await Promise.all(
      result.map(async (row: any) => {
        const linkedIds = row.linked_sub
          ?.toString()
          .split(",")
          .map((id: string) => Number(id.trim()))
          .filter((id: number) => !isNaN(id));

        let tutorSubjects: any[] = [];

        if (linkedIds?.length) {
          const placeholders = linkedIds.map(() => "?").join(",");

          tutorSubjects = await executeQuery(
            `SELECT id, subject_id, subject_name, status
           FROM tutor_subjects 
           WHERE id IN (${placeholders})`,
            linkedIds,
          );
        }

        const streams = row.stream_id
          ? await eduMdl.fetchStreamsForAll(row.stream_id.toString())
          : [];
        const subjects =
          await tutMdl.fetchSubjectsFromTutorSubjects(tutorSubjects);

        const profile_img = fileMap[row.profile_img]
          ? [fileMap[row.profile_img]]
          : [];
        let showNum;
        if (row.is_show_num === 0) {
          showNum = 0;
        } else {
          showNum = 1;
        }

        return cmnMdl.convertNullObjectToString({
          ...row,
          is_show_num: showNum,
          subjects,
          is_deleted: tutorSubjects?.[0]?.status ?? "direct-view",
          streams,
          profile_img,
        });
      }),
    );

    if (subject_name) {
      finalData = finalData.filter((row: any) =>
        row.subjects?.some((sub: any) =>
          sub.subject_name?.toLowerCase().includes(subject_name.toLowerCase()),
        ),
      );
    }

    const countRes: any = await executeQuery(
      `SELECT COUNT(*) as total
     FROM tutor_leads tl
     ${where}`,
      params,
    );

    const total = countRes[0]?.total || 0;

    return {
      data: finalData,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async fetchLeadsLocations(filters: any) {
    const {
      tutor_id,
      from_date,
      to_date,
      leads_type,
      search_subject,
      page = 1,
      limit = 1,
    } = filters;

    const offset = (page - 1) * limit;

    let where = `WHERE tl.tutor_id = ?`;
    let params: any[] = [tutor_id];

    if (leads_type) {
      where += ` AND tl.lead_type = ?`;
      params.push(leads_type);
    }

    if (search_subject) {
      where += ` AND tl.search_subject LIKE ?`;
      params.push(`%${search_subject}%`);
    }

    if (from_date && to_date) {
      if (from_date === to_date) {
        where += ` AND DATE(tl.created_at) = ?`;
        params.push(from_date);
      } else {
        where += ` AND DATE(tl.created_at) BETWEEN ? AND ?`;
        params.push(from_date, to_date);
      }
    }

    const data: any[] = await executeQuery(
      `SELECT 
      tl.search_address,
      COUNT(*) as total
     FROM tutor_leads tl
     ${where}
     AND tl.search_address IS NOT NULL
     AND tl.search_address != ''
     GROUP BY tl.search_address
     ORDER BY total DESC
     LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    const countResult: any[] = await executeQuery(
      `SELECT COUNT(*) as total FROM (
        SELECT tl.search_address
        FROM tutor_leads tl
        ${where}
        AND tl.search_address IS NOT NULL
        AND tl.search_address != ''
        GROUP BY tl.search_address
     ) as grouped`,
      params,
    );
    const total = countResult[0]?.total || 0;
    const total_pages = Math.ceil(total / limit);
    return {
      data: data.map((row: any) => ({
        search_address: row.search_address,
        count: row.total,
      })),
      total: countResult[0]?.total || 0,
      total_pages,
      page,
      limit,
    };
  }

  async setReadStatus(lead_id: number) {
    const result: any = await executeQuery(
      `UPDATE tutor_leads SET is_read = 1 WHERE id = ?`,
      [lead_id],
    );
    return result;
  }
}
