import { Request, Response } from "express";
import { StudentModel } from "../models/student.model";
import {
  convertNullToString,
  executeQuery,
  sendResponse,
} from "../utils/helper";
import { Location } from "../interface/interface";
import { LeadsModel } from "../models/leads.model";

export class StudentController {
  private static studentModel = new StudentModel();
  private static leadsMdl = new LeadsModel();

  static getStudentData = async (req: Request, res: Response) => {
    try {
      const { student_id } = req.body;
      if (!student_id) {
        return sendResponse(res, 200, 0, [], "Student Id is required", []);
      }

      const studentData = await this.studentModel.fetchStudentData(student_id);
      return sendResponse(
        res,
        200,
        1,

        studentData,
        "Student Data Fetched Successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(
        res,
        500,
        0,
        "Internal Server Error",
        err.errors || err.message || err,
      );
    }
  };

  public static getNearbyTutors = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const body: Location = req.body;

      const tutors = await this.studentModel.findNearbyTutors(body);

      if (tutors?.data.length) {
        const tutorIds = [...new Set(tutors?.data.map((t: any) => t.tutor_id))];

        for (const tutor_id of tutorIds) {
          if (tutor_id) {
            const existing: any = await executeQuery(
              `SELECT id FROM tutor_leads 
       WHERE tutor_id = ? 
       AND student_id = ? 
       AND DATE(created_at) = CURDATE()`,
              [tutor_id, body.student_id],
            );

            if (!existing.length) {
              await this.leadsMdl.insertLead({
                tutor_id: tutor_id.toString(),
                student_id: body.student_id,
                lead_type: "search",
                search_subject: body.search_subject,
              });
            }
          }
        }
      }

      sendResponse(res, 200, 1, tutors, "Tutor Data Fetched successfully", []);
    } catch (err: any) {
      console.log(err);
      sendResponse(
        res,
        200,
        0,
        [],
        "Internal Server error",
        err.errors || err.message || err,
      );
    }
  };

  static bookASession = async (req: Request, res: Response) => {
    try {
      const { student_id, tutor_id, linked_sub } = req.body;
      const data = await this.studentModel.studentClassBooking({
        student_id,
        tutor_id,
        linked_sub,
      });

      return sendResponse(
        res,
        200,
        1,
        data,
        "Booking request sent (Pending)",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static bookSessionStatus = async (req: Request, res: Response) => {
    try {
      const { session_id } = req.body;
      const data = await this.studentModel.getbookSessionStatus(session_id);

      return sendResponse(res, 200, 1, data, "Status Fetched successfully", []);
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static getFees = async (req: Request, res: Response) => {
    try {
      const { subject_id, subject_name, fee_type, student_id } = req.body;

      const data = await this.studentModel.fetchFees(
        subject_id,
        subject_name,
        fee_type,
        student_id,
      );

      return sendResponse(
        res,
        200,
        1,
        convertNullToString(data),
        "Fees fetched successfully",
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static updateMovileViewFromTutorById = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { student_id, tutor_id } = req.body;

      if (!student_id || !tutor_id) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "student_id & tutor_id required",
          [],
        );
      }
      const result = await this.studentModel.setViewMobileForTutorByid(
        student_id,
        tutor_id,
      );
      return sendResponse(
        res,
        200,
        1,
        [],
        "Student Liked tutor Successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };
}
