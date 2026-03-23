import { Request, Response } from "express";
import { StudentModel } from "../models/student.model";
import { sendResponse } from "../utils/helper";
import { Location } from "../interface/interface";

export class StudentController {
  private static studentModel = new StudentModel();

  public static getNearbyTutors = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const body: Location = req.body;

      const tutors = await this.studentModel.findNearbyTutors(body);

      sendResponse(res, 200, 1, tutors, "Tutor Data Fetched successfully", []);
    } catch (err: any) {
      sendResponse(
        res,
        200,
        0,
        [],
        "Internal Server error",
        err.errors || err.message || err,
      );
    }
  };
}
