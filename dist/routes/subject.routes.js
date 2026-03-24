"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subject_controller_1 = require("../controller/subject.controller");
const router = (0, express_1.Router)();
router.post("/add-update-subject", (req, res) => {
    subject_controller_1.SubjectController.addUpdateSubjects(req, res);
});
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
    /*
      #swagger.tags = ['5.Subject']
      #swagger.summary = 'Add Update subjects to Tutor'
      #swagger.description = 'Add and Update Subject to Tutor'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          id : 1,
          tutor_id : "TUTOR_A2u50js3",
          subject_name: "java etc.",
          subject_id : "1",
          covered_topics: ["abcd , efgh "],
          sylabus : "1",
          prior_exp : "0 or 1",
          exp_year : "1",
          exp_month : "11",
          teach_language : "1,2,3,4",
          class_mode : "0",
          class_type : "0",
          stream_ids : "1,2,3",
          min_fee : "120",
          max_fee : "1200",
          tenure_type : "hour"
        }
      }
  
  
      #swagger.responses[200] = {
        description: "Subject added to tutor successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    subject_controller_1.SubjectController.addUpdateSubjectsToTutor(req, res);
});
router.post("/get-tutor-subjetcs", (req, res) => {
    /*
      #swagger.tags = ['5.Subject']
      #swagger.summary = 'Get subjects belongs to tutor'
      #swagger.description = 'Get subject all or based on ID'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          id: 1,
          tutor_id : "TUTOR_A2u50js3"
        }
      }
  
  
      #swagger.responses[200] = {
        description: "Subjects fetched successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    subject_controller_1.SubjectController.getTutorSubjects(req, res);
});
router.post("/delete-tutor-subject", (req, res) => {
    /*
      #swagger.tags = ['5.Subject']
      #swagger.summary = 'Remove subjects belongs to tutor'
      #swagger.description = 'Remove subject based on ID (soft delete only)'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          id: 1
        }
      }
  
  
      #swagger.responses[200] = {
        description: "Subjects removed successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    subject_controller_1.SubjectController.deleteTutorSubject(req, res);
});
exports.default = router;
//# sourceMappingURL=subject.routes.js.map