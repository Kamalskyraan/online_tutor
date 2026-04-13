import { Request, Response } from "express";
import {
  convertNullToString,
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

const rvModel = new ReviewModel();
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

      return sendResponse(
        res,
        200,
        1,
        [revData],
        id ? "Review updated successfully" : "Review added successfully",
      );
    } catch (err: any) {
      console.log(err);
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
        convertNullToString(ReviewData),

        "Reviews Fetched Successfully",
        [],
      );
    } catch (err: any) {

      console.log(err)
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

      const result = await rvModel.toggleReviewLike({
        review_id,
        student_id,
        tutor_id,
      });
      return sendResponse(
        res,
        200,
        1,
        { like_count: result.total_likes, action: result.action },
        result.message,
        [],
      );
    } catch (err: any) {
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
