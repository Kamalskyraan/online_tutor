"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsController = void 0;
const helper_1 = require("../utils/helper");
class LeadsController {
}
exports.LeadsController = LeadsController;
_a = LeadsController;
LeadsController.getTutorLeads = async (req, res) => {
    try {
        const { tutor_id, lead_id, from_date, to_date, subject_name, locations, leads_type, } = req.body;
        //   const leadsData = await 
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
            err.errors || err.message || err,
        ]);
    }
};
//# sourceMappingURL=leads.controller.js.map