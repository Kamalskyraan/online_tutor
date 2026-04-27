"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorModel = void 0;
const helper_1 = require("../utils/helper");
const common_model_1 = require("./common.model");
const education_model_1 = require("./education.model");
const student_model_1 = require("./student.model");
const eduMdl = new education_model_1.EduModel();
const stuMdl = new student_model_1.StudentModel();
const cmnModel = new common_model_1.commonModel();
class TutorModel {
    async insertUpdateDemos(data) {
        const { id, tutor_id, media_type, media_id, title, thumbnail } = data;
        if (id) {
            await (0, helper_1.executeQuery)(`UPDATE tutor_demo_media
       SET 
         tutor_id = ?,
         media_id = ?,
         media_type = ?,
         title = ?,
         thumbnail = ?
       WHERE id = ?`, [
                tutor_id,
                media_id,
                media_type,
                media_type === "video" ? title || null : null,
                media_type === "video" ? thumbnail || null : null,
                id,
            ]);
            return {
                message: "Updated successfully",
            };
        }
        const countRes = await (0, helper_1.executeQuery)(`SELECT COUNT(*) as total 
     FROM tutor_demo_media 
     WHERE tutor_id = ? AND media_type = ?`, [tutor_id, media_type]);
        const count = countRes[0].total;
        if (media_type === "video" && count >= 5) {
            return {
                message: "Only 5 videos maximum upload",
            };
        }
        if (media_type === "image" && count >= 3) {
            return {
                message: "Max 3 images upload",
            };
        }
        const result = await (0, helper_1.executeQuery)(`INSERT INTO tutor_demo_media
     (tutor_id, media_type, media_id, title , thumbnail)
     VALUES (?, ?, ?, ? , ?)`, [
            tutor_id,
            media_type,
            media_id,
            media_type === "video" ? title || null : null,
            media_type === "video" ? thumbnail || null : null,
        ]);
        return {
            message: "Upload successfully",
            id: result.insertId,
        };
    }
    async deleteDemos(id) {
        await (0, helper_1.executeQuery)(`DELETE FROM tutor_demo_media WHERE id = ?`, [id]);
        return {
            message: "Demos Deleted Successfully",
        };
    }
    async getDemoVideosAndImages(data) {
        const { tutor_id, media_type, id } = data;
        let rows = [];
        if (id) {
            const result = await (0, helper_1.executeQuery)(`SELECT id, tutor_id, media_type, media_id, title, thumbnail 
       FROM tutor_demo_media 
       WHERE id = ? AND tutor_id = ?`, [id, tutor_id]);
            rows = result;
        }
        else if (media_type === "video" || media_type === "image") {
            rows = await (0, helper_1.executeQuery)(`SELECT id, tutor_id, media_type, media_id, title, thumbnail 
       FROM tutor_demo_media
       WHERE tutor_id = ? AND media_type = ?`, [tutor_id, media_type]);
        }
        else {
            rows = await (0, helper_1.executeQuery)(`SELECT id, tutor_id, media_type, media_id, title, thumbnail 
       FROM tutor_demo_media 
       WHERE tutor_id = ?`, [tutor_id]);
        }
        if (!rows || rows.length === 0) {
            return { videos: [], images: [] };
        }
        const allIds = rows
            .flatMap((row) => [row.media_id, row.thumbnail])
            .filter((id) => id);
        let filesMap = {};
        if (allIds.length > 0) {
            const uniqueIds = [...new Set(allIds)];
            const files = await cmnModel.getUploadFiles(uniqueIds);
            filesMap = files.reduce((acc, file) => {
                acc[file.id] = file;
                return acc;
            }, {});
        }
        const videos = [];
        const images = [];
        for (const row of rows) {
            const formatted = {
                id: row.id,
                tutor_id: row.tutor_id,
                media_type: row.media_type,
                title: row.title,
                media: filesMap[row.media_id] ? [filesMap[row.media_id]] : [],
                thumbnail: filesMap[row.thumbnail] ? [filesMap[row.thumbnail]] : [],
            };
            if (row.media_type === "video") {
                videos.push(cmnModel.convertNullObjectToString(formatted));
            }
            else if (row.media_type === "image") {
                images.push(cmnModel.convertNullObjectToString(formatted));
            }
        }
        if (id) {
            return {
                [rows[0].media_type === "video" ? "videos" : "images"]: rows[0].media_type === "video" ? videos : images,
            };
        }
        if (media_type === "video") {
            return { videos };
        }
        if (media_type === "image") {
            return { images };
        }
        return {
            videos,
            images,
        };
    }
    async fetchTutorData(tutor_id) {
        const tutor = await (0, helper_1.executeQuery)(`SELECT tutor_id ,user_id ,  user_name , represent , stream_id  FROM tutor WHERE tutor_id = ? LIMIT 1`, [tutor_id]);
        if (!tutor.length)
            return [];
        const tutorData = tutor[0];
        const { user_id, stream_id } = tutorData;
        const user = await (0, helper_1.executeQuery)(`SELECT user_id , user_name , gender , pincode , area , district , state , self_about , address , lat , lng , is_form_filled as personal_form , is_show_num  FROM users WHERE user_id = ? LIMIT 1`, [user_id]);
        const userData = user.length ? user[0] : {};
        let streams = {};
        if (stream_id) {
            streams = await eduMdl.fetchStreamsForAll(stream_id);
        }
        return {
            ...tutorData,
            ...userData,
            streams,
        };
    }
    async fetchFirstSub(mobile) {
        const res = await (0, helper_1.executeQuery)(`
    SELECT 
      u.user_id, 
      t.tutor_id,
      ts.*
    FROM users u
    LEFT JOIN tutor t ON t.user_id = u.user_id
    LEFT JOIN tutor_subjects ts ON ts.tutor_id = t.tutor_id
    WHERE u.mobile = ?
    LIMIT 1
    `, [mobile]);
        return res;
    }
    async getTutorById(tutor_id, student_id) {
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
      u.mobile,
      u.is_show_num,
      u.self_about,
      u.profile_img,
      t.tutor_id,
      t.stream_id,
      t.represent,
      t.tutor_exp as tutor_exp,
      t.exp_year as t_exp_year,
      t.exp_month as t_exp_month 
    FROM users u
    RIGHT JOIN tutor t ON t.user_id = u.user_id
    WHERE t.tutor_id = ?
    AND EXISTS (
  SELECT 1 FROM tutor_subjects ts
  WHERE ts.tutor_id = t.tutor_id
  AND ts.status = 'active'
)
    LIMIT 1
    `;
        // RIGHT JOIN tutor_subjects ts
        //   ON ts.tutor_id = t.tutor_id
        //   AND ts.status = 'active'
        const rows = await (0, helper_1.executeQuery)(query, [tutor_id]);
        if (!rows.length)
            return null;
        const data = await stuMdl.buildTutorFullDatasForId(rows, student_id);
        const tutor = data[0];
        let is_like = 0;
        if (student_id) {
            const likeRes = await (0, helper_1.executeQuery)(`SELECT id , is_like FROM tutor_likes 
       WHERE tutor_id = ? AND student_id = ?`, [tutor_id, student_id]);
            is_like = likeRes.length > 0 && likeRes[0].is_like === Number(1) ? 1 : 0;
        }
        tutor.is_like = is_like;
        let is_mobile_view = 0;
        if (student_id) {
            const mobileViewRes = await (0, helper_1.executeQuery)(`SELECT is_mobile_view 
     FROM tutor_leads
     WHERE tutor_id = ? AND student_id = ?
     LIMIT 1`, [tutor_id, student_id]);
            is_mobile_view =
                mobileViewRes.length > 0 && mobileViewRes[0].is_mobile_view === 1
                    ? 1
                    : 0;
        }
        tutor.is_mobile_view = is_mobile_view;
        let has_reviewed = 0;
        if (student_id) {
            const reviewRes = await (0, helper_1.executeQuery)(`SELECT id 
     FROM reviews 
     WHERE tutor_id = ? AND student_id = ?
     LIMIT 1`, [tutor_id, student_id]);
            has_reviewed = reviewRes.length > 0 ? 1 : 0;
        }
        tutor.has_reviewed = has_reviewed;
        const demoMedia = await (0, helper_1.executeQuery)(`SELECT id, media_type, media_id, title, thumbnail 
     FROM tutor_demo_media 
     WHERE tutor_id = ?`, [tutor_id]);
        const mediaIds = [
            ...new Set(demoMedia
                .flatMap((i) => [i.media_id, i.thumbnail])
                .filter(Boolean)),
        ];
        let mediaData = [];
        if (mediaIds.length) {
            const placeholders = mediaIds.map(() => "?").join(",");
            mediaData = await (0, helper_1.executeQuery)(`SELECT id, file_type, file_url, pathname, org_name 
       FROM media WHERE id IN (${placeholders})`, mediaIds);
        }
        const mediaMap = new Map();
        mediaData.forEach((file) => {
            mediaMap.set(Number(file.id), {
                id: (0, helper_1.convertNullToString)(file.id),
                file_type: (0, helper_1.convertNullToString)(file.file_type),
                pathname: (0, helper_1.convertNullToString)(file.pathname),
                org_name: (0, helper_1.convertNullToString)(file.org_name),
                file_url: file.file_url ? (0, helper_1.convertNullToString)(`${file.file_url}`) : "",
            });
        });
        const images = [];
        const videos = [];
        demoMedia.forEach((item) => {
            const mainMedia = mediaMap.get(Number(item.media_id));
            const thumbnailMedia = mediaMap.get(Number(item.thumbnail));
            if (!mainMedia)
                return;
            const responseObj = {
                id: (0, helper_1.convertNullToString)(item.id),
                title: (0, helper_1.convertNullToString)(item.title),
                media_id: (0, helper_1.convertNullToString)(item.media_id),
                thumbnail_id: (0, helper_1.convertNullToString)(item.thumbnail),
                file: (0, helper_1.convertNullToString)(mainMedia),
                thumbnail: thumbnailMedia ? [(0, helper_1.convertNullToString)(thumbnailMedia)] : [],
            };
            if (item.media_type === "image") {
                images.push(responseObj);
            }
            else if (item.media_type === "video") {
                videos.push(responseObj);
            }
            else {
                const type = mainMedia.file_type?.toLowerCase();
                if (type?.includes("image"))
                    images.push(responseObj);
                else if (type?.includes("video"))
                    videos.push(responseObj);
            }
        });
        tutor.demo_media = {
            images,
            videos,
        };
        return (0, helper_1.convertNullToString)(tutor);
    }
    async addUpdateLikeForTutor(tutor_id, student_id, status) {
        const existing = await (0, helper_1.executeQuery)(`SELECT is_like FROM tutor_likes WHERE tutor_id = ? AND student_id = ?`, [tutor_id, student_id]);
        if (!existing.length) {
            await (0, helper_1.executeQuery)(`INSERT INTO tutor_likes (tutor_id, student_id, is_like) VALUES (?, ?, ?)`, [tutor_id, student_id, status]);
            return { action: "liked/disliked" };
        }
        if (existing[0].status === status) {
            await (0, helper_1.executeQuery)(`DELETE FROM tutor_likes WHERE tutor_id = ? AND student_id = ?`, [tutor_id, student_id]);
            return { action: "removed" };
        }
        await (0, helper_1.executeQuery)(`UPDATE tutor_likes SET is_like = ? WHERE tutor_id = ? AND student_id = ?`, [status, tutor_id, student_id]);
        return { action: "updated" };
    }
    //
    async fetchTutorRequests(tutor_id, page, limit, subject_name, from_date, to_date, status) {
        const offset = (page - 1) * limit;
        let where = `WHERE tsr.tutor_id = ?`;
        let params = [tutor_id];
        if (status) {
            where += ` AND tsr.status = ?`;
            params.push(status);
        }
        else {
            where += ` AND tsr.status != 'cancelled'`;
        }
        if (from_date && to_date) {
            if (from_date === to_date) {
                where += ` AND DATE(tsr.requested_at) = ?`;
                params.push(from_date);
            }
            else {
                where += ` AND DATE(tsr.requested_at) BETWEEN ? AND ?`;
                params.push(from_date, to_date);
            }
        }
        const result = await (0, helper_1.executeQuery)(`SELECT 
      tsr.*,
      u.user_id,
      u.dob,
      u.pincode,
      u.district,
      u.area,
      u.state,
      u.address,
      u.is_show_num,
      u.gender,
      u.mobile,
      u.email,
      u.user_name,
      u.profile_img,
      s.stream_id
    FROM tutor_student_rel tsr
    LEFT JOIN student s ON s.student_id = tsr.student_id
    LEFT JOIN users u ON u.user_id = s.user_id
    ${where}
    ORDER BY tsr.id DESC
    LIMIT ? OFFSET ?`, [...params, Number(limit), Number(offset)]);
        if (!result.length) {
            return {
                data: [],
                pagination: { total: 0, page, limit, totalPages: 0 },
            };
        }
        const profileImgIds = result
            .map((row) => Number(row.profile_img))
            .filter((id) => !isNaN(id) && id > 0);
        let fileMap = {};
        if (profileImgIds.length > 0) {
            const files = await cmnModel.getUploadFiles([...new Set(profileImgIds)]);
            fileMap = files.reduce((acc, file) => {
                acc[file.id] = file;
                return acc;
            }, {});
        }
        let finalData = await Promise.all(result.map(async (row) => {
            const linkedIds = row.linked_sub
                ?.toString()
                .split(",")
                .map((id) => Number(id.trim()))
                .filter((id) => !isNaN(id));
            let tutorSubjects = [];
            if (linkedIds?.length) {
                const placeholders = linkedIds.map(() => "?").join(",");
                tutorSubjects = await (0, helper_1.executeQuery)(`SELECT id, stream_ids, subject_id, subject_name , status
           FROM tutor_subjects 
           WHERE id IN (${placeholders})`, linkedIds);
            }
            const streams = row.stream_id
                ? await eduMdl.fetchStreamsForAll(row.stream_id.toString())
                : [];
            const subjects = await this.fetchSubjectsFromTutorSubjects(tutorSubjects);
            const checjSub = tutorSubjects.map((sub) => ({
                status: sub.status,
            }));
            const profile_img = fileMap[row.profile_img]
                ? [fileMap[row.profile_img]]
                : [];
            let showNum;
            if (row.is_show_num === 0) {
                showNum = 0;
            }
            else {
                showNum = 1;
            }
            return cmnModel.convertNullObjectToString({
                ...row,
                is_show_num: showNum,
                streams,
                subjects,
                is_deleted: checjSub[0].status,
                profile_img,
            });
        }));
        if (subject_name) {
            finalData = finalData.filter((row) => row.subjects.some((sub) => sub.subject_name.toLowerCase().includes(subject_name.toLowerCase())));
        }
        const countRes = await (0, helper_1.executeQuery)(`SELECT COUNT(*) as total 
     FROM tutor_student_rel tsr
     ${where}`, params);
        const total = countRes[0].total;
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
    //
    async fetchSubjectsFromTutorSubjects(tutorSubjects) {
        if (!tutorSubjects || tutorSubjects.length === 0)
            return [];
        const subjectIds = tutorSubjects
            .map((ts) => ts.subject_id)
            .filter((id) => id);
        let subjectMap = {};
        if (subjectIds.length > 0) {
            const placeholders = subjectIds.map(() => "?").join(",");
            const dbSubjects = await (0, helper_1.executeQuery)(`SELECT id, subject_name FROM subjects WHERE id IN (${placeholders})`, subjectIds);
            subjectMap = dbSubjects.reduce((acc, sub) => {
                acc[sub.id] = sub.subject_name;
                return acc;
            }, {});
        }
        return tutorSubjects.map((ts) => {
            if (ts.subject_id && subjectMap[ts.subject_id]) {
                return {
                    subject_id: Number(ts.subject_id),
                    subject_name: subjectMap[ts.subject_id],
                };
            }
            if (ts.subject_name) {
                return {
                    subject_id: 0,
                    subject_name: ts.subject_name,
                };
            }
            return {
                subject_id: 0,
                subject_name: "",
            };
        });
    }
    async acceptOrRejectRequest(req_id, status) {
        const data = await (0, helper_1.executeQuery)(`UPDATE tutor_student_rel SET status = ? WHERE id = ?`, [status, req_id]);
        return data[0];
    }
    async fetchTutorSuggestion(tutor_id) {
        const tutorSubjects = await (0, helper_1.executeQuery)(`SELECT subject_id, subject_name 
     FROM tutor_subjects 
     WHERE tutor_id = ?`, [tutor_id]);
        const formattedSubjects = await this.fetchSubjectsFromTutorSubjects(tutorSubjects);
        return formattedSubjects;
    }
    //for request
    async updateMobileViewStatus(tutor_id, student_id) {
        const result = await (0, helper_1.executeQuery)(`
    UPDATE tutor_student_rel
    SET is_view = 1
    WHERE tutor_id = ? AND student_id = ?
    `, [tutor_id, student_id]);
        return result;
    }
    async updateMobileViewStatusInLeads(tutor_id, student_id) {
        const result = await (0, helper_1.executeQuery)(`
    UPDATE tutor_leads
    SET is_view = 1
    WHERE tutor_id = ? AND student_id = ?
    `, [tutor_id, student_id]);
        return result;
    }
    async fetchLikes(tutor_id, student_id) {
        if (!tutor_id && !student_id) {
            return [];
        }
        let query = `SELECT * FROM tutor_likes WHERE `;
        let params = [];
        if (tutor_id && student_id) {
            query += `tutor_id = ? AND student_id = ?`;
            params.push(tutor_id, student_id);
        }
        else if (tutor_id) {
            query += `tutor_id = ?`;
            params.push(tutor_id);
        }
        else {
            query += `student_id = ?`;
            params.push(student_id);
        }
        const [rows] = await (0, helper_1.executeQuery)(query, params);
        return rows;
    }
    // Home data
    async getTutorLeadsGraph(tutor_id, from_date, to_date) {
        const finalToDate = to_date || new Date().toISOString().slice(0, 19).replace("T", " ");
        let finalFromDate = from_date;
        if (!from_date && to_date) {
            const minDateRes = await (0, helper_1.executeQuery)(`
      SELECT LEAST(
        (SELECT MIN(created_at) FROM tutor_leads WHERE tutor_id = ?),
        (SELECT MIN(created_at) FROM tutor_student_rel WHERE tutor_id = ?)
      ) as first_date
      `, [tutor_id, tutor_id]);
            finalFromDate = minDateRes[0]?.first_date || "2026-01-01";
        }
        if (!finalFromDate)
            finalFromDate = "2026-01-01";
        const [leadRows, requestRows] = await Promise.all([
            (0, helper_1.executeQuery)(`SELECT created_at FROM tutor_leads WHERE tutor_id=? AND lead_type='profile' AND created_at BETWEEN ? AND ?`, [tutor_id, finalFromDate, finalToDate]),
            (0, helper_1.executeQuery)(`SELECT created_at FROM tutor_student_rel WHERE tutor_id=? AND created_at BETWEEN ? AND ?`, [tutor_id, finalFromDate, finalToDate]),
        ]);
        const leadsCount = await (0, helper_1.executeQuery)(`SELECT COUNT(*) as lead FROM tutor_leads WHERE tutor_id=? AND lead_type='profile' AND created_at BETWEEN ? AND ?`, [tutor_id, finalFromDate, finalToDate]);
        const requestCount = await (0, helper_1.executeQuery)(`SELECT COUNT(*) as req FROM tutor_student_rel WHERE tutor_id=?  AND created_at BETWEEN ? AND ?`, [tutor_id, finalFromDate, finalToDate]);
        const from = new Date(finalFromDate);
        const to = new Date(finalToDate);
        const totalDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        let buckets = [];
        if (totalDays <= 7) {
            let current = new Date(from);
            const isSameDay = from.toDateString() === to.toDateString();
            while (current <= to) {
                if (isSameDay) {
                    const sessions = [
                        { name: "Mrng", start: 6, end: 12 },
                        { name: "Noon", start: 12, end: 18 },
                        { name: "Night", start: 18, end: 24 },
                    ];
                    for (const s of sessions) {
                        const start = new Date(current);
                        start.setHours(s.start, 0, 0, 0);
                        const end = new Date(current);
                        end.setHours(s.end, 0, 0, 0);
                        buckets.push({
                            start,
                            end,
                            label: `${start.toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                            })} ${s.name}`,
                            leads: 0,
                            requests: 0,
                        });
                    }
                }
                else {
                    const start = new Date(current);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(current);
                    end.setHours(23, 59, 59, 999);
                    buckets.push({
                        start,
                        end,
                        label: start.toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                        }),
                        leads: 0,
                        requests: 0,
                    });
                }
                current.setDate(current.getDate() + 1);
            }
        }
        else {
            let temp = [];
            let current = new Date(from);
            while (current <= to) {
                const start = new Date(current);
                const end = new Date(current);
                end.setDate(end.getDate() + 6);
                if (end > to)
                    end.setTime(to.getTime());
                const sameMonth = start.getMonth() === end.getMonth();
                let label;
                if (sameMonth) {
                    label = `${start.getDate().toString().padStart(2, "0")}-${end
                        .getDate()
                        .toString()
                        .padStart(2, "0")} ${end.toLocaleString("en-IN", {
                        month: "short",
                    })}`;
                }
                else {
                    label = `${start
                        .getDate()
                        .toString()
                        .padStart(2, "0")} ${start.toLocaleString("en-IN", {
                        month: "short",
                    })} - ${end
                        .getDate()
                        .toString()
                        .padStart(2, "0")} ${end.toLocaleString("en-IN", {
                        month: "short",
                    })}`;
                }
                temp.push({
                    start,
                    end,
                    label,
                    leads: 0,
                    requests: 0,
                });
                current.setDate(current.getDate() + 7);
            }
            if (temp.length > 4) {
                const step = Math.ceil(temp.length / 4);
                buckets = temp.filter((_, i) => i % step === 0).slice(0, 4);
            }
            else {
                buckets = temp;
            }
        }
        for (const row of leadRows) {
            const d = new Date(row.created_at);
            for (const b of buckets) {
                if (d >= b.start && d <= b.end) {
                    b.leads++;
                    break;
                }
            }
        }
        for (const row of requestRows) {
            const d = new Date(row.created_at);
            for (const b of buckets) {
                if (d >= b.start && d <= b.end) {
                    b.requests++;
                    break;
                }
            }
        }
        const x_axis = buckets.map((b) => b.label);
        const leads_data = buckets.map((b) => b.leads);
        const request_data = buckets.map((b) => b.requests);
        const max = Math.max(...leads_data, ...request_data, 0);
        const stepY = Math.ceil(max / 5) || 1;
        const y_axis_scale = Array.from({ length: 6 }, (_, i) => i * stepY);
        y_axis_scale[5] = max;
        const startYear = Math.max(from.getFullYear(), 2026);
        const endYear = to.getFullYear();
        const all_time = Array.from({ length: endYear - startYear + 1 }, (_, i) => String(startYear + i));
        return {
            tutor_graph: {
                x_axis,
                leads: leads_data,
                requests: request_data,
                y_axis_scale,
                all_time,
                leads_count: leadsCount[0].lead,
                request_count: requestCount[0].req,
            },
        };
    }
    async fetchTutorRequestsFor(tutor_id) {
        const result = await (0, helper_1.executeQuery)(`
    SELECT s.status, COUNT(r.status) as count
    FROM (
      SELECT 'pending' as status
      UNION ALL SELECT 'accepted'
      UNION ALL SELECT 'rejected'
     
    ) s
    LEFT JOIN tutor_student_rel r
      ON r.status = s.status
      AND r.tutor_id = ?
    GROUP BY s.status
    ORDER BY s.status
    `, [tutor_id]);
        return {
            requests: result,
        };
    }
    async getRequestUsers(req_id) {
        const res = await (0, helper_1.executeQuery)(`
    SELECT 
      tutor_id,
      student_id
    FROM tutor_student_rel
    WHERE id = ?
    `, [req_id]);
        return res?.[0] || null;
    }
}
exports.TutorModel = TutorModel;
//# sourceMappingURL=tutor.model.js.map