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
    async fetchLeads() {
    }
}
exports.LeadsModel = LeadsModel;
//# sourceMappingURL=leads.model.js.map