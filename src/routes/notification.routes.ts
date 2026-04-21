import { Router } from "express";
import { NotificationController } from "../controller/notification.controller";

const router = Router();

router.post("/get-notifications", (req, res) => {
  /*
    #swagger.tags = ['13.Notification']
    #swagger.summary = 'GET notifications'
    #swagger.description = 'GET notifications'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {  
       receiver_id : "USER_eFzOtN1M",
       page : 1
      }
    }


    #swagger.responses[200] = {
      description: "Get Notifcations successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  return NotificationController.getNotifications(req, res);
});

export default router;
