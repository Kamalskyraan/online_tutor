import { Request, Response } from "express";
import { sendResponse } from "../utils/helper";
import { LeadsModel } from "../models/leads.model";
import { TutorModel } from "../models/tutor.model";

const leadsMdl = new LeadsModel();
const tutModel = new TutorModel();
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

      return sendResponse(res, 200, 1, data, "Leads fetched successfully", []);
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static setViewMobileLeads = async (req: Request, res: Response) => {
    try {
      const { tutor_id, student_id } = req.body;

      if (!tutor_id || !student_id) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "tutor_id and student_id are required",
          [],
        );
      }

      const result = await tutModel.updateMobileViewStatusInLeads(
        tutor_id,
        student_id,
      );

      if (result.affectedRows === 0) {
        return sendResponse(res, 200, 0, [], "No record found to update", []);
      }

      return sendResponse(
        res,
        200,
        1,
        [],
        "Mobile view status updated successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static getLeadsLocations = async (req: Request, res: Response) => {
    try {
      const {
        tutor_id,
        from_date,
        to_date,
        leads_type,
        search_subject,
        page = 1,
        limit = 5,
      } = req.body;

      if (!tutor_id) {
        return sendResponse(res, 200, 0, [], "tutor_id is required", []);
      }

      const result = await leadsMdl.fetchLeadsLocations({
        tutor_id,
        from_date,
        to_date,
        leads_type,
        search_subject,
        page,
        limit,
      });

      return sendResponse(
        res,
        200,
        1,
        {
          data: result.data,
          total: result.total,
          page: result.page,
          limit: result.limit,
          total_pages: result.total_pages,
        },
        "Locations fetched successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static setReadStatus = async (req: Request, res: Response) => {
    try {
      const { lead_id } = req.body;

      if (!lead_id) {
        return sendResponse(res, 200, 0, [], "Lead ID is required", []);
      }

      const result = await leadsMdl.setReadStatus(lead_id);
      if (result.affectedRows === 0) {
        return sendResponse(res, 200, 0, [], "No record found to update", []);
      }
      return sendResponse(
        res,
        200,
        1,
        [],
        "Mobile view status updated successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };
}
