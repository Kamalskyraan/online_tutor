"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonController = void 0;
const helper_1 = require("../utils/helper");
const promises_1 = __importDefault(require("fs/promises"));
const common_model_1 = require("../models/common.model");
const cmnModel = new common_model_1.commonModel();
class CommonController {
}
exports.CommonController = CommonController;
_a = CommonController;
CommonController.countryData = async (req, res) => {
    try {
        const file = await promises_1.default.readFile("./public/country.json", "utf8");
        const data = JSON.parse(file);
        let india = null;
        const others = [];
        data?.forEach((val) => {
            if (val.id === "0076")
                india = val;
            else
                others.push(val);
        });
        const finalData = india ? [india, ...others] : data;
        return (0, helper_1.sendResponse)(res, 200, 1, finalData, "Country Data is fetched successfully", []);
    }
    catch (err) {
        (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", []);
    }
};
CommonController.changeNumber = async (req, res) => {
    try {
        const { old_password, mobile } = req.body;
        if (!old_password) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Old Password is required", []);
        }
        // await
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "something went wrong", err.errors || err.message || err);
    }
};
CommonController.uploadFile = async (req, res) => {
    try {
        const file = req.file;
        const { category } = req.body;
        if (!file) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "file is required", []);
        }
        if (!category) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Category is required", []);
        }
        const uploadId = await cmnModel.saveUpload(file, category);
        return (0, helper_1.sendResponse)(res, 200, 1, {
            id: uploadId,
            category,
            pathname: file.key,
            url: `https://${process.env.CLOUDFRONT_URL}/${file.key}`,
            org_name: file.originalname,
            file_size: `${(file.size / (1024 * 1024)).toFixed(4)}MB`,
        }, "Upload successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "something went wrong", err.message || err);
    }
};
CommonController.uploadFileLoc = async (req, res) => {
    try {
        const file = req.file;
        const { category } = req.body;
        if (!file) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "file is required", []);
        }
        if (!category) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Category is required", []);
        }
        const uploadId = await cmnModel.saveUploadLoc(file, category);
        return (0, helper_1.sendResponse)(res, 200, 1, {
            id: uploadId,
            category,
            pathname: file.filename,
            url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
            org_name: file.originalname,
            file_size: `${(file.size / (1024 * 1024)).toFixed(4)}MB`,
        }, "Upload successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "something went wrong", err.message || err);
    }
};
CommonController.getUploadFiles = async (req, res) => {
    try {
        let { ids } = req.body;
        if (!ids) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Ids are required", []);
        }
        if (typeof ids === "string") {
            ids = ids.split(",").map((id) => Number(id.trim()));
        }
        if (typeof ids === "number") {
            ids = [ids];
        }
        ids = ids.map((id) => Number(id)).filter((id) => !isNaN(id));
        if (ids.length === 0) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid ids", []);
        }
        const files = await cmnModel.getUploadFiles(ids);
        return (0, helper_1.sendResponse)(res, 200, 1, files, "Assets are fetched successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.errors || err.message || err);
    }
};
//# sourceMappingURL=common.controller.js.map