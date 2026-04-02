"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorController = void 0;
const helper_1 = require("../utils/helper");
const tutor_model_1 = require("../models/tutor.model");
const validate_1 = require("../validators/validate");
const review_model_1 = require("../models/review.model");
const leads_model_1 = require("../models/leads.model");
const tutModel = new tutor_model_1.TutorModel();
const rvMdl = new review_model_1.ReviewModel();
const leadsMdl = new leads_model_1.LeadsModel();
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
        let responseData = [];
        if (id) {
            const data = await tutModel.getDemoVideosAndImages({
                tutor_id,
                id,
            });
            responseData = data;
        }
        else {
            const data = await tutModel.getDemoVideosAndImages({
                tutor_id,
                id: demos.id,
            });
            responseData = data;
        }
        return (0, helper_1.sendResponse)(res, 200, 1, responseData, demos.message, []);
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
        const { tutor_id, search_subject, student_id } = req.body;
        if (!tutor_id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "tutor_id is required", []);
        }
        const tutor = await tutModel.getTutorById(tutor_id);
        if (!tutor) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Tutor not found", []);
        }
        await leadsMdl.insertLead({
            tutor_id,
            student_id,
            lead_type: "profile",
            search_subject,
        });
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
        const { tutor_id, subject_name, from_date, to_date, page = 1, limit = 10, status, } = req.body;
        const data = await tutModel.fetchTutorRequests(tutor_id, Number(page), Number(limit), subject_name, from_date, to_date, status);
        return (0, helper_1.sendResponse)(res, 200, 1, data, "Request Fetched successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
TutorController.requestAcceptRejectFlow = async (req, res) => {
    try {
        const { req_id, status } = req.body;
        if (!req_id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Request Id is required", []);
        }
        await tutModel.acceptOrRejectRequest(req_id, status);
        const respStatus = status === "accepted" ? "accepted" : "rejected";
        return (0, helper_1.sendResponse)(res, 200, 1, [], `Tutor ${respStatus} successfully`, []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
TutorController.getTutorSubjectSuggestion = async (req, res) => {
    try {
        const { tutor_id } = req.body;
        const respData = await tutModel.fetchTutorSuggestion(tutor_id);
        return (0, helper_1.sendResponse)(res, 200, 1, respData, "Tutor suggestion fetch successfuly", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
TutorController.setViewMobile = async (req, res) => {
    try {
        const { tutor_id, student_id } = req.body;
        if (!tutor_id || !student_id) {
            return (0, helper_1.sendResponse)(res, 400, 0, [], "tutor_id and student_id are required", []);
        }
        const result = await tutModel.updateMobileViewStatus(tutor_id, student_id);
        if (result.affectedRows === 0) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "No record found to update", []);
        }
        return (0, helper_1.sendResponse)(res, 200, 1, [], "Mobile view status updated successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
//# sourceMappingURL=tutor.controller.js.map