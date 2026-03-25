import { exec } from "node:child_process";
import db from "../config/db";
import {
  studentPersonalBody,
  tutorData,
  UserAddressBody,
  userDetailsRequest,
  UserEducationBody,
  UserProfileBody,
} from "../interface/interface";
import {
  convertNullToString,
  executeQuery,
  generateTutorId,
} from "../utils/helper";

export class UserModel {
  async fetchUserFormFilled(user_id: string): Promise<number> {
    const rows: any[] = await executeQuery(
      `SELECT is_form_filled FROM users WHERE user_id = ?`,
      [user_id],
    );

    return rows.length ? rows[0].is_form_filled : 0;
  }
  async updateUserBasic(user: UserProfileBody): Promise<number> {
    const {
      user_role,
      gender,
      is_show_num,
      about_myself = null,
      user_id,
    } = user;
    const result: any = await executeQuery(
      `UPDATE users SET user_role = ? , gender = ? , is_show_num = ? , self_about = ?  WHERE user_id = ?  `,
      [user_role, gender, is_show_num, about_myself, user_id],
    );
    return result.affectedRows;
  }
  async formFilledUpdate(user_id: string, step: number) {
    await executeQuery(
      `UPDATE users SET is_form_filled = ? WHERE user_id = ?`,
      [step, user_id],
    );
  }
  async updateUserAddress(address_detail: UserAddressBody) {
    const {
      user_id,
      country,
      pincode,
      state,
      district,
      address,
      area,
      lat,
      lng,
    } = address_detail;
    const result: any = await executeQuery(
      `UPDATE users SET area = ? ,district = ? , pincode = ? , state = ? , country = ? ,  address = ?,  lat = ? , lng= ?  WHERE user_id = ?`,
      [area, district, pincode, state, country, address, lat, lng, user_id],
    );
    return result.affectedRows;
  }
  async updateUserEducation(edu_details: UserEducationBody) {
    const { user_id, stream_id, user_name } = edu_details;
    const result: any = await executeQuery(
      `UPDATE tutor SET stream_id = ? ,  user_name = ?  WHERE user_id = ? `,
      [stream_id, user_name, user_id],
    );
    return result.affectedRows;
  }

  async fetchUserName(user_id: string): Promise<string> {
    const rows: any[] = await executeQuery(
      `SELECT user_name 
     FROM users 
     WHERE user_id = ?
     LIMIT 1`,
      [user_id],
    );

    return rows.length ? rows[0].user_name : "";
  }

  async updateTutorInfo(tutor: tutorData): Promise<number> {
    const { tutor_id, user_id, user_name, represent } = tutor;

    if (tutor_id) {
      const result: any = await executeQuery(
        `UPDATE tutor SET represent = ? WHERE tutor_id = ?`,
        [represent, tutor_id],
      );
      return result.affectedRows;
    }

    const rows: any[] = await executeQuery(
      `SELECT tutor_id FROM tutor WHERE user_id = ? LIMIT 1`,
      [user_id],
    );

    if (rows.length) {
      const tutor_id = rows[0].tutor_id;
      const result: any = await executeQuery(
        `UPDATE tutor SET represent = ?, user_name = ? WHERE tutor_id = ?`,
        [represent, user_name, tutor_id],
      );
      return result.affectedRows;
    }
    const tutorId = await generateTutorId();

    const result = await executeQuery(
      `INSERT INTO tutor (tutor_id , user_id , user_name , represent) VALUES (?,?,?,?)`,
      [tutorId, user_id, user_name, represent],
    );
    return result.affectedRows;
  }
  async fetchUserRole(user_id: string): Promise<string> {
    const [rows] = await executeQuery(
      `SELECT user_role FROM users WHERE user_id = ?`,
      [user_id],
    );
    return rows.user_role;
  }

  async updateUserBasicForStudent(user: studentPersonalBody): Promise<number> {
    const {
      gender,
      dob,
      country,
      pincode,
      area,
      district,
      state,
      is_show_num,
      address,
      user_id,
      user_role,
      lat,
      lng,
    } = user;

    let query = `UPDATE users SET `;
    const fields: string[] = [];
    const values: any[] = [];

    if (gender !== undefined) {
      fields.push(`gender = ?`);
      values.push(gender);
    }
    if (dob !== undefined) {
      fields.push(`dob = ?`);
      values.push(dob);
    }
    if (country !== undefined) {
      fields.push(`country = ?`);
      values.push(country);
    }
    if (pincode !== undefined) {
      fields.push(`pincode = ?`);
      values.push(pincode);
    }
    if (state !== undefined) {
      fields.push(`state = ?`);
      values.push(state);
    }
    if (district !== undefined) {
      fields.push(`district = ?`);
      values.push(district);
    }
    if (area !== undefined) {
      fields.push(`area = ?`);
      values.push(area);
    }
    if (is_show_num !== undefined) {
      fields.push(`is_show_num = ?`);
      values.push(is_show_num);
    }
    if (address !== undefined) {
      fields.push(`address = ?`);
      values.push(address);
    }
    if (user_role !== undefined) {
      fields.push(`user_role = ?`);
      values.push(user_role);
    }
    if (lat !== undefined) {
      fields.push(`lat = ?`);
      values.push(lat);
    }
    if (lng !== undefined) {
      fields.push(`lng = ?`);
      values.push(lng);
    }

    if (fields.length === 0) return 0;

    query += fields.join(", ") + ` WHERE user_id = ?`;
    values.push(user_id);

    const result: any = await executeQuery(query, values);
    return result.affectedRows;
  }

