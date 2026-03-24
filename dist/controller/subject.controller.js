"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectController = void 0;
const helper_1 = require("../utils/helper");
const validate_1 = require("../validators/validate");
const subject_model_1 = require("../models/subject.model");
const subMdl = new subject_model_1.SubjectModel();
class SubjectController {
}
exports.SubjectController = SubjectController;
_a = SubjectController;
SubjectController.addUpdateSubjects = async (req, res) => {
    try {
        const { id, subject_name, status } = await (0, helper_1.validateRequest)(req.body, validate_1.subjectSchema);
        await subMdl.insertUpdateSubject({
            id,
            subject_name,
            status,
        });
        return (0, helper_1.sendResponse)(res, 200, 1, [], id ? "Subject Update Successfully" : "Subject added Successfully", []);
    }
    catch (err) {
        console.log(err);
        return (0, helper_1.sendResponse)(res, 200, 0, [], "something went wrong", err.errors || err.message || err);
    }
};
SubjectController.getSubjects = async (req, res) => {
    try {
        const { id, subject_name, status } = req.body;
        const subjects = await subMdl.fetchSubjects({ id, subject_name, status });
        return (0, helper_1.sendResponse)(res, 200, 1, subjects, "subjects fetched successfully", []);
    }
    catch (err) {
        console.log(err);
        (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.errors || err.message || err);
    }
};
//
SubjectController.addUpdateSubjectsToTutor = async (req, res) => {
    try {
        const payload = await (0, helper_1.validateRequest)(req.body, validate_1.updateTutorSubjectsSchema);
        let result = {
            success: 1,
            message: "Updated successfully",
        };
        if (payload.subject_id ||
            payload.subject_name ||
            payload.covered_topics ||
            payload.sylabus ||
            payload.prior_exp ||
            payload.exp_year ||
            payload.exp_month ||
            payload.id) {
            result = await subMdl.addTutorSubjects(payload);
            if (result.success === 0) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], result.message, []);
            }
        }
        if (payload.teach_language) {
            await subMdl.addTeachingLanguages(payload);
        }
        if (payload.class_mode ||
            payload.class_type ||
            payload.stream_ids ||
            payload.min_fee ||
            payload.max_fee ||
            payload.tenure_type) {
            await subMdl.addClassDetails(payload);
        }
        return (0, helper_1.sendResponse)(res, 200, 1, [result.id ? { id: result.id } : []], result.message, []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
SubjectController.getTutorSubjects = async (req, res) => {
    try {
        const { tutor_id, id } = req.body;
        const result = await subMdl.getTutorSubjectById(tutor_id, id);
        if (!result) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Subject not found", []);
        }
        return (0, helper_1.sendResponse)(res, 200, 1, [result], "Subject fetched successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
SubjectController.deleteTutorSubject = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Id is required", []);
        }
        const result = await subMdl.removeTutorSubject(id);
        if (result.success === 0) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], result.message, []);
        }
        return (0, helper_1.sendResponse)(res, 200, 1, [], result.message, []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
//# sourceMappingURL=subject.controller.js.map