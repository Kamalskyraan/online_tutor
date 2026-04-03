"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsController = void 0;
const helper_1 = require("../utils/helper");
const leads_model_1 = require("../models/leads.model");
const tutor_model_1 = require("../models/tutor.model");
const leadsMdl = new leads_model_1.LeadsModel();
const tutModel = new tutor_model_1.TutorModel();
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
LeadsController.setViewMobileLeads = async (req, res) => {
    try {
        const { tutor_id, student_id } = req.body;
        if (!tutor_id || !student_id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "tutor_id and student_id are required", []);
        }
        const result = await tutModel.updateMobileViewStatusInLeads(tutor_id, student_id);
        if (result.affectedRows === 0) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "No record found to update", []);
        }
        return (0, helper_1.sendResponse)(res, 200, 1, [], "Mobile view status updated successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
LeadsController.getLeadsLocations = async (req, res) => {
    try {
        const { tutor_id, from_date, to_date, leads_type, search_subject, page = 1, limit = 5, } = req.body;
        if (!tutor_id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "tutor_id is required", []);
        }
        const result = await leadsMdl.fetchLeadsLocations({
            tutor_id,
            from_date,
            to_date,
            leads_type,
            search_subject,
            page,
            limit,
        });
        return (0, helper_1.sendResponse)(res, 200, 1, {
            data: result.data,
            total: result.total,
            page: result.page,
            limit: result.limit,
        }, "Locations fetched successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
LeadsController.setReadStatus = async (req, res) => {
    try {
        const { lead_id } = req.body;
        if (!lead_id) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "Lead ID is required", []);
        }
        const result = await leadsMdl.setReadStatus(lead_id);
        if (result.affectedRows === 0) {
            return (0, helper_1.sendResponse)(res, 200, 0, [], "No record found to update", []);
        }
        return (0, helper_1.sendResponse)(res, 200, 1, [], "Mobile view status updated successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
//# sourceMappingURL=leads.controller.js.map