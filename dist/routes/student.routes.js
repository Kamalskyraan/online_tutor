"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("../controller/student.controller");
const router = (0, express_1.Router)();
router.post("/nearby-tutors", (req, res) => {
    /*
      #swagger.tags = ['9.Student']
      #swagger.summary = 'Get Near By Tutor's Data'
      #swagger.description = 'Get Tutor's data using lat,lng'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          lat : "12.45",
          lng : "10.46",
          search_address : "cbe"
          }
      }
  
  
      #swagger.responses[200] = {
        description: "Tutor Data fetched successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    student_controller_1.StudentController.getNearbyTutors(req, res);
});
router.post("/get-student-data", (req, res) => {
    /*
      #swagger.tags = ['9.Student']
      #swagger.summary = 'Get Student Data'
      #swagger.description = 'Get Student data using student_id'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          student_id: "STUDENT_2Ie159-E"
          }
      }
  
  
      #swagger.responses[200] = {
        description: "Student Data fetched successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    student_controller_1.StudentController.getStudentData(req, res);
});
exports.default = router;
//# sourceMappingURL=student.routes.js.map