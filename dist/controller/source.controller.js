"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceController = void 0;
const helper_1 = require("../utils/helper");
const source_model_1 = require("../models/source.model");
const validate_1 = require("../validators/validate");
const sourceModel = new source_model_1.SourceModel();
class SourceController {
}
exports.SourceController = SourceController;
_a = SourceController;
SourceController.getAdressDetailsFromPincode = async (req, res) => {
    try {
        const { pincode } = req.body;
        if (!pincode) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Pincode is required");
        }
        const data = await sourceModel.getLatLngFromPincode(pincode);
        if (!data) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Pincode not found");
        }
        return (0, helper_1.sendResponse)(res, 200, 1, data, "Address fetched successfully from pincode");
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, err.status || 500, 0, [], "Something went wrong", err.errors || err.message || err);
    }
};
SourceController.addUpdateEducationLevel = async (req, res) => {
    try {
        const { id, name } = await (0, helper_1.validateRequest)(req.body, validate_1.educationSchema);
        if (id) {
            await sourceModel.updateEducationLevel(id, name);
            return (0, helper_1.sendResponse)(res, 200, 1, [], "Education level updated successfully");
        }
        else {
            await sourceModel.addEducationLevel(name);
            return (0, helper_1.sendResponse)(res, 201, 1, [], "Education level added successfully");
        }
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, err.status || 500, 0, [], "Something went wrong", err.errors || err.message || err);
    }
};
SourceController.addUpdateStream = async (req, res) => {
    try {
        const { id, edu_id, name } = await (0, helper_1.validateRequest)(req.body, validate_1.educationStreamSchema);
        const level = await sourceModel.getEducationLevelById(edu_id);
        if (!level) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Education level not found");
        }
        if (id) {
            await sourceModel.updateStream(id, edu_id, name);
            return (0, helper_1.sendResponse)(res, 200, 1, [], "Stream updated successfully");
        }
        else {
            await sourceModel.addStream(edu_id, name);
            return (0, helper_1.sendResponse)(res, 200, 1, [], "Stream added successfully");
        }
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, err.status || 500, 0, [], "Something went wrong", err.errors || err.message || err);
    }
};
SourceController.getStreamsByEducation = async (req, res) => {
    try {
        const { edu_id } = req.body;
        let streams;
        if (edu_id) {
            streams = await sourceModel.getStreamsByEduId(edu_id);
        }
        else {
            streams = await sourceModel.getAllStreams();
        }
        return (0, helper_1.sendResponse)(res, 200, 1, streams, "Streams fetched successfully");
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, err.status || 500, 0, [], "Something went wrong", err.errors || err.message || err);
    }
};
SourceController.getCountryData = async (req, res) => {
    try {
        const { search } = req.body;
        const result = await sourceModel.fetchCountryCode(search);
        return (0, helper_1.sendResponse)(res, 200, 1, result, "Country Data Fetched successfully");
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "something went wrong", err.errors || err.message || err);
    }
};
//lang
SourceController.addUpdateLanguage = async (req, res) => {
    try {
        const { id, lang_name, status } = await (0, helper_1.validateRequest)(req.body, validate_1.addUpdateLangSchema);
        const data = await sourceModel.createAndUpdate({
            id,
            lang_name,
            status,
        });
        const message = data.type === "insert"
            ? "Language added successfully"
            : "Language updated successfully";
        return (0, helper_1.sendResponse)(res, 200, 1, [], message, []);
    }
    catch (err) {
        console.log(err);
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.errors || err.message || err);
    }
};
SourceController.getLanguages = async (req, res) => {
    try {
        const { id, lang_name, status } = req.body;
        const langData = await sourceModel.fetchLanguages({
            id,
            lang_name,
            status,
        });
        return (0, helper_1.sendResponse)(res, 200, 1, langData, "Language Data fetched successfully", []);
    }
    catch (err) {
        (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.errors || err.message || err);
    }
};
//# sourceMappingURL=source.controller.js.map