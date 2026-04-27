import { Request, Response } from "express";
import {
  convertNullToString,
  executeQuery,
  sendResponse,
  validateRequest,
} from "../utils/helper";
import {
  fetchReviewSchema,
  replyReviewSchema,
  reportSchema,
  reviewLikeSchema,
  reviewSchema,
  signupSchema,
} from "../validators/validate";
import { ReviewModel } from "../models/review.model";
import { NotificationModel } from "../models/notification.model";
import { sendPushNotification } from "../service/firebase.service";
import { NotificationTemplates } from "../config/notification.template";

const rvModel = new ReviewModel();
const noteModel = new NotificationModel();
export class ReviewController {
  static async addUpdateReview(req: Request, res: Response) {
    try {
      const { id, tutor_id, student_id, rating, review_text } =
        await validateRequest(req.body, reviewSchema);

      const revData = await rvModel.createReview({
        id,
        tutor_id,
        student_id,
        rating,
        review_text,
      });

      const userId = await noteModel.getUserIdFromRole({
        tutor_id,
        student_id,
      });
      const tutorUserId = userId?.tutor_user_id;
      const studentUserId = userId.student_user_id;
      const notif = NotificationTemplates.review({
        isUpdate: !!id,
        tutor_id,
        rating,
      });

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

      return sendResponse(
        res,
        200,
        1,
        [revData],
        id ? "Review updated successfully" : "Review added successfully",
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
  }

  static async getUpdateReview(req: Request, res: Response) {
    try {
      const {
        id,
        tutor_id,
        student_id,
        rating,
        from_date,
        to_date,
        page = 1,
        limit = 5,
      } = await validateRequest(req.body, fetchReviewSchema);

      const ReviewData = await rvModel.fetchReviews({
        id,
        tutor_id,
        student_id,
        rating,
        from_date,
        to_date,
        page,
        limit,
      });

      return sendResponse(
        res,
        200,
        1,
        [convertNullToString(ReviewData)],

        "Reviews Fetched Successfully",
        [],
      );
    } catch (err: any) {
      console.log(err);
      sendResponse(
        res,
        500,
        0,
        [],
        "Internal Server Error",
        err.errors || err.message || err,
      );
    }
  }

  static async replyReview(req: Request, res: Response) {
    try {
      const { id, review_id, tutor_id, student_id, reply_text } =
        await validateRequest(req.body, replyReviewSchema);

      const result = await rvModel.createUpdateReviewReply({
        id,
        review_id,
        tutor_id,
        student_id,
        reply_text,
      });

      const notif = NotificationTemplates.reviewReply({
        isUpdate: !!id,
        tutor_id,
      });
      const userId = await noteModel.getUserIdFromRole({
        tutor_id,
        student_id,
      });

      await noteModel.insertNOtifcations({
        sender_id: userId.tutor_user_id,
        receiver_id: userId.student_user_id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        extra_data: notif.extra_data,
        sent_to: "student",
      });

      await sendPushNotification({
        user_id: String(userId.student_user_id),
        payload: {
          title: notif.title,
          message: notif.message,
        },
      });
      sendResponse(
        res,
        200,
        1,
        [result],
        id
          ? "Rview Reply added successfully"
          : "Review reply ipdated succesfully",
        [],
      );
    } catch (err: any) {
      sendResponse(
        res,
        500,
        0,
        "Internal Server Error",
        err.errors || err.message || err,
      );
    }
  }

  static async deleteReview(req: Request, res: Response) {
    try {
      const { id, student_id } = req.body;

      if (!id) {
        return sendResponse(res, 200, 0, [], "ID is required", []);
      }

      const result = await rvModel.removeReview({
        id,
        student_id,
      });

      return sendResponse(res, 200, 1, [], result.message, []);
    } catch (err: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        "Internal Server Error",
        err.message,
      );
    }
  }

  static async deleteReviewReply(req: Request, res: Response) {
    try {
      const { id, tutor_id } = req.body;

      if (!id) {
        return sendResponse(res, 200, 0, [], "ID is required", []);
      }

      const result = await rvModel.removeReviewReply({
        id,
        tutor_id,
      });

      return sendResponse(res, 200, 1, [], result.message, []);
    } catch (err: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        "Internal Server Error",
        err.message,
      );
    }
  }

  static async reviewLike(req: Request, res: Response) {
    try {
      const { review_id, student_id, tutor_id } = await validateRequest(
        req.body,
        reviewLikeSchema,
      );

      if (!student_id && !tutor_id) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "student_id or tutor_id required",
          [],
        );
      }

      const isTutor = !!tutor_id;
      const sender_id = tutor_id || student_id;

      const reviewRes: any = await executeQuery(
        `SELECT student_id FROM reviews WHERE id = ?`,
        [review_id],
      );
      if (!reviewRes.length) {
        return sendResponse(res, 200, 0, [], "Review not found", []);
      }

      const receiver_id = reviewRes[0].student_id;

      const result = await rvModel.toggleReviewLike({
        review_id,
        student_id,
        tutor_id,
      });

      if (sender_id !== receiver_id) {
        let sender_user_id: any;
        let receiver_user_id: any;
        if (isTutor) {
          const userMap = await noteModel.getUserIdFromRole({
            tutor_id: sender_id,
            student_id: receiver_id,
          });

          sender_user_id = userMap.tutor_user_id;
          receiver_user_id = userMap.student_user_id;
        } else {
          const userMap = await noteModel.getUserIdFromRole({
            student_id: sender_id,
          });

          sender_user_id = userMap.student_user_id;
          receiver_user_id = receiver_id;
        }

        const notif = NotificationTemplates.reviewLike({ review_id });

        if (result.action === "like") {
          await noteModel.insertNOtifcations({
            sender_id: sender_user_id,
            receiver_id: receiver_user_id,
            title: notif.title,
            message: notif.message,
            type: notif.type,
            extra_data: notif.extra_data,
            sent_to: "student",
          });

          await sendPushNotification({
            user_id: String(receiver_user_id),
            payload: {
              title: notif.title,
              message: notif.message,
            },
          });
        } else if (result.action === "dislike") {
          await rvModel.removeNotification({
            sender_id: sender_user_id,
            receiver_id: receiver_user_id,
            review_id,
          });
        }
      }

      return sendResponse(
        res,
        200,
        1,
        { like_count: result.total_likes, action: result.action },
        result.message,
        [],
      );
    } catch (err: any) {
      console.log(err);
      sendResponse(res, 500, 0, [], "Internal Server Error");
    }
  }

  static async fetchReportReasons(req: Request, res: Response) {
    try {
      const result = await rvModel.getActiveReportReasons();

      return sendResponse(
        res,
        200,
        1,
        result,
        "Report reasons fetched successfully",
        [],
      );
    } catch (err: any) {
      console.log(err);
      return sendResponse(res, 500, 0, [], "Something went wrong", err.message);
    }
  }

  static async reportReview(req: Request, res: Response) {
    try {
      const payload = await validateRequest(req.body, reportSchema);

      const result = await rvModel.reportReview(payload);

      return sendResponse(res, 200, 1, result, result.message, []);
    } catch (err: any) {
      console.log(err);
      return sendResponse(
        res,
        500,
        0,
        [],
        err.message || "Something went wrong",
      );
    }
  }
}
