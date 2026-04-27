"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const helper_1 = require("../utils/helper");
const profile_model_1 = require("../models/profile.model");
const common_model_1 = require("../models/common.model");
const validate_1 = require("../validators/validate");
const education_model_1 = require("../models/education.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const profileMdl = new profile_model_1.ProfileModel();
const cmnModel = new common_model_1.commonModel();
const eduModl = new education_model_1.EduModel();
class ProfileController {
}
exports.ProfileController = ProfileController;
_a = ProfileController;
ProfileController.getUserData = async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "User_id is required", []);
        }
        const user_role = await profileMdl.fetchUserRole(user_id);
        if (!user_role) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "User not found", []);
        }
        const result = await profileMdl.fetchUserProfileData(user_id, user_role);
        if (!result || !result.data) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "User data not found", []);
        }
        const data = result.data;
        const streamId = data.stream_id || data.student_stream_id;
        let streams = null;
        if (streamId) {
            streams = await eduModl.fetchStreamsForAll(streamId.toString());
        }
        const stringData = await cmnModel.convertNullObjectToString(data);
        return (0, helper_1.sendResponse)(res, 200, 1, [{
                role: result.role,
                ...stringData,
                streams,
            }], "User Profile Data Fetched successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "something went wrong", err.errors || err.message || err);
    }
};
ProfileController.addUpdateUserData = async (req, res) => {
    try {
        await (0, helper_1.validateRequest)(req.body, validate_1.updateUserProfileSchema);
        const { user_id, ...payload } = req.body;
        await profileMdl.addUpdateProfileData(user_id, payload);
        return (0, helper_1.sendResponse)(res, 200, 1, [], "user Profile Data Updated successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "something went wrong", err.errors || err.message || err);
    }
};
ProfileController.changePrimary = async (req, res) => {
    try {
        const { new_primary_number, country_code, user_id } = req.body;
        const existing = await profileMdl.checkExistingPrimaryNumber(user_id);
        const oldMobile = existing.primary_num;
        const oldCountry_code = existing.country_code;
        if (oldMobile === new_primary_number) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Already This is primary number");
        }
        await profileMdl.updatePrimaryNumber(user_id, new_primary_number, country_code, oldMobile);
        return (0, helper_1.sendResponse)(res, 200, 1, [], "Primary Number Changed successfully");
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "something went wrong", err.errors || err.message || err);
    }
};
ProfileController.addUpdateAdditionalNumber = async (req, res) => {
    try {
        const { add_mobile, user_id } = req.body;
        const registerNum = await profileMdl.checkExistingPrimaryNumber(user_id);
        if (registerNum?.primary_num === add_mobile) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "additional number should be differ from register number", []);
        }
        const result = await profileMdl.updateAdditionalMobile(add_mobile, user_id);
        return (0, helper_1.sendResponse)(res, 200, 1, result, "Update additional number successfully", []);
    }
    catch (err) {
        console.log(err);
        return (0, helper_1.sendResponse)(res, 500, 0, [], "something went wrong", err.errors || err.message || err);
    }
};
ProfileController.checkOldPassword = async (req, res) => {
    try {
        const { user_id, old_password } = req.body;
        if (!user_id || !old_password) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "user_id and old_password are required", []);
        }
        const user = await profileMdl.checkOldPassword(user_id);
        if (!user) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "User not found", []);
        }
        const isMatch = await bcryptjs_1.default.compare(old_password, user.password);
        if (!isMatch) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Old password is incorrect", []);
        }
        return (0, helper_1.sendResponse)(res, 200, 1, [], "Old password is correct", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Something went wrong", err.errors || err.message || err);
    }
};
ProfileController.updateProfilePic = async (req, res) => {
    try {
        let { profile_id, user_id } = req.body;
        if (!user_id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "User ID is required", []);
        }
        if (!profile_id) {
            profile_id = null;
        }
        const result = await profileMdl.updateProfileImage(user_id, profile_id);
        if (result.affectedRows === 0) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "User not found", []);
        }
        return (0, helper_1.sendResponse)(res, 200, 1, [], "Profile Image Update Successfully", []);
    }
    catch (err) {
        console.log(err);
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
ProfileController.changeRegisterNumber = async (req, res) => {
    try {
        const { user_id, mobile } = req.body;
        if (!user_id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "User ID is required", []);
        }
        if (!mobile) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Mobile number is required", []);
        }
        const result = await profileMdl.updateRegisterNumber(user_id, mobile);
        if (!result || result.affectedRows === 0) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "User not found or not updated", []);
        }
        return (0, helper_1.sendResponse)(res, 200, 1, [], "Register Number Updated Successfully", []);
    }
    catch (err) {
        console.log(err);
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
ProfileController.deleteAccountReasons = async (req, res) => {
    try {
        const { id } = req.body;
        const reasons = await profileMdl.fetchReasons(id);
        return (0, helper_1.sendResponse)(res, 200, 1, reasons, "Delete Reasons Fetched Successfully", []);
    }
    catch (err) {
        console.log(err);
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", []);
    }
};
ProfileController.removeAccount = async (req, res) => {
    try {
        const { user_id, reasons } = req.body;
        if (!user_id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "user_id is required", []);
        }
        if (!reasons) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "reason_id is required", []);
        }
        const data = await profileMdl.deleteAccount(user_id, reasons);
        return (0, helper_1.sendResponse)(res, 200, 1, [], "Account Removed Successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internak Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
//# sourceMappingURL=profile.controller.js.map