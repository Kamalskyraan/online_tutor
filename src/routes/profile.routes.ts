import { Router } from "express";
import { ProfileController } from "../controller/profile.controller";


const router = Router();

router.post("/get-profiledata",  (req, res) => {
  /*
    #swagger.tags = ['3.Profile']
    #swagger.summary = 'get user data'
    #swagger.description = 'fetch user's data'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {  
        user_id : "USER_7wbjv2wt"
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
        is_mob_verify : 1,
        is_addmob_verify :1,
        is_mail_verify : 1,
        user_name : "kamalesh",
        email : "skyraankamalesh@gmail.com",
        gender : "male or female or other",
        country_code : "+91",
        mobile : "9876543211",
        add_mobile : "9876543210",
        primary_num : "9876543211",
        country : "India",
        pincode : "624601",
        state : "Tamilnadu",
        district : "Dindigul",
        area : "gaandhimaanagar",
        address : "no.123/qwe",
        stream_id : "1",
        represent: "1 or 2 or 3",
        is_show_num : 1,
        self_about : "abc def ghi",
        tutor_exp : "0 or 1",
        exp_year : "1",
        exp_month: "11",
        dob : "2026-10-11"

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

router.post("/check-old-password", (req, res) => {
  /*
    #swagger.tags = ['3.Profile']
    #swagger.summary = 'Check Old Password'
    #swagger.description = 'Find Old Password'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {  
        user_id : "USER_7wbjv2wt",
        old_password : "12345678"
      }
    }


    #swagger.responses[200] = {
      description: "Password is correct"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  ProfileController.checkOldPassword(req, res);
});

router.post("/update-profile", (req, res) => {
  /*
    #swagger.tags = ['3.Profile']
    #swagger.summary = 'update Profile Image'
    #swagger.description = 'Update Profile Image'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {  
        user_id : "USER_7wbjv2wt",
        profile_id : "1"
      }
    }


    #swagger.responses[200] = {
      description: "Profile Image updated successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  ProfileController.updateProfilePic(req, res);
});

router.post("/change-primary", (req, res) => {
  /*
    #swagger.tags = ['3.Profile']
    #swagger.summary = 'update Primary Number'
    #swagger.description = 'Update Primary Number'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {  
        user_id : "USER_7wbjv2wt",
        new_primary_number : "9988776655",
        country_code : "+91",
        
      }
    }


    #swagger.responses[200] = {
      description: "Profile Image updated successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  ProfileController.changePrimary(req, res);
});

router.post("/change-register-num", (req, res) => {
  /*
    #swagger.tags = ['3.Profile']
    #swagger.summary = 'update Register Number'
    #swagger.description = 'Update Register Number'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {  
        user_id : "USER_7wbjv2wt",
        mobile : "9876543210"
        
      }
    }


    #swagger.responses[200] = {
      description: "Register Number updated successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */

  ProfileController.changeRegisterNumber(req, res);
});

router.post("/get-delete-reasons", (req, res) => {
  /*
    #swagger.tags = ['3.Profile']
    #swagger.summary = 'Get Delete Reasons'
    #swagger.description = 'Fetch Delete Reasons'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {  
       id : 1
        
      }
    }


    #swagger.responses[200] = {
      description: "Fetch Delete Reasons successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */

  ProfileController.deleteAccountReasons(req, res);
});

router.post("/remove-account", (req, res) => {
  /*
    #swagger.tags = ['3.Profile']
    #swagger.summary = 'Account Remove'
    #swagger.description = 'Account Remove tab'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {  
       user_id : "USER_eFzOtN1M",
       reasons : "What this is ?"
        
      }
    }


    #swagger.responses[200] = {
      description: "Account removed successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  return ProfileController.removeAccount(req, res);
});
export default router;
