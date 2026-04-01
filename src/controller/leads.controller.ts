import { Request, Response } from "express";
import { sendResponse } from "../utils/helper";

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
      } = req.body;


    //   const leadsData = await 
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };
}
