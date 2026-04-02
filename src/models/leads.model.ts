import { Help } from "../interface/interface";
import { executeQuery } from "../utils/helper";

export class LeadsModel {
  async insertLead(data: {
    tutor_id?: string;
    student_id?: string;
    lead_type: "search" | "profile";
    search_subject?: string;
  }) {
    const {
      tutor_id,
      student_id = null,
      lead_type,
      search_subject = null,
    } = data;

    await executeQuery(
      `INSERT INTO tutor_leads 
     (tutor_id, student_id, lead_type, search_subject)
     VALUES (?, ?, ?, ?)`,
      [tutor_id, student_id, lead_type, search_subject],
    );
  }

  async fetchLeads(filters: any) {
    const {
      tutor_id,
      lead_id,
      from_date,
      to_date,
      subject_name,
      locations,
      leads_type,
      page = 1,
      limit = 10,
    } = filters;

    const offset = (page - 1) * limit;

    let query = `
    SELECT *
    FROM tutor_leads
    WHERE tutor_id = ?
  `;

    const params: any[] = [tutor_id];

    if (lead_id) {
      query += ` AND id = ?`;
      params.push(lead_id);
    }

    if (leads_type) {
      query += ` AND lead_type = ?`;
      params.push(leads_type);
    }

    if (subject_name) {
      query += ` AND search_subject LIKE ?`;
      params.push(`%${subject_name}%`);
    }

    if (locations) {
      const locationArray = locations
        .split(",")
        .map((loc: string) => loc.trim())
        .filter((loc: string) => loc);

      if (locationArray.length) {
        const likeConditions = locationArray
          .map(() => `search_address LIKE ?`)
          .join(" OR ");

        query += ` AND (${likeConditions})`;

        locationArray.forEach((loc: string) => {
          params.push(`%${loc}%`);
        });
      }
    }

    if (from_date && to_date) {
      query += ` AND DATE(created_at) BETWEEN ? AND ?`;
      params.push(from_date, to_date);
    } else if (from_date) {
      query += ` AND DATE(created_at) >= ?`;
      params.push(from_date);
    } else if (to_date) {
      query += ` AND DATE(created_at) <= ?`;
      params.push(to_date);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const data = await executeQuery(query, params);

    const countQuery = `
    SELECT COUNT(*) as total
    FROM tutor_leads
    WHERE tutor_id = ?
`;

    const countResult = await executeQuery(countQuery, [tutor_id]);
    const total = countResult[0]?.total || 0;

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
