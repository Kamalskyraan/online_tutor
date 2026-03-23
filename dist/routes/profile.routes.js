"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../controller/profile.controller");
const router = (0, express_1.Router)();
router.post("/get-userdata", (req, res) => {
    /*
      #swagger.tags = ['3.Profile']
      #swagger.summary = 'get user data'
      #swagger.description = 'fetch user's data'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          user_id : 'USER_7wbjv2wt'
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
router.post("/add-update-userdata", profile_controller_1.ProfileController.addUpdateUserData);
router.post("/change-primary", profile_controller_1.ProfileController.changePrimary);
router.post("/add-update-additional-number", profile_controller_1.ProfileController.addUpdateAdditionalNumber);
exports.default = router;
//# sourceMappingURL=profile.routes.js.map