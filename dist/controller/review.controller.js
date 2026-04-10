"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const helper_1 = require("../utils/helper");
const validate_1 = require("../validators/validate");
const review_model_1 = require("../models/review.model");
const rvModel = new review_model_1.ReviewModel();
class ReviewController {
    static async addUpdateReview(req, res) {
        try {
            const { id, tutor_id, student_id, rating, review_text } = await (0, helper_1.validateRequest)(req.body, validate_1.reviewSchema);
            const revData = await rvModel.createReview({
                id,
                tutor_id,
                student_id,
                rating,
                review_text,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, [revData], id ? "Review updated successfully" : "Review added successfully");
        }
        catch (err) {
            console.log(err);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.errors || err.message || err);
        }
    }
    static async getUpdateReview(req, res) {
        try {
            const { id, tutor_id, student_id, rating, from_date, to_date, page = 1, limit = 10, } = await (0, helper_1.validateRequest)(req.body, validate_1.fetchReviewSchema);
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
            return (0, helper_1.sendResponse)(res, 200, 1, (0, helper_1.convertNullToString)(ReviewData), "Reviews Fetched Successfully", []);
        }
        catch (err) {
            console.log(err);
            (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.errors || err.message || err);
        }
    }
    static async replyReview(req, res) {
        try {
            const { id, review_id, tutor_id, student_id, reply_text } = await (0, helper_1.validateRequest)(req.body, validate_1.replyReviewSchema);
            const result = await rvModel.createUpdateReviewReply({
                id,
                review_id,
                tutor_id,
                student_id,
                reply_text,
            });
            (0, helper_1.sendResponse)(res, 200, 1, [], result.message, []);
        }
        catch (err) {
            (0, helper_1.sendResponse)(res, 500, 0, "Internal Server Error", err.errors || err.message || err);
        }
    }
    static async deleteReview(req, res) {
        try {
            const { id, student_id } = req.body;
            if (!id) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "ID is required", []);
            }
            const result = await rvModel.removeReview({
                id,
                student_id,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, [], result.message, []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.message);
        }
    }
    static async reviewLike(req, res) {
        try {
            const { review_id, student_id, tutor_id } = await (0, helper_1.validateRequest)(req.body, validate_1.reviewLikeSchema);
            if (!student_id && !tutor_id) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "student_id or tutor_id required", []);
            }
            const result = await rvModel.toggleReviewLike({
                review_id,
                student_id,
                tutor_id,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, result.action, result.message, []);
        }
        catch (err) {
            (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error");
        }
    }
    static async fetchReportReasons(req, res) {
        try {
            const result = await rvModel.getActiveReportReasons();
            return (0, helper_1.sendResponse)(res, 200, 1, result, "Report reasons fetched successfully", []);
        }
        catch (err) {
            console.log(err);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Something went wrong", err.message);
        }
    }
    static async reportReview(req, res) {
        try {
            const payload = await (0, helper_1.validateRequest)(req.body, validate_1.reportSchema);
            const result = await rvModel.reportReview(payload);
            return (0, helper_1.sendResponse)(res, 200, 1, result, result.message, []);
        }
        catch (err) {
            console.log(err);
            return (0, helper_1.sendResponse)(res, 500, 0, [], err.message || "Something went wrong");
        }
    }
}
exports.ReviewController = ReviewController;
//# sourceMappingURL=review.controller.js.map