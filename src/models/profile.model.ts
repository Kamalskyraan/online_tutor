import { UpdateUserProfilePayload } from "../interface/interface";
import { executeQuery } from "../utils/helper";

export class ProfileModel {
  async convertRepresentData(value: string) {
    const data =
      value === "1"
        ? "Student Tutor"
        : value === "2"
          ? "Teacher / Professor"
          : "Certified Trainer";

    return data;
  }
  async fetchUserProfileData(user_id: string, user_role?: string) {
    if (!user_role) {
      const [rows]: any = await executeQuery(
        `SELECT 
        user_id, user_name, profile_img, gender,
        country_code, mobile, email,
        district, state, pincode,
        add_mobile, primary_num,
        country, address, area, self_about
       FROM users
       WHERE user_id = ?`,
        [user_id],
      );

      return {
        data: rows[0] || null,
      };
    }

    if (user_role === "tutor") {
      const [rows]: any = await executeQuery(
        `SELECT 
        u.user_id, u.user_name, u.profile_img, u.gender,
        u.country_code, u.mobile, u.email,
        u.district, u.state, u.pincode,
        u.add_mobile, u.primary_num,
        u.country, u.address, u.area, u.self_about,
        t.tutor_id, t.represent, t.stream_id, t.tutor_exp,
        es.id as stream_id,
        es.edu_id,
        es.name as stream_name,

        el.id as edu_level_id,
        el.name as edu_name,
        el.board,

        cy.currency

      FROM users u
      LEFT JOIN tutor t ON t.user_id = u.user_id
      LEFT JOIN education_stream es ON es.id = t.stream_id
      LEFT JOIN education_level el ON el.id = es.edu_id
      LEFT JOIN country cy ON cy.country = u.country

      WHERE u.user_id = ?`,
        [user_id],
      );

      return {
        role: "tutor",
        data: rows[0] || null,
      };
    }

    // ✅ 3. STUDENT FLOW
    if (user_role === "student") {
      const [rows]: any = await executeQuery(
        `SELECT 
        u.user_id, u.user_name, u.profile_img, u.gender,
        u.country_code, u.mobile, u.email,
        u.district, u.state, u.pincode,
        u.add_mobile, u.primary_num,
        u.country, u.address, u.area, u.self_about,

        s.student_id,
        s.stream_id as student_stream_id,
        s.learn_course,
        s.req_course,

        es.id as stream_id,
        es.edu_id,
        es.name as stream_name,

        el.id as edu_level_id,
        el.name as edu_name,
        el.board,

        cy.currency,

        GROUP_CONCAT(DISTINCT sub.subject_name) as learn_course_names,
        GROUP_CONCAT(DISTINCT lcr.subject_name) as requested_course_names

      FROM users u

      LEFT JOIN student s ON s.user_id = u.user_id

      LEFT JOIN education_stream es ON es.id = s.stream_id
      LEFT JOIN education_level el ON el.id = es.edu_id

      LEFT JOIN subjects sub 
        ON FIND_IN_SET(sub.id, s.learn_course)

      LEFT JOIN learn_course_request lcr 
        ON FIND_IN_SET(lcr.id, s.req_course)

      LEFT JOIN country cy ON cy.country = u.country

      WHERE u.user_id = ?

      GROUP BY u.user_id`,
        [user_id],
      );

      return {
        role: "student",
        data: rows[0] || null,
      };
    }

    return null;
  }
  async addUpdateProfileData(
    user_id: string,
    payload: UpdateUserProfilePayload,
  ) {
    const userFields: (keyof UpdateUserProfilePayload)[] = [
      "user_name",
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
        userUpdateData[field] = payload[field];
      }
    });

    if (Object.keys(userUpdateData).length > 0) {
      const setClause = Object.keys(userUpdateData)
        .map((key) => `${key} = ?`)
        .join(", ");

      await executeQuery(`UPDATE users SET ${setClause} WHERE user_id = ?`, [
        ...Object.values(userUpdateData),
        user_id,
      ]);
    }

    const tutorUpdateData: Record<string, any> = {};
    if (payload.represent !== undefined)
      tutorUpdateData.represent = payload.represent;

    if (payload.tutor_exp !== undefined)
      tutorUpdateData.tutor_exp = payload.tutor_exp;

    if (payload.stream !== undefined)
      tutorUpdateData.stream_id = payload.stream;

    if (Object.keys(tutorUpdateData).length > 0) {
      const setClause = Object.keys(tutorUpdateData)
        .map((key) => `${key} = ?`)
        .join(", ");

      await executeQuery(`UPDATE tutor SET ${setClause} WHERE user_id = ?`, [
        ...Object.values(tutorUpdateData),
        user_id,
      ]);
    }
  }

  async checkExistingPrimaryNumber(user_id: string) {
    const [rows]: any = await executeQuery(
      `SELECT primary_num FROM users WHERE user_id = ?`,
      [user_id],
    );

    return rows;
  }

  async updatePrimaryNumber(
    user_id: string,
    mobile: string,
    country_code: string,
  ) {
    await executeQuery(
      `UPDATE users 
     SET primary_num = ?, country_code = ?
     WHERE user_id = ?`,
      [mobile, country_code, user_id],
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
}
