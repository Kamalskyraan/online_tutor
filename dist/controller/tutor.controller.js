"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorController = void 0;
const helper_1 = require("../utils/helper");
const tutor_model_1 = require("../models/tutor.model");
const validate_1 = require("../validators/validate");
const review_model_1 = require("../models/review.model");
const tutModel = new tutor_model_1.TutorModel();
const rvMdl = new review_model_1.ReviewModel();
class TutorController {
}
exports.TutorController = TutorController;
_a = TutorController;
TutorController.addUpdateDemos = async (req, res) => {
    try {
        const { id, tutor_id, media_type, media_id, title, thumbnail } = await (0, helper_1.validateRequest)(req.body, validate_1.addUpdateDemosSchema);
        const demos = await tutModel.insertUpdateDemos({
            id,
            tutor_id,
            media_type,
            media_id,
            title,
            thumbnail,
        });
        return (0, helper_1.sendResponse)(res, 200, 1, [], demos.message, []);
    }
    catch (err) {
        console.log(err);
        return (0, helper_1.sendResponse)(res, 200, 0, [], "something went wrong", err.errors || err.message || err);
    }
};
TutorController.removeDemos = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "ID is required", []);
        }
        const tMdl = await tutModel.deleteDemos(id);
        return (0, helper_1.sendResponse)(res, 200, 1, [], tMdl.message, []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.errors || err.message || err);
    }
};
TutorController.getDemos = async (req, res) => {
    try {
        const { tutor_id, media_type, id } = await (0, helper_1.validateRequest)(req.body, validate_1.getDemosSchema);
        const result = await tutModel.getDemoVideosAndImages({
            tutor_id,
            media_type,
            id,
        });
        return (0, helper_1.sendResponse)(res, 200, 1, result, "Demos Fetched Successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.errors || err.message || err);
    }
};
TutorController.getTutorData = async (req, res) => {
    try {
        const { tutor_id } = req.body;
        if (!tutor_id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Tutor Id is required", []);
        }
        const tutorData = await tutModel.fetchTutorData(tutor_id);
        return (0, helper_1.sendResponse)(res, 200, 1, tutorData, "Tutor Data fetched successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.errors || err.message || err);
    }
};
TutorController.getTutorDataById = async (req, res) => {
    try {
        const { tutor_id, search_subject } = req.body;
        if (!tutor_id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "tutor_id is required", []);
        }
        const tutor = await tutModel.getTutorById(tutor_id);
        if (!tutor) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Tutor not found", []);
        }
        if (search_subject && tutor.subjects?.length) {
            const keyword = search_subject.toLowerCase();
            tutor.subjects.sort((a, b) => {
                const aName = a.sub?.[0]?.subject_name?.toLowerCase() || "";
                const bName = b.sub?.[0]?.subject_name?.toLowerCase() || "";
                const aMatch = aName.includes(keyword);
                const bMatch = bName.includes(keyword);
                if (aMatch && !bMatch)
                    return -1;
                if (!aMatch && bMatch)
                    return 1;
                if (aName.startsWith(keyword))
                    return -1;
                if (bName.startsWith(keyword))
                    return 1;
                return 0;
            });
        }
        return (0, helper_1.sendResponse)(res, 200, 1, tutor, "Tutor fetched successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
TutorController.getReviewsAboutTutor = async (req, res) => {
    try {
        const { tutor_id } = req.body;
        const reviewData = await rvMdl.fetchReviewsForTutorById(tutor_id);
        return (0, helper_1.sendResponse)(res, 200, 1, reviewData, "Reviews Fetched sucessfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
TutorController.addStudentLikeTutor = async (req, res) => {
    try {
        const { tutor_id, student_id, status } = req.body;
        const result = await tutModel.addUpdateLikeForTutor(tutor_id, student_id, status);
        let message = "";
        if (result.action === "removed") {
            message = "Reaction removed";
        }
        else if (result.action === "updated") {
            message = Number(status) === 1 ? "Tutor liked" : "Tutor disliked";
        }
        else {
            message = Number(status) === 1 ? "Tutor liked" : "Tutor disliked";
        }
        return (0, helper_1.sendResponse)(res, 200, 1, [], message, []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
TutorController.getTutorRequest = async (req, res) => {
    try {
        const { tutor_id } = req.body;
        const data = await tutModel.fetchTutorRequests(tutor_id);
        return (0, helper_1.sendResponse)(res, 200, 1, data, "Request Fetched successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
//# sourceMappingURL=tutor.controller.js.map