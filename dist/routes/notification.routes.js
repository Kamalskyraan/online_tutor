"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controller/notification.controller");
const router = (0, express_1.Router)();
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
    return notification_controller_1.NotificationController.getNotifications(req, res);
});
exports.default = router;
//# sourceMappingURL=notification.routes.js.map