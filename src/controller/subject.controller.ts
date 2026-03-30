import { Request, Response } from "express";
import { sendResponse, validateRequest } from "../utils/helper";
import {
  subjectSchema,
  updateTutorSubjectsSchema,
} from "../validators/validate";
import { SubjectModel } from "../models/subject.model";

const subMdl = new SubjectModel();
export class SubjectController {
  static addUpdateSubjects = async (req: Request, res: Response) => {
    try {
      const { id, subject_name, status } = await validateRequest(
        req.body,
        subjectSchema,
      );
      await subMdl.insertUpdateSubject({
        id,
        subject_name,
        status,
      });

      return sendResponse(
        res,
        200,
        1,
        [],
        id ? "Subject Update Successfully" : "Subject added Successfully",
        [],
      );
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

  static getSubjects = async (req: Request, res: Response) => {
    try {
      const { id, subject_name, status } = req.body;
      const subjects = await subMdl.fetchSubjects({ id, subject_name, status });

      return sendResponse(
        res,
        200,
        1,
        subjects,
        "subjects fetched successfully",
        [],
      );
    } catch (err: any) {
      console.log(err);
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

  
  static addUpdateSubjectsToTutor = async (req: Request, res: Response) => {
    try {
      const payload = await validateRequest(
        req.body,
        updateTutorSubjectsSchema,
      );

      let result: any = {
        success: 1,
        message: "Updated successfully",
      };

      if (
        payload.subject_id ||
        payload.subject_name ||
        payload.covered_topics ||
        payload.sylabus ||
        payload.prior_exp ||
        payload.exp_year ||
        payload.exp_month ||
        payload.id
      ) {
        result = await subMdl.addTutorSubjects(payload);

        if (result.success === 0) {
          return sendResponse(res, 200, 0, [], result.message, []);
        }
      }

      if (payload.teach_language) {
        await subMdl.addTeachingLanguages(payload);
      }

      if (
        payload.class_mode ||
        payload.class_type ||
        payload.stream_id ||
        payload.min_fee ||
        payload.max_fee ||
        payload.tenure_type
      ) {
        await subMdl.addClassDetails(payload);
      }

      return sendResponse(
        res,
        200,
        1,
        [result.id ? { id: result.id } : []],
        result.message,
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static getTutorSubjects = async (req: Request, res: Response) => {
    try {
      const { tutor_id, id } = req.body;
      const result = await subMdl.getTutorSubjectById(tutor_id, id);

      if (!result) {
        return sendResponse(res, 200, 0, [], "Subject not found", []);
      }

      return sendResponse(
        res,
        200,
        1,
        result,
        "Subject fetched successfully",
        [],
      );
    } catch (err: any) {

      console.log(err)
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static deleteTutorSubject = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      if (!id) {
        return sendResponse(res, 200, 0, [], "Id is required", []);
      }

      const result = await subMdl.removeTutorSubject(id);

      if (result.success === 0) {
        return sendResponse(res, 200, 0, [], result.message, []);
      }

      return sendResponse(res, 200, 1, [], result.message, []);
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };
}
