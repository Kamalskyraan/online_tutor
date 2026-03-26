import { getSubjectBody, subjectBody } from "../interface/interface";
import { executeQuery } from "../utils/helper";

export class SubjectModel {
  async insertUpdateSubject({
    id,
    subject_name,
    status = "active",
  }: subjectBody) {
    let query = "";
    const params: any[] = [];

    if (id) {
      query += `UPDATE subjects SET subject_name = ? , status = ? WHERE id = ? `;
      params.push(subject_name, status, id);
    } else {
      query += `INSERT INTO subjects (subject_name, status) VALUES (?,?)`;
      params.push(subject_name, status);
    }
    const result = await executeQuery(query, params);
    return result;
  }
  async fetchSubjects(data: getSubjectBody) {
    const { id, subject_name, status } = data;

    let query = `SELECT id , subject_name , status FROM subjects WHERE 1=1`;
    const values: any[] = [];

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

    const result: any = await executeQuery(query, values);
    return result;
  }

  async addTutorSubjects(data: any) {
    const {
      tutor_id,
      id,
      subject_id,
      subject_name,
      covered_topics,
      sylabus,
      prior_exp,
      exp_year,
      exp_month,
    } = data;

    const topics = Array.isArray(covered_topics)
      ? [...new Set(covered_topics)]
      : covered_topics
        ? [covered_topics]
        : [];

    const checkQuery = `
    SELECT id FROM tutor_subjects 
    WHERE tutor_id = ? 
    AND (
      (subject_id IS NOT NULL AND subject_id = ?) OR
      (subject_id IS NULL AND LOWER(subject_name) = LOWER(?))
    )
  `;

    const existing: any = await executeQuery(checkQuery, [
      tutor_id,
      subject_id || null,
      subject_name || null,
    ]);

    let message = "";
    let success = 1;
    let subjectId: any = id || null;

    if (id) {
      // if (existing.length > 0 && existing[0].id !== id) {
      //   return {
      //     success: 0,
      //     message: "Tutor already has this subject",
      //   };
      // }

      await executeQuery(
        `UPDATE tutor_subjects
       SET 
         subject_id = ?,
         subject_name = ?,
         sylabus = ?,
         covered_topics = ?,
         prior_exp = ?,
         exp_year = ?,
         exp_month = ?
       WHERE id = ? AND tutor_id = ?`,
        [
          subject_id || null,
          subject_id ? null : subject_name,
          sylabus || null,
          JSON.stringify(topics),
          prior_exp || null,
          exp_year || 0,
          exp_month || 0,
          id,
          tutor_id,
        ],
      );

      message = "Subject Updated Successfully";
    } else {
      if (existing.length > 0) {
        return {
          success: 0,
          message: "Tutor already has this subject",
        };
      }

      const countResult: any = await executeQuery(
        `SELECT COUNT(*) as total FROM tutor_subjects WHERE tutor_id = ? AND status ='active'`,
        [tutor_id],
      );

      const total = countResult[0]?.total || 0;

      if (total >= 4) {
        return {
          success: 0,
          message: "Maximum 4 subjects allowed",
        };
      }

      const result: any = await executeQuery(
        `INSERT INTO tutor_subjects
       (tutor_id, subject_id, subject_name, sylabus, covered_topics,
        prior_exp, exp_year, exp_month)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tutor_id,
          subject_id || null,
          subject_id ? null : subject_name,
          sylabus || null,
          JSON.stringify(topics),
          prior_exp || null,
          exp_year || 0,
          exp_month || 0,
        ],
      );

      message = "Subject Added Successfully";
      subjectId = result.insertId;
    }

    await executeQuery(
      `UPDATE tutor_subjects
     SET sub_form = GREATEST(COALESCE(sub_form,0), 1)
     WHERE tutor_id = ?`,
      [tutor_id],
    );

    return {
      success,
      message,
      id: subjectId,
    };
  }

  async addTeachingLanguages(data: any) {
    const { tutor_id, teach_language } = data;

    if (!teach_language) return;

    await executeQuery(
      `UPDATE tutor_subjects
     SET teach_language = ?,
         sub_form = GREATEST(COALESCE(sub_form,0), 2)
     WHERE tutor_id = ?`,
      [teach_language, tutor_id],
    );
  }

  async addClassDetails(data: any) {
    const {
      tutor_id,
      class_mode,
      class_type,
      stream_id,
      min_fee,
      max_fee,
      tenure_type,
    } = data;

    if (
      !class_mode &&
      !class_type &&
      !stream_id &&
      !min_fee &&
      !max_fee &&
      !tenure_type
    )
      return;

    await executeQuery(
      `UPDATE tutor_subjects
     SET 
       class_mode = ?,
       class_type = ?,
       stream_ids = ?,
       min_fee = ?,
       max_fee = ?,
       tenure_type = ?,
       sub_form = GREATEST(COALESCE(sub_form,0), 3)
     WHERE tutor_id = ?`,
      [
        class_mode,
        class_type,
        stream_id,
        min_fee,
        max_fee,
        tenure_type,
        tutor_id,
      ],
    );
  }

  async getTutorSubjectById(tutor_id?: string, id?: number) {
    let query = `
    SELECT 
      id,
      tutor_id,
      subject_id,
      subject_name,
      sylabus,
      covered_topics,
      prior_exp,
      exp_year,
      exp_month,
      teach_language,
      class_mode,
      class_type,
      stream_ids,
      min_fee,
      max_fee,
      tenure_type
    FROM tutor_subjects
    WHERE tutor_id = ?
    AND status = 'active'
  `;
    const params: any[] = [tutor_id];
    if (id) {
      query += ` AND id = ?`;
      params.push(id);
    }
    const result: any = await executeQuery(query, params);

    if (!result.length) return [];
    
    return result;
  }

  async removeTutorSubject(id: number) {
    const existing: any = await executeQuery(
      `SELECT id FROM tutor_subjects WHERE id = ? `,
      [id],
    );

    if (!existing.length) {
      return {
        success: 0,
        message: "Subject not found",
      };
    }

    await executeQuery(
      `UPDATE tutor_subjects SET status = 'deleted' WHERE id = ? `,
      [id],
    );
    return {
      success: 1,
      message: "Subject deleted successfully",
    };
  }
}
