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

  static async getNotifications(req: Request, res: Response) {
    try {
      const { receiver_id, page } = req.body;

      if (!receiver_id) {
        return sendResponse(res, 200, 0, [], "Receiver ID is required", []);
      }
      const result = await notifyMdl.getNotifications({
        receiver_id,
        page,
      });

      return sendResponse(
        res,
        200,
        1,
        result,
        "Notification Fetched Successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  }

  static async removeNotifications(req: Request, res: Response) {
    try {
      const { ids, receiver_id, action } = req.body;

      if (!receiver_id) {
        return sendResponse(res, 200, 0, [], "receiver_id is required", []);
      }

      const result = await notifyMdl.removeAllNotify({ receiver_id, ids });

      return sendResponse(
        res,
        200,
        1,
        [],
        action === "undo"
          ? "Last notification restored successfully"
          : "Notification action completed",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  }

  static async checkNotifyExists(req: Request, res: Response) {
    try {
      const { receiver_id } = req.body;
      const data = await notifyMdl.checkLastNotification(receiver_id);

      console.log(data);
      return sendResponse(
        res,
        200,
        1,
        data,
        "notification staus fetched successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  }

  static async updateNotifyView(req: Request, res: Response) {
    try {
      const { receiver_id } = req.body;

      if (!receiver_id) {
        return sendResponse(res, 200, 0, [], "receiver_id is required", []);
      }

      const result = await notifyMdl.updateAllView(receiver_id);

      return sendResponse(
        res,
        200,
        1,
        [],
        "All notifications marked as read",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  }
}
