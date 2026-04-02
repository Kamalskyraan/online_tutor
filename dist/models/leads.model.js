"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsModel = void 0;
const helper_1 = require("../utils/helper");
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
        let query = `
    SELECT *
    FROM tutor_leads
    WHERE tutor_id = ?
  `;
        const params = [tutor_id];
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
                .map((loc) => loc.trim())
                .filter((loc) => loc);
            if (locationArray.length) {
                const likeConditions = locationArray
                    .map(() => `search_address LIKE ?`)
                    .join(" OR ");
                query += ` AND (${likeConditions})`;
                locationArray.forEach((loc) => {
                    params.push(`%${loc}%`);
                });
            }
        }
        if (from_date && to_date) {
            query += ` AND DATE(created_at) BETWEEN ? AND ?`;
            params.push(from_date, to_date);
        }
        else if (from_date) {
            query += ` AND DATE(created_at) >= ?`;
            params.push(from_date);
        }
        else if (to_date) {
            query += ` AND DATE(created_at) <= ?`;
            params.push(to_date);
        }
        query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);
        const data = await (0, helper_1.executeQuery)(query, params);
        const countQuery = `
    SELECT COUNT(*) as total
    FROM tutor_leads
    WHERE tutor_id = ?
`;
        const countResult = await (0, helper_1.executeQuery)(countQuery, [tutor_id]);
        const total = countResult[0]?.total || 0;
        return {
            data,
            total,
            page,
            limit,
        };
    }
}
exports.LeadsModel = LeadsModel;
//# sourceMappingURL=leads.model.js.map