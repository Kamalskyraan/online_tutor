"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectModel = void 0;
const helper_1 = require("../utils/helper");
const common_model_1 = require("./common.model");
const education_model_1 = require("./education.model");
const source_model_1 = require("./source.model");
const srcMdl = new source_model_1.SourceModel();
const cmnMdl = new common_model_1.commonModel();
const eduMdl = new education_model_1.EduModel();
class SubjectModel {
    async insertUpdateSubject({ id, subject_name, status = "active", }) {
        let query = "";
        const params = [];
        if (id) {
            query += `UPDATE subjects SET subject_name = ? , status = ? WHERE id = ? `;
            params.push(subject_name, status, id);
        }
        else {
            query += `INSERT INTO subjects (subject_name, status) VALUES (?,?)`;
            params.push(subject_name, status);
        }
        const result = await (0, helper_1.executeQuery)(query, params);
        return result;
    }
    async fetchSubjects(data) {
        const { id, subject_name, status } = data;
        let query = `SELECT id , subject_name , status FROM subjects WHERE 1=1`;
        const values = [];
        if (id !== undefined && id !== null) {
            query += ` AND id = ?`;
            values.push(id);
        }
        if (subject_name) {
            query += ` AND subject_name LIKE ?`;
            values.push(`%${subject_name}%`);
        }
        if (status !== undefined && status !== null) {
            query += ` AND status = ?`;
            values.push(status);
        }
        const result = await (0, helper_1.executeQuery)(query, values);
        return result;
    }
    async addTutorSubjects(data) {
        const { tutor_id, id, subject_id, subject_name, covered_topics, sylabus, prior_exp, exp_year, exp_month, } = data;
        const topics = Array.isArray(covered_topics)
            ? [...new Set(covered_topics)]
            : covered_topics
                ? [covered_topics]
                : [];
        const checkQuery = `
    SELECT id FROM tutor_subjects 
    WHERE tutor_id = ? 
    AND status = 'active'
    AND (
      (subject_id IS NOT NULL AND subject_id = ?) OR
      (subject_id IS NULL AND LOWER(subject_name) = LOWER(?))
    )
  `;
        const existing = await (0, helper_1.executeQuery)(checkQuery, [
            tutor_id,
            subject_id || null,
            subject_name || null,
        ]);
        let message = "";
        let success = 1;
        let subjectId = id || null;
        if (id) {
            // if (existing.length > 0 && existing[0].id !== id) {
            //   return {
            //     success: 0,
            //     message: "Tutor already has this subject",
            //   };
            // }
            await (0, helper_1.executeQuery)(`UPDATE tutor_subjects
       SET 
         subject_id = ?,
         subject_name = ?,
         sylabus = ?,
         covered_topics = ?,
         prior_exp = ?,
         exp_year = ?,
         exp_month = ?
       WHERE id = ? AND tutor_id = ?`, [
                subject_id || null,
                subject_id ? null : subject_name,
                sylabus || null,
                JSON.stringify(topics),
                prior_exp || null,
                exp_year || 0,
                exp_month || 0,
                id,
                tutor_id,
            ]);
            message = "Subject Updated Successfully";
        }
        else {
            if (existing.length > 0) {
                return {
                    success: 0,
                    message: "Tutor already has this subject",
                };
            }
            const countResult = await (0, helper_1.executeQuery)(`SELECT COUNT(*) as total FROM tutor_subjects WHERE tutor_id = ? AND status ='active'`, [tutor_id]);
            const total = countResult[0]?.total || 0;
            if (total >= 4) {
                return {
                    success: 0,
                    message: "Maximum 4 subjects allowed",
                };
            }
            const result = await (0, helper_1.executeQuery)(`INSERT INTO tutor_subjects
       (tutor_id, subject_id, subject_name, sylabus, covered_topics,
        prior_exp, exp_year, exp_month)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
                tutor_id,
                subject_id || null,
                subject_id ? null : subject_name,
                sylabus || null,
                JSON.stringify(topics),
                prior_exp || null,
                exp_year || 0,
                exp_month || 0,
            ]);
            message = "Subject Added Successfully";
            subjectId = result.insertId;
        }
        await (0, helper_1.executeQuery)(`UPDATE tutor_subjects
     SET sub_form = GREATEST(COALESCE(sub_form,0), 1)
     WHERE tutor_id = ?`, [tutor_id]);
        return {
            success,
            message,
            id: subjectId,
        };
    }
    // async addTeachingLanguages(data: any) {
    //   const { tutor_id, teach_language, id } = data;
    //   if (!teach_language) return;
    //   await executeQuery(
    //     `UPDATE tutor_subjects
    //    SET teach_language = ?,
    //        sub_form = GREATEST(COALESCE(sub_form,0), 2)
    //    WHERE tutor_id = ?`,
    //     [teach_language, tutor_id],
    //   );
    // }
    async addTeachingLanguages(data) {
        const { tutor_id, teach_language, id } = data;
        if (!teach_language)
            return;
        let query = `
    UPDATE tutor_subjects
    SET teach_language = ?,
        sub_form = GREATEST(COALESCE(sub_form,0), 2)
  `;
        let params = [teach_language];
        if (id) {
            query += ` WHERE id = ? AND tutor_id = ?`;
            params.push(id, tutor_id);
        }
        else {
            query += ` WHERE tutor_id = ?`;
            params.push(tutor_id);
        }
        await (0, helper_1.executeQuery)(query, params);
    }
    async addClassDetails(data) {
        const { tutor_id, id, class_mode, class_type, stream_id, min_fee, max_fee, tenure_type, } = data;
        if (!class_mode &&
            !class_type &&
            !stream_id &&
            !min_fee &&
            !max_fee &&
            !tenure_type)
            return;
        let query = `
    UPDATE tutor_subjects
    SET 
      class_mode = ?,
      class_type = ?,
      stream_ids = ?,
      min_fee = ?,
      max_fee = ?,
      tenure_type = ?,
      sub_form = GREATEST(COALESCE(sub_form,0), 3)
  `;
        let params = [
            class_mode,
            class_type,
            stream_id,
            min_fee,
            max_fee,
            tenure_type,
        ];
        if (id) {
            query += ` WHERE id = ? AND tutor_id = ?`;
            params.push(id, tutor_id);
        }
        else {
            query += ` WHERE tutor_id = ?`;
            params.push(tutor_id);
        }
        await (0, helper_1.executeQuery)(query, params);
    }
    async getTutorSubjectById(tutor_id, id) {
        let query = `
    SELECT 
      ts.id,
      ts.tutor_id,
      ts.subject_id,
      ts.subject_name,
      ts.sylabus,
      ts.covered_topics,
      ts.prior_exp,
      ts.exp_year,
      ts.exp_month,
      ts.teach_language,
      ts.class_mode,
      ts.class_type,
      ts.stream_ids,
      ts.min_fee,
      ts.max_fee,
      ts.tenure_type,
      u.area,
  u.state,
  u.district,
  u.pincode
    FROM tutor_subjects ts
    LEFT JOIN tutor t ON t.tutor_id = ts.tutor_id
    LEFT JOIN users u ON u.user_id = t.user_id
    WHERE ts.tutor_id = ?
    AND status = 'active'
  `;
        const params = [tutor_id];
        if (id) {
            query += ` AND ts.id = ?`;
            params.push(id);
        }
        if (!id) {
            await (0, helper_1.executeQuery)(`DELETE FROM tutor_subjects 
     WHERE tutor_id = ? 
     AND status = 'active' 
     AND sub_form < 3`, [tutor_id]);
        }
        const result = await (0, helper_1.executeQuery)(query, params);
        if (!result.length)
            return [];
        await Promise.all(result.map(async (row) => {
            Object.keys(row).forEach((key) => {
                if (row[key] === null) {
                    row[key] = "";
                }
            });
            let subjects = [];
            let languages = [];
            try {
                let langIds = [];
                if (row.teach_language) {
                    if (row.teach_language.startsWith("[")) {
                        langIds = JSON.parse(row.teach_language);
                    }
                    else {
                        langIds = row.teach_language
                            .split(",")
                            .map((id) => Number(id));
                    }
                }
                if (langIds.length) {
                    const placeholders = langIds.map(() => "?").join(",");
                    const langData = await (0, helper_1.executeQuery)(`SELECT id, lang_name FROM languages WHERE id IN (${placeholders})`, langIds);
                    languages = langData;
                }
            }
            catch {
                languages = [];
            }
            row.languages = languages;
            delete row.teach_language;
            if (row.subject_id) {
                const subjectData = await (0, helper_1.executeQuery)(`SELECT id, subject_name FROM subjects WHERE id = ?`, [row.subject_id]);
                if (subjectData.length) {
                    subjects.push(subjectData[0]);
                }
            }
            else if (row.subject_name) {
                subjects.push({
                    id: 0,
                    subject_name: row.subject_name,
                });
            }
            row.subjects = subjects;
            delete row.subject_id;
            delete row.subject_name;
            try {
                row.covered_topics = row.covered_topics
                    ? JSON.parse(row.covered_topics)
                    : [];
            }
            catch {
                row.covered_topics = [];
            }
            try {
                let syllabusIds = [];
                if (row.sylabus) {
                    if (row.sylabus.startsWith("[")) {
                        syllabusIds = JSON.parse(row.sylabus);
                    }
                    else {
                        syllabusIds = row.sylabus.split(",").map((id) => Number(id));
                    }
                }
                row.syllabus = syllabusIds.length
                    ? await cmnMdl.getUploadFiles(syllabusIds)
                    : [];
            }
            catch {
                row.syllabus = [];
            }
            delete row.sylabus;
            try {
                let streamIdStr = "";
                if (row.stream_ids) {
                    if (row.stream_ids.startsWith("[")) {
                        const parsed = JSON.parse(row.stream_ids);
                        streamIdStr = parsed.join(",");
                    }
                    else {
                        streamIdStr = row.stream_ids;
                    }
                }
                row.streams = streamIdStr
                    ? await eduMdl.fetchStreamsForAll(streamIdStr)
                    : [];
            }
            catch {
                row.streams = [];
            }
            delete row.stream_ids;
        }));
        return result;
    }
    async removeTutorSubject(id) {
        const existing = await (0, helper_1.executeQuery)(`SELECT id FROM tutor_subjects WHERE id = ? `, [id]);
        if (!existing.length) {
            return {
                success: 0,
                message: "Subject not found",
            };
        }
        await (0, helper_1.executeQuery)(`UPDATE tutor_subjects SET status = 'deleted' WHERE id = ? `, [id]);
        return {
            success: 1,
            message: "Subject deleted successfully",
        };
    }
}
exports.SubjectModel = SubjectModel;
//# sourceMappingURL=subject.model.js.map