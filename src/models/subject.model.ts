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
      query += ` AND subject_name = ?`;
      values.push(subject_name);
    }

    if (status !== undefined && status !== null) {
      query += ` AND status = ?`;
      values.push(status);
    }

    const result: any = await executeQuery(query, values);
    return result;
  }

  async addTutorSubjects(data: any) {
    const { tutor_id } = data;

    const subjects = Array.isArray(data.subjects) ? data.subjects : [];

    if (subjects.length === 0) return;

    for (const subject of subjects) {
      const checkQuery = `
      SELECT id FROM tutor_subjects 
      WHERE tutor_id = ? 
      AND (
        subject_id = ? OR subject_name = ?
      )
    `;

      const existing: any = await executeQuery(checkQuery, [
        tutor_id,
        subject.subject_id || null,
        subject.subject_name || null,
      ]);

      if (existing.length > 0) {
        const updateQuery = `
        UPDATE tutor_subjects
        SET sylabus = ?, covered_topics = ?, prior_exp = ?, exp_year = ?, exp_month = ?
        WHERE id = ?
      `;

        await executeQuery(updateQuery, [
          subject.sylabus,
          JSON.stringify(subject.covered_topics),
          subject.prior_exp,
          subject.exp_year,
          subject.exp_month,
          existing[0].id,
        ]);
      } else {
        const query = `
      INSERT INTO tutor_subjects
      (tutor_id,subject_id , subject_name, sylabus, covered_topics,
       prior_exp, exp_year, exp_month )
      VALUES (?, ?, ?, ?, ?, ?, ? , ? )
    `;

        await executeQuery(query, [
          tutor_id,
          subject.subject_id || null,
          subject.subject_id ? null : subject.subject_name,
          subject.sylabus || null,
          JSON.stringify(subject.covered_topics),
          subject.prior_exp,
          subject.exp_year,
          subject.exp_month,
        ]);
      }
    }

    await executeQuery(
      `UPDATE tutor_subjects
   SET sub_form = GREATEST(COALESCE(sub_form,0), 1)
   WHERE tutor_id = ?`,
      [tutor_id],
    );
  }

  async addTeachingLanguages(data: any) {
    const { tutor_id, teach_language } = data;

    const query = `
UPDATE tutor_subjects
SET 
  teach_language = ?,
  sub_form = GREATEST(COALESCE(sub_form,0), 2)
WHERE tutor_id = ?
`;

    await executeQuery(query, [teach_language, tutor_id]);
  }

  async addClassDetails(data: any) {
    const {
      tutor_id,
      class_mode,
      class_type,
      stream_ids,
      min_fee,
      max_fee,
      tenure_type,
    } = data;

    const query = `
    UPDATE tutor_subjects
    SET 
      class_mode = ?,
      class_type = ?,
      stream_ids = ?,
      min_fee = ?,
      max_fee = ?,
      tenure_type = ?,
      sub_form = GREATEST(sub_form, 3)
    WHERE tutor_id = ?
  `;

    await executeQuery(query, [
      class_mode,
      class_type,
      stream_ids,
      min_fee,
      max_fee,
      tenure_type,
      tutor_id,
    ]);
  }

  
}
