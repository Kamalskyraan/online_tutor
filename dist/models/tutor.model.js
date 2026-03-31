"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorModel = void 0;
const helper_1 = require("../utils/helper");
const common_model_1 = require("./common.model");
const education_model_1 = require("./education.model");
const student_model_1 = require("./student.model");
const eduMdl = new education_model_1.EduModel();
const stuMdl = new student_model_1.StudentModel();
const cmnModel = new common_model_1.commonModel();
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
    // async getDemoVideosAndImages(data: getDemosBody) {
    //   const { tutor_id, media_type, id } = data;
    //   if (id) {
    //     const row: any = await executeQuery(
    //       `SELECT id , tutor_id , media_type , media_id , title , thumbnail  FROM tutor_demo_media
    //      WHERE id = ? AND tutor_id = ?`,
    //       [id, tutor_id],
    //     );
    //     const media = row[0];
    //     return {
    //       [media.media_type === "video" ? "videos" : "images"]: [media],
    //     };
    //   }
    //   if (media_type === "video" || media_type === "image") {
    //     const rows: any = await executeQuery(
    //       `SELECT id , tutor_id , media_type , media_id , title , thumbnail FROM tutor_demo_media
    //      WHERE tutor_id = ? AND media_type = ?`,
    //       [tutor_id, media_type],
    //     );
    //     return {
    //       [media_type === "video" ? "videos" : "images"]: rows,
    //     };
    //   }
    //   const rows: any = await executeQuery(
    //     `SELECT id , tutor_id , media_type , media_id , title , thumbnail FROM tutor_demo_media WHERE tutor_id = ?`,
    //     [tutor_id],
    //   );
    //   const videos = [];
    //   const images = [];
    //   for (const row of rows) {
    //     if (row.media_type === "video") {
    //       videos.push(row);
    //     } else if (row.media_type === "image") {
    //       images.push(row);
    //     }
    //   }
    //   return {
    //     videos,
    //     images,
    //   };
    // }
    async getDemoVideosAndImages(data) {
        const { tutor_id, media_type, id } = data;
        let rows = [];
        if (id) {
            const result = await (0, helper_1.executeQuery)(`SELECT id, tutor_id, media_type, media_id, title, thumbnail 
       FROM tutor_demo_media 
       WHERE id = ? AND tutor_id = ?`, [id, tutor_id]);
            rows = result;
        }
        else if (media_type === "video" || media_type === "image") {
            rows = await (0, helper_1.executeQuery)(`SELECT id, tutor_id, media_type, media_id, title, thumbnail 
       FROM tutor_demo_media
       WHERE tutor_id = ? AND media_type = ?`, [tutor_id, media_type]);
        }
        else {
            rows = await (0, helper_1.executeQuery)(`SELECT id, tutor_id, media_type, media_id, title, thumbnail 
       FROM tutor_demo_media 
       WHERE tutor_id = ?`, [tutor_id]);
        }
        if (!rows || rows.length === 0) {
            return { videos: [], images: [] };
        }
        const allIds = rows
            .flatMap((row) => [row.media_id, row.thumbnail])
            .filter((id) => id);
        let filesMap = {};
        if (allIds.length > 0) {
            const uniqueIds = [...new Set(allIds)];
            const files = await cmnModel.getUploadFiles(uniqueIds);
            filesMap = files.reduce((acc, file) => {
                acc[file.id] = file;
                return acc;
            }, {});
        }
        const videos = [];
        const images = [];
        for (const row of rows) {
            const formatted = {
                id: row.id,
                tutor_id: row.tutor_id,
                media_type: row.media_type,
                title: row.title,
                media: filesMap[row.media_id] ? [filesMap[row.media_id]] : [],
                thumbnail: filesMap[row.thumbnail] ? [filesMap[row.thumbnail]] : [],
            };
            if (row.media_type === "video") {
                videos.push(cmnModel.convertNullObjectToString(formatted));
            }
            else if (row.media_type === "image") {
                images.push(cmnModel.convertNullObjectToString(formatted));
            }
        }
        if (id) {
            return {
                [rows[0].media_type === "video" ? "videos" : "images"]: rows[0].media_type === "video" ? videos : images,
            };
        }
        if (media_type === "video") {
            return { videos };
        }
        if (media_type === "image") {
            return { images };
        }
        return {
            videos,
            images,
        };
    }
    async fetchTutorData(tutor_id) {
        const tutor = await (0, helper_1.executeQuery)(`SELECT tutor_id ,user_id ,  user_name , represent , stream_id  FROM tutor WHERE tutor_id = ? LIMIT 1`, [tutor_id]);
        if (!tutor.length)
            return [];
        const tutorData = tutor[0];
        const { user_id, stream_id } = tutorData;
        const user = await (0, helper_1.executeQuery)(`SELECT user_id , user_name , gender , pincode , area , district , state , self_about , address , lat , lng , is_form_filled as personal_form , is_show_num  FROM users WHERE user_id = ? LIMIT 1`, [user_id]);
        const userData = user.length ? user[0] : {};
        let streams = {};
        if (stream_id) {
            streams = await eduMdl.fetchStreamsForAll(stream_id);
        }
        return {
            ...tutorData,
            ...userData,
            streams,
        };
    }
    async fetchFirstSub(mobile) {
        const res = await (0, helper_1.executeQuery)(`
    SELECT 
      u.user_id, 
      t.tutor_id,
      ts.*
    FROM users u
    LEFT JOIN tutor t ON t.user_id = u.user_id
    LEFT JOIN tutor_subjects ts ON ts.tutor_id = t.tutor_id
    WHERE u.mobile = ?
    LIMIT 1
    `, [mobile]);
        return res;
    }
    async getTutorById(tutor_id) {
        const query = `
    SELECT 
      u.user_id,
      u.user_name,
      u.lat,
      u.lng,
      u.state,
      u.district,
      u.area,
      u.pincode,
      u.mobile,
      u.is_show_num,
      u.self_about,
      u.profile_img,
      t.tutor_id,
      t.stream_id,
      t.represent
    FROM users u
    RIGHT JOIN tutor t ON t.user_id = u.user_id
    RIGHT JOIN tutor_subjects ts 
      ON ts.tutor_id = t.tutor_id 
      AND ts.status = 'active'
    WHERE t.tutor_id = ?
    LIMIT 1
  `;
        const rows = await (0, helper_1.executeQuery)(query, [tutor_id]);
        if (!rows.length)
            return null;
        const data = await stuMdl.buildTutorFullDatasForId(rows);
        const tutor = data[0];
        const demoMedia = await (0, helper_1.executeQuery)(`SELECT id, media_type, media_id, title, thumbnail 
     FROM tutor_demo_media 
     WHERE tutor_id = ?`, [tutor_id]);
        const mediaIds = [
            ...new Set(demoMedia
                .flatMap((item) => [item.media_id, item.thumbnail])
                .filter(Boolean)),
        ];
        let mediaData = [];
        if (mediaIds.length) {
            const placeholders = mediaIds.map(() => "?").join(",");
            mediaData = await (0, helper_1.executeQuery)(`SELECT id, file_type, file_url, pathname, org_name 
       FROM media 
       WHERE id IN (${placeholders})`, mediaIds);
        }
        const mediaMap = new Map();
        mediaData.forEach((file) => {
            mediaMap.set(Number(file.id), {
                id: (0, helper_1.convertNullToString)(file.id),
                file_type: (0, helper_1.convertNullToString)(file.file_type),
                pathname: (0, helper_1.convertNullToString)(file.pathname),
                org_name: (0, helper_1.convertNullToString)(file.org_name),
                file_url: (0, helper_1.convertNullToString)(file.file_url) ??
                    (0, helper_1.convertNullToString)(file.file_url),
            });
        });
        const images = [];
        const videos = [];
        demoMedia.forEach((item) => {
            const mainMedia = mediaMap.get(Number(item.media_id));
            const thumbnailMedia = mediaMap.get(Number(item.thumbnail));
            if (!mainMedia)
                return;
            const responseObj = {
                id: (0, helper_1.convertNullToString)(item.id),
                title: (0, helper_1.convertNullToString)(item.title),
                media_id: (0, helper_1.convertNullToString)(item.media_id),
                thumbnail_id: (0, helper_1.convertNullToString)(item.thumbnail),
                file: (0, helper_1.convertNullToString)(mainMedia),
                thumbnail: thumbnailMedia ? (0, helper_1.convertNullToString)(thumbnailMedia) : null,
            };
            if (item.media_type === "image") {
                images.push(responseObj);
            }
            else if (item.media_type === "video") {
                videos.push(responseObj);
            }
            else {
                const type = mainMedia.file_type?.toLowerCase();
                if (type?.includes("image"))
                    images.push(responseObj);
                else if (type?.includes("video"))
                    videos.push(responseObj);
            }
        });
        tutor.demo_media = {
            images,
            videos,
        };
        return (0, helper_1.convertNullToString)(tutor);
    }
    async addUpdateLikeForTutor(tutor_id, student_id, status) {
        const existing = await (0, helper_1.executeQuery)(`SELECT is_like FROM tutor_likes WHERE tutor_id = ? AND student_id = ?`, [tutor_id, student_id]);
        if (!existing.length) {
            await (0, helper_1.executeQuery)(`INSERT INTO tutor_likes (tutor_id, student_id, is_like) VALUES (?, ?, ?)`, [tutor_id, student_id, status]);
            return { action: "liked/disliked" };
        }
        if (existing[0].status === status) {
            await (0, helper_1.executeQuery)(`DELETE FROM tutor_likes WHERE tutor_id = ? AND student_id = ?`, [tutor_id, student_id]);
            return { action: "removed" };
        }
        await (0, helper_1.executeQuery)(`UPDATE tutor_likes SET is_like = ? WHERE tutor_id = ? AND student_id = ?`, [status, tutor_id, student_id]);
        return { action: "updated" };
    }
    async fetchTutorRequests(tutor_id) {
        const result = await (0, helper_1.executeQuery)(`SELECT 
    tsr.*,
    u.user_id,
    u.user_name,
    u.area,
    u.state,
    u.district,
    u.pincode,
    u.mobile,
    u.profile_img
  FROM tutor_student_rel tsr
  LEFT JOIN student s ON s.student_id = tsr.student_id
  LEFT JOIN users u ON u.user_id = s.user_id
  WHERE tsr.tutor_id = ?`, [tutor_id]);
        if (!result || result.length === 0) {
            return [];
        }
        const profileImgIds = result
            .map((row) => row.profile_img)
            .filter((id) => id);
        let fileMap = {};
        if (profileImgIds.length > 0) {
            const uniqueIds = [...new Set(profileImgIds)];
            const files = await cmnModel.getUploadFiles(uniqueIds);
            fileMap = files.reduce((acc, file) => {
                acc[file.id] = file;
                return acc;
            }, {});
        }
        const finalData = result.map((row) => {
            const formatted = {
                ...row,
                profile_img: fileMap[row.profile_img] ? [fileMap[row.profile_img]] : [],
            };
            return cmnModel.convertNullObjectToString(formatted);
        });
        return finalData;
    }
}
exports.TutorModel = TutorModel;
//# sourceMappingURL=tutor.model.js.map