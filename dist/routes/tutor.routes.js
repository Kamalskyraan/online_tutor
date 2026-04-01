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
          search_subject : "abacus",
          student_id : "STUDENT_4Gy3VZ_N"
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
router.post("/get-tutor-request", (req, res) => {
    /*
      #swagger.tags = ['8.Tutor']
      #swagger.summary = 'Get Tutor's Requests All'
      #swagger.description = 'Get Tutor's Request'
  
     
      #swagger.parameters['body'] = {
      in:'body',
      schema:{
      tutor_id : "TUTOR_A2u50js3",page : 1,
          status : "accepted or rejected or pending",
          subject_name : "Java",
          from_date : "2026-03-31",
          to_date : "2026-03-30"
          }}
  
      #swagger.responses[200] = {
        description: "Tutor's Request  fetched successfully",
       
      }
  
      #swagger.responses[500] = {
        description: "Something went wrong"
      }
    */
    return tutor_controller_1.TutorController.getTutorRequest(req, res);
});
router.post("/accept-reject-request", (req, res) => {
    /*
      #swagger.tags = ['8.Tutor']
      #swagger.summary = 'Accept or Reject Request'
      #swagger.description = 'Accept Or Reject Request by tutor_id'
  
      #swagger.parameters['body'] = {
        in: 'body',
        required: false,
        schema: {
          req_id : 1 ,
          status : "accepted or rejected"
            }
      }
  
      #swagger.responses[200] = {
        description: "Demos fetched successfully",
       
      }
  
      #swagger.responses[500] = {
        description: "Something went wrong"
      }
    */
    tutor_controller_1.TutorController.requestAcceptRejectFlow(req, res);
});
router.post("/get-tutor-suggestion", (req, res) => {
    /*
      #swagger.tags = ['8.Tutor']
      #swagger.summary = 'Get Tutor's Subject suggestion'
      #swagger.description = 'Get Tutor's Subject suggestion'
  
     
      #swagger.parameters['body'] = {
      in:'body',
      schema:{
      tutor_id : "TUTOR_A2u50js3"
          }}
  
      #swagger.responses[200] = {
        description: "Tutor's suggestion  fetched successfully",
       
      }
  
      #swagger.responses[500] = {
        description: "Something went wrong"
      }
    */
    tutor_controller_1.TutorController.getTutorSubjectSuggestion(req, res);
});
exports.default = router;
//# sourceMappingURL=tutor.routes.js.map