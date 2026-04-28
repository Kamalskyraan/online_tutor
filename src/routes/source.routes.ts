import { Router } from "express";
import { SourceController } from "../controller/source.controller";

const router = Router();

router.post("/get-address-by-pincode", (req, res) => {
  /*
    #swagger.tags = ['7.Source']
    #swagger.summary = 'Get Address By Pincode'
    #swagger.description = 'Get address by pincode'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        pincode: '624601',
        icountry : "india"
        
      }
    }


    #swagger.responses[200] = {
      description: "Address fetched successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  return SourceController.getAdressDetailsFromPincode(req, res);
});

router.post("/search-address", (req, res) => {
  /*
    #swagger.tags = ['7.Source']
    #swagger.summary = 'Get datas By Address'
    #swagger.description = 'Get datas by Address'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
      query : "peelamedu"
        
      }
    }


    #swagger.responses[200] = {
      description: "Address fetched successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  return SourceController.getLatLangFromArea(req, res);
});
router.post(
  "/add-or-update-education",
  SourceController.addUpdateEducationLevel,
);

router.post("/add-or-update-stream", SourceController.addUpdateStream);
router.post("/get-streams", SourceController.getStreamsByEducation);
router.post("/get-country", SourceController.getCountryData);
router.post("/add-update-language", (req, res) => {
  /*
    #swagger.tags = ['7.Source']
    #swagger.summary = 'Add Update Language'
    #swagger.description = 'Add Language and Update language'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        id: 1,
        lang_name : "Tamil",
        status : "active"
      }
    }


    #swagger.responses[200] = {
      description: "Add or Update language successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */

  return SourceController.addUpdateLanguage(req, res);
});

router.post("/get-languages", (req, res) => {
  /*
    #swagger.tags = ['7.Source']
    #swagger.summary = 'Get Language'
    #swagger.description = 'Get Language all or ID or active languages'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        id: 1,
        lang_name : "Tamil",
        status : "active"
      }
    }


    #swagger.responses[200] = {
      description: "Language fetched successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  SourceController.getLanguages(req, res);
});

router.post("/add-chat-report", (req, res) => {
  /*
    #swagger.tags = ['7.Source']
    #swagger.summary = 'Add  and Update Chat Report'
    #swagger.description = 'Add and Update Chat Report'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        reporter_id : "USER_eFzOtN1M",
        reported_id : "USER_CN8S7SGp"
      }
    }


    #swagger.responses[200] = {
      description: "Add chat Report successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  SourceController.reportAUser(req, res);
});

router.post("/get-report-status", (req, res) => {
  /*
    #swagger.tags = ['7.Source']
    #swagger.summary = 'Get Chat Report'
    #swagger.description = 'Get Chat Report'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        reporter_id : "USER_eFzOtN1M",
        reported_id : "USER_CN8S7SGp"
      }
    }


    #swagger.responses[200] = {
      description: "Get Report successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */

  return SourceController.getReportStatus(req, res);
});

router.post("/chat-notify-sent", (req, res) => {
  /*
    #swagger.tags = ['7.Source']
    #swagger.summary = 'Chat Report sent'
    #swagger.description = 'Get Chat Sent'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
       sender_id : "user_123",
       reciver_id : "user_123",
       message : "any"
      }
    }


    #swagger.responses[200] = {
      description: "Chat notify send successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  SourceController.sendChatNotify(req, res);
});
export default router;
