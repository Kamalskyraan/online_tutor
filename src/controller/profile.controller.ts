import { Request, Response } from "express";
import { sendResponse, validateRequest } from "../utils/helper";
import { ProfileModel } from "../models/profile.model";
import { commonModel } from "../models/common.model";
import { updateUserProfileSchema } from "../validators/validate";
import { EduModel } from "../models/education.model";
import bcrypt from "bcryptjs";
import { log } from "node:console";
const profileMdl = new ProfileModel();
const cmnModel = new commonModel();
const eduModl = new EduModel();
export class ProfileController {
  static getUserData = async (req: Request, res: Response) => {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return sendResponse(res, 200, 0, [], "User_id is required", []);
      }

      const user_role = await profileMdl.fetchUserRole(user_id);

      if (!user_role) {
        return sendResponse(res, 200, 0, [], "User not found", []);
      }

      const result = await profileMdl.fetchUserProfileData(user_id, user_role);

      if (!result || !result.data) {
        return sendResponse(res, 200, 0, [], "User data not found", []);
      }

      const data = result.data;

      const streamId = data.stream_id || data.student_stream_id;
      let streams = null;

      if (streamId) {
        streams = await eduModl.fetchStreamsForAll(streamId.toString());
      }

      const stringData = await cmnModel.convertNullObjectToString(data);

      return sendResponse(
        res,
        200,
        1,
        [{
          role: result.role,
          ...stringData,
          streams,
        }],
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
      const oldCountry_code = existing.country_code;
      if (oldMobile === new_primary_number) {
        return sendResponse(res, 200, 0, [], "Already This is primary number");
      }

      await profileMdl.updatePrimaryNumber(
        user_id,
        new_primary_number,
        country_code,
        oldMobile,
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

  static checkOldPassword = async (req: Request, res: Response) => {
    try {
      const { user_id, old_password } = req.body;

      if (!user_id || !old_password) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "user_id and old_password are required",
          [],
        );
      }

      const user = await profileMdl.checkOldPassword(user_id);

      if (!user) {
        return sendResponse(res, 200, 0, [], "User not found", []);
      }

      const isMatch = await bcrypt.compare(old_password, user.password);

      if (!isMatch) {
        return sendResponse(res, 200, 0, [], "Old password is incorrect", []);
      }

      return sendResponse(res, 200, 1, [], "Old password is correct", []);
    } catch (err: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        "Something went wrong",
        err.errors || err.message || err,
      );
    }
  };
  static updateProfilePic = async (req: Request, res: Response) => {
    try {
      let { profile_id, user_id } = req.body;

      if (!user_id) {
        return sendResponse(res, 200, 0, [], "User ID is required", []);
      }

      if (!profile_id) {
        profile_id = null;
      }
      const result = await profileMdl.updateProfileImage(user_id, profile_id);
      if (result.affectedRows === 0) {
        return sendResponse(res, 200, 0, [], "User not found", []);
      }
      return sendResponse(
        res,
        200,
        1,
        [],
        "Profile Image Update Successfully",
        [],
      );
    } catch (err: any) {
      console.log(err);
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static changeRegisterNumber = async (req: Request, res: Response) => {
    try {
      const { user_id, mobile } = req.body;

      if (!user_id) {
        return sendResponse(res, 200, 0, [], "User ID is required", []);
      }

      if (!mobile) {
        return sendResponse(res, 200, 0, [], "Mobile number is required", []);
      }

      const result: any = await profileMdl.updateRegisterNumber(
        user_id,
        mobile,
      );

      if (!result || result.affectedRows === 0) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "User not found or not updated",
          [],
        );
      }

      return sendResponse(
        res,
        200,
        1,
        [],
        "Register Number Updated Successfully",
        [],
      );
    } catch (err: any) {
      console.log(err);
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static deleteAccountReasons = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const reasons = await profileMdl.fetchReasons(id);

      return sendResponse(
        res,
        200,
        1,
        reasons,
        "Delete Reasons Fetched Successfully",
        [],
      );
    } catch (err: any) {
      console.log(err);
      return sendResponse(res, 500, 0, [], "Internal Server Error", []);
    }
  };

  static removeAccount = async (req: Request, res: Response) => {
    try {
      const { user_id, reasons } = req.body;
      if (!user_id) {
        return sendResponse(res, 200, 0, [], "user_id is required", []);
      }
      if (!reasons) {
        return sendResponse(res, 200, 0, [], "reason_id is required", []);
      }
      const data = await profileMdl.deleteAccount(user_id, reasons);

      return sendResponse(res, 200, 1, [], "Account Removed Successfully", []);
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internak Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };
}
