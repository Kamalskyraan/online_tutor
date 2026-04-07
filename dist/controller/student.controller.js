"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const student_model_1 = require("../models/student.model");
const helper_1 = require("../utils/helper");
const leads_model_1 = require("../models/leads.model");
class StudentController {
}
exports.StudentController = StudentController;
_a = StudentController;
StudentController.studentModel = new student_model_1.StudentModel();
StudentController.leadsMdl = new leads_model_1.LeadsModel();
StudentController.getStudentData = async (req, res) => {
    try {
        const { student_id } = req.body;
        if (!student_id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Student Id is required", []);
        }
        const studentData = await _a.studentModel.fetchStudentData(student_id);
        return (0, helper_1.sendResponse)(res, 200, 1, studentData, "Student Data Fetched Successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, "Internal Server Error", err.errors || err.message || err);
    }
};
StudentController.getNearbyTutors = async (req, res) => {
    try {
        const body = req.body;
        const tutors = await _a.studentModel.findNearbyTutors(body);
        if (tutors.length) {
            const tutorIds = [...new Set(tutors.map((t) => t.tutor_id))];
            for (const tutor_id of tutorIds) {
                if (tutor_id) {
                    await _a.leadsMdl.insertLead({
                        tutor_id: tutor_id.toString(),
                        student_id: body.student_id,
                        lead_type: "search",
                        search_subject: body.search_subject,
                    });
                }
            }
        }
        (0, helper_1.sendResponse)(res, 200, 1, tutors, "Tutor Data Fetched successfully", []);
    }
    catch (err) {
        console.log(err);
        (0, helper_1.sendResponse)(res, 200, 0, [], "Internal Server error", err.errors || err.message || err);
    }
};
StudentController.bookASession = async (req, res) => {
    try {
        const { student_id, tutor_id, linked_sub } = req.body;
        const data = await _a.studentModel.studentClassBooking({
            student_id,
            tutor_id,
            linked_sub,
        });
        return (0, helper_1.sendResponse)(res, 200, 1, data, "Booking request sent (Pending)", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
StudentController.bookSessionStatus = async (req, res) => {
    try {
        const { session_id } = req.body;
        const data = await _a.studentModel.getbookSessionStatus(session_id);
        return (0, helper_1.sendResponse)(res, 200, 1, data, "Status Fetched successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
StudentController.getFees = async (req, res) => {
    try {
        const { subject_id, subject_name } = req.body;
        const data = await _a.studentModel.fetchFees(subject_id, subject_name);
        return (0, helper_1.sendResponse)(res, 200, 1, data, "Fees fetched successfully");
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
//# sourceMappingURL=student.controller.js.map