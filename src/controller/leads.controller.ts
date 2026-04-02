import { Request, Response } from "express";
import { sendResponse } from "../utils/helper";
import { LeadsModel } from "../models/leads.model";

const leadsMdl = new LeadsModel();
export class LeadsController {
  static getTutorLeads = async (req: Request, res: Response) => {
    try {
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
      } = req.body;

      if (!tutor_id) {
        return sendResponse(res, 200, 0, [], "tutor_id is required", []);
      }

      const data = await leadsMdl.fetchLeads({
        tutor_id,
        lead_id,
        from_date,
        to_date,
        subject_name,
        locations,
        leads_type,
        page,
        limit,
      });

      console.log(data)

      return sendResponse(res, 200, 1, data, "Leads fetched successfully", []);
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };
}
