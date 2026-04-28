import { Request, Response } from "express";
import {
  convertNullToString,
  executeQuery,
  sendResponse,
  validateRequest,
} from "../utils/helper";
import { SourceModel } from "../models/source.model";
import {
  addUpdateLangSchema,
  educationSchema,
  educationStreamSchema,
} from "../validators/validate";
import { NotificationTemplates } from "../config/notification.template";
import { NotificationModel } from "../models/notification.model";
import { sendPushNotification } from "../service/firebase.service";

const sourceModel = new SourceModel();
const noteModel = new NotificationModel();
export class SourceController {
  static getAdressDetailsFromPincode = async (req: Request, res: Response) => {
    try {
      const { pincode, icountry } = req.body;
      if (!pincode) {
        return sendResponse(res, 200, 0, [], "Pincode is required");
      }
      if (!icountry) {
        return sendResponse(res, 200, 0, [], "Country is required");
      }

      const data = await sourceModel.getLatLngFromPincode(pincode, icountry);
      if (!data) {
        return sendResponse(res, 200, 0, [], "Pincode not found");
      }
      return sendResponse(
        res,
        200,
        1,
        [data],
        "Address fetched successfully from pincode",
      );
    } catch (err: any) {
      return sendResponse(
        res,
        err.status || 500,
        0,
        [],
        "Something went wrong",
        err.errors || err.message || err,
      );
    }
  };
  static addUpdateEducationLevel = async (req: Request, res: Response) => {
    try {
      const { id, name } = await validateRequest(req.body, educationSchema);
      if (id) {
        await sourceModel.updateEducationLevel(id, name);
        return sendResponse(
          res,
          200,
          1,
          [],
          "Education level updated successfully",
        );
      } else {
        await sourceModel.addEducationLevel(name);
        return sendResponse(
          res,
          201,
          1,
          [],
          "Education level added successfully",
        );
      }
    } catch (err: any) {
      return sendResponse(
        res,
        err.status || 500,
        0,
        [],
        "Something went wrong",
        err.errors || err.message || err,
      );
    }
  };
  static addUpdateStream = async (req: Request, res: Response) => {
    try {
      const { id, edu_id, name } = await validateRequest(
        req.body,
        educationStreamSchema,
      );
      const level = await sourceModel.getEducationLevelById(edu_id);

      if (!level) {
        return sendResponse(res, 200, 0, [], "Education level not found");
      }

      if (id) {
        await sourceModel.updateStream(id, edu_id, name);
        return sendResponse(res, 200, 1, [], "Stream updated successfully");
      } else {
        await sourceModel.addStream(edu_id, name);
        return sendResponse(res, 200, 1, [], "Stream added successfully");
      }
    } catch (err: any) {
      return sendResponse(
        res,
        err.status || 500,
        0,
        [],
        "Something went wrong",
        err.errors || err.message || err,
      );
    }
  };
  static getStreamsByEducation = async (req: Request, res: Response) => {
    try {
      const { edu_id } = req.body;
      let streams;
      if (edu_id) {
        streams = await sourceModel.getStreamsByEduId(edu_id);
      } else {
        streams = await sourceModel.getAllStreams();
      }
      return sendResponse(res, 200, 1, streams, "Streams fetched successfully");
    } catch (err: any) {
      return sendResponse(
        res,
        err.status || 500,
        0,
        [],
        "Something went wrong",
        err.errors || err.message || err,
      );
    }
  };
  static getCountryData = async (req: Request, res: Response) => {
    try {
      const { search } = req.body;
      const result = await sourceModel.fetchCountryCode(search);
      return sendResponse(
        res,
        200,
        1,
        result,
        "Country Data Fetched successfully",
      );
    } catch (err: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        "something went wrong",
        err.errors || err.message || err,
      );
    }
  };
  //lan
  static addUpdateLanguage = async (req: Request, res: Response) => {
    try {
      const { id, lang_name, status } = await validateRequest(
        req.body,
        addUpdateLangSchema,
      );

      const data = await sourceModel.createAndUpdate({
        id,
        lang_name,
        status,
      });

      const message =
        data.type === "insert"
          ? "Language added successfully"
          : "Language updated successfully";

      return sendResponse(res, 200, 1, [], message, []);
    } catch (err: any) {
      console.log(err);
      return sendResponse(
        res,
        500,
        0,
        [],
        "Internal Server Error",
        err.errors || err.message || err,
      );
    }
  };

  static getLanguages = async (req: Request, res: Response) => {
    try {
      const { id, lang_name, status } = req.body;

      const langData = await sourceModel.fetchLanguages({
        id,
        lang_name,
        status,
      });
      return sendResponse(
        res,
        200,
        1,
        langData,
        "Language Data fetched successfully",
        [],
      );
    } catch (err: any) {
      sendResponse(
        res,
        500,
        0,
        [],
        "Internal Server Error",
        err.errors || err.message || err,
      );
    }
  };

  static async getLatLangFromArea(req: Request, res: Response) {
    try {
      const { query } = req.body;

      if (!query) {
        return sendResponse(res, 200, 0, [], "Query is required", []);
      }

      const result = await sourceModel.fetchLatLangFromQuery(query);

      if (result === null) {
        return sendResponse(res, 200, 0, [], "Something Went wrong", []);
      }

      if (!result.length) {
        return sendResponse(res, 200, 0, [], "No location found", []);
      }

      sendResponse(res, 200, 1, result, "Data fetched successfully", []);
    } catch (err: any) {
      console.error("Controller Error (getLatLangFromArea):", err);

      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  }

  static async reportAUser(req: Request, res: Response) {
    try {
      const { reporter_id, reported_id } = req.body;

      if (!reporter_id || !reported_id) {
        return sendResponse(res, 200, 0, [], "Missing fields", []);
      }

      const result = await sourceModel.reportUser(reporter_id, reported_id);

      // 🔥 already reported case
      if (result.success === 0) {
        return sendResponse(res, 200, 0, result, "Already reported", []);
      }

      return sendResponse(
        res,
        200,
        1,
        result,
        "User reported successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.message || err,
      ]);
    }
  }
  static async getReportStatus(req: Request, res: Response) {
    try {
      const { reporter_id, reported_id } = req.body;

      if (!reporter_id || !reported_id) {
        return sendResponse(res, 200, 0, [], "Reporter_id is required", []);
      }

      const result = await sourceModel.getReportStatus(
        reporter_id,
        reported_id,
      );

      return sendResponse(res, 200, 1, result, "Report status fetched", []);
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.message || err,
      ]);
    }
  }

  static async sendChatNotify(req: Request, res: Response) {
    try {
      const { sender_id, reciver_id, message } = req.body;
      if (!sender_id || !reciver_id) {
        return sendResponse(res, 200, 0, [], "Missing fields", []);
      }

      const notif = NotificationTemplates.chatNotify(reciver_id);

      await sendPushNotification({
        user_id: String(reciver_id),
        payload: {
          title: notif.title,
          message: message,
        },
      });
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.message || err,
      ]);
    }
  }
}
