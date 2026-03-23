"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("../controller/student.controller");
const router = (0, express_1.Router)();
router.post("/nearby-tutors", student_controller_1.StudentController.getNearbyTutors);
exports.default = router;
//# sourceMappingURL=student.routes.js.map