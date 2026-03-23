"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorModel = void 0;
const helper_1 = require("../utils/helper");
class TutorModel {
    async insertUpdateDemos(data) {
        const { id, tutor_id, media_type, media_id, title, thumbnail } = data;
        if (id) {
            await (0, helper_1.executeQuery)(`UPDATE tutor_demo_media
       SET 
         tutor_id = ?,
         media_id = ?,
         media_type = ?,
         title = ?,
         thumbnail = ?
       WHERE id = ?`, [
                tutor_id,
                media_id,
                media_type,
                media_type === "video" ? title || null : null,
                media_type === "video" ? thumbnail || null : null,
                id,
            ]);
            return {
                message: "Updated successfully",
            };
        }
        const countRes = await (0, helper_1.executeQuery)(`SELECT COUNT(*) as total 
     FROM tutor_demo_media 
     WHERE tutor_id = ? AND media_type = ?`, [tutor_id, media_type]);
        const count = countRes[0].total;
        if (media_type === "video" && count >= 5) {
            return {
                message: "Only 5 videos maximum upload",
            };
        }
        if (media_type === "image" && count >= 3) {
            return {
                message: "Max 3 images upload",
            };
        }
        await (0, helper_1.executeQuery)(`INSERT INTO tutor_demo_media
     (tutor_id, media_type, media_id, title , thumbnail)
     VALUES (?, ?, ?, ? , ?)`, [
            tutor_id,
            media_type,
            media_id,
            media_type === "video" ? title || null : null,
            media_type === "video" ? thumbnail || null : null,
        ]);
        return {
            message: "Upload successfully",
        };
    }
    async deleteDemos(id) {
        await (0, helper_1.executeQuery)(`DELETE FROM tutor_demo_media WHERE id = ?`, [id]);
        return {
            message: "Demos Deleted Successfully",
        };
    }
    async getDemoVideosAndImages(data) {
        const { tutor_id, media_type, id } = data;
        if (id) {
            const row = await (0, helper_1.executeQuery)(`SELECT id , tutor_id , media_type , media_id , title , thumbnail  FROM tutor_demo_media 
       WHERE id = ? AND tutor_id = ?`, [id, tutor_id]);
            const media = row[0];
            return {
                [media.media_type === "video" ? "videos" : "images"]: [media],
            };
        }
        if (media_type === "video" || media_type === "image") {
            const rows = await (0, helper_1.executeQuery)(`SELECT id , tutor_id , media_type , media_id , title , thumbnail FROM tutor_demo_media
       WHERE tutor_id = ? AND media_type = ?`, [tutor_id, media_type]);
            return {
                [media_type === "video" ? "videos" : "images"]: rows,
            };
        }
        const rows = await (0, helper_1.executeQuery)(`SELECT id , tutor_id , media_type , media_id , title , thumbnail FROM tutor_demo_media WHERE tutor_id = ?`, [tutor_id]);
        const videos = [];
        const images = [];
        for (const row of rows) {
            if (row.media_type === "video") {
                videos.push(row);
            }
            else if (row.media_type === "image") {
                images.push(row);
            }
        }
        return {
            videos,
            images,
        };
    }
}
exports.TutorModel = TutorModel;
//# sourceMappingURL=tutor.model.js.map