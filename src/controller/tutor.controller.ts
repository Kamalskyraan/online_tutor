import { Request, Response } from "express";
import { sendResponse, validateRequest } from "../utils/helper";
import { TutorModel } from "../models/tutor.model";
import { addUpdateDemosSchema, getDemosSchema } from "../validators/validate";
import { ReviewModel } from "../models/review.model";
import { LeadsModel } from "../models/leads.model";
import { NotificationTemplates } from "../config/notification.template";
import { NotificationModel } from "../models/notification.model";
import { sendPushNotification } from "../service/firebase.service";

const tutModel = new TutorModel();
const rvMdl = new ReviewModel();
const leadsMdl = new LeadsModel();
const noteModel = new NotificationModel();
export class TutorController {
  static addUpdateDemos = async (req: Request, res: Response) => {
    try {
      const { id, tutor_id, media_type, media_id, title, thumbnail } =
        await validateRequest(req.body, addUpdateDemosSchema);

      const demos = await tutModel.insertUpdateDemos({
        id,
        tutor_id,
        media_type,
        media_id,
        title,
        thumbnail,
      });

      let responseData: any = [];

      if (id) {
        const data = await tutModel.getDemoVideosAndImages({
          tutor_id,
          id,
        });

        responseData = data;
      } else {
        const data = await tutModel.getDemoVideosAndImages({
          tutor_id,
          id: demos.id,
        });

        responseData = data;
      }

      return sendResponse(res, 200, 1, responseData, demos.message, []);
    } catch (err: any) {
      console.log(err);
      return sendResponse(
        res,
        200,
        0,
        [],
        "something went wrong",
        err.errors || err.message || err,
      );
    }
  };

