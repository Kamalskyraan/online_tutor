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
        const { lat, lng, radius = 100, search_address, search_subject, page = 1, limit = 5, } = location;
        const offset = (page - 1) * limit;
        let rows = [];
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
        u.profile_img,
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
      RIGHT JOIN tutor_subjects ts ON ts.tutor_id = t.tutor_id AND ts.status = 'active'
      WHERE u.lat IS NOT NULL AND u.lng IS NOT NULL
      HAVING distance <= ?
      ORDER BY distance ASC
      LIMIT ? OFFSET ?
    `;
            rows = await (0, helper_1.executeQuery)(query, [lat, lng, lat, radius, limit, offset]);
        }
        else if (search_address) {
            const search = `%${search_address}%`;
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
        u.profile_img,
        t.tutor_id,
        t.stream_id,
        t.represent
      FROM users u
      RIGHT JOIN tutor t ON t.user_id = u.user_id
      RIGHT JOIN tutor_subjects ts ON ts.tutor_id = t.tutor_id AND ts.status = 'active'
      WHERE 
        u.state LIKE ? OR
        u.district LIKE ? OR
        u.area LIKE ? OR
        u.pincode LIKE ?
      LIMIT ? OFFSET ?
    `;
            rows = await (0, helper_1.executeQuery)(query, [
                search,
                search,
                search,
                search,
                limit,
                offset,
            ]);
        }
        else if (search_subject) {
            const keyword = search_subject.toLowerCase();
            const search = `%${search_subject}%`;
            const query = `
      SELECT DISTINCT
        u.user_id,
        u.user_name,
        u.lat,
        u.lng,
        u.profile_img,
        t.tutor_id,
        t.stream_id,
        t.represent
      FROM users u
      RIGHT JOIN tutor t ON t.user_id = u.user_id
      RIGHT JOIN tutor_subjects ts ON ts.tutor_id = t.tutor_id AND ts.status = 'active'
      
      LEFT JOIN subjects s ON s.id = ts.subject_id
      WHERE 
        ts.status = 'active'
        AND (
          s.subject_name LIKE ? OR
          ts.subject_name LIKE ?
        )
      LIMIT ? OFFSET ?
    `;
            rows = await (0, helper_1.executeQuery)(query, [search, search, limit, offset]);
        }
        if (!rows.length)
            return [];
        const data = await this.buildTutorFullData(rows);
        if (search_subject) {
            const keyword = search_subject.toLowerCase();
            const sorted = data.map((tutor) => {
                let hasMatch = false;
                tutor.subjects.sort((a, b) => {
                    const aName = a.sub[0]?.subject_name?.toLowerCase() || "";
                    const bName = b.sub[0]?.subject_name?.toLowerCase() || "";
                    const aMatch = aName.includes(keyword);
                    const bMatch = bName.includes(keyword);
                    if (aMatch)
                        hasMatch = true;
                    if (bMatch)
                        hasMatch = true;
                    if (aMatch && !bMatch)
                        return -1;
                    if (!aMatch && bMatch)
                        return 1;
                    return 0;
                });
                return {
                    ...tutor,
                    _matchPriority: hasMatch ? 1 : 0,
                };
            });
            sorted.sort((a, b) => b._matchPriority - a._matchPriority);
            return sorted.map(({ _matchPriority, ...rest }) => rest);
        }
        return data;
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
    //
    async buildTutorFullData(rows) {
        const safeParse = (data) => {
            try {
                return data ? JSON.parse(data) : [];
            }
            catch {
                return [];
            }
        };
        //
        const allStreamIds = rows
            .map((r) => r.stream_id)
            .filter(Boolean)
            .join(",");
        const streams = await eduMdl.fetchStreamsForAll(allStreamIds);
        const streamMap = new Map();
        streams.forEach((s) => {
            streamMap.set(s.stream_id, s);
        });
        //
        const tutorIds = rows.map((r) => r.tutor_id).filter(Boolean);
        let subjectRows = [];
        if (tutorIds.length) {
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
        subjectRows.forEach((sub) => {
            if (!subjectMap.has(sub.tutor_id)) {
                subjectMap.set(sub.tutor_id, []);
            }
            subjectMap.get(sub.tutor_id).push({
                id: sub.id,
                sub: [
                    {
                        id: sub.subject_id || "",
                        subject_name: sub.db_subject_name || sub.subject_name,
                        covered_topics: safeParse(sub.covered_topics),
                        min_fee: sub.min_fee,
                        max_fee: sub.max_fee,
                        tenure_type: sub.tenure_type,
                        class_mode: sub.class_mode,
                        class_type: sub.class_type,
                    },
                ],
            });
        });
        //
        const ratingMap = new Map();
        await Promise.all(tutorIds.map(async (id) => {
            const rating = await rvMdl.getReviewSummary(id);
            ratingMap.set(id, rating);
        }));
        let finalData = rows.map((row) => ({
            ...row,
            stream: row.stream_id
                ? streamMap.get(Number(row.stream_id)) || null
                : null,
            subjects: subjectMap.get(row.tutor_id) || [],
            ...(ratingMap.get(row.tutor_id) || {
                average_rating: 0,
                total_reviews: 0,
            }),
        }));
        const fileIds = finalData.map((r) => r.profile_img).filter(Boolean);
        let fileData = [];
        if (fileIds.length) {
            const placeholders = fileIds.map(() => "?").join(",");
            fileData = await (0, helper_1.executeQuery)(`SELECT file_type , file_url ,pathname , org_name , file_size   FROM media WHERE id IN (${placeholders})`, fileIds);
        }
        const fileMap = new Map();
        fileData.forEach((file) => {
            fileMap.set(file.id, {
                ...file,
                file_url: file.file_url?.startsWith("http")
                    ? file.file_url
                    : `https://${file.file_url}`,
            });
        });
        finalData = finalData.map((row) => ({
            ...row,
            profile_img: row.profile_img
                ? fileMap.get(row.profile_img) || null
                : null,
        }));
        return (0, helper_1.convertNullToString)(finalData);
    }
    async buildTutorFullDatasForId(rows) {
        const safeParse = (data) => {
            try {
                return data ? JSON.parse(data) : [];
            }
            catch {
                return [];
            }
        };
        const allStreamIds = rows
            .map((r) => r.stream_id)
            .filter(Boolean)
            .join(",");
        const streams = await eduMdl.fetchStreamsForAll(allStreamIds);
        const streamMap = new Map();
        streams.forEach((s) => {
            streamMap.set(Number(s.stream_id), s);
        });
        const tutorIds = rows.map((r) => r.tutor_id).filter(Boolean);
        let subjectRows = [];
        if (tutorIds.length) {
            const placeholders = tutorIds.map(() => "?").join(",");
            subjectRows = await (0, helper_1.executeQuery)(`
      SELECT ts.*, s.subject_name as db_subject_name 
      FROM tutor_subjects ts
      LEFT JOIN subjects s ON s.id = ts.subject_id
      WHERE ts.tutor_id IN (${placeholders})
      AND ts.status = 'active'
      `, tutorIds);
        }
        const allSylabusIds = new Set();
        const allLanguageIds = new Set();
        const allSubjectStreamIds = new Set();
        subjectRows.forEach((sub) => {
            if (sub.sylabus) {
                allSylabusIds.add(Number(sub.sylabus));
            }
            if (sub.teach_language) {
                sub.teach_language.split(",").forEach((id) => {
                    if (id)
                        allLanguageIds.add(Number(id));
                });
            }
            if (sub.stream_ids) {
                sub.stream_ids.split(",").forEach((id) => {
                    if (id)
                        allSubjectStreamIds.add(Number(id));
                });
            }
        });
        let sylabusData = [];
        if (allSylabusIds.size) {
            const ids = [...allSylabusIds];
            const placeholders = ids.map(() => "?").join(",");
            sylabusData = await (0, helper_1.executeQuery)(`SELECT id, file_type, file_url, pathname, org_name 
       FROM media 
       WHERE id IN (${placeholders})`, ids);
        }
        let languageData = [];
        if (allLanguageIds.size) {
            const ids = [...allLanguageIds];
            const placeholders = ids.map(() => "?").join(",");
            languageData = await (0, helper_1.executeQuery)(`SELECT id, lang_name FROM languages WHERE id IN (${placeholders})`, ids);
        }
        const subjectStreams = await eduMdl.fetchStreamsForAll([...allSubjectStreamIds].join(","));
        const sylabusMap = new Map();
        sylabusData.forEach((f) => {
            sylabusMap.set(Number(f.id), {
                id: f.id || "",
                file_type: f.file_type || "",
                pathname: f.pathname || "",
                org_name: f.org_name || "",
                file_url: f.file_url
                    ? f.file_url.startsWith("http")
                        ? f.file_url
                        : `https://${f.file_url}`
                    : "",
            });
        });
        const languageMap = new Map();
        languageData.forEach((l) => {
            languageMap.set(Number(l.id), {
                id: l.id || "",
                lang_name: l.lang_name || "",
            });
        });
        const subjectStreamMap = new Map();
        subjectStreams.forEach((s) => {
            subjectStreamMap.set(Number(s.stream_id), s);
        });
        const subjectMap = new Map();
        subjectRows.forEach((sub) => {
            if (!subjectMap.has(sub.tutor_id)) {
                subjectMap.set(sub.tutor_id, []);
            }
            subjectMap.get(sub.tutor_id).push({
                id: sub.id || "",
                sub: [
                    {
                        id: sub.subject_id || "",
                        subject_name: sub.db_subject_name || sub.subject_name || "",
                        covered_topics: safeParse(sub.covered_topics),
                        min_fee: sub.min_fee || "",
                        max_fee: sub.max_fee || "",
                        tenure_type: sub.tenure_type || "",
                        class_mode: sub.class_mode || "",
                        class_type: sub.class_type || "",
                        sylabus: sub.sylabus
                            ? sylabusMap.get(Number(sub.sylabus)) || {}
                            : {},
                        teach_language: sub.teach_language
                            ? sub.teach_language
                                .split(",")
                                .map((id) => languageMap.get(Number(id)) || {})
                                .filter((v) => Object.keys(v).length)
                            : [],
                        stream_ids: sub.stream_ids
                            ? sub.stream_ids
                                .split(",")
                                .map((id) => subjectStreamMap.get(Number(id)) || {})
                                .filter((v) => Object.keys(v).length)
                            : [],
                        prior_exp: sub.prior_exp || "",
                    },
                ],
            });
        });
        const ratingMap = new Map();
        await Promise.all(tutorIds.map(async (id) => {
            const rating = await rvMdl.getReviewSummary(id);
            ratingMap.set(id, rating);
        }));
        let finalData = rows.map((row) => ({
            ...row,
            stream: row.stream_id ? streamMap.get(Number(row.stream_id)) || {} : {},
            subjects: subjectMap.get(row.tutor_id) || [],
            ...(ratingMap.get(row.tutor_id) || {
                average_rating: 0,
                total_reviews: 0,
            }),
        }));
        const fileIds = finalData.map((r) => r.profile_img).filter(Boolean);
        let fileData = [];
        if (fileIds.length) {
            const placeholders = fileIds.map(() => "?").join(",");
            fileData = await (0, helper_1.executeQuery)(`SELECT id, file_type, file_url, pathname, org_name 
       FROM media 
       WHERE id IN (${placeholders})`, fileIds);
        }
        const fileMap = new Map();
        fileData.forEach((file) => {
            fileMap.set(Number(file.id), {
                id: file.id || "",
                file_type: file.file_type || "",
                pathname: file.pathname || "",
                org_name: file.org_name || "",
                file_url: file.file_url
                    ? file.file_url.startsWith("http")
                        ? file.file_url
                        : `https://${file.file_url}`
                    : "",
            });
        });
        finalData = finalData.map((row) => ({
            ...row,
            profile_img: row.profile_img
                ? fileMap.get(Number(row.profile_img)) || {}
                : {},
        }));
        return finalData;
    }
    //
    async studentClassBooking(data) {
        const { student_id, tutor_id, linked_sub } = data;
        const subjectCheck = await (0, helper_1.executeQuery)(`
    SELECT id, status 
    FROM tutor_subjects 
    WHERE id = ? AND tutor_id = ?
    `, [linked_sub, tutor_id]);
        if (!subjectCheck.length || subjectCheck[0].status !== "active") {
            return {
                status: "failed",
                message: "Tutor deleted this subject",
            };
        }
        const existing = await (0, helper_1.executeQuery)(`
    SELECT id, status 
    FROM tutor_student_rel
    WHERE student_id = ? 
    AND tutor_id = ? 
    AND linked_sub = ?
    ORDER BY id DESC
    LIMIT 1
    `, [student_id, tutor_id, linked_sub]);
        if (existing.length) {
            const current = existing[0];
            if (current.status === "approved") {
                return {
                    status: "approved",
                    message: "Already approved",
                };
            }
            if (current.status === "pending") {
                await (0, helper_1.executeQuery)(`
        UPDATE tutor_student_rel
        SET status = 'cancelled'
        WHERE id = ?
        `, [current.id]);
                return {
                    status: "cancelled",
                    message: "Booking cancelled",
                };
            }
        }
        const result = await (0, helper_1.executeQuery)(`
    INSERT INTO tutor_student_rel 
    (student_id, tutor_id, linked_sub, status, requested_at)
    VALUES (?, ?, ?, 'pending', NOW())
    `, [student_id, tutor_id, linked_sub]);
        return {
            booking_id: result.insertId,
            status: "pending",
            message: "Request sent",
        };
    }
    async getbookSessionStatus(session_id) {
        const data = await (0, helper_1.executeQuery)(`SELECT status FROM tutor_student_rel WHERE id = ?`, [session_id]);
        return data.length > 0 ? data[0].status : "";
    }
}
exports.StudentModel = StudentModel;
//# sourceMappingURL=student.model.js.map