import { Request, Response } from "express";
import { sendResponse, validateRequest } from "../utils/helper";
import { helpSchema } from "../validators/validate";
import {
  createOrUpdateIssueCategory,
  getAllHelp,
  saveHelp,
} from "../models/help.model";
import { UserModel } from "../models/user.model";
import { number, string } from "joi";

const userModel = new UserModel();
export const addUpdateHelp = async (req: Request, res: Response) => {
  try {
    const { id, question, answer, status, support_for } = await validateRequest(
      req.body,
      helpSchema,
    );

    const result = await saveHelp({
      id,
      question,
      answer,
      status,
      support_for,
    });

    return sendResponse(
      res,
      200,
      1,
      [],
      id ? "Help updated successfully" : "Help added successfully",
    );
  } catch (err: any) {
    return sendResponse(
      res,
      err.status || 500,
      0,
      null,
      "Something went wrong",
      err.errors || err.message || err,
    );
  }
};

export const getHelpSupport = async (req: Request, res: Response) => {
  try {
    const { search, status, page, user_id, limit = 10 } = req.body;

    if (search && search.length < 3) {
      return sendResponse(
        res,
        200,
        1,
        [],
        "search term must be atleast 3 characters",
      );
    }

    const pageNumber = Number(page);
    let user_role;
    if (user_id) {
      user_role = await userModel.fetchUserRole(user_id);
    }
    const result = await getAllHelp(search, status, user_role, pageNumber);

    return sendResponse(
      res,
      200,
      1,
      result,
      result.data.length
        ? "Help and Support list fetched successfully"
        : "No Data found",
    );
  } catch (err: any) {
    console.log(err);
    return sendResponse(
      res,
      err.status || 500,
      0,
      null,
      "Something went wrong",
      err.errors || err.message || err,
    );
  }
};

export const addUpdateIssueCategories = async (req: Request, res: Response) => {
  try {
    const { id, name, status } = req.body;

    if (!name) {
      return sendResponse(res, 200, 0, [], "Name is required", []);
    }

    const result = await createOrUpdateIssueCategory(id, name, status);

    return sendResponse(res, 200, 1, result, "add issue category", []);
  } catch (err: any) {
    return sendResponse(res, 500, 0, [], "Internal Server Error", [
      err.errors || err.message || err,
    ]);
  }
};

export const getIssueCategory = async (req: Request, res: Response) => {
  try {
  } catch (err: any) {
    return sendResponse(res, 500, 0, [], "Internal Server Error", [
      err.errors || err.message || err,
    ]);
  }
};
