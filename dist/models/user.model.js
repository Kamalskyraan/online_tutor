"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const helper_1 = require("../utils/helper");
class UserModel {
    async fetchUserFormFilled(user_id) {
        const rows = await (0, helper_1.executeQuery)(`SELECT is_form_filled FROM users WHERE user_id = ?`, [user_id]);
        return rows.length ? rows[0].is_form_filled : 0;
    }
    async updateUserBasic(user) {
        const { user_role, gender, is_show_num, about_myself = null, user_id, } = user;
        const result = await (0, helper_1.executeQuery)(`UPDATE users SET user_role = ? , gender = ? , is_show_num = ? , self_about = ?  WHERE user_id = ?  `, [user_role, gender, is_show_num, about_myself, user_id]);
        return result.affectedRows;
    }
    async formFilledUpdate(user_id, step) {
        await (0, helper_1.executeQuery)(`UPDATE users SET is_form_filled = ? WHERE user_id = ?`, [step, user_id]);
    }
    async updateUserAddress(address_detail) {
        const { user_id, country, pincode, state, district, address, area, lat, lng, } = address_detail;
        const result = await (0, helper_1.executeQuery)(`UPDATE users SET area = ? ,district = ? , pincode = ? , state = ? , country = ? ,  address = ?,  lat = ? , lng= ?  WHERE user_id = ?`, [area, district, pincode, state, country, address, lat, lng, user_id]);
        return result.affectedRows;
    }
    async updateUserEducation(edu_details) {
        const { user_id, stream_id, user_name } = edu_details;
        const result = await (0, helper_1.executeQuery)(`UPDATE tutor SET stream_id = ? ,  user_name = ?  WHERE user_id = ? `, [stream_id, user_name, user_id]);
        return result.affectedRows;
    }
    async fetchUserName(user_id) {
        const rows = await (0, helper_1.executeQuery)(`SELECT user_name 
     FROM users 
     WHERE user_id = ?
     LIMIT 1`, [user_id]);
        return rows.length ? rows[0].user_name : "";
    }
    async updateTutorInfo(tutor) {
        const { tutor_id, user_id, user_name, represent } = tutor;
        if (tutor_id) {
            const result = await (0, helper_1.executeQuery)(`UPDATE tutor SET represent = ? WHERE tutor_id = ?`, [represent, tutor_id]);
            return result.affectedRows;
        }
        const rows = await (0, helper_1.executeQuery)(`SELECT tutor_id FROM tutor WHERE user_id = ? LIMIT 1`, [user_id]);
        if (rows.length) {
            const tutor_id = rows[0].tutor_id;
            const result = await (0, helper_1.executeQuery)(`UPDATE tutor SET represent = ?, user_name = ? WHERE tutor_id = ?`, [represent, user_name, tutor_id]);
            return result.affectedRows;
        }
        const tutorId = await (0, helper_1.generateTutorId)();
        const result = await (0, helper_1.executeQuery)(`INSERT INTO tutor (tutor_id , user_id , user_name , represent) VALUES (?,?,?,?)`, [tutorId, user_id, user_name, represent]);
        return result.affectedRows;
    }
    async fetchUserRole(user_id) {
        const [rows] = await (0, helper_1.executeQuery)(`SELECT user_role FROM users WHERE user_id = ?`, [user_id]);
        return rows.user_role;
    }
    async updateUserBasicForStudent(user) {
        const { gender, dob, country, pincode, area, district, state, is_show_num, address, user_id, } = user;
        let query = `UPDATE users SET `;
        const fields = [];
        const values = [];
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
        if (fields.length === 0)
            return 0;
        query += fields.join(", ") + ` WHERE id = ?`;
        values.push(user_id);
        const result = await (0, helper_1.executeQuery)(query, values);
        return result.affectedRows;
    }
    async updateStudentEducation(student) {
        const { user_id, stream_id, user_name, learn_course, student_id } = student;
        const existing = await (0, helper_1.executeQuery)(`SELECT id FROM students WHERE user_id = ? LIMIT 1`, [user_id]);
        if (existing.length > 0) {
            const result = await (0, helper_1.executeQuery)(`UPDATE students 
       SET stream_id = ?, learn_course = ?, user_name = ?
       WHERE user_id = ?`, [stream_id, learn_course, user_name, user_id]);
            return result.affectedRows;
        }
        const result = await (0, helper_1.executeQuery)(`INSERT INTO students 
     (user_id, stream_id, user_name, learn_course, student_id) 
     VALUES (?, ?, ?, ?, ?)`, [user_id, stream_id, user_name, learn_course, student_id]);
        return result.affectedRows;
    }
    //
    async fetchUserData(data) {
        const { user_id, mobile } = data;
        let query = `SELECT id , user_name , user_id , user_role , country_code , mobile , add_mobile as additional_mobile,  primary_num , email ,is_show_num , profile_img , gender , dob, country , state , area ,pincode ,self_about , address , lat , lng , is_form_filled  FROM users WHERE `;
        const values = [];
        if (user_id) {
            query += `user_id = ?`;
            values.push(user_id);
        }
        if (mobile) {
            query += `mobile = ?`;
            values.push(mobile);
        }
        const result = await (0, helper_1.executeQuery)(query, values);
        return (0, helper_1.convertNullToString)(result);
    }
    async createSubject(data) {
        const { subject_id, subject_name, covered_topics, syllabus_id, prior_exp, exp_months, exp_years, } = data;
        // const result = await executeQuery()
    }
    //
    async checkCourseExists(learn_course) {
        const result = await (0, helper_1.executeQuery)(`SELECT id FROM subjects WHERE subject_name = ?`, [learn_course]);
        return result.length > 0;
    }
    async createCourseRequest(data) {
        const { subject_name, user_id } = data;
        await (0, helper_1.executeQuery)(`INSERT INTO learn_course_request (subject_name, user_id)
     VALUES (?, ?)`, [subject_name, user_id]);
    }
    async createCourseRequestIfNotExists(data) {
        const { subject_name, user_id } = data;
        const existing = await (0, helper_1.executeQuery)(`SELECT id FROM learn_course_request 
     WHERE subject_name = ? AND user_id = ?`, [subject_name, user_id]);
        if (existing.length > 0)
            return;
        await (0, helper_1.executeQuery)(`INSERT INTO learn_course_request (course_name, user_id)
     VALUES (?, ?)`, [subject_name, user_id]);
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=user.model.js.map