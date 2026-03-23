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
        const { tutor_id, ...payload } = await (0, helper_1.validateRequest)(req.body, validate_1.updateTutorSubjectsSchema);
        if (payload.subject_id ||
            payload.subject_name ||
            payload.covered_topics ||
            payload.sylabus ||
            payload.prior_exp ||
            payload.exp_year ||
            payload.exp_month) {
            await subMdl.addTutorSubjects({ tutor_id, subjects: [payload] });
        }
        if (payload.teach_language) {
            await subMdl.addTeachingLanguages({ tutor_id, ...payload });
        }
        if (payload.class_mode ||
            payload.class_type ||
            payload.stream_ids ||
            payload.min_fee ||
            payload.max_fee ||
            payload.tenure_type) {
            await subMdl.addClassDetails({ tutor_id, ...payload });
        }
        return (0, helper_1.sendResponse)(res, 200, 1, [], "Tutor subjects updated successfully", []);
    }
    catch (err) {
        console.log(err);
        return (0, helper_1.sendResponse)(res, 500, 0, [], "something went wrong", err.errors || err.message || err);
    }
};
SubjectController.getTutorSubjects = async (req, res) => { };
//# sourceMappingURL=subject.controller.js.map