  async updateStudentEducation(student: UserEducationBody): Promise<number> {
    const {
      user_id,
      stream_id,
      user_name,
      learn_course,
      student_id,
      req_course,
    } = student;

    const existing: any = await executeQuery(
      `SELECT id FROM student WHERE user_id = ? LIMIT 1`,
      [user_id],
    );
    let updatedReqCourse = req_course || null;

    if (existing.length > 0) {
      if (req_course) {
        const oldReq = existing[0].req_course
          ? existing[0].req_course.split(",")
          : [];

        const newReq = [...new Set([...oldReq, ...req_course])];
        updatedReqCourse = newReq.join(",");
      }
      const result: any = await executeQuery(
        `UPDATE student
       SET stream_id = ?, learn_course = ?, user_name = ? , req_course = ?
       WHERE user_id = ?`,
        [stream_id, learn_course, user_name, req_course, user_id],
      );

      return result.affectedRows;
    }

    const result: any = await executeQuery(
      `INSERT INTO student
     (user_id, stream_id, user_name, learn_course, req_course , student_id) 
     VALUES (?, ?, ?, ?, ? , ?)`,
      [user_id, stream_id, user_name, learn_course, req_course, student_id],
    );

    return result.affectedRows;
  }
  //
  async fetchUserData(data: userDetailsRequest): Promise<any> {
    const { user_id, mobile } = data;

    let query = `
    SELECT id, user_name, user_id, user_role, country_code, mobile,
           add_mobile as additional_mobile, primary_num, email, is_show_num,
           profile_img, gender, dob, country, state, area, pincode,
           self_about, address, lat, lng, is_form_filled
    FROM users
  `;

    const conditions: string[] = [];
    const values: any[] = [];

    if (user_id) {
      conditions.push(`user_id = ?`);
      values.push(user_id);
    }

    if (mobile) {
      conditions.push(`mobile = ?`);
      values.push(mobile);
    }

    if (conditions.length) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    const result = await executeQuery(query, values);
    console.log(result)

    return convertNullToString(result);
  }

  async createSubject(data: any) {}

  //

  async checkCourseExists(learn_course: string) {
    const result: any = await executeQuery(
      `SELECT id FROM subjects WHERE subject_name = ?`,
      [learn_course],
    );

    return result.length > 0;
  }

  async createCourseRequest(data: any) {
    const { subject_name, user_id } = data;

    await executeQuery(
      `INSERT INTO learn_course_request (subject_name, user_id)
     VALUES (?, ?)`,
      [subject_name, user_id],
    );
  }

  async createCourseRequestIfNotExists(data: any) {
    const { subject_name, user_id } = data;

    const existing: any = await executeQuery(
      `SELECT id FROM learn_course_request 
     WHERE subject_name = ? AND user_id = ?`,
      [subject_name, user_id],
    );

    if (existing.length > 0) return existing[0].id;

    const result: any = await executeQuery(
      `INSERT INTO learn_course_request (subject_name, user_id)
     VALUES (?, ?)`,
      [subject_name, user_id],
    );
    return result.insertId;
  }

  async getStudentByUserId(user_id: string) {
    const result: any = await executeQuery(
      `SELECT id, student_id FROM student WHERE user_id = ? LIMIT 1`,
      [user_id],
    );

    return result.length ? result[0] : null;
  }

  async fetchSubFormData(user_id: string) {
    const tutorData: any = await executeQuery(
      `SELECT tutor_id FROM tutor WHERE user_id = ? LIMIT 1`,
      [user_id],
    );

    if (!tutorData.length) {
      return { sub_form: "0" };
    }

    const tutor_id = tutorData[0].tutor_id;

    if (!tutor_id) {
      return {
        sub_form: "0",
      };
    }

    const subFormData: any = await executeQuery(
      `SELECT sub_form FROM tutor_subjects 
     WHERE tutor_id = ? 
     LIMIT 1`,
      [tutor_id],
    );

    return {
      tutor_id,
      sub_form: subFormData[0].sub_form ? subFormData[0].sub_form : "0",
    };
  }

  //
  async getCourseByName(subject_name: string) {
    const result: any = await executeQuery(
      `SELECT id FROM subjects WHERE subject_name = ? LIMIT 1`,
      [subject_name],
    );

    return result.length ? result[0] : null;
  }

  async approveCourseRequest(request_id: number) {
    const request: any = await executeQuery(
      `SELECT * FROM learn_course_request WHERE id = ?`,
      [request_id],
    );

    if (!request.length) return;

    const { subject_name } = request[0];

    let subject: any = await executeQuery(
      `SELECT id FROM subjects WHERE subject_name = ? LIMIT 1`,
      [subject_name],
    );

    let subject_id: number;

    if (subject.length > 0) {
      subject_id = subject[0].id;
    } else {
      const subjectResult: any = await executeQuery(
        `INSERT INTO subjects (subject_name) VALUES (?)`,
        [subject_name],
      );
      subject_id = subjectResult.insertId;
    }

    const students: any = await executeQuery(
      `SELECT user_id, req_course, learn_course FROM student
     WHERE FIND_IN_SET(?, req_course)`,
      [request_id],
    );

    for (const student of students) {
      const reqList = student.req_course
        ? student.req_course
            .split(",")
            .filter((id: string) => Number(id) !== request_id)
        : [];

      const learnList = student.learn_course
        ? student.learn_course.split(",").map(Number)
        : [];

      if (!learnList.includes(subject_id)) {
        learnList.push(subject_id);
      }

      await executeQuery(
        `UPDATE student
       SET req_course = ?, learn_course = ?
       WHERE user_id = ?`,
        [
          reqList.length ? reqList.join(",") : null,
          learnList.length ? learnList.join(",") : null,
          student.user_id,
        ],
      );
    }

    await executeQuery(
      `UPDATE learn_course_request SET status = 'approved' WHERE id = ?`,
      [request_id],
    );
  }
}
