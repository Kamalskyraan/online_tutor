"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationController = void 0;
const helper_1 = require("../utils/helper");
const education_model_1 = require("../models/education.model");
const eduMdl = new education_model_1.EduModel();
class EducationController {
}
exports.EducationController = EducationController;
_a = EducationController;
EducationController.getEducationLevel = async (req, res) => {
    try {
        const { id, name, status } = req.body;
        const result = await eduMdl.fetchEducationLvl({
            id,
            name,
            status,
        });
        const formatResult = result?.map((item) => ({
            ...item,
            board: item.board ?? "",
        }));
        return (0, helper_1.sendResponse)(res, 200, 0, formatResult, "Education Levl Fetched Succesfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 1, 500, [], "something went wrong", err.errors || err.message || err);
    }
};
EducationController.getStreams = async (req, res) => {
    try {
        const { id, name, status, edu_id } = req.body;
        const result = await eduMdl.fetchStreams({ id, name, status, edu_id });
        return (0, helper_1.sendResponse)(res, 200, 1, result, "Streams Fetched successfully", []);
    }
    catch (err) {
        console.log(err);
        return (0, helper_1.sendResponse)(res, 500, 0, [], "something went wrong", err.errors || err.message || err);
    }
};
//# sourceMappingURL=education.controller.js.map