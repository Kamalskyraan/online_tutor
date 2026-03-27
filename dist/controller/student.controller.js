"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const student_model_1 = require("../models/student.model");
const helper_1 = require("../utils/helper");
class StudentController {
}
exports.StudentController = StudentController;
_a = StudentController;
StudentController.studentModel = new student_model_1.StudentModel();
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
        (0, helper_1.sendResponse)(res, 200, 1, tutors, "Tutor Data Fetched successfully", []);
    }
    catch (err) {
        console.log(err);
        (0, helper_1.sendResponse)(res, 200, 0, [], "Internal Server error", err.errors || err.message || err);
    }
};
//# sourceMappingURL=student.controller.js.map