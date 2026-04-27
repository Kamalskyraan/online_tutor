"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_model_1 = require("../models/auth.model");
const helper_1 = require("../utils/helper");
const validate_1 = require("../validators/validate");
const mail_service_1 = require("../service/mail.service");
const user_model_1 = require("../models/user.model");
const tutor_model_1 = require("../models/tutor.model");
//
const authModel = new auth_model_1.AuthModel();
const userMdl = new user_model_1.UserModel();
const tutMdl = new tutor_model_1.TutorModel();
class AuthController {
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.RequestOtp = async (req, res) => {
    try {
        const { country_code, mobile, email, type } = req.body;
        const user = await authModel.findUser(country_code, mobile);
        if (type === "1") {
            if (user) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "User already exists", []);
            }
        }
        if (type === "2") {
            if (!user) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "User not found", []);
            }
        }
        const otp = (0, helper_1.generateOTP)();
        const expires_at = (0, helper_1.getOTPExpiry)();
        await (0, auth_model_1.createOTP)({
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
            await (0, mail_service_1.sendMail)(email, otp);
        }
        const responseData = {
            otp: "",
        };
        if (process.env.NODE_ENV === "development") {
            responseData.otp = otp;
        }
        return (0, helper_1.sendResponse)(res, 200, 1, [responseData], "OTP sent successfully");
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, err.status || 500, 0, [], "Something went wrong", err.errors || err.message || err);
    }
};
AuthController.VerifyOtp = async (req, res) => {
    try {
        const { country_code, mobile, otp, email } = req.body;
        const otpRecord = await (0, auth_model_1.getValiOTP)({
            country_code,
            mobile,
            otp,
            email,
        });
        if (otpRecord.message === "invalid") {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid OTP");
        }
        if (otpRecord.message === "expired") {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "OTP expired");
        }
        if (otpRecord.message === "used") {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "OTP already used");
        }
        await (0, auth_model_1.markOTPUsed)(otpRecord.id);
        return (0, helper_1.sendResponse)(res, 200, 1, [], "OTP verified successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, err.status || 500, 0, [], "Something went wrong", [err.errors || err.message || err]);
    }
};
AuthController.signup = async (req, res) => {
    try {
        const { user_name, country_code, mobile, otp, email, password, device_id, device_type, device_token, } = await (0, helper_1.validateRequest)(req.body, validate_1.signupSchema);
        const existingUser = await authModel.findUser(country_code, mobile);
        if (existingUser) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "User already exists", []);
        }
        const otpRecord = await (0, auth_model_1.getValiOTP)({
            country_code,
            mobile,
            otp,
        });
        if (otpRecord.message === "invalid") {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid OTP", []);
        }
        if (otpRecord.message === "expired") {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "OTP expired", []);
        }
        if (otpRecord.message === "used") {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "OTP already used", []);
        }
        await (0, auth_model_1.markOTPUsed)(otpRecord.id);
        const password_hash = await bcryptjs_1.default.hash(password, 10);
        const user_id = await (0, helper_1.generateUserId)();
        const countryy = await (0, helper_1.fetchCountryName)(country_code);
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
        const token = jsonwebtoken_1.default.sign({ user_id, device_id }, process.env.JWT_SECRET, {
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
            return (0, helper_1.sendResponse)(res, 200, 1, [{ user_id }], "Signup successful", []);
        }
        return (0, helper_1.sendResponse)(res, 200, 1, [
            {
                user_id,
                token,
                country,
                personal_form,
                sub_form,
                user_role,
                mobile,
            },
        ], "Signup successful", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, err.status || 500, 0, [], "Something went wrong", [err.errors || err.message || err]);
    }
};
AuthController.login = async (req, res) => {
    try {
        const { country_code, mobile, password, device_id, device_type, device_token, } = await (0, helper_1.validateRequest)(req.body, validate_1.loginSchema);
        const user = await authModel.findUser(country_code, mobile);
        if (!user) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "User not found", []);
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid)
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid password", []);
        if (user.is_deleted === 2) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Account permanently deleted. Contact support.", []);
        }
        await authModel.clearExistUserDevice(user.user_id);
        await authModel.addUserDevice({
            user_id: user.user_id,
            device_id: device_id,
            device_token: device_token,
            device_type: device_type,
        });
        const token = jsonwebtoken_1.default.sign({ user_id: user.user_id, device_id }, process.env.JWT_SECRET, { expiresIn: "90d" });
        const users = await userMdl.fetchUserData({ mobile });
        const user_role = users[0]?.user_role
            ? (0, helper_1.convertNullToString)(users[0]?.user_role)
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
            return (0, helper_1.sendResponse)(res, 200, 1, [{ user_id: user.user_id }], "Login successful", []);
        }
        return (0, helper_1.sendResponse)(res, 200, 1, [
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
        ], "Login successful", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
AuthController.resetPassword = async (req, res) => {
    try {
        const { mobile, country_code, new_password, confirm_password, user_id } = await (0, helper_1.validateRequest)(req.body, validate_1.resetPasswordSchema);
        if (new_password !== confirm_password) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Passwords do not match", []);
        }
        const hashedPassword = await bcryptjs_1.default.hash(new_password, 10);
        if (user_id) {
            await authModel.updatePasswordByUserId(user_id, hashedPassword);
            return (0, helper_1.sendResponse)(res, 200, 1, [], "Password updated successfully (via user_id)", []);
        }
        if (mobile && country_code) {
            await authModel.updatePassword(country_code, mobile, hashedPassword);
            return (0, helper_1.sendResponse)(res, 200, 1, [], "Password updated successfully (via mobile)", []);
        }
        return (0, helper_1.sendResponse)(res, 200, 0, [], "user_id or mobile + country_code is required", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, err.status || 500, 0, [], "Something went wrong", [err.errors || err.message || err]);
    }
};
AuthController.logout = async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return (0, helper_1.sendResponse)(res, 400, 0, [], "User Id is required", []);
        }
        await authModel.clearExistUserDevice(user_id);
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });
        return (0, helper_1.sendResponse)(res, 200, 1, [], "Logout successful", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, err.status || 500, 0, [], "Something went wrong", [err.errors || err.message || err]);
    }
};
AuthController.reactivateAccount = async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "user_id is required");
        }
        const user = await authModel.fetchUserDataForReactive(user_id);
        if (!user) {
            return (0, helper_1.sendResponse)(res, 404, 0, [], "User not found");
        }
        if (Number(user.is_deleted) === 0) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Account already active");
        }
        if (Number(user.is_deleted) === 1) {
            const deletedAt = user.deleted_at ? new Date(user.deleted_at) : null;
            if (!deletedAt || isNaN(deletedAt.getTime())) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid deletion date");
            }
            const now = new Date();
            const diffDays = (now.getTime() - deletedAt.getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays <= 30) {
                await (0, helper_1.executeQuery)(`UPDATE users 
           SET is_deleted = 0, deleted_at = NULL, delete_reasons = NULL 
           WHERE user_id = ?`, [user.user_id]);
                return (0, helper_1.sendResponse)(res, 200, 1, [], "Account reactivated successfully");
            }
            await (0, helper_1.executeQuery)(`UPDATE users SET is_deleted = 2 WHERE user_id = ?`, [user.user_id]);
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Account permanently deleted. Contact support.");
        }
        return (0, helper_1.sendResponse)(res, 400, 0, [], "Invalid account state");
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
AuthController.appealFormInfo = async (req, res) => {
    try {
        let { user_id } = req.params;
        if (!user_id) {
            (0, helper_1.sendResponse)(res, 200, 1, [], "User Id is required", []);
            return;
        }
        let findQuery = `SELECT mobile,user_name FROM users WHERE user_id = ?`;
        let userInfo = await (0, helper_1.executeQuery)(findQuery, [user_id]);
        const resp = {
            mobile: userInfo[0].mobile,
            name: userInfo[0].user_name,
        };
        (0, helper_1.sendResponse)(res, 200, 1, resp, "Appeal form infos", []);
    }
    catch (error) {
        (0, helper_1.sendResponse)(res, 500, 1, [], "Please contact admin or try again later", error);
    }
};
AuthController.addAppeal = async (req, res) => {
    try {
        const { user_id, name, mobile, email, reason, attachments } = req.body;
        if (!user_id || !name || !mobile || !reason) {
            return (0, helper_1.sendResponse)(res, 400, 0, [], "Required fields missing", []);
        }
        const already = await authModel.checkAlreadySubmitted(user_id);
        if (already) {
            return (0, helper_1.sendResponse)(res, 200, 0, { already_submit: 1 }, "You have already submitted appeal", []);
        }
        const id = await authModel.createJustification({
            user_id,
            name,
            mobile,
            email,
            reason,
            attachments,
        });
        return (0, helper_1.sendResponse)(res, 200, 1, {
            id,
            already_submit: 0,
        }, "Appeal submitted successfully", []);
    }
    catch (err) {
        console.error(err);
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Something went wrong", err.message || err);
    }
};
//# sourceMappingURL=auth.controller.js.map