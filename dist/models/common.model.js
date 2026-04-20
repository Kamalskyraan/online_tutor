"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonModel = void 0;
const helper_1 = require("../utils/helper");
class commonModel {
    convertNullObjectToString(obj) {
        const newObj = {};
        for (const key in obj) {
            newObj[key] = obj[key] === null || obj[key] === undefined ? "" : obj[key];
        }
        return newObj;
    }
    async saveUpload(file, category) {
        const query = `
    INSERT INTO media (pathname, org_name , file_url , file_type, file_size, mime_type)
    VALUES (?, ? , ?, ?, ? , ?)
  `;
        const result = await (0, helper_1.executeQuery)(query, [
            file.key,
            file.originalname,
            `https://${process.env.CLOUDFRONT_URL}/${file.key}`,
            category,
            file.size,
            file.mimetype,
        ]);
        return result.insertId;
    }
    async saveUploadLoc(file, category) {
        const fileUrl = `${process.env.ASSET_URL}/uploads/${file.filename}`;
        const query = `
    INSERT INTO media (pathname, org_name, file_url, file_type, file_size, mime_type)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
        const result = await (0, helper_1.executeQuery)(query, [
            file.filename,
            file.originalname,
            fileUrl,
            category,
            file.size,
            file.mimetype,
        ]);
        return result.insertId;
    }
    async getUploadFiles(ids) {
        const placeholders = ids.map(() => "?").join(",");
        const query = `
    SELECT id, pathname, file_url as url, file_type as category, file_size, org_name
    FROM media
    WHERE id IN (${placeholders})
  `;
        const result = await (0, helper_1.executeQuery)(query, ids);
        return result.map((file) => {
            const formatted = {
                ...file,
                file_size: this.formatFileSize(Number(file.file_size)),
            };
            return this.convertNullObjectToString(formatted);
        });
    }
    formatFileSize(bytes) {
        return `${(bytes / (1024 * 1024)).toFixed(4)} MB`;
    }
    async fetchChatReports() {
        const result = await (0, helper_1.executeQuery)(`SELECT id , name , status FROM report_reasons_chat`);
        return result;
    }
}
exports.commonModel = commonModel;
//# sourceMappingURL=common.model.js.map