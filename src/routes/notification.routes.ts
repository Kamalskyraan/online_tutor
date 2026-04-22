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

router.post("/remove-all-notify", (req, res) => {
  /*
    #swagger.tags = ['13.Notification']
    #swagger.summary = 'remove single or all notifications'
    #swagger.description = 'remove single or all notification'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {  
       receiver_id : "USER_eFzOtN1M",
       id : ["1","2"],
       action : "undo"
      }
    }


    #swagger.responses[200] = {
      description: " Notifcations deleted successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */

  return NotificationController.removeNotifications(req, res);
});

router.post("/check-last-notif", (req, res) => {
  /*
    #swagger.tags = ['13.Notification']
    #swagger.summary = 'FInd last notify status'
    #swagger.description = 'FInd last notify status'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {  
       receiver_id : "USER_eFzOtN1M"
      }
    }


    #swagger.responses[200] = {
      description: "Find Notifcations status successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  NotificationController.checkNotifyExists(req, res);
});

router.post("/update-view-notify", (req, res) => {
  /*
    #swagger.tags = ['13.Notification']
    #swagger.summary = 'Update  notify View status'
    #swagger.description = 'Update  notify View status'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {  
       receiver_id : "USER_eFzOtN1M"
      }
    }


    #swagger.responses[200] = {
      description: "Notification View Update successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  NotificationController.updateNotifyView(req, res);
});

router.post("/notify-read-status", (req, res) => {
  /*
    #swagger.tags = ['13.Notification']
    #swagger.summary = 'Notify Read status'
    #swagger.description = 'Notify Read status'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {  
      id: 1
      }
    }


    #swagger.responses[200] = {
      description: "Notification Read Update successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  NotificationController.updateNotifyView(req, res);
});
export default router;
