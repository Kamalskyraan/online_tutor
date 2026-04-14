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
        if (tutors?.data.length) {
            const tutorIds = [...new Set(tutors?.data.map((t) => t.tutor_id))];
            for (const tutor_id of tutorIds) {
                if (tutor_id) {
                    const existing = await (0, helper_1.executeQuery)(`SELECT id FROM tutor_leads 
       WHERE tutor_id = ? 
       AND student_id = ? 
       AND DATE(created_at) = CURDATE()`, [tutor_id, body.student_id]);
                    if (!existing.length) {
                        await _a.leadsMdl.insertLead({
                            tutor_id: tutor_id.toString(),
                            student_id: body.student_id,
                            lead_type: "search",
                            search_subject: body.search_subject,
                        });
                    }
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
StudentController.cancelABookSession = async (req, res) => {
    try {
        const { booking_id } = req.body;
        await _a.studentModel.cancelBooking(booking_id);
        return (0, helper_1.sendResponse)(res, 200, 1, [], "Booking session withdraw", []);
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
        const { subject_id, subject_name, fee_type, student_id } = req.body;
        const data = await _a.studentModel.fetchFees(subject_id, subject_name, fee_type, student_id);
        return (0, helper_1.sendResponse)(res, 200, 1, (0, helper_1.convertNullToString)(data), "Fees fetched successfully");
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
StudentController.updateMovileViewFromTutorById = async (req, res) => {
    try {
        const { student_id, tutor_id } = req.body;
        if (!student_id || !tutor_id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "student_id & tutor_id required", []);
        }
        const result = await _a.studentModel.setViewMobileForTutorByid(student_id, tutor_id);
        return (0, helper_1.sendResponse)(res, 200, 1, [], "Student Liked tutor Successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
StudentController.getBookedClassesForStudent = async (req, res) => {
    try {
        const { student_id, status, subject_name, page } = req.body;
        const result = await _a.studentModel.fetchBookedClasses({
            student_id,
            status,
            subject_name,
            page,
        });
        return (0, helper_1.sendResponse)(res, 200, 1, result, "Booked classes fetched", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
StudentController.studentConsumedSubjects = async (req, res) => {
    try {
        const { student_id, page } = req.body;
        const responses = await _a.studentModel.fetchConsumedSubjects(student_id, page);
        return (0, helper_1.sendResponse)(res, 200, 1, (0, helper_1.convertNullToString)(responses), "Subjects Fetched successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
StudentController.getMyFavourites = async (req, res) => {
    try {
        const { student_id, page } = req.body;
        if (!student_id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Student ID is required", []);
        }
        const studentFav = await _a.studentModel.fethFavouritesOfStudent(student_id, page);
        return (0, helper_1.sendResponse)(res, 200, 1, studentFav, "Favs fetched successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
//# sourceMappingURL=student.controller.js.map