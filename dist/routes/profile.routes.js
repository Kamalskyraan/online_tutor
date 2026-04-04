"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../controller/profile.controller");
const router = (0, express_1.Router)();
router.post("/get-profiledata", (req, res) => {
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
    return profile_controller_1.ProfileController.getUserData(req, res);
});
router.post("/add-update-userdata", (req, res) => {
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
        stream_id : 1,
        represent: "1 or 2 or 3",
        is_show_num : 1,
        self_about : "abc def ghi"

      }
    }


    #swagger.responses[200] = {
      description: "fetch user data successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
    profile_controller_1.ProfileController.addUpdateUserData(req, res);
});
router.post("/change-primary", profile_controller_1.ProfileController.changePrimary);
router.post("/add-update-additional-number", profile_controller_1.ProfileController.addUpdateAdditionalNumber);
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
    profile_controller_1.ProfileController.checkOldPassword(req, res);
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
    profile_controller_1.ProfileController.updateProfilePic(req, res);
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
    profile_controller_1.ProfileController.changePrimary(req, res);
});
exports.default = router;
//# sourceMappingURL=profile.routes.js.map