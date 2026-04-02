import { Request, Response } from "express";
import { sendResponse, validateRequest } from "../utils/helper";
import { ProfileModel } from "../models/profile.model";
import { commonModel } from "../models/common.model";
import { updateUserProfileSchema } from "../validators/validate";

const profileMdl = new ProfileModel();
const cmnModel = new commonModel();
export class ProfileController {
  static getUserData = async (req: Request, res: Response) => {
    try {
      const { user_id, user_role } = req.body;
      if (!user_id) {
        return sendResponse(res, 200, 0, [], "User_id is required", []);
      }
      const result = await profileMdl.fetchUserProfileData(user_id, user_role);

      console.log(result);

      if (!result) {
        return sendResponse(res, 200, 0, [], "User not found", []);
      }

      const converted = await profileMdl.convertRepresentData(
        result?.data?.represent,
      );

      const stringData = await cmnModel.convertNullObjectToString(result?.data);

      return sendResponse(
        res,
        200,
        1,
        {
          ...stringData,
          represent_name: converted,
        },
        "User Profile Data Fetched successfully",
        [],
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

  static addUpdateUserData = async (req: Request, res: Response) => {
    try {
      await validateRequest(req.body, updateUserProfileSchema);
      const { user_id, ...payload } = req.body;
      await profileMdl.addUpdateProfileData(user_id, payload);

      return sendResponse(
        res,
        200,
        1,
        [],
        "user Profile Data Updated successfully",
        [],
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

  static changePrimary = async (req: Request, res: Response) => {
    try {
      const { new_primary_number, country_code, user_id } = req.body;
      const existing = await profileMdl.checkExistingPrimaryNumber(user_id);

      const oldMobile = existing.primary_num;

      if (oldMobile === new_primary_number) {
        return sendResponse(res, 200, 0, [], "Already This is primary number");
      }

      await profileMdl.updatePrimaryNumber(
        user_id,
        new_primary_number,
        country_code,
      );
      return sendResponse(
        res,
        200,
        1,
        [],
        "Primary Number Changed successfully",
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

  static addUpdateAdditionalNumber = async (req: Request, res: Response) => {
    try {
      const { add_mobile, user_id } = req.body;

      const registerNum = await profileMdl.checkExistingPrimaryNumber(user_id);
      if (registerNum?.primary_num === add_mobile) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "additional number should be differ from register number",
          [],
        );
      }

      const result = await profileMdl.updateAdditionalMobile(
        add_mobile,
        user_id,
      );
      return sendResponse(
        res,
        200,
        1,
        result,
        "Update additional number successfully",
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
