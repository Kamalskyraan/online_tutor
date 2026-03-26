"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const s3_1 = require("../service/s3");
const path_1 = __importDefault(require("path"));
exports.upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3_1.s3,
        bucket: process.env.BUCKET_NAME,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const ext = path_1.default.extname(file.originalname).toLowerCase();
            let folder = "others";
            // if (file.mimetype.startsWith("image/")) {
            //   folder = "image";
            // } else if (file.mimetype.startsWith("video/")) {
            //   folder = "video";
            // } else if (file.mimetype === "application/pdf") {
            //   folder = "pdf";
            // } else if (
            //   file.mimetype === "application/msword" ||
            //   file.mimetype ===
            //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            // ) {
            //   folder = "docs";
            // } else {
            //   return cb(new Error("Invalid file type"));
            // }
            if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) {
                folder = "image";
            }
            else if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) {
                folder = "video";
            }
            else if ([".pdf"].includes(ext)) {
                folder = "pdf";
            }
            else if ([".doc", ".docx"].includes(ext)) {
                folder = "docs";
            }
            else if ([".xls", ".xlsx", ".csv"].includes(ext)) {
                folder = "excel";
            }
            else {
                return cb(new Error("Invalid file type"));
            }
            const uniqueName = folder +
                "/" +
                Date.now() +
                "-" +
                Math.round(Math.random() * 1e9) +
                path_1.default.extname(file.originalname);
            cb(null, uniqueName);
        },
    }),
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
});
//# sourceMappingURL=multer.js.map