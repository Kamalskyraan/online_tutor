import { Router } from "express";
import { SubjectController } from "../controller/subject.controller";
import { authMiddleware } from "../config/middleware";

const router = Router();

router.post("/add-update-subject", (req, res) => {
  SubjectController.addUpdateSubjects(req, res);
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
  return SubjectController.getSubjects(req, res);
});

router.post("/update-tutor-subjects",authMiddleware, (req, res) => {
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
        class_mode : "1 or 2 or 3",
        class_type : "1 or 2 or 3",
        stream_id : "1,2,3",
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
  SubjectController.addUpdateSubjectsToTutor(req, res);
});

router.post("/get-tutor-subjetcs",authMiddleware, (req, res) => {
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
  SubjectController.getTutorSubjects(req, res);
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

  SubjectController.deleteTutorSubject(req, res);
});
export default router;
