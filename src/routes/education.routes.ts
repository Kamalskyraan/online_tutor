import { Router } from "express";
import { EducationController } from "../controller/education.controller";

const router = Router();
router.post("/get-edu-level", (req, res) => {
  /*
    #swagger.tags = ['4.Education']
    #swagger.summary = 'Get education level'
    #swagger.description = 'Get Education level'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        id: 1,
        name : "school level",
        status : "active"
      }
    }


    #swagger.responses[200] = {
      description: "Education Level fetched successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  return EducationController.getEducationLevel(req, res);
});
router.post("/get-streams", (req, res) => {
  /*
    #swagger.tags = ['4.Education']
    #swagger.summary = 'Get education's streams'
    #swagger.description = 'Get streams'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        id: "1",
        name : "B.E(CSE)",
        status : "active",
        edu_id : 1
      }
    }


    #swagger.responses[200] = {
      description: "stream  fetched successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */

  return EducationController.getStreams(req, res);
});

export default router;
