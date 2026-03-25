import { Router } from "express";
import { TutorController } from "../controller/tutor.controller";

const router = Router();
// router.post('/add-update-tutor',addUpdateTutorPersonal)
router.post("/add-update-demos", (req, res) => {
  /*
    #swagger.tags = ['8.Tutor']
    #swagger.summary = 'Add Update Demo videos or Images'
    #swagger.description = 'Add image and videos'

    #swagger.parameters['body'] = {
      in: 'body',
      required: false,
      schema: {
        id: 1,
        tutor_id: 'TUTOR_onDXQ037',
        media_type: "image or video",
        media_id: '1',
        title : "Intro Video",
        thumbnail : "2"
      }
    }

    #swagger.responses[200] = {
      description: "Upload successfully",
     
    }

    #swagger.responses[500] = {
      description: "Something went wrong"
    }
  */
  TutorController.addUpdateDemos(req, res);
});

router.post("/remove-demos", (req, res) => {
  /*
    #swagger.tags = ['8.Tutor']
    #swagger.summary = 'Remove Demo videos or Images'
    #swagger.description = 'Delete image and videos'

    #swagger.parameters['body'] = {
      in: 'body',
      required: false,
      schema: {
        id: 1    
          }
    }

    #swagger.responses[200] = {
      description: "Demos deleted successfully",
     
    }

    #swagger.responses[500] = {
      description: "Something went wrong"
    }
  */
  TutorController.removeDemos(req, res);
});

router.post("/get-demos", (req, res) => {
  /*
    #swagger.tags = ['8.Tutor']
    #swagger.summary = 'get Demo videos or Images'
    #swagger.description = 'Get image and videos'

    #swagger.parameters['body'] = {
      in: 'body',
      required: false,
      schema: {
        id: 1 ,
        tutor_id : "TUTOR_onDXQ037" ,
        media_type : "video or image"
          }
    }

    #swagger.responses[200] = {
      description: "Demos fetched successfully",
     
    }

    #swagger.responses[500] = {
      description: "Something went wrong"
    }
  */

  TutorController.getDemos(req, res);
});

router.post("/get-tutor-data", (req, res) => {
  /*
    #swagger.tags = ['8.Tutor']
    #swagger.summary = 'get Tutor Data'
    #swagger.description = 'Get Tutor's Data using tutor_id'

    #swagger.parameters['body'] = {
      in: 'body',
      required: false,
      schema: {
       
        tutor_id : "TUTOR_onDXQ037" 
        
          }
    }

    #swagger.responses[200] = {
      description: "Data fetched successfully",
     
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */

  TutorController.getTutorData(req, res);
});
export default router;
