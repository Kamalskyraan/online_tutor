"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subject_controller_1 = require("../controller/subject.controller");
const router = (0, express_1.Router)();
router.post("/add-subject", subject_controller_1.SubjectController.addUpdateSubjects);
router.post("/get-subjects", (req, res) => {
    /*
      #swagger.tags = ['5.Subject']
      #swagger.summary = 'Get subjects'
      #swagger.description = 'Get subject all or ID or active subjects'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          id: 1,
          subject_name : "java",
          status : "active"
        }
      }
  
  
      #swagger.responses[200] = {
        description: "Subject fetched successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    return subject_controller_1.SubjectController.getSubjects(req, res);
});
router.post("/update-tutor-subjects", (req, res) => {
    subject_controller_1.SubjectController.addUpdateSubjectsToTutor(req, res);
});
exports.default = router;
//# sourceMappingURL=subject.routes.js.map