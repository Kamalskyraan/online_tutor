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
//
const authModel = new auth_model_1.AuthModel();
class AuthController {
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.RequestOtp = async (req, res) => {
    try {
        const { country_code, mobile, email } = (0, helper_1.validateRequest)(req.body, validate_1.requestOtSchema);
        const otp = (0, helper_1.generateOTP)();
        const expires_at = (0, helper_1.getOTPExpiry)();
        await (0, auth_model_1.createOTP)({ mobile, email, country_code, otp, expires_at });
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
        return (0, helper_1.sendResponse)(res, 200, 1, responseData, "OTP sent successfully");
    }
    catch (err) {
        console.log(err);
        return (0, helper_1.sendResponse)(res, err.status || 500, 0, [], "Something went wrong", err.errors || err.message || err);
    }
};
AuthController.VerifyOtp = async (req, res) => {
    try {
        const { country_code, mobile, otp } = (0, helper_1.validateRequest)(req.body, validate_1.verifyOtpSchema);
        const otpRecord = await (0, auth_model_1.getValiOTP)({
            country_code,
            mobile,
            otp,
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
        return (0, helper_1.sendResponse)(res, 200, 1, [], "OTP verified successfully");
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, err.status || 500, 0, [], "Something went wrong", err.errors || err.message || err);
    }
};
AuthController.signup = async (req, res) => {
    try {
        const { user_name, country_code, mobile, otp, email, password, device_id, device_type, device_token, } = await (0, helper_1.validateRequest)(req.body, validate_1.signupSchema);
        const existingUser = await authModel.findUser(country_code, mobile);
        if (existingUser) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "User already exists");
        }
        const otpRecord = await (0, auth_model_1.getValiOTP)({
            country_code,
            mobile,
            otp,
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
        const password_hash = await bcryptjs_1.default.hash(password, 10);
        const user_id = await (0, helper_1.generateUserId)();
        const country = await (0, helper_1.fetchCountryName)(country_code);
        const userId = await authModel.createUser({
            user_name,
            user_id,
            country_code,
            mobile,
            password_hash,
            country,
            email,
        });
        await authModel.addUserDevice({
            user_id,
            device_id,
            device_token,
            device_type,
        });
        const token = jsonwebtoken_1.default.sign({ user_id, device_id, device_token }, process.env.JWT_SECRET, { expiresIn: "90d" });
        if (device_type === "web") {
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                // sameSite: "Strict",
                maxAge: 90 * 24 * 60 * 60 * 1000,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, { user_id }, "Signup successful");
        }
        return (0, helper_1.sendResponse)(res, 200, 1, { user_id, token }, "Signup successful");
    }
    catch (err) {
        console.log(err);
        return (0, helper_1.sendResponse)(res, err.status || 500, 0, [], "Something went wrong", err.errors || err.message || err);
    }
};
AuthController.login = async (req, res) => {
    try {
        const { country_code, mobile, password, device_id, device_type, device_token, } = await (0, helper_1.validateRequest)(req.body, validate_1.loginSchema);
        const user = await authModel.findUser(country_code, mobile);
        if (!user) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "User not found");
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid)
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid password");
        await authModel.clearExistUserDevice(user.user_id);
        await authModel.addUserDevice({
            user_id: user.user_id,
            device_id: device_id,
            device_token: device_token,
            device_type: device_type,
        });
        const token = jsonwebtoken_1.default.sign({ user_id: user.user_id, device_id, device_token }, process.env.JWT_SECRET, { expiresIn: "90d" });
        if (device_type === "web") {
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 90 * 24 * 60 * 60 * 1000,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, { user_id: user.user_id }, "Login successful");
        }
        return (0, helper_1.sendResponse)(res, 200, 1, { user_id: user.user_id, token }, "Login successful");
    }
    catch (err) {
        console.log(err);
        return (0, helper_1.sendResponse)(res, err.status || 500, 0, [], "Something went wrong", err.errors || err.message || err);
    }
};
AuthController.resetPassword = async (req, res) => {
    try {
        const { mobile, country_code, new_password, confirm_password } = await (0, helper_1.validateRequest)(req.body, validate_1.resetPasswordSchema);
        if (new_password !== confirm_password) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Passwords do not match");
        }
        const hashedPassword = await bcryptjs_1.default.hash(new_password, 10);
        await authModel.updatePassword(country_code, mobile, hashedPassword);
        return (0, helper_1.sendResponse)(res, 200, 1, [], "Password updated successfully");
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, err.status || 500, 0, [], "Something went wrong", err.errors || err.message || err);
    }
};
AuthController.logout = async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return (0, helper_1.sendResponse)(res, 400, 0, [], "User Id is required");
        }
        await authModel.clearExistUserDevice(user_id);
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });
        return (0, helper_1.sendResponse)(res, 200, 1, [], "Logout successful");
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, err.status || 500, 0, [], "Something went wrong", err.errors || err.message || err);
    }
};
//# sourceMappingURL=auth.controller.js.map