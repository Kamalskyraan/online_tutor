"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const helper_1 = require("../utils/helper");
const profile_model_1 = require("../models/profile.model");
const common_model_1 = require("../models/common.model");
const validate_1 = require("../validators/validate");
const profileMdl = new profile_model_1.ProfileModel();
const cmnModel = new common_model_1.commonModel();
class ProfileController {
}
exports.ProfileController = ProfileController;
_a = ProfileController;
ProfileController.getUserData = async (req, res) => {
    try {
        const { user_id, user_role } = req.body;
        if (!user_id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "User_id is required", []);
        }
        const result = await profileMdl.fetchUserProfileData(user_id, user_role);
        console.log(result);
        if (!result) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "User not found", []);
        }
        const converted = await profileMdl.convertRepresentData(result?.data?.represent);
        const stringData = await cmnModel.convertNullObjectToString(result?.data);
        return (0, helper_1.sendResponse)(res, 200, 1, {
            ...stringData,
            represent_name: converted,
        }, "User Profile Data Fetched successfully", []);
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
        if (oldMobile === new_primary_number) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Already This is primary number");
        }
        await profileMdl.updatePrimaryNumber(user_id, new_primary_number, country_code);
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
//# sourceMappingURL=profile.controller.js.map