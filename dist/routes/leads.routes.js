"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leads_controller_1 = require("../controller/leads.controller");
const router = (0, express_1.Router)();
router.post("/get-tutor-leads", (req, res) => {
    /*
      #swagger.tags = ['12.Leads']
      #swagger.summary = 'Get Leads'
      #swagger.description = 'Get Leads'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: false,
        schema: {
          tutor_id : "TUTOR_A2u50js3",
          lead_id : "1",
          from_date : "2026-03-10",
          to_date : "2026-03-11",
          subject_name: "abc",
          locations : ["abc", "cbe" , "chen"],
          leads_type : "profile",
          page : 1
        }
      }
  
  
      #swagger.responses[200] = {
        description: "Leads  fetched successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    leads_controller_1.LeadsController.getTutorLeads(req, res);
});
exports.default = router;
//# sourceMappingURL=leads.routes.js.map