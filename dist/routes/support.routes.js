"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const support_controller_1 = require("../controller/support.controller");
const router = (0, express_1.Router)();
router.post("/add-update-help-support", support_controller_1.addUpdateHelp);
router.post("/get-help-support", (req, res) => {
    /*
      #swagger.tags = ['6.Help & Support']
      #swagger.summary = 'Get Help and Support List'
      #swagger.description = 'Fetch paginated help and support tickets based on search, status and user role.'
  
      #swagger.parameters['body'] = {
        in: 'body',
        required: false,
        schema: {
          search: 'what to do',
          status: 'active',
          page: 1,
          user_id: 'user_123'
        }
      }
  
      #swagger.responses[200] = {
        description: "Help and Support list fetched successfully",
       
      }
  
      #swagger.responses[400] = {
        description: "Search term must be at least 3 characters"
      }
  
      #swagger.responses[500] = {
        description: "Something went wrong"
      }
    */
    return (0, support_controller_1.getHelpSupport)(req, res);
});
router.post("/add-update-issue-category", (req, res) => {
    /*
      #swagger.tags = ['6.Help & Support']
      #swagger.summary = 'Get Help and Support List'
      #swagger.description = 'Fetch paginated help and support tickets based on search, status and user role.'
  
      #swagger.parameters['body'] = {
        in: 'body',
        required: false,
        schema: {
          search: 'what to do',
          status: 'active',
          page: 1,
          user_id: 'user_123'
        }
      }
  
      #swagger.responses[200] = {
        description: "Help and Support list fetched successfully",
       
      }
  
      #swagger.responses[400] = {
        description: "Search term must be at least 3 characters"
      }
  
      #swagger.responses[500] = {
        description: "Something went wrong"
      }
    */
    (0, support_controller_1.addUpdateIssueCategories)(req, res);
});
router.post("/get-issue-categories", (req, res) => { });
exports.default = router;
//# sourceMappingURL=support.routes.js.map