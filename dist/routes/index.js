"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const support_routes_1 = __importDefault(require("./support.routes"));
const source_routes_1 = __importDefault(require("./source.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const education_routes_1 = __importDefault(require("./education.routes"));
const subject_routes_1 = __importDefault(require("./subject.routes"));
const profile_routes_1 = __importDefault(require("./profile.routes"));
const student_routes_1 = __importDefault(require("./student.routes"));
const review_routes_1 = __importDefault(require("./review.routes"));
const common_routes_1 = __importDefault(require("./common.routes"));
const notification_routes_1 = __importDefault(require("./notification.routes"));
const tutor_routes_1 = __importDefault(require("./tutor.routes"));
const multer_1 = require("../config/multer");
const leads_routes_1 = __importDefault(require("./leads.routes"));
const auth_controller_1 = require("../controller/auth.controller");
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/user", user_routes_1.default);
router.use("/profile", profile_routes_1.default);
router.use("/edu", education_routes_1.default);
router.use("/subject", subject_routes_1.default);
router.use("/help", support_routes_1.default);
router.use("/source", source_routes_1.default);
router.use("/tutor", tutor_routes_1.default);
router.use("/student", student_routes_1.default);
router.use("/review", review_routes_1.default);
router.use("/cmn", common_routes_1.default);
router.use("/leads", leads_routes_1.default);
router.use("/notify", notification_routes_1.default);
// common
router.post("/upload", multer_1.upload.single("file"), (req, res) => {
    res.json({
        message: "File uploaded",
        file: req.file,
    });
});
router.post("/upload-multiple", multer_1.upload.array("files", 5), (req, res) => {
    res.json({
        message: "Files uploaded",
        // files: req.files,
    });
});
// justify
router.post("/add-appeal", auth_controller_1.AuthController.addAppeal);
router.post("/check-appeal", auth_controller_1.AuthController.checkAlreadyAppeal);
exports.default = router;
//# sourceMappingURL=index.js.map