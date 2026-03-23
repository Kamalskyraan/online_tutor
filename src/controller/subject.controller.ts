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

  //
  static addUpdateSubjectsToTutor = async (req: Request, res: Response) => {
    try {
      const { tutor_id, ...payload } = await validateRequest(
        req.body,
        updateTutorSubjectsSchema,
      );

      if (
        payload.subject_id ||
        payload.subject_name ||
        payload.covered_topics ||
        payload.sylabus ||
        payload.prior_exp ||
        payload.exp_year ||
        payload.exp_month
      ) {
        await subMdl.addTutorSubjects({ tutor_id, subjects: [payload] });
      }

      if (payload.teach_language) {
        await subMdl.addTeachingLanguages({ tutor_id, ...payload });
      }
      if (
        payload.class_mode ||
        payload.class_type ||
        payload.stream_ids ||
        payload.min_fee ||
        payload.max_fee ||
        payload.tenure_type
      ) {
        await subMdl.addClassDetails({ tutor_id, ...payload });
      }

      return sendResponse(
        res,
        200,
        1,
        [],
        "Tutor subjects updated successfully",
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

  static getTutorSubjects = async (req: Request, res: Response) => {};
}
