"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModel = void 0;
const helper_1 = require("../utils/helper");
const common_model_1 = require("./common.model");
const education_model_1 = require("./education.model");
const review_model_1 = require("./review.model");
const eduMdl = new education_model_1.EduModel();
const rvMdl = new review_model_1.ReviewModel();
const cmnMdl = new common_model_1.commonModel();
class StudentModel {
    //   public async findNearbyTutors(location: any): Promise<any> {
    //     const {
    //       lat,
    //       lng,
    //       radius = 100,
    //       search_address,
    //       search_subject,
    //       page = 1,
    //       limit = 5,
    //       tutor_type,
    //       rating,
    //       gender,
    //       represent,
    //       min_fee,
    //       max_fee,
    //       tenure_type,
    //       class_mode,
    //       class_type,
    //       languages,
    //       student_id,
    //     } = location;
    //     const offset = (page - 1) * limit;
    //     let prefIds: number[] = [];
    //     if (student_id) {
    //       const pref: any = await executeQuery(
    //         `SELECT learn_course FROM student WHERE student_id = ?`,
    //         [student_id],
    //       );
    //       prefIds = pref.map((p: any) => p.learn_course);
    //     }
    //     let params: any[] = [];
    //     let where = `WHERE u.is_deleted = 0 AND ts.status = 'active'`;
    //     let having = "";
    //     let orderBy = "";
    //     let distanceField = "";
    //     if (lat && lng) {
    //       distanceField = `,
    //       (6371 * acos(
    //         cos(radians(?)) *
    //         cos(radians(u.lat)) *
    //         cos(radians(u.lng) - radians(?)) +
    //         sin(radians(?)) *
    //         sin(radians(u.lat))
    //       )) AS distance`;
    //       params.push(lat, lng, lat);
    //       where += ` AND u.lat IS NOT NULL AND u.lng IS NOT NULL`;
    //     }
    //     if (search_address) {
    //       const search = `%${search_address}%`;
    //       where += ` AND (u.state LIKE ? OR u.district LIKE ? OR u.area LIKE ? OR u.pincode LIKE ?)`;
    //       params.push(search, search, search, search);
    //     }
    //     if (search_subject) {
    //       const search = `%${search_subject}%`;
    //       where += ` AND (s.subject_name LIKE ? OR ts.subject_name LIKE ?)`;
    //       params.push(search, search);
    //     }
    //     if (gender) {
    //       where += ` AND u.gender = ?`;
    //       params.push(gender);
    //     }
    //     if (represent) {
    //       const reps = represent.split(",").map((r: any) => r.trim());
    //       where += ` AND t.represent IN (${reps.map(() => "?").join(",")})`;
    //       params.push(...reps);
    //     }
    //     if (min_fee) {
    //       where += ` AND ts.min_fee >= ?`;
    //       params.push(min_fee);
    //     }
    //     if (max_fee) {
    //       where += ` AND ts.max_fee <= ?`;
    //       params.push(max_fee);
    //     }
    //     if (tenure_type) {
    //       where += ` AND ts.tenure_type = ?`;
    //       params.push(tenure_type);
    //     }
    //     if (class_mode) {
    //       where += ` AND ts.class_mode = ?`;
    //       params.push(class_mode);
    //     }
    //     if (class_type) {
    //       where += ` AND ts.class_type = ?`;
    //       params.push(class_type);
    //     }
    //     if (languages && languages.length) {
    //       where += ` AND (${languages
    //         .map(() => `FIND_IN_SET(?, ts.teach_language)`)
    //         .join(" OR ")})`;
    //       params.push(...languages);
    //     }
    //     let priorityOrder = "";
    //     if (prefIds.length) {
    //       priorityOrder = `
    //       CASE
    //         WHEN ts.subject_id IN (${prefIds.map(() => "?").join(",")}) THEN 1
    //         ELSE 0
    //       END DESC,`;
    //       params.push(...prefIds);
    //     }
    //     if (rating !== undefined) {
    //       const ratingValue = Number(rating);
    //       having = `
    //       HAVING avg_rating >= ? AND avg_rating < ?
    //     `;
    //       params.push(ratingValue, ratingValue + 1);
    //     }
    //     orderBy = `
    //     ORDER BY
    //       ${lat && lng ? "distance ASC," : ""}
    //       avg_rating DESC
    //   `;
    //     const query = `
    //     SELECT
    //       u.user_id,
    //       u.user_name,
    //       u.lat,
    //       u.lng,
    //       u.gender,
    //       u.profile_img,
    //       u.state,
    //       u.district,
    //       u.area,
    //       u.pincode,
    //       u.self_about,
    //       t.tutor_id,
    //       t.represent,
    //   ts.subject_id,
    //       ts.subject_name,
    //       ts.min_fee,
    //      ts.max_fee,
    //       ts.tenure_type,
    //      ts.teach_language,
    //       ts.class_mode,
    //       ts.class_type,
    //      (
    //         SELECT AVG(r2.rating)
    //         FROM reviews r2
    //         WHERE r2.tutor_id = t.tutor_id
    //       ) AS avg_rating,
    //       CASE
    //         WHEN EXISTS (
    //           SELECT 1
    //           FROM tutor_leads tl2
    //           WHERE tl2.tutor_id = t.tutor_id
    //             AND tl2.student_id = ?
    //             AND tl2.lead_type = 'profile'
    //         ) THEN 0
    //         ELSE 1
    //       END AS is_new,
    //       CASE
    //   WHEN EXISTS (
    //     SELECT 1
    //     FROM tutor_likes tl
    //     WHERE tl.tutor_id = t.tutor_id
    //       AND tl.student_id = ?
    //       AND tl.is_like = 1
    //   ) THEN 1
    //   ELSE 0
    // END AS is_like
    //       ${distanceField}
    //     FROM users u
    //     JOIN tutor t ON t.user_id = u.user_id
    //     JOIN tutor_subjects ts ON ts.tutor_id = t.tutor_id
    //     LEFT JOIN subjects s ON s.id = ts.subject_id
    //     ${where}
    //     GROUP BY t.tutor_id
    //     ${having}
    //     ${orderBy}
    //     LIMIT ? OFFSET ?
    //   `;
    //     let finalParams = [];
    //     finalParams.push(student_id || "");
    //     finalParams.push(student_id || "");
    //     finalParams.push(...params);
    //     finalParams.push(limit, offset);
    //     const countQuery = `
    //     SELECT COUNT(DISTINCT t.tutor_id) as total
    //     FROM users u
    //     JOIN tutor t ON t.user_id = u.user_id
    //     JOIN tutor_subjects ts ON ts.tutor_id = t.tutor_id
    //     LEFT JOIN subjects s ON s.id = ts.subject_id
    //     LEFT JOIN reviews r ON r.tutor_id = t.tutor_id
    //     ${where}
    //     GROUP BY t.tutor_id
    //   ${having}
    //   `;
    //     const countResult: any = await executeQuery(countQuery, params);
    //     const total = countResult[0]?.total || 0;
    //     const rows: any = await executeQuery(query, finalParams);
    //     const data = await this.buildTutorFullData(rows, search_subject);
    //     if (!rows.length)
    //       return {
    //         data: [],
    //         pagination: {
    //           total: 0,
    //           page,
    //           limit,
    //           total_pages: 0,
    //         },
    //       };
    //     return {
    //       data,
    //       pagination: {
    //         total,
    //         page,
    //         limit,
    //         total_pages: Math.ceil(total / limit),
    //       },
    //     };
    //   }
    async findNearbyTutors(location) {
        const { lat, lng, search_address, search_subject, page = 1, limit = 5, rating, gender, represent, min_fee, max_fee, tenure_type, class_mode, class_type, languages, student_id, } = location;
        const offset = (page - 1) * limit;
        let params = [];
        let where = `WHERE u.is_deleted = 0 AND ts.status = 'active'`;
        let having = "";
        let orderBy = "";
        let distanceField = "";
        if (lat && lng) {
            distanceField = `,
    (6371 * acos(
      cos(radians(?)) *
      cos(radians(u.lat)) *
      cos(radians(u.lng) - radians(?)) +
      sin(radians(?)) *
      sin(radians(u.lat))
    )) AS distance`;
            params.push(lat, lng, lat);
            where += ` AND u.lat IS NOT NULL AND u.lng IS NOT NULL`;
        }
        if (search_address) {
            const search = `%${search_address}%`;
            where += ` AND (u.state LIKE ? OR u.district LIKE ? OR u.area LIKE ? OR u.pincode LIKE ?)`;
            params.push(search, search, search, search);
        }
        if (search_subject) {
            const search = `%${search_subject}%`;
            where += ` AND (s.subject_name LIKE ? OR ts.subject_name LIKE ?)`;
            params.push(search, search);
        }
        if (gender) {
            where += ` AND u.gender = ?`;
            params.push(gender);
        }
        if (represent) {
            const reps = represent.split(",");
            where += ` AND t.represent IN (${reps.map(() => "?").join(",")})`;
            params.push(...reps);
        }
        if (min_fee) {
            where += ` AND ts.min_fee >= ?`;
            params.push(min_fee);
        }
        if (max_fee) {
            where += ` AND ts.max_fee <= ?`;
            params.push(max_fee);
        }
        if (tenure_type) {
            where += ` AND ts.tenure_type = ?`;
            params.push(tenure_type);
        }
        if (class_mode) {
            where += ` AND ts.class_mode = ?`;
            params.push(class_mode);
        }
        if (class_type) {
            where += ` AND ts.class_type = ?`;
            params.push(class_type);
        }
        if (languages?.length) {
            where += ` AND (${languages.map(() => `FIND_IN_SET(?, ts.teach_language)`).join(" OR ")})`;
            params.push(...languages);
        }
        if (rating !== undefined) {
            const ratingValue = Number(rating);
            having = `
      HAVING avg_rating >= ? AND avg_rating < ?
    `;
            params.push(ratingValue, ratingValue + 1);
        }
        orderBy = `
    ORDER BY 
      ${lat && lng ? "distance ASC," : ""}
      avg_rating DESC
  `;
        const query = `
    SELECT 
      u.user_id,
      u.user_name,
      u.lat,
      u.lng,
      u.gender,
      u.profile_img,
      u.state,
      u.district,
      u.area,
      u.pincode,
      u.self_about,

      t.tutor_id,
      t.represent,

     
      (
        SELECT AVG(r2.rating)
        FROM reviews r2
        WHERE r2.tutor_id = t.tutor_id
      ) AS avg_rating,

      CASE 
        WHEN EXISTS (
          SELECT 1 FROM tutor_leads tl2
          WHERE tl2.tutor_id = t.tutor_id
          AND tl2.student_id = ?
          AND tl2.lead_type = 'profile'
        ) THEN 0 ELSE 1
      END AS is_new,

      CASE 
        WHEN EXISTS (
          SELECT 1 FROM tutor_likes tl
          WHERE tl.tutor_id = t.tutor_id
          AND tl.student_id = ?
          AND tl.is_like = 1
        ) THEN 1 ELSE 0
      END AS is_like

      ${distanceField}

    FROM users u
    JOIN tutor t ON t.user_id = u.user_id
    JOIN tutor_subjects ts ON ts.tutor_id = t.tutor_id
    LEFT JOIN subjects s ON s.id = ts.subject_id

    ${where}

    GROUP BY t.tutor_id

    ${having}
    ${orderBy}

    LIMIT ? OFFSET ?
  `;
        const finalParams = [
            student_id || "",
            student_id || "",
            ...params,
            limit,
            offset,
        ];
        const rows = await (0, helper_1.executeQuery)(query, finalParams);
        const uniqueMap = new Map();
        rows.forEach((r) => {
            if (!uniqueMap.has(r.tutor_id)) {
                uniqueMap.set(r.tutor_id, r);
            }
        });
        const uniqueRows = Array.from(uniqueMap.values());
        const data = await this.buildTutorFullData(uniqueRows, search_subject);
        return {
            data,
            pagination: {
                total: uniqueRows.length,
                page,
                limit,
                total_pages: Math.ceil(uniqueRows.length / limit),
            },
        };
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
    async buildTutorFullData(rows, search_subject) {
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
            if (search_subject) {
                const search = search_subject.toLowerCase();
                subjectMap.forEach((subjects) => {
                    subjects.sort((a, b) => {
                        const aName = a.sub[0].subject_name?.toLowerCase() || "";
                        const bName = b.sub[0].subject_name?.toLowerCase() || "";
                        const aMatch = aName.includes(search) ? 1 : 0;
                        const bMatch = bName.includes(search) ? 1 : 0;
                        return bMatch - aMatch;
                    });
                });
            }
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
        let fileMap = new Map();
        if (fileIds.length) {
            const files = await cmnMdl.getUploadFiles(fileIds);
            files.forEach((file) => {
                fileMap.set(file.id, file);
            });
        }
        finalData = finalData.map((row) => ({
            ...row,
            profile_img: row.profile_img && fileMap.has(row.profile_img) ? [] : [],
        }));
        return (0, helper_1.convertNullToString)(finalData);
    }
    async buildTutorFullDatasForId(rows, student_id) {
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
            const studentParam = student_id || 0;
            subjectRows = await (0, helper_1.executeQuery)(`
      SELECT ts.*, s.subject_name as db_subject_name,
      IFNULL(tsr.id, 0) AS booking_id,

      CASE 
    WHEN tsr.id IS NULL THEN 'no_booking'
    ELSE tsr.status
   END AS booking_status
  
      FROM tutor_subjects ts

      LEFT JOIN subjects s ON s.id = ts.subject_id

      LEFT JOIN tutor_student_rel tsr 
  ON tsr.tutor_id = ts.tutor_id
  AND tsr.linked_sub = ts.id
  AND tsr.student_id = ?

      WHERE ts.tutor_id IN (${placeholders})
      AND ts.status = 'active'
      `, [studentParam, ...tutorIds]);
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
            sylabusMap.set(Number(f.id), [
                {
                    id: f.id || "",
                    file_type: f.file_type || "",
                    pathname: f.pathname || "",
                    org_name: f.org_name || "",
                    file_url: f.file_url ? f.file_url : [],
                },
            ]);
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
                        booking_status: sub.booking_status,
                        booking_id: sub.booking_id,
                        covered_topics: safeParse(sub.covered_topics),
                        min_fee: sub.min_fee || "",
                        max_fee: sub.max_fee || "",
                        tenure_type: sub.tenure_type || "",
                        class_mode: sub.class_mode || "",
                        class_type: sub.class_type || "",
                        sylabus: sub.sylabus
                            ? sylabusMap.get(Number(sub.sylabus)) || []
                            : [],
                        teach_language: sub.teach_language
                            ? sub.teach_language
                                .split(",")
                                .map((id) => languageMap.get(Number(id)) || [])
                                .filter((v) => Object.keys(v).length)
                            : [],
                        stream_ids: sub.stream_ids
                            ? sub.stream_ids
                                .split(",")
                                .map((id) => subjectStreamMap.get(Number(id)) || [])
                                .filter((v) => Object.keys(v).length)
                            : [],
                        prior_exp: sub.prior_exp || "",
                        exp_year: sub.exp_year || "",
                        exp_month: sub.exp_month || "",
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
                file_url: file.file_url ? `${file.file_url}` : "",
            });
        });
        finalData = finalData.map((row) => ({
            ...row,
            profile_img: Number(row.profile_img) > 0 && fileMap.get(Number(row.profile_img))
                ? [fileMap.get(Number(row.profile_img))]
                : [],
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
    async fetchFees(subject_id, subject_name, tenure_type, student_id) {
        let where = `WHERE 1=1`;
        let params = [];
        if (student_id) {
            const student = await (0, helper_1.executeQuery)(`SELECT learn_course FROM student WHERE student_id = ?`, [student_id]);
            if (student.length && student[0].learn_course) {
                const courseIds = student[0].learn_course
                    .split(",")
                    .map((id) => Number(id.trim()))
                    .filter(Boolean);
                if (courseIds.length) {
                    where += ` AND subject_id IN (${courseIds.map(() => "?").join(",")})`;
                    params.push(...courseIds);
                }
            }
        }
        if (subject_id) {
            where += ` AND subject_id = ?`;
            params.push(subject_id);
        }
        if (subject_name) {
            where += ` AND subject_name LIKE ?`;
            params.push(`%${subject_name}%`);
        }
        if (tenure_type) {
            where += ` AND tenure_type = ?`;
            params.push(tenure_type);
        }
        const query = `
    SELECT 
      MIN(min_fee) as min_fee,
      MAX(max_fee) as max_fee
    FROM tutor_subjects
    ${where}
  `;
        const result = await (0, helper_1.executeQuery)(query, params);
        return {
            min_fee: result[0]?.min_fee || 0,
            max_fee: result[0]?.max_fee || 0,
        };
    }
    async setViewMobileForTutorByid(student_id, tutor_id) {
        const result = await (0, helper_1.executeQuery)(`
      UPDATE tutor_leads
      SET is_mobile_view = 1
      WHERE student_id = ? 
        AND tutor_id = ?
        AND is_mobile_view = 0
      `, [student_id, tutor_id]);
        return result;
    }
    async cancelBooking(booking_id) {
        if (!booking_id) {
            throw new Error("booking_id is required");
        }
        const query = `
    UPDATE tutor_student_rel
    SET status = 'cancelled'
    WHERE id = ?
  `;
        const result = await (0, helper_1.executeQuery)(query, [booking_id]);
        return result;
    }
    async fetchBookedClasses(data) {
        const { student_id, status, subject_name, page = 1, limit = 10 } = data;
        const offset = (page - 1) * limit;
        let where = `WHERE bc.student_id = ?`;
        let params = [student_id];
        if (status) {
            where += ` AND bc.status = ?`;
            params.push(status);
        }
        if (subject_name) {
            where += ` AND COALESCE(s.subject_name, ts.subject_name) LIKE ?`;
            params.push(`%${subject_name}%`);
        }
        const query = `
    SELECT 
      bc.id AS booking_id,
      bc.status,
      bc.tutor_id,
      bc.student_id,
      bc.created_at,

      ts.id AS tutor_subject_id,
      ts.subject_id,

      COALESCE(s.subject_name, ts.subject_name) AS subject_name,

      t.tutor_id,
      t.user_id,

      u.user_name,
      u.email,
      u.mobile,
      u.profile_img,
      u.area,
      u.district,
      u.state, 
      u.country

    FROM tutor_student_rel bc

    LEFT JOIN tutor_subjects ts 
      ON ts.id = bc.linked_sub   

    LEFT JOIN subjects s 
      ON s.id = ts.subject_id    

    LEFT JOIN tutor t 
      ON t.tutor_id = bc.tutor_id

    LEFT JOIN users u 
      ON u.user_id = t.user_id

    ${where}
    ORDER BY bc.created_at DESC
    LIMIT ? OFFSET ?
  `;
        const dataParams = [...params, Number(limit), Number(offset)];
        const rows = await (0, helper_1.executeQuery)(query, dataParams);
        const countQuery = `
    SELECT COUNT(*) as total
    FROM tutor_student_rel bc
    LEFT JOIN tutor_subjects ts ON ts.id = bc.linked_sub
    LEFT JOIN subjects s ON s.id = ts.subject_id
    ${where}
  `;
        const countResult = await (0, helper_1.executeQuery)(countQuery, params);
        const total = countResult[0]?.total || 0;
        const fileIds = [
            ...new Set(rows.map((r) => Number(r.profile_img)).filter(Boolean)),
        ];
        const files = await cmnMdl.getUploadFiles(fileIds);
        const fileMap = new Map();
        files.forEach((f) => {
            fileMap.set(Number(f.id), f);
        });
        const finalData = rows.map((r) => ({
            ...r,
            profile_img: r.profile_img
                ? [fileMap.get(Number(r.profile_img))].filter(Boolean)
                : [],
        }));
        return {
            data: finalData,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                total_pages: Math.ceil(total / limit),
            },
        };
    }
    async fetchConsumedSubjects(student_id, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        let params = [student_id];
        const query = `
    SELECT 
      ts.subject_id,

      COALESCE(s.subject_name, ts.subject_name) AS subject_name

    FROM tutor_student_rel bc

    LEFT JOIN tutor_subjects ts 
      ON ts.id = bc.linked_sub

    LEFT JOIN subjects s 
      ON s.id = ts.subject_id

    WHERE bc.student_id = ?
      AND (ts.subject_id IS NOT NULL OR ts.subject_name IS NOT NULL) 

    GROUP BY 
      ts.subject_id, 
      COALESCE(s.subject_name, ts.subject_name)
   ORDER BY subject_name ASC
    LIMIT ? OFFSET ?
  `;
        const dataParams = [...params, Number(limit), Number(offset)];
        const rows = await (0, helper_1.executeQuery)(query, dataParams);
        const countQuery = `
    SELECT COUNT(*) as total FROM (
      SELECT 
        ts.subject_id,
        COALESCE(s.subject_name, ts.subject_name)

      FROM tutor_student_rel bc

      LEFT JOIN tutor_subjects ts 
        ON ts.id = bc.linked_sub

      LEFT JOIN subjects s 
        ON s.id = ts.subject_id

      WHERE bc.student_id = ?
        AND (ts.subject_id IS NOT NULL OR ts.subject_name IS NOT NULL)

      GROUP BY 
        ts.subject_id, 
        COALESCE(s.subject_name, ts.subject_name)
    ) AS grouped_data
  `;
        const countResult = await (0, helper_1.executeQuery)(countQuery, params);
        const total = countResult[0]?.total || 0;
        return {
            data: rows,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                total_pages: Math.ceil(total / limit),
            },
        };
    }
}
exports.StudentModel = StudentModel;
//# sourceMappingURL=student.model.js.map