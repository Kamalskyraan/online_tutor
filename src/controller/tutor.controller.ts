import { Request, Response } from "express";
import { sendResponse, validateRequest } from "../utils/helper";
import { TutorModel } from "../models/tutor.model";
import { addUpdateDemosSchema, getDemosSchema } from "../validators/validate";

const tutModel = new TutorModel();
export class TutorController {
  static addUpdateDemos = async (req: Request, res: Response) => {
    try {
      const { id, tutor_id, media_type, media_id, title, thumbnail } =
        await validateRequest(req.body, addUpdateDemosSchema);
      const demos = await tutModel.insertUpdateDemos({
        id,
        tutor_id,
        media_type,
        media_id,
        title,
        thumbnail,
      });
      return sendResponse(res, 200, 1, [], demos.message, []);
    } catch (err: any) {
      console.log(err);
      return sendResponse(
        res,
        200,
        0,
        [],
        "something went wrong",
        err.errors || err.message || err,
      );
    }
  };

  static removeDemos = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      if (!id) {
        return sendResponse(res, 200, 0, [], "ID is required", []);
      }
      const tMdl = await tutModel.deleteDemos(id);
      return sendResponse(res, 200, 1, [], tMdl.message, []);
    } catch (err: any) {
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

  static getDemos = async (req: Request, res: Response) => {
    try {
      const { tutor_id, media_type, id } = await validateRequest(
        req.body,
        getDemosSchema,
      );
      const result = await tutModel.getDemoVideosAndImages({
        tutor_id,
        media_type,
        id,
      });
      return sendResponse(
        res,
        200,
        1,
        result,
        "Demos Fetched Successfully",
        [],
      );
    } catch (err: any) {
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
}
