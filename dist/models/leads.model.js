"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsModel = void 0;
const helper_1 = require("../utils/helper");
const common_model_1 = require("./common.model");
const education_model_1 = require("./education.model");
const tutor_model_1 = require("./tutor.model");
const cmnMdl = new common_model_1.commonModel();
const tutMdl = new tutor_model_1.TutorModel();
const eduMdl = new education_model_1.EduModel();
class LeadsModel {
    async insertLead(data) {
        const { tutor_id, student_id = null, lead_type, search_subject = null, } = data;
        await (0, helper_1.executeQuery)(`INSERT INTO tutor_leads 
     (tutor_id, student_id, lead_type, search_subject)
     VALUES (?, ?, ?, ?)`, [tutor_id, student_id, lead_type, search_subject]);
    }
    async fetchLeads(filters) {
        const { tutor_id, lead_id, from_date, to_date, subject_name, locations, leads_type, page = 1, limit = 10, } = filters;
        const offset = (page - 1) * limit;
        let where = `WHERE tl.tutor_id = ?`;
        let params = [tutor_id];
        // lead_id filter
        if (lead_id) {
            where += ` AND tl.id = ?`;
            params.push(lead_id);
        }
        // lead type filter
        if (leads_type) {
            where += ` AND tl.lead_type = ?`;
            params.push(leads_type);
        }
        // location filter
        if (locations) {
            const locationArray = Array.isArray(locations)
                ? locations
                : locations.split(",");
            const cleaned = locationArray
                .map((loc) => loc.trim())
                .filter((loc) => loc);
            if (cleaned.length) {
                const likeConditions = cleaned
                    .map(() => `tl.search_address LIKE ?`)
                    .join(" OR ");
                where += ` AND (${likeConditions})`;
                cleaned.forEach((loc) => {
                    params.push(`%${loc}%`);
                });
            }
        }
        // date filter
        if (from_date && to_date) {
            if (from_date === to_date) {
                where += ` AND DATE(tl.created_at) = ?`;
                params.push(from_date);
            }
            else {
                where += ` AND DATE(tl.created_at) BETWEEN ? AND ?`;
                params.push(from_date, to_date);
            }
        }
        const result = await (0, helper_1.executeQuery)(`SELECT 
    tl.*,
    s.student_id,
    s.user_id,
    s.stream_id,
    u.user_name,
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
            const files = await cmnMdl.getUploadFiles([...new Set(profileImgIds)]);
            fileMap = files.reduce((acc, file) => {
                acc[file.id] = file;
                return acc;
            }, {});
        }
        let finalData = await Promise.all(result.map(async (row) => {
            // If you have linked_sub in leads
            const linkedIds = row.linked_sub
                ?.toString()
                .split(",")
                .map((id) => Number(id.trim()))
                .filter((id) => !isNaN(id));
            let tutorSubjects = [];
            if (linkedIds?.length) {
                const placeholders = linkedIds.map(() => "?").join(",");
                tutorSubjects = await (0, helper_1.executeQuery)(`SELECT id, subject_id, subject_name, status
           FROM tutor_subjects 
           WHERE id IN (${placeholders})`, linkedIds);
            }
            const streams = row.stream_id
                ? await eduMdl.fetchStreamsForAll(row.stream_id.toString())
                : [];
            const subjects = await tutMdl.fetchSubjectsFromTutorSubjects(tutorSubjects);
            const profile_img = fileMap[row.profile_img]
                ? [fileMap[row.profile_img]]
                : [];
            return cmnMdl.convertNullObjectToString({
                ...row,
                subjects,
                is_deleted: tutorSubjects?.[0]?.status ?? 0,
                streams,
                profile_img,
            });
        }));
        if (subject_name) {
            finalData = finalData.filter((row) => row.subjects?.some((sub) => sub.subject_name?.toLowerCase().includes(subject_name.toLowerCase())));
        }
        const countRes = await (0, helper_1.executeQuery)(`SELECT COUNT(*) as total
     FROM tutor_leads tl
     ${where}`, params);
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
}
exports.LeadsModel = LeadsModel;
//# sourceMappingURL=leads.model.js.map