import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  AuthModel,
  createOTP,
  getValiOTP,
  markOTPUsed,
} from "../models/auth.model";
import {
  convertNullToString,
  executeQuery,
  fetchCountryName,
  generateOTP,
  generateUserId,
  getOTPExpiry,
  sendResponse,
  validateRequest,
} from "../utils/helper";
import {
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "../validators/validate";
import { sendMail } from "../service/mail.service";
import { UserModel } from "../models/user.model";
import { TutorModel } from "../models/tutor.model";
import { AuthRequest } from "../config/middleware";

//
const authModel = new AuthModel();
const userMdl = new UserModel();
const tutMdl = new TutorModel();
export class AuthController {
  static RequestOtp = async (req: Request, res: Response) => {
    try {
      const { country_code, mobile, email, type } = req.body;

      const user = await authModel.findUser(country_code, mobile);
      if (type === "1") {
        if (user) {
          return sendResponse(res, 200, 0, [], "User already exists", []);
        }
      }

      if (type === "2") {
        if (!user) {
          return sendResponse(res, 200, 0, [], "User not found", []);
        }
      }

      const otp = generateOTP();
      const expires_at = getOTPExpiry();
      await createOTP({
        mobile,
        email,
        country_code,
        otp,
        expires_at,
      });

      // if (process.env.NODE_ENV === "production") {
      //   await sendSmsOTP(mobile, otp);
      // }
      if (email) {
        await sendMail(email, otp);
      }

      const responseData = {
        otp: "",
      };
      if (process.env.NODE_ENV === "development") {
        responseData.otp = otp;
      }

      return sendResponse(res, 200, 1, [responseData], "OTP sent successfully");
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

  static VerifyOtp = async (req: Request, res: Response) => {
    try {
      const { country_code, mobile, otp, email } = req.body;

      const otpRecord = await getValiOTP({
        country_code,
        mobile,
        otp,
        email,
      });

      if (otpRecord.message === "invalid") {
        return sendResponse(res, 200, 0, [], "Invalid OTP");
      }
      if (otpRecord.message === "expired") {
        return sendResponse(res, 200, 0, [], "OTP expired");
      }
      if (otpRecord.message === "used") {
        return sendResponse(res, 200, 0, [], "OTP already used");
      }

      await markOTPUsed(otpRecord.id);

      return sendResponse(res, 200, 1, [], "OTP verified successfully", []);
    } catch (err: any) {
      return sendResponse(
        res,
        err.status || 500,
        0,
        [],
        "Something went wrong",
        [err.errors || err.message || err],
      );
    }
  };

  static signup = async (req: Request, res: Response) => {
    try {
      const {
        user_name,
        country_code,
        mobile,
        otp,
        email,
        password,
        device_id,
        device_type,
        device_token,
      } = await validateRequest(req.body, signupSchema);
      const existingUser = await authModel.findUser(country_code, mobile);
      if (existingUser) {
        return sendResponse(res, 200, 0, [], "User already exists", []);
      }

      const otpRecord = await getValiOTP({
        country_code,
        mobile,
        otp,
      });

      if (otpRecord.message === "invalid") {
        return sendResponse(res, 200, 0, [], "Invalid OTP", []);
      }
      if (otpRecord.message === "expired") {
        return sendResponse(res, 200, 0, [], "OTP expired", []);
      }
      if (otpRecord.message === "used") {
        return sendResponse(res, 200, 0, [], "OTP already used", []);
      }

      await markOTPUsed(otpRecord.id);

      const password_hash = await bcrypt.hash(password, 10);
      const user_id = await generateUserId();
      const countryy = await fetchCountryName(country_code);
      const userId = await authModel.createUser({
        user_name,
        user_id,
        country_code,
        mobile,
        password_hash,
        countryy,
        email,
      });
      await authModel.addUserDevice({
        user_id,
        device_id,
        device_token,
        device_type,
      });
      const token = jwt.sign({ user_id, device_id }, process.env.JWT_SECRET!, {
        expiresIn: "90d",
      });

      const users = await userMdl.fetchUserData(mobile);
      const country = users[0].country;
      const personal_form = users[0].is_form_filled;
      const user_role = users[0].user_role;
      const subForm = await userMdl.fetchSubFormData(user_id);

      const sub_form = subForm?.sub_form;

      if (device_type === "web") {
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          // sameSite: "Strict",
          maxAge: 90 * 24 * 60 * 60 * 1000,
        });

        return sendResponse(
          res,
          200,
          1,
          [{ user_id }],
          "Signup successful",
          [],
        );
      }

      return sendResponse(
        res,
        200,
        1,
        [
          {
            user_id,
            token,
            country,
            personal_form,
            sub_form,
            user_role,
            mobile,
          },
        ],
        "Signup successful",
        [],
      );
    } catch (err: any) {
      return sendResponse(
        res,
        err.status || 500,
        0,
        [],
        "Something went wrong",
        [err.errors || err.message || err],
      );
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const {
        country_code,
        mobile,
        password,
        device_id,
        device_type,
        device_token,
      } = await validateRequest(req.body, loginSchema);
      const user = await authModel.findUser(country_code, mobile);

      if (!user) {
        return sendResponse(res, 200, 0, [], "User not found", []);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return sendResponse(res, 200, 0, [], "Invalid password", []);

      if (user.is_deleted === 2) {
        return sendResponse(
          res,
          200,
          0,
          [],
          "Account permanently deleted. Contact support.",
          [],
        );
      }

      await authModel.clearExistUserDevice(user.user_id);
      await authModel.addUserDevice({
        user_id: user.user_id,
        device_id: device_id,
        device_token: device_token,
        device_type: device_type,
      });
      const token = jwt.sign(
        { user_id: user.user_id, device_id },
        process.env.JWT_SECRET!,
        { expiresIn: "90d" },
      );
      const users = await userMdl.fetchUserData({ mobile });

      const user_role = users[0]?.user_role
        ? convertNullToString(users[0]?.user_role)
        : "";

      const country = users[0].country;
      const personal_form = users[0].is_form_filled;

      const subForm = await userMdl.fetchSubFormData(user?.user_id);

      const sub_form = subForm?.sub_form;

      const tutor_id = await userMdl.geTutorByUserId(user?.user_id);
      const student_id = await userMdl.getStudentByUserId(user?.user_id);

      const FirstSub = await tutMdl.fetchFirstSub(mobile);

      if (device_type === "web") {
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 90 * 24 * 60 * 60 * 1000,
        });

        return sendResponse(
          res,
          200,
          1,
          [{ user_id: user.user_id }],
          "Login successful",
          [],
        );
      }

      if (user.is_blocked === 1) {
        return sendResponse(
          res,
          200,
          2,
          [
            {
              user_id: user.user_id,
              token: "",
              country: "",
              personal_form: "",
              sub_form: "",
              user_role: "",
              tutor_id: "",
              student_id,
              first_sub: 0,
            },
          ],
          "Need Justification for this ID",
          [],
        );
      }

      return sendResponse(
        res,
        200,
        1,
        [
          {
            user_id: user.user_id,
            token,
            country,
            personal_form,
            sub_form,
            user_role,
            tutor_id,
            student_id,
            first_sub: FirstSub[0].id ?? 0,
            is_deleted: user.is_deleted,
            deleted_at: user?.deleted_at ?? "",
          },
        ],
        "Login successful",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static resetPassword = async (req: Request, res: Response) => {
    try {
      const { mobile, country_code, new_password, confirm_password, user_id } =
        await validateRequest(req.body, resetPasswordSchema);
      if (new_password !== confirm_password) {
        return sendResponse(res, 200, 0, [], "Passwords do not match", []);
      }
      const hashedPassword = await bcrypt.hash(new_password, 10);

      if (user_id) {
        await authModel.updatePasswordByUserId(user_id, hashedPassword);

        return sendResponse(
          res,
          200,
          1,
          [],
          "Password updated successfully (via user_id)",
          [],
        );
      }
      if (mobile && country_code) {
        await authModel.updatePassword(country_code, mobile, hashedPassword);

        return sendResponse(
          res,
          200,
          1,
          [],
          "Password updated successfully (via mobile)",
          [],
        );
      }
      return sendResponse(
        res,
        200,
        0,
        [],
        "user_id or mobile + country_code is required",
        [],
      );
    } catch (err: any) {
      return sendResponse(
        res,
        err.status || 500,
        0,
        [],
        "Something went wrong",
        [err.errors || err.message || err],
      );
    }
  };

  // static logout = async (req: Request, res: Response) => {
  //   try {
  //     const { user_id } = req.body;

  //     if (!user_id) {
  //       return sendResponse(res, 200, 0, [], "User Id is required", []);
  //     }

  //     await authModel.clearExistUserDevice(user_id);

  //     res.clearCookie("token", {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //     });
  //     return sendResponse(res, 200, 1, [], "Logout successful", []);
  //   } catch (err: any) {
  //     return sendResponse(
  //       res,
  //       err.status || 500,
  //       0,
  //       [],
  //       "Something went wrong",
  //       [err.errors || err.message || err],
  //     );
  //   }
  // };
  static reactivateAccount = async (req: Request, res: Response) => {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return sendResponse(res, 200, 0, [], "user_id is required");
      }

      const user = await authModel.fetchUserDataForReactive(user_id);

      if (!user) {
        return sendResponse(res, 404, 0, [], "User not found");
      }

      if (Number(user.is_deleted) === 0) {
        return sendResponse(res, 200, 0, [], "Account already active");
      }

      if (Number(user.is_deleted) === 1) {
        const deletedAt = user.deleted_at ? new Date(user.deleted_at) : null;

        if (!deletedAt || isNaN(deletedAt.getTime())) {
          return sendResponse(res, 200, 0, [], "Invalid deletion date");
        }

        const now = new Date();

        const diffDays =
          (now.getTime() - deletedAt.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays <= 30) {
          await executeQuery(
            `UPDATE users 
           SET is_deleted = 0, deleted_at = NULL, delete_reasons = NULL 
           WHERE user_id = ?`,
            [user.user_id],
          );

          return sendResponse(
            res,
            200,
            1,
            [],
            "Account reactivated successfully",
          );
        }

        await executeQuery(
          `UPDATE users SET is_deleted = 2 WHERE user_id = ?`,
          [user.user_id],
        );

        return sendResponse(
          res,
          200,
          0,
          [],
          "Account permanently deleted. Contact support.",
        );
      }

      return sendResponse(res, 400, 0, [], "Invalid account state");
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  };

  static logout = async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return sendResponse(res, 200, 3, [], "Unauthorized", []);
      }

      const token = authHeader.split(" ")[1];

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      const user_id = decoded.user_id;
      const device_id = decoded.device_id;

      if (!user_id || !device_id) {
        return sendResponse(res, 200, 3, [], "Invalid token data", []);
      }

      await authModel.removeUserDevicedec(user_id, device_id);

       res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      return sendResponse(res, 200, 1, [], "Logout successful", []);
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return sendResponse(res, 200, 3, [], "Token expired", []);
      }

      if (err.name === "JsonWebTokenError") {
        return sendResponse(res, 401, 3, [], "Invalid token", []);
      }

      return sendResponse(res, 500, 3, [], "Something went wrong", [
        err.message || err,
      ]);
    }
  };

  static appealFormInfo = async (req: Request, res: Response) => {
    try {
      let { user_id } = req.params;

      if (!user_id) {
        sendResponse(res, 200, 1, [], "User Id is required", []);
        return;
      }

      let findQuery = `SELECT mobile,user_name FROM users WHERE user_id = ?`;

      let userInfo = await executeQuery(findQuery, [user_id]);

      const resp = {
        mobile: userInfo[0].mobile,
        name: userInfo[0].user_name,
      };

      sendResponse(res, 200, 1, resp, "Appeal form infos", []);
    } catch (error) {
      sendResponse(
        res,
        500,
        1,
        [],
        "Please contact admin or try again later",
        error,
      );
    }
  };

  static addAppeal = async (req: Request, res: Response) => {
    try {
      const { user_id, name, mobile, email, reason, attachments } = req.body;

      if (!user_id || !name || !mobile || !reason) {
        return sendResponse(res, 200, 0, [], "Required fields missing", []);
      }

      const already = await authModel.checkAlreadySubmitted(user_id);

      if (already) {
        return sendResponse(
          res,
          200,
          0,
          { already_submit: 1 },
          "You have already submitted appeal",
          [],
        );
      }

      const id = await authModel.createJustification({
        user_id,
        name,
        mobile,
        email,
        reason,
        attachments,
      });

      return sendResponse(
        res,
        200,
        1,
        {
          id,
          already_submit: 0,
        },
        "Appeal submitted successfully",
        [],
      );
    } catch (err: any) {
      console.error(err);

      return sendResponse(
        res,
        500,
        0,
        [],
        "Something went wrong",
        err.message || err,
      );
    }
  };

  static checkAlreadyAppeal = async (req: Request, res: Response) => {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return sendResponse(res, 200, 0, [], "User id required", []);
      }

      const already = await authModel.checkAlreadySubmitted(user_id);

      return sendResponse(
        res,
        200,
        1,
        {
          already_submit: already ? 1 : 0,
        },
        already ? "Already submitted" : "Not submitted",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.message || err,
      ]);
    }
  };
}
