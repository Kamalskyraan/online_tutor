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
  fetchCountryName,
  generateOTP,
  generateUserId,
  getOTPExpiry,
  sendResponse,
  validateRequest,
} from "../utils/helper";
import {
  loginSchema,
  requestOtSchema,
  resetPasswordSchema,
  signupSchema,
  verifyOtpSchema,
} from "../validators/validate";
import { sendMail } from "../service/mail.service";
import { UserModel } from "../models/user.model";
import { TutorModel } from "../models/tutor.model";

//
const authModel = new AuthModel();
const userMdl = new UserModel();
const tutMdl = new TutorModel();
export class AuthController {
  static RequestOtp = async (req: Request, res: Response) => {
    try {
      const { country_code, mobile, email, type } = validateRequest(
        req.body,
        requestOtSchema,
      );
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
      await createOTP({ mobile, email, country_code, otp, expires_at });

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
      const { country_code, mobile, otp } = validateRequest(
        req.body,
        verifyOtpSchema,
      );
      const otpRecord = await getValiOTP({
        country_code,
        mobile,
        otp,
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
      const token = jwt.sign(
        { user_id, device_id, device_token },
        process.env.JWT_SECRET!,
        { expiresIn: "90d" },
      );

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
        [{ user_id, token, country, personal_form, sub_form, user_role }],
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

      await authModel.clearExistUserDevice(user.user_id);
      await authModel.addUserDevice({
        user_id: user.user_id,
        device_id: device_id,
        device_token: device_token,
        device_type: device_type,
      });
      const token = jwt.sign(
        { user_id: user.user_id, device_id, device_token },
        process.env.JWT_SECRET!,
        { expiresIn: "90d" },
      );
      const users = await userMdl.fetchUserData({ mobile });

      const user_role = users[0].user_role;
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
      const { mobile, country_code, new_password, confirm_password } =
        await validateRequest(req.body, resetPasswordSchema);
      if (new_password !== confirm_password) {
        return sendResponse(res, 200, 0, [], "Passwords do not match", []);
      }
      const hashedPassword = await bcrypt.hash(new_password, 10);
      await authModel.updatePassword(country_code, mobile, hashedPassword);
      return sendResponse(res, 200, 1, [], "Password updated successfully", []);
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

  static logout = async (req: Request, res: Response) => {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return sendResponse(res, 400, 0, [], "User Id is required", []);
      }

      await authModel.clearExistUserDevice(user_id);

      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      return sendResponse(res, 200, 1, [], "Logout successful", []);
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
}
