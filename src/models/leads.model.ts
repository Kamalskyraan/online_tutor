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

  async fetchLeads(){
    
  }
}
