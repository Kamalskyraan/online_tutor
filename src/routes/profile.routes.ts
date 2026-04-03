import { Router } from "express";
import { ProfileController } from "../controller/profile.controller";

const router = Router();

router.post("/get-userdata", (req, res) => {
  /*
    #swagger.tags = ['3.Profile']
    #swagger.summary = 'get user data'
    #swagger.description = 'fetch user's data'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {  
        user_id : "USER_7wbjv2wt",
        user_role : "student or tutor"
      }
    }


    #swagger.responses[200] = {
      description: "fetch user data successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  return ProfileController.getUserData(req, res);
});
router.post(
  "/add-update-userdata",

  (req, res) => {
    /*
    #swagger.tags = ['3.Profile']
    #swagger.summary = 'add Update user data'
    #swagger.description = 'Add and Update user's data'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {  
        user_id : "USER_7wbjv2wt",
        user_name : "kamalesh",
        email : "skyraankamalesh@gmail.com",
        gender : "male or female or other",
        country_code : "+91",
        mobile : "9876543211",
        add_mobile : "9876543210",
        
      }
    }


    #swagger.responses[200] = {
      description: "fetch user data successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
    ProfileController.addUpdateUserData(req, res);
  },
);
router.post("/change-primary", ProfileController.changePrimary);
router.post(
  "/add-update-additional-number",
  ProfileController.addUpdateAdditionalNumber,
);

export default router;
