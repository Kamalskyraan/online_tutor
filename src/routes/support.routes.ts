import { Router } from "express";
import {
  addUpdateHelp,
  addUpdateIssueCategories,
  getHelpSupport,
  getIssueCategory,
  helpRequest,
} from "../controller/support.controller";

const router = Router();

router.post("/add-update-help-support", addUpdateHelp);

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
  return getHelpSupport(req, res);
});

router.post("/add-update-issue-category", (req, res) => {
  /*
    #swagger.tags = ['6.Help & Support']
    #swagger.summary = 'add Issue Category'
    #swagger.description = 'Add Issue Category'

    #swagger.parameters['body'] = {
      in: 'body',
      required: false,
      schema: {
       id : 1,
       name : "Technical Problem",
       status : "active",
       cat_for : "tutor"
      }
    }

    #swagger.responses[200] = {
      description: "Add update category successfully",
     
    }

   

    #swagger.responses[500] = {
      description: "Something went wrong"
    }
  */

  addUpdateIssueCategories(req, res);
});

router.post("/get-issue-categories", (req, res) => {
  /*
    #swagger.tags = ['6.Help & Support']
    #swagger.summary = 'Get Issue Category'
    #swagger.description = 'Get Issue Category'

    #swagger.parameters['body'] = {
      in: 'body',
      required: false,
      schema: {
       id : 1,
       status : "active",
       cat_for : "tutor"
      }
    }

    #swagger.responses[200] = {
      description: "Get Issue category successfully",
     
    }
    #swagger.responses[500] = {
      description: "Something went wrong"
    }
  */

  getIssueCategory(req, res);
});

router.post("/help-request", (req, res) => {
  /*
    #swagger.tags = ['6.Help & Support']
    #swagger.summary = 'request help support'
    #swagger.description = 'Request Help Support'

    #swagger.parameters['body'] = {
      in: 'body',
      required: false,
      schema: {
       user_name : "kamalesh",
       mobile : "9876543210",
       email : "kamalesh@gmail.com",
       issue_reason : "invaliddd",
       subject : "this belongs to report",
       descp : "asdfgkcjnsjn dn"
      }
    }

    #swagger.responses[200] = {
      description: "Request Help Support successfully",
     
    }

   

    #swagger.responses[500] = {
      description: "Something went wrong"
    }
  */

  helpRequest(req, res);
});
export default router;
