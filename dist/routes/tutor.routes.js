"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tutor_controller_1 = require("../controller/tutor.controller");
const router = (0, express_1.Router)();
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
    tutor_controller_1.TutorController.addUpdateDemos(req, res);
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
    tutor_controller_1.TutorController.removeDemos(req, res);
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
    tutor_controller_1.TutorController.getDemos(req, res);
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
    tutor_controller_1.TutorController.getTutorData(req, res);
});
//
router.post("/get-tutor-byid", (req, res) => {
    /*
      #swagger.tags = ['8.Tutor']
      #swagger.summary = 'Get Tutor data from tutor_id'
      #swagger.description = 'Get Tutor data from tutor_id'
  
      #swagger.parameters['body'] = {
        in: 'body',
        required: false,
        schema: {
          tutor_id : "TUTOR_A2u50js3" ,
          search_subject : "abacus"
            }
      }
  
      #swagger.responses[200] = {
        description: "Tutor Data Fetched successfully",
       
      }
  
      #swagger.responses[500] = {
        description: "Something went wrong"
      }
    */
    return tutor_controller_1.TutorController.getTutorDataById(req, res);
});
router.post("/get-reviews-about-tutor", (req, res) => {
    /*
      #swagger.tags = ['8.Tutor']
      #swagger.summary = 'Get Tutor's Review from tutor_id'
      #swagger.description = 'Get Tutor's Review from tutor_id'
  
      #swagger.parameters['body'] = {
        in: 'body',
        required: false,
        schema: {
          tutor_id : "TUTOR_A2u50js3"
            }
      }
  
      #swagger.responses[200] = {
        description: "Reviews Fetched successfully",
       
      }
  
      #swagger.responses[500] = {
        description: "Something went wrong"
      }
    */
    tutor_controller_1.TutorController.getReviewsAboutTutor(req, res);
});
router.post("/add-update-like-tutor", (req, res) => {
    /*
      #swagger.tags = ['8.Tutor']
      #swagger.summary = 'Add Update Like Tutor'
      #swagger.description = 'Add Update Like Tutor'
  
      #swagger.parameters['body'] = {
        in: 'body',
        required: false,
        schema: {
          tutor_id : "TUTOR_A2u50js3" ,
          student_id : "STUDENT_7uwDAj0o",
          status : "0 or 1"
            }
      }
  
      #swagger.responses[200] = {
        description: "Liked  successfully",
       
      }
  
      #swagger.responses[500] = {
        description: "Something went wrong"
      }
    */
    return tutor_controller_1.TutorController.addStudentLikeTutor(req, res);
});
exports.default = router;
//# sourceMappingURL=tutor.routes.js.map