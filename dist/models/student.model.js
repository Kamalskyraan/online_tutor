"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModel = void 0;
const helper_1 = require("../utils/helper");
const education_model_1 = require("./education.model");
const review_model_1 = require("./review.model");
const eduMdl = new education_model_1.EduModel();
const rvMdl = new review_model_1.ReviewModel();
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
      u.pincode,
      u.self_about,
      t.tutor_id,
      t.stream_id,
      t.represent,



      (
        6371 * acos(
          cos(radians(?)) *
          cos(radians(u.lat)) *
          cos(radians(u.lng) - radians(?)) +
          sin(radians(?)) *
          sin(radians(u.lat))
        )
      ) AS distance

    FROM users u
    RIGHT JOIN tutor t ON t.user_id = u.user_id
    WHERE u.lat IS NOT NULL AND u.lng IS NOT NULL
    HAVING distance <= ?
    ORDER BY distance ASC
  `;
            const rows = await (0, helper_1.executeQuery)(query, [lat, lng, lat, radius]);
            const allStreamIds = rows
                .map((row) => row.stream_id)
                .filter((id) => id)
                .join(",");
            const streams = await eduMdl.fetchStreamsForAll(allStreamIds);
            const streamMap = new Map();
            streams.forEach((s) => {
                streamMap.set(s.stream_id, s);
            });
            const tutorIds = rows.map((r) => r.tutor_id).filter((id) => id);
            const placeholders = tutorIds.map(() => "?").join(",");
            let subjectRows = [];
            if (tutorIds.length === 1) {
                subjectRows = await (0, helper_1.executeQuery)(`
    SELECT ts.*, s.subject_name as db_subject_name
    FROM tutor_subjects ts
    LEFT JOIN subjects s ON s.id = ts.subject_id
    WHERE ts.tutor_id = ?
    AND ts.status = 'active'
    `, [tutorIds[0]]);
            }
            else if (tutorIds.length > 1) {
                const placeholders = tutorIds.map(() => "?").join(",");
                subjectRows = await (0, helper_1.executeQuery)(`
    SELECT ts.*, s.subject_name as db_subject_name 
    FROM tutor_subjects ts
    LEFT JOIN subjects s ON s.id = ts.subject_id
    WHERE ts.tutor_id IN (${placeholders})
    AND ts.status = 'active'
    `, tutorIds);
            }
            const subjectMap = new Map();
            subjectRows.map((sub) => {
                const tutorId = sub.tutor_id;
                if (!subjectMap.has(tutorId)) {
                    subjectMap.set(tutorId, []);
                }
                let subjectArr = [];
                if (sub.subject_id) {
                    subjectArr.push({
                        id: sub.subject_id,
                        subject_name: sub.db_subject_name,
                    });
                }
                else if (sub.subject_name) {
                    subjectArr.push({
                        id: "",
                        subject_name: sub.subject_name,
                    });
                }
                subjectMap.get(tutorId).push({
                    id: sub.id,
                    sub: subjectArr,
                    // class_mode: sub.class_mode,
                    // class_type: sub.class_type,
                    // min_fee: sub.min_fee,
                    // max_fee: sub.max_fee,
                });
            });
            const avgRating = await rvMdl.getReviewSummary(tutorIds);
            const ratingMap = new Map();
            [avgRating].forEach((r) => {
                ratingMap.set(r.tutor_id, {
                    avg_rating: r.avg_rating,
                    total_reviews: r.total_reviews,
                });
            });
            const finalData = rows.map((row) => {
                const rating = ratingMap.get(row.tutor_id) || {
                    average_rating: 0,
                    total_reviews: 0,
                };
                return {
                    ...row,
                    stream: row.stream_id
                        ? streamMap.get(Number(row.stream_id)) || null
                        : null,
                    subjects: subjectMap.get(row.tutor_id) || [],
                    average_rating: rating.average_rating,
                    total_reviews: rating.total_reviews,
                };
            });
            return (0, helper_1.convertNullToString)(finalData);
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