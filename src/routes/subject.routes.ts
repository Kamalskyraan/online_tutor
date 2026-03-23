import { Router } from "express";
import { SubjectController } from "../controller/subject.controller";

const router = Router();

router.post("/add-subject", SubjectController.addUpdateSubjects);

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

router.post("/update-tutor-subjects", (req, res) => {
  SubjectController.addUpdateSubjectsToTutor(req, res);
});

export default router;