  static removeDemos = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      if (!id) {
        return sendResponse(res, 200, 0, [], "ID is required", []);
      }
      const tMdl = await tutModel.deleteDemos(id);
      return sendResponse(res, 200, 1, [], tMdl.message, []);
    } catch (err: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        "Internal Server Error",
        err.errors || err.message || err,
      );
    }
  };

  static getDemos = async (req: Request, res: Response) => {
    try {
      const { tutor_id, media_type, id } = await validateRequest(
        req.body,
        getDemosSchema,
      );
      const result = await tutModel.getDemoVideosAndImages({
        tutor_id,
        media_type,
        id,
      });

      return sendResponse(
        res,
        200,
        1,
        [result],
        "Demos Fetched Successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        "Internal Server Error",
        err.errors || err.message || err,
      );
    }
  };

  static getTutorData = async (req: Request, res: Response) => {
    try {
      const { tutor_id } = req.body;
      if (!tutor_id) {
        return sendResponse(res, 200, 0, [], "Tutor Id is required", []);
      }
      const tutorData = await tutModel.fetchTutorData(tutor_id);

      return sendResponse(
        res,
        200,
        1,
        tutorData,
        "Tutor Data fetched successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        "Internal Server Error",
        err.errors || err.message || err,
      );
    }
  };

  static getTutorDataById = async (req: Request, res: Response) => {
    try {
      const { tutor_id, search_subject, student_id } = req.body;
      if (!tutor_id) {
        return sendResponse(res, 200, 0, [], "tutor_id is required", []);
      }

      const tutor = await tutModel.getTutorById(tutor_id, student_id);
      if (!tutor) {
        return sendResponse(res, 200, 0, [], "Tutor not found", []);
      }

      await leadsMdl.insertLead({
        tutor_id,
        student_id,
        lead_type: "profile",
        search_subject,
      });

      if (search_subject && tutor.subjects?.length) {
        const keyword = search_subject.toLowerCase();

        tutor.subjects.sort((a: any, b: any) => {
          const aName = a.sub?.[0]?.subject_name?.toLowerCase() || "";
          const bName = b.sub?.[0]?.subject_name?.toLowerCase() || "";

          const aMatch = aName.includes(keyword);
          const bMatch = bName.includes(keyword);

          if (aMatch && !bMatch) return -1;
          if (!aMatch && bMatch) return 1;

          if (aName.startsWith(keyword)) return -1;
          if (bName.startsWith(keyword)) return 1;

          return 0;
        });
      }

      return sendResponse(res, 200, 1, tutor, "Tutor fetched successfully", []);
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static getReviewsAboutTutor = async (req: Request, res: Response) => {
    try {
      const { tutor_id } = req.body;
      const reviewData = await rvMdl.fetchReviewsForTutorById(tutor_id);
      return sendResponse(
        res,
        200,
        1,
        reviewData,
        "Reviews Fetched sucessfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static addStudentLikeTutor = async (req: Request, res: Response) => {
    try {
      const { tutor_id, student_id, status } = req.body;
      const result = await tutModel.addUpdateLikeForTutor(
        tutor_id,
        student_id,
        status,
      );

      let message = "";

      if (result.action === "removed") {
        message = "Reaction removed";
      } else if (result.action === "updated") {
        message = Number(status) === 1 ? "Tutor liked" : "Tutor disliked";
      } else {
        message = Number(status) === 1 ? "Tutor liked" : "Tutor disliked";
      }

      const userMap = await noteModel.getUserIdFromRole({
        tutor_id,
        student_id,
      });

      const tutorUserId = userMap?.tutor_user_id;
      const studentUserId = userMap?.student_user_id;

      if (tutorUserId && studentUserId && tutorUserId !== studentUserId) {
        const notif = NotificationTemplates.mobileViewedByStudent(student_id);

        if (Number(status) === 1 && result.action !== "removed") {
          await noteModel.insertNOtifcations({
            sender_id: studentUserId,
            receiver_id: tutorUserId,
            title: notif.title,
            message: notif.message,
            type: notif.type,
            extra_data: notif.extra_data,
            sent_to: "tutor",
          });

          await sendPushNotification({
            user_id: String(tutorUserId),
            payload: {
              title: notif.title,
              message: notif.message,
            },
          });
        } else {
          await tutModel.removeLikeNotification({
            sender_id: studentUserId,
            receiver_id: tutorUserId,
            tutor_id,
          });
        }
      }
      return sendResponse(res, 200, 1, [], message, []);
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static getLikesData = async (req: Request, res: Response) => {
    try {
      const { tutor_id, student_id } = req.body;
      if (!tutor_id && !student_id) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "Either tutor_id or student_id is required",
          [],
        );
      }
      const data = await tutModel.fetchLikes(tutor_id, student_id);
      return sendResponse(
        res,
        200,
        1,
        data,
        "Liked Data fetched successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static getTutorRequest = async (req: Request, res: Response) => {
    try {
      const {
        tutor_id,
        subject_name,
        from_date,
        to_date,
        page = 1,
        limit = 10,
        status,
      } = req.body;

      const data = await tutModel.fetchTutorRequests(
        tutor_id,
        Number(page),
        Number(limit),
        subject_name,
        from_date,
        to_date,
        status,
      );
      return sendResponse(
        res,
        200,
        1,
        data,
        "Request Fetched successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static requestAcceptRejectFlow = async (req: Request, res: Response) => {
    try {
      const { req_id, status } = req.body;
      if (!req_id) {
        return sendResponse(res, 200, 0, [], "Request Id is required", []);
      }

      await tutModel.acceptOrRejectRequest(req_id, status);

      const requestData = await tutModel.getRequestUsers(req_id);
      const tutor_id = requestData.tutor_id;
      const student_id = requestData.student_id;
      const userId = await noteModel.getUserIdFromRole({
        tutor_id,
        student_id,
      });

      const tutorUserId = userId.tutor_user_id;
      const studentUserId = userId.student_user_id;
      if (!requestData) {
        return sendResponse(res, 200, 0, [], "Request not found", []);
      }

      let notification;

      if (status === "accepted") {
        notification = NotificationTemplates.requestAccepted({
          subject: "subject",
        });
      } else {
        notification = NotificationTemplates.requestRejected({
          subject: "subject",
        });
      }

      await noteModel.insertNOtifcations({
        sender_id: tutorUserId,
        receiver_id: studentUserId,
        ...notification,
      });

      await sendPushNotification({
        user_id: String(studentUserId),
        payload: {
          title: notification.title,
          message: notification.message,
        },
      });
      const respStatus = status === "accepted" ? "accepted" : "rejected";
      return sendResponse(
        res,
        200,
        1,
        [],
        `Tutor ${respStatus} successfully`,
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static getTutorSubjectSuggestion = async (req: Request, res: Response) => {
    try {
      const { tutor_id } = req.body;
      const respData = await tutModel.fetchTutorSuggestion(tutor_id);
      return sendResponse(
        res,
        200,
        1,
        respData,
        "Tutor suggestion fetch successfuly",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static setViewMobile = async (req: Request, res: Response) => {
    try {
      const { tutor_id, student_id } = req.body;

      if (!tutor_id || !student_id) {
        return sendResponse(
          res,
          400,
          0,
          [],
          "tutor_id and student_id are required",
          [],
        );
      }

      const result = await tutModel.updateMobileViewStatus(
        tutor_id,
        student_id,
      );

      if (result.affectedRows === 0) {
        return sendResponse(res, 200, 0, [], "No record found to update", []);
      }
      const userId = await noteModel.getUserIdFromRole({
        tutor_id,
        student_id,
      });

      const tutorUserId = userId?.tutor_user_id;
      const studentUserId = userId?.student_user_id;
      if (!tutorUserId || !studentUserId) {
        return sendResponse(res, 200, 0, [], "User mapping failed", []);
      }
      const notification = NotificationTemplates.mobileViewed(tutor_id);

      await noteModel.insertNOtifcations({
        sender_id: tutorUserId,
        receiver_id: studentUserId,
        ...notification,
      });

      await sendPushNotification({
        user_id: String(studentUserId),
        payload: {
          title: notification.title,
          message: notification.message,
        },
      });
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

  static getTutorLeadsGraph = async (req: Request, res: Response) => {
    try {
      const { tutor_id, from_date, to_date } = req.body;

      const graph = await tutModel.getTutorLeadsGraph(
        tutor_id,
        from_date,
        to_date,
      );

      const requests = await tutModel.fetchTutorRequestsFor(tutor_id);

      return sendResponse(res, 200, 1, [graph, requests], "Graph fetched", []);
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.message,
      ]);
    }
  };
}
