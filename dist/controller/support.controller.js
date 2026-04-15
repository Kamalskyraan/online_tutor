"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIssueCategory = exports.addUpdateIssueCategories = exports.getHelpSupport = exports.addUpdateHelp = void 0;
const helper_1 = require("../utils/helper");
const validate_1 = require("../validators/validate");
const help_model_1 = require("../models/help.model");
const user_model_1 = require("../models/user.model");
const userModel = new user_model_1.UserModel();
const addUpdateHelp = async (req, res) => {
    try {
        const { id, question, answer, status, support_for } = await (0, helper_1.validateRequest)(req.body, validate_1.helpSchema);
        const result = await (0, help_model_1.saveHelp)({
            id,
            question,
            answer,
            status,
            support_for,
        });
        return (0, helper_1.sendResponse)(res, 200, 1, [], id ? "Help updated successfully" : "Help added successfully");
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, err.status || 500, 0, null, "Something went wrong", err.errors || err.message || err);
    }
};
exports.addUpdateHelp = addUpdateHelp;
const getHelpSupport = async (req, res) => {
    try {
        const { search, status, page, user_id, limit = 10 } = req.body;
        if (search && search.length < 3) {
            return (0, helper_1.sendResponse)(res, 200, 1, [], "search term must be atleast 3 characters");
        }
        const pageNumber = Number(page);
        let user_role;
        if (user_id) {
            user_role = await userModel.fetchUserRole(user_id);
        }
        const result = await (0, help_model_1.getAllHelp)(search, status, user_role, pageNumber);
        return (0, helper_1.sendResponse)(res, 200, 1, result, result.data.length
            ? "Help and Support list fetched successfully"
            : "No Data found");
    }
    catch (err) {
        console.log(err);
        return (0, helper_1.sendResponse)(res, err.status || 500, 0, null, "Something went wrong", err.errors || err.message || err);
    }
};
exports.getHelpSupport = getHelpSupport;
const addUpdateIssueCategories = async (req, res) => {
    try {
        const { id, name, status } = req.body;
        if (!name) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Name is required", []);
        }
        const result = await (0, help_model_1.createOrUpdateIssueCategory)(id, name, status);
        return (0, helper_1.sendResponse)(res, 200, 1, result, "add issue category", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
exports.addUpdateIssueCategories = addUpdateIssueCategories;
const getIssueCategory = async (req, res) => {
    try {
        const { status } = req.body;
        const data = await (0, help_model_1.fetchIssueCategories)(status);
        return (0, helper_1.sendResponse)(res, 200, 1, data, "Fetched successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
exports.getIssueCategory = getIssueCategory;
//# sourceMappingURL=support.controller.js.map