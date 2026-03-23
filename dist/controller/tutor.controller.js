"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorController = void 0;
const helper_1 = require("../utils/helper");
const tutor_model_1 = require("../models/tutor.model");
const validate_1 = require("../validators/validate");
const tutModel = new tutor_model_1.TutorModel();
class TutorController {
}
exports.TutorController = TutorController;
_a = TutorController;
TutorController.addUpdateDemos = async (req, res) => {
    try {
        const { id, tutor_id, media_type, media_id, title, thumbnail } = await (0, helper_1.validateRequest)(req.body, validate_1.addUpdateDemosSchema);
        const demos = await tutModel.insertUpdateDemos({
            id,
            tutor_id,
            media_type,
            media_id,
            title,
            thumbnail,
        });
        return (0, helper_1.sendResponse)(res, 200, 1, [], demos.message, []);
    }
    catch (err) {
        console.log(err);
        return (0, helper_1.sendResponse)(res, 200, 0, [], "something went wrong", err.errors || err.message || err);
    }
};
TutorController.removeDemos = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "ID is required", []);
        }
        const tMdl = await tutModel.deleteDemos(id);
        return (0, helper_1.sendResponse)(res, 200, 1, [], tMdl.message, []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.errors || err.message || err);
    }
};
TutorController.getDemos = async (req, res) => {
    try {
        const { tutor_id, media_type, id } = await (0, helper_1.validateRequest)(req.body, validate_1.getDemosSchema);
        const result = await tutModel.getDemoVideosAndImages({
            tutor_id,
            media_type,
            id,
        });
        return (0, helper_1.sendResponse)(res, 200, 1, result, "Demos Fetched Successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.errors || err.message || err);
    }
};
//# sourceMappingURL=tutor.controller.js.map