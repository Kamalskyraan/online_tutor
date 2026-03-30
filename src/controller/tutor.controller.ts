import { Request, Response } from "express";
import { sendResponse, validateRequest } from "../utils/helper";
import { TutorModel } from "../models/tutor.model";
import { addUpdateDemosSchema, getDemosSchema } from "../validators/validate";
import { ReviewModel } from "../models/review.model";

const tutModel = new TutorModel();
const rvMdl = new ReviewModel();
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

  static getTutorData = async (req: Request, res: Response) => {
    try {
      const { tutor_id } = req.body;
      if (!tutor_id) {
        return sendResponse(res, 200, 0, [], "Tutor Id is required", []);
      }
      const tutorData = await tutModel.fetchTutorData(tutor_id);

      return sendResponse(
        res,
        200,
        1,
        tutorData,
        "Tutor Data fetched successfully",
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

  static getTutorDataById = async (req: Request, res: Response) => {
    try {
      const { tutor_id, search_subject } = req.body;
      if (!tutor_id) {
        return sendResponse(res, 200, 0, [], "tutor_id is required", []);
      }

      const tutor = await tutModel.getTutorById(tutor_id);
      if (!tutor) {
        return sendResponse(res, 200, 0, [], "Tutor not found", []);
      }

      if (search_subject && tutor.subjects?.length) {
        const keyword = search_subject.toLowerCase();

        tutor.subjects.sort((a: any, b: any) => {
          const aName = a.sub?.[0]?.subject_name?.toLowerCase() || "";
          const bName = b.sub?.[0]?.subject_name?.toLowerCase() || "";

          const aMatch = aName.includes(keyword);
          const bMatch = bName.includes(keyword);

          if (aMatch && !bMatch) return -1;
          if (!aMatch && bMatch) return 1;

          if (aName.startsWith(keyword)) return -1;
          if (bName.startsWith(keyword)) return 1;

          return 0;
        });
      }

      return sendResponse(res, 200, 1, tutor, "Tutor fetched successfully", []);
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static getReviewsAboutTutor = async (req: Request, res: Response) => {
    try {
      const { tutor_id } = req.body;
      const reviewData = await rvMdl.fetchReviewsForTutorById(tutor_id);
      return sendResponse(
        res,
        200,
        1,
        reviewData,
        "Reviews Fetched sucessfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static addStudentLikeTutor = async (req: Request, res: Response) => {
    try {
      const { tutor_id, student_id, status } = req.body;
      const result = await tutModel.addUpdateLikeForTutor(
        tutor_id,
        student_id,
        status,
      );

      let message = "";

      if (result.action === "removed") {
        message = "Reaction removed";
      } else if (result.action === "updated") {
        message = Number(status) === 1 ? "Tutor liked" : "Tutor disliked";
      } else {
        message = Number(status) === 1 ? "Tutor liked" : "Tutor disliked";
      }
      return sendResponse(res, 200, 1, [], message, []);
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  
}
