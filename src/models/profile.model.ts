import { UpdateUserProfilePayload } from "../interface/interface";
import { executeQuery } from "../utils/helper";
import { commonModel } from "./common.model";

const cmnMdl = new commonModel();
export class ProfileModel {
  async fetchUserProfileData(user_id: string, user_role?: string) {
    if (!user_role) return null;

    let row: any = null;

    if (user_role === "tutor") {
      const [rows]: any = await executeQuery(
        `SELECT 
        u.user_id, u.user_name, u.profile_img, u.gender,
        u.num_changed_at ,
        u.country_code, u.mobile, u.email,
        u.district, u.state, u.pincode,u.is_show_num , u.lat , u.lng , 
        u.is_mob_verify , u.is_addmob_verify , u.is_mail_verify,
        
        u.add_mobile, u.primary_num,
        u.country, u.address, u.area, u.self_about,
        t.tutor_id, t.represent, t.stream_id, t.tutor_exp,
        t.exp_year , t.exp_month,
        cy.currency
      FROM users u
      LEFT JOIN tutor t ON t.user_id = u.user_id
      LEFT JOIN country cy ON cy.country = u.country
      WHERE u.user_id = ?`,
        [user_id],
      );

      row = rows || null;
    } else if (user_role === "student") {
      const [rows]: any = await executeQuery(
        `SELECT 
        u.user_id, u.user_name, u.profile_img, u.gender,
        u.dob,
        u.num_changed_at,
        u.country_code, u.mobile, u.email,
        u.district, u.state, u.pincode,
        u.add_mobile, u.primary_num,
        u.country, u.address, u.area, u.self_about,u.is_show_num , u.lat , u.lng , 
        u.is_mob_verify , u.is_addmob_verify , u.is_mail_verify,

        s.student_id,
        s.stream_id as student_stream_id,
        s.learn_course,
        s.req_course,

        cy.currency,

        GROUP_CONCAT(DISTINCT sub.subject_name) as learn_course_names,
        GROUP_CONCAT(DISTINCT lcr.subject_name) as requested_course_names

      FROM users u
      LEFT JOIN student s ON s.user_id = u.user_id
      LEFT JOIN subjects sub ON FIND_IN_SET(sub.id, s.learn_course)
      LEFT JOIN learn_course_request lcr ON FIND_IN_SET(lcr.id, s.req_course)
      LEFT JOIN country cy ON cy.country = u.country

      WHERE u.user_id = ?
      GROUP BY u.user_id`,
        [user_id],
      );

      row = rows || null;
    }

    if (!row) {
      return { role: user_role, data: "" };
    }

    if (row) {
      if (row.profile_img) {
        const images = await cmnMdl.getUploadFiles([row.profile_img]);

        if (Array.isArray(images)) {
          row.profile_img = images[0] ? [images[0]] : [];
        } else {
          row.profile_img = images?.[row.profile_img]
            ? [images[row.profile_img]]
            : [];
        }
      } else {
        row.profile_img = [];
      }
    }

    return {
      role: user_role,
      data: row,
    };
  }

  async fetchUserRole(user_id: string) {
    const [rows]: any = await executeQuery(
      `SELECT user_role FROM users WHERE user_id = ?`,
      [user_id],
    );

    return rows.user_role;
  }

  async addUpdateProfileData(
    user_id: string,
    payload: UpdateUserProfilePayload,
  ) {
    const updateTable = async (table: string, data: Record<string, any>) => {
      if (Object.keys(data).length === 0) return;

      const setClause = Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(", ");

      await executeQuery(`UPDATE ${table} SET ${setClause} WHERE user_id = ?`, [
        ...Object.values(data),
        user_id,
      ]);
    };

    // ================= USERS TABLE =================
    const userFields: (keyof UpdateUserProfilePayload)[] = [
      "user_name",
      "is_mob_verify",
      "is_addmob_verify",
      "is_mail_verify",
      "gender",
      "email",
      "mobile",
      "add_mobile",
      "primary_num",
      "country_code",
      "country",
      "pincode",
      "state",
      "district",
      "address",
      "area",
      "about_myself",
      "is_show_num",
      "profile_img",
    ];

    const userUpdateData: Record<string, any> = {};

    userFields.forEach((field) => {
      if (payload[field] !== undefined) {
        if (payload[field] === "" || payload[field] === null) {
          userUpdateData[field] = null;
        } else {
          userUpdateData[field] = payload[field];
        }
      }
    });

    await updateTable("users", userUpdateData);

    const tutorUpdateData: Record<string, any> = {};

    if (payload.represent !== undefined)
      tutorUpdateData.represent = payload.represent;

    if (payload.tutor_exp !== undefined)
      tutorUpdateData.tutor_exp = payload.tutor_exp;

    if (payload.exp_year !== undefined)
      tutorUpdateData.exp_year = payload.exp_year;

    if (payload.exp_month !== undefined)
      tutorUpdateData.exp_month = payload.exp_month;

    if (payload.stream_id !== undefined) {
      tutorUpdateData.stream_id =
        payload.stream_id === "" || payload.stream_id === null
          ? null
          : payload.stream_id;
    }

    await updateTable("tutor", tutorUpdateData);

    const studentUpdateData: Record<string, any> = {};

    if (payload.stream_id !== undefined) {
      studentUpdateData.stream_id =
        payload.stream_id === "" || payload.stream_id === null
          ? null
          : payload.stream_id;
    }

    await updateTable("student", studentUpdateData);
  }

  async checkExistingPrimaryNumber(user_id: string) {
    const [rows]: any = await executeQuery(
      `SELECT primary_num , country_code FROM users WHERE user_id = ?`,
      [user_id],
    );

    return rows;
  }

  async updatePrimaryNumber(
    user_id: string,
    new_primary_number: string,
    country_code: string,
    oldMobile: string,
  ) {
    await executeQuery(
      `UPDATE users 
     SET   primary_num = ?  WHERE user_id = ?`,
      [new_primary_number, user_id],
    );

    return true;
  }

  async updateAdditionalMobile(add_mobile: string, user_id: string) {
    await executeQuery(`UPDATE users SET add_mobile = ? WHERE user_id = ?`, [
      add_mobile,
      user_id,
    ]);
    return true;
  }

  async checkOldPassword(user_id: string) {
    const [rows]: any = await executeQuery(
      `SELECT password FROM users WHERE user_id = ?`,
      [user_id],
    );

    return rows;
  }

  async updateProfileImage(user_id: string, profile_id: string) {
    const value = profile_id ? profile_id : null;
    const result: any = await executeQuery(
      `UPDATE users SET profile_img = ? WHERE user_id = ?`,
      [value, user_id],
    );

    return {
      affectedRows: result?.affectedRows || 0,
      changedRows: result?.changedRows || 0,
    };
  }

  async updateRegisterNumber(user_id: string, mobile: string) {
    const result: any = await executeQuery(
      `UPDATE users 
     SET 
       mobile = ?,
       primary_num = CASE 
         WHEN primary_num = mobile THEN ?
         ELSE primary_num
       END,
       is_mob_verify = 1,
       num_changed_at = CURDATE() 
     WHERE user_id = ?`,
      [mobile, mobile, user_id],
    );

    return {
      affectedRows: result?.affectedRows || 0,
      changedRows: result?.changedRows || 0,
    };
  }
  async fetchReasons(id?: number) {
    let query = `SELECT * FROM delete_reasons`;
    let params: any[] = [];

    if (id) {
      query += ` WHERE id = ?`;
      params.push(id);
    }

    const [response]: any = await executeQuery(query, params);
    console.log(response);
    return response;
  }
}
