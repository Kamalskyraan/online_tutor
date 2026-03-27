"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const router = (0, express_1.Router)();
router.post("/add-update-tutor", (req, res) => {
    /*
      #swagger.tags = ['2.User']
      #swagger.summary = 'add-update tutor'
      #swagger.description = 'add and update tutor'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          user_role: "tutor",
          user_id : 'USER_7wbjv2wt',
          represent : "1",
          gender : "male",
          is_show_num : 1,
          about_myself : "abcd efg hijk",
          country : "India",
          pincode : "624601",
          lat : "123.45",
          lng : "123.455",
          state : "tamilnadu",
          district : "dindigul",
          address : "abcd street, palani",
          area : "abcd",
          stream_id : 1
        }
      }
  
  
      #swagger.responses[200] = {
        description: "add or update tutor successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    user_controller_1.userController.updateTutor(req, res);
});
router.post("/add-update-student", (req, res) => {
    /*
      #swagger.tags = ['2.User']
      #swagger.summary = 'add or update student data'
      #swagger.description = 'Add Or Update Student Data'
  
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          user_role : "student",
          user_id : "USER_LDsMp-Dsm",
          dob : "2002-03-15",
          gender : "male",
          country : "India",
          pincode : "624601",
          state : "Tamilnadu",
          lat : "12.4566",
          lng : "10.56",
          district : "CBE",
          area : "RSpuram",
          is_show_num : true,
               
          stream_id : "1",
          learn_course_id : "1,2,3",
          learn_course : ["Full Stack Development","java"]
  
        }
      }
  
      #swagger.responses[200] = {
        description: "Add Or Update Student data successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    user_controller_1.userController.updateStudent(req, res);
});
router.post("/get-user-data", (req, res) => {
    /*
      #swagger.tags = ['2.User']
      #swagger.summary = 'get user data'
      #swagger.description = 'fetch user's data'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          user_id : 'USER_7wbjv2wt',
          mobile : "986543210",
          user_role: "student or tutor"
        }
      }
  
  
      #swagger.responses[200] = {
        description: "fetch user data successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    return user_controller_1.userController.userDetails(req, res);
});
router.post("/approve-course-req", (req, res) => {
    /*
      #swagger.tags = ['2.User']
      #swagger.summary = 'Approve Course Request '
      #swagger.description = 'Approve Course Request'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
         request_id : "1"
        }
      }
  
  
      #swagger.responses[200] = {
        description: "course request approved  successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    user_controller_1.userController.approveCourseRequest(req, res);
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map