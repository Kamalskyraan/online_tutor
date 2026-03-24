import { Request, Response } from "express";
import { sendResponse } from "../utils/helper";
import { EduModel } from "../models/education.model";

const eduMdl = new EduModel();

export class EducationController {
  static getEducationLevel = async (req: Request, res: Response) => {
    try {
      const { id, name, status } = req.body;
      const result = await eduMdl.fetchEducationLvl({
        id,
        name,
        status,
      });

      const groupedData: any = {};
      result.forEach((item: any) => {
        const key = item.name?.toLowerCase().replace(/\s+/g, " ");

        if (!groupedData[key]) {
          groupedData[key] = [];
        }

        groupedData[key].push({
          id: item.id,
          name: item.name,
          board: item.board ?? "",
        });
      });
      return sendResponse(
        res,
        200,
        1,
        [groupedData],
        "Education Levl Fetched Succesfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 0, 500, [], "something went wrong", [
        err.errors || err.message || err,
      ]);
    }
  };
  static getStreams = async (req: Request, res: Response) => {
    try {
      const { id, name, status, edu_id } = req.body;
      const result = await eduMdl.fetchStreams({ id, name, status, edu_id });
      return sendResponse(
        res,
        200,
        1,
        result,
        "Streams Fetched successfully",
        [],
      );
    } catch (err: any) {
      console.log(err);
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
}
