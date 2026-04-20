import { Request, Response } from "express";
import { sendResponse } from "../utils/helper";
import { NotificationModel } from "../models/notification.model";

const notifyMdl = new NotificationModel();
export class NotificationController {
  static createNotification = async (req: Request, res: Response) => {
    try {
      const {
        sender_id,
        receiver_id,
        title,
        message,
        type,
        extra_data,
        sent_to,
      } = req.body;

      if (!receiver_id || !title || !message) {
        return sendResponse(res, 200, 0, [], "Required fields missing", []);
      }

      const result = await notifyMdl.insertNOtifcations({
        sender_id,
        receiver_id,
        title,
        message,
        type,
        extra_data,
        sent_to,
      });

      return sendResponse(
        res,
        200,
        1,
        result,
        "Notification created successfully",
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };
}
