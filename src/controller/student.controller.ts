import { Request, Response } from "express";
import { StudentModel } from "../models/student.model";
import {
  convertNullToString,
  executeQuery,
  sendResponse,
} from "../utils/helper";
import { Location } from "../interface/interface";
import { LeadsModel } from "../models/leads.model";
import { NotificationModel } from "../models/notification.model";
import { NotificationTemplates } from "../config/notification.template";
import { sendPushNotification } from "../service/firebase.service";

export class StudentController {
  private static studentModel = new StudentModel();
  private static leadsMdl = new LeadsModel();
  private static noteModel = new NotificationModel();
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

      sendResponse(
        res,
        200,
        1,
        [tutors],
        "Tutor Data Fetched successfully",
        [],
      );
    } catch (err: any) {
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
      const { booking_id, student_id, tutor_id, linked_sub } = req.body;

      const data = await this.studentModel.studentClassBooking({
        booking_id,
        student_id,
        tutor_id,
        linked_sub,
      });

      const userId = await this.noteModel.getUserIdFromRole({
        tutor_id,
        student_id,
      });
      const tutorUserId = userId.tutor_user_id;
      const studentUserId = userId.student_user_id;
      const notif = NotificationTemplates.studentRequest({});

      await this.noteModel.insertNOtifcations({
        sender_id: studentUserId,
        receiver_id: tutorUserId,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        extra_data: notif.extra_data,
        sent_to: "tutor",
      });

      console.log(tutorUserId);
      await sendPushNotification({
        user_id: String(tutorUserId),
        payload: {
          title: notif.title,
          message: notif.message,
        },
      });
      return sendResponse(
        res,
        200,
        1,
        [data],
        "Booking request sent (Pending)",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static cancelABookSession = async (req: Request, res: Response) => {
    try {
      const { booking_id } = req.body;
      await this.studentModel.cancelBooking(booking_id);

      return sendResponse(res, 200, 1, [], "Booking session withdraw", []);
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

  static getBookedClassesForStudent = async (req: Request, res: Response) => {
    try {
      const { student_id, status, subject_name, page } = req.body;
      const result = await this.studentModel.fetchBookedClasses({
        student_id,
        status,
        subject_name,
        page,
      });

      return sendResponse(
        res,
        200,
        1,
        [convertNullToString(result)],
        "Booked classes fetched",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static studentConsumedSubjects = async (req: Request, res: Response) => {
    try {
      const { student_id } = req.body;
      const responses =
        await this.studentModel.fetchConsumedSubjects(student_id);

      return sendResponse(
        res,
        200,
        1,
        convertNullToString(responses),
        "Subjects Fetched successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static getMyFavourites = async (req: Request, res: Response) => {
    try {
      const { student_id, page } = req.body;
      if (!student_id) {
        return sendResponse(res, 200, 0, [], "Student ID is required", []);
      }
      const studentFav = await this.studentModel.fethFavouritesOfStudent(
        student_id,
        page,
      );

      return sendResponse(
        res,
        200,
        1,
        studentFav,
        "Favs fetched successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static reportTutorProfile = async (req: Request, res: Response) => {
    try {
      const { tutor_id, student_id, reason_id, other_reason } = req.body;

      const existing = await this.studentModel.checkExistingReport(
        tutor_id,
        student_id,
      );

      if (existing.length > 0) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "You already reported this tutor",
          [],
        );
      }

      await this.studentModel.insertReport(
        tutor_id,
        student_id,
        reason_id,
        other_reason,
      );

      const totalReports = await this.studentModel.getReportCount(tutor_id);

      let isBlocked = false;

      if (totalReports >= 1) {
        const user_id = await this.studentModel.getTutorUserId(tutor_id);

        if (user_id) {
          await this.studentModel.blockUser(user_id);
          isBlocked = true;
        }
      }

      return sendResponse(
        res,
        200,
        1,
        [
          {
            total_reports: totalReports,
            is_blocked: isBlocked,
          },
        ],
        isBlocked
          ? "Reported successfully. Tutor has been blocked."
          : "Reported successfully",
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };
}
