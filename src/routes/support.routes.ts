import { Router } from "express";
import {
  addUpdateHelp,
  getHelpSupport,
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

export default router;
