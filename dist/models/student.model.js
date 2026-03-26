"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModel = void 0;
const helper_1 = require("../utils/helper");
const education_model_1 = require("./education.model");
const eduMdl = new education_model_1.EduModel();
class StudentModel {
    async findNearbyTutors(location) {
        const { lat, lng, radius = 100, search_address } = location;
        if (lat && lng) {
            const query = `
      SELECT 
        u.user_id,
        u.user_name,
        u.lat,
        u.lng,
        u.state,
        u.district,
        u.area,
        u.pincode t.tutor_id
        
        (
          6371 * acos(
            cos(radians(?)) *
            cos(radians(u.lat)) *
            cos(radians(u.lng) - radians(?)) +
            sin(radians(?)) *
            sin(radians(u.lat))
          )
        ) AS distance,
         
        t.tutor_id,
        t.represent,
        t.stream_id
      FROM users u
      INNER JOIN tutor t ON t.user_id = u.user_id
      WHERE u.lat IS NOT NULL AND u.lng IS NOT NULL
      HAVING distance <= ?
      ORDER BY distance ASC
    `;
            const rows = await (0, helper_1.executeQuery)(query, [lat, lng, lat, radius]);
            return rows;
        }
        if (search_address) {
            const query = `
      SELECT 
        u.user_id,
        u.user_name,
        u.lat,
        u.lng,
        u.state,
        u.district,
        u.area,
        u.pincode
      FROM users u
      INNER JOIN tutor t ON t.user_id = u.user_id
      WHERE 
        u.state LIKE ? OR
        u.district LIKE ? OR
        u.area LIKE ? OR
        u.pincode LIKE ?
      ORDER BY u.user_name ASC
    `;
            const search = `%${search_address}%`;
            const rows = await (0, helper_1.executeQuery)(query, [
                search,
                search,
                search,
                search,
            ]);
            return rows;
        }
        return [];
    }
    async fetchStudentData(student_id) {
        const student = await (0, helper_1.executeQuery)(`SELECT student_id, user_id, user_name, stream_id, learn_course, req_course 
     FROM student 
     WHERE student_id = ? 
     LIMIT 1`, [student_id]);
        if (!student.length)
            return null;
        const studentData = student[0];
        const { user_id, stream_id, learn_course, req_course } = studentData;
        const user = await (0, helper_1.executeQuery)(`SELECT user_id, user_name, gender, pincode, area, district, state, 
            self_about, address, lat, lng, 
            is_form_filled as personal_form 
     FROM users 
     WHERE user_id = ? 
     LIMIT 1`, [user_id]);
        const userData = user.length ? user[0] : {};
        let streams = {};
        if (stream_id) {
            streams = await eduMdl.fetchStreamsForAll(stream_id);
        }
        let learnCourses = [];
        if (learn_course) {
            learnCourses = await this.fetchSubjectsByIds(learn_course);
        }
        let requestedCourses = [];
        if (req_course) {
            requestedCourses = await this.fetchRequestedCoursesByIds(req_course);
        }
        return {
            ...studentData,
            user: userData,
            streams,
            learn_courses: learnCourses,
            requested_courses: requestedCourses,
        };
    }
    async fetchRequestedCoursesByIds(req_course) {
        if (!req_course)
            return [];
        const ids = req_course
            .split(",")
            .map((id) => Number(id.trim()))
            .filter((id) => !isNaN(id));
        if (!ids.length)
            return [];
        const placeholders = ids.map(() => "?").join(",");
        const result = await (0, helper_1.executeQuery)(`SELECT id, subject_name 
     FROM learn_course_request 
     WHERE id IN (${placeholders})`, ids);
        return result;
    }
    async fetchSubjectsByIds(learn_course) {
        if (!learn_course)
            return [];
        const ids = learn_course
            .split(",")
            .map((id) => Number(id.trim()))
            .filter((id) => !isNaN(id));
        if (!ids.length)
            return [];
        const placeholders = ids.map(() => "?").join(",");
        const result = await (0, helper_1.executeQuery)(`SELECT id, subject_name 
     FROM subjects 
     WHERE id IN (${placeholders})`, ids);
        return result;
    }
}
exports.StudentModel = StudentModel;
//# sourceMappingURL=student.model.js.map