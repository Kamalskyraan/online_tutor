import { Router } from "express";
import { userController } from "../controller/user.controller";

const router = Router();
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
        is_show_num : true,
        about_myself : "abcd efg hijk",
        country : "india",
        pincode : "624601",
        lat : "123.45",
        lng : "123.455",
        state : "tamilnadu",
        district : "dindigul",
        address : "abcd street, palani",
        area : "abcd",
        stream : 1
      }
    }


    #swagger.responses[200] = {
      description: "add or update tutor successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  userController.updateTutor(req, res);
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
        dob : "2002-03-15",
        gender : "male",
        country : "india",
        pincode : "624601",
        state : "tamilnadu",
        district : "CBE",
        area : "RSpuram",
        is_show_num : true,
        address : "abcde fghij klmnop",
        user_id : "USER_LDsMp-Dsm",

        stream_id : "1",

        
        learn_course : "Full Stack Development"
      }
    }

    #swagger.responses[200] = {
      description: "Add Or Update Student data successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  userController.updateStudent(req, res);
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
        mobile : "986543210"
      }
    }


    #swagger.responses[200] = {
      description: "fetch user data successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */

  return userController.userDetails(req, res);
});
export default router;
