"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsController = void 0;
const helper_1 = require("../utils/helper");
const leads_model_1 = require("../models/leads.model");
const leadsMdl = new leads_model_1.LeadsModel();
class LeadsController {
}
exports.LeadsController = LeadsController;
_a = LeadsController;
LeadsController.getTutorLeads = async (req, res) => {
    try {
        const { tutor_id, lead_id, from_date, to_date, subject_name, locations, leads_type, page = 1, limit = 10, } = req.body;
        if (!tutor_id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "tutor_id is required", []);
        }
        const data = await leadsMdl.fetchLeads({
            tutor_id,
            lead_id,
            from_date,
            to_date,
            subject_name,
            locations,
            leads_type,
            page,
            limit,
        });
        return (0, helper_1.sendResponse)(res, 200, 1, data, "Leads fetched successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
//# sourceMappingURL=leads.controller.js.map