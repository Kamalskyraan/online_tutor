import { Request, Response } from "express";
import { sendResponse } from "../utils/helper";

export class NotificationController {


  static getNotification = async (req: Request, res: Response) => {
    try {


    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  
}
