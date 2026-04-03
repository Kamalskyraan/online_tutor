import { Router } from "express";
import { LeadsController } from "../controller/leads.controller";

const router = Router();

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
  LeadsController.getTutorLeads(req, res);
});

router.post("/update-leads-view-status", (req, res) => {
  /*
    #swagger.tags = ['12.Leads']
    #swagger.summary = 'Update View Status In Leads'
    #swagger.description = 'Update View Status for mobile view In Leads'

   
    #swagger.parameters['body'] = {
    in:'body',
    schema:{ 
    tutor_id : "TUTOR_A2u50js3",
    student_id : "STUDENT_4Gy3VZ"
        }}

    #swagger.responses[200] = {
      description: "Tutor set Mobile View Status successfully",
     
    }

    #swagger.responses[500] = {
      description: "Something went wrong"
    }
  */

  LeadsController.setViewMobileLeads(req, res);
});

router.post("/get-leads-locations", (req, res) => {
  /*
    #swagger.tags = ['12.Leads']
    #swagger.summary = 'Get Leads Locations count'
    #swagger.description = 'Get Leads Locations count'

   
    #swagger.parameters['body'] = {
    in:'body',
    schema:{ 
    tutor_id : "TUTOR_A2u50js3",
    from_date : "2026-04-03",
    to_date : "2026-04-04",
     search_subject: "tamil"
        }}

    #swagger.responses[200] = {
      description: "Get Leads Locations count sucessfully",
     
    }

    #swagger.responses[500] = {
      description: "Something went wrong"
    }
  */

  LeadsController.getLeadsLocations(req, res);
});

router.post("/update-read-status", (req, res) => {
  /*
    #swagger.tags = ['12.Leads']
    #swagger.summary = 'Update Read Status In Leads'
    #swagger.description = 'Update Read Status for mobile view In Leads'

   
    #swagger.parameters['body'] = {
    in:'body',
    schema:{ 
   lead_id : 1
        }}

    #swagger.responses[200] = {
      description: "Tutor set card read Status successfully",
     
    }

    #swagger.responses[500] = {
      description: "Something went wrong"
    }
  */

  LeadsController.setReadStatus(req, res);
});

export default router;
