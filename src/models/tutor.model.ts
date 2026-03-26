import { getDemosBody } from "../interface/interface";
import { executeQuery } from "../utils/helper";
import { EduModel } from "./education.model";
const eduMdl = new EduModel();
export class TutorModel {
  async insertUpdateDemos(data: any) {
    const { id, tutor_id, media_type, media_id, title, thumbnail } = data;

    if (id) {
      await executeQuery(
        `UPDATE tutor_demo_media
       SET 
         tutor_id = ?,
         media_id = ?,
         media_type = ?,
         title = ?,
         thumbnail = ?
       WHERE id = ?`,
        [
          tutor_id,
          media_id,
          media_type,
          media_type === "video" ? title || null : null,
          media_type === "video" ? thumbnail || null : null,
          id,
        ],
      );

      return {
        message: "Updated successfully",
      };
    }

    const countRes: any = await executeQuery(
      `SELECT COUNT(*) as total 
     FROM tutor_demo_media 
     WHERE tutor_id = ? AND media_type = ?`,
      [tutor_id, media_type],
    );

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

    await executeQuery(
      `INSERT INTO tutor_demo_media
     (tutor_id, media_type, media_id, title , thumbnail)
     VALUES (?, ?, ?, ? , ?)`,
      [
        tutor_id,
        media_type,
        media_id,
        media_type === "video" ? title || null : null,
        media_type === "video" ? thumbnail || null : null,
      ],
    );

    return {
      message: "Upload successfully",
    };
  }
  async deleteDemos(id: number) {
    await executeQuery(`DELETE FROM tutor_demo_media WHERE id = ?`, [id]);
    return {
      message: "Demos Deleted Successfully",
    };
  }
  async getDemoVideosAndImages(data: getDemosBody) {
    const { tutor_id, media_type, id } = data;

    if (id) {
      const row: any = await executeQuery(
        `SELECT id , tutor_id , media_type , media_id , title , thumbnail  FROM tutor_demo_media 
       WHERE id = ? AND tutor_id = ?`,
        [id, tutor_id],
      );

      const media = row[0];

      return {
        [media.media_type === "video" ? "videos" : "images"]: [media],
      };
    }
    if (media_type === "video" || media_type === "image") {
      const rows: any = await executeQuery(
        `SELECT id , tutor_id , media_type , media_id , title , thumbnail FROM tutor_demo_media
       WHERE tutor_id = ? AND media_type = ?`,
        [tutor_id, media_type],
      );

      return {
        [media_type === "video" ? "videos" : "images"]: rows,
      };
    }

    const rows: any = await executeQuery(
      `SELECT id , tutor_id , media_type , media_id , title , thumbnail FROM tutor_demo_media WHERE tutor_id = ?`,
      [tutor_id],
    );

    const videos = [];
    const images = [];
    for (const row of rows) {
      if (row.media_type === "video") {
        videos.push(row);
      } else if (row.media_type === "image") {
        images.push(row);
      }
    }

    return {
      videos,
      images,
    };
  }
  async fetchTutorData(tutor_id: string) {
    const tutor: any = await executeQuery(
      `SELECT tutor_id ,user_id ,  user_name , represent , stream_id  FROM tutor WHERE tutor_id = ? LIMIT 1`,
      [tutor_id],
    );

    if (!tutor.length) return [];

    const tutorData = tutor[0];

    const { user_id, stream_id } = tutorData;

    const user: any = await executeQuery(
      `SELECT user_id , user_name , gender , pincode , area , district , state , self_about , address , lat , lng , is_form_filled as personal_form , is_show_num  FROM users WHERE user_id = ? LIMIT 1`,
      [user_id],
    );

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
}
