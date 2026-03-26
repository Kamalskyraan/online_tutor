import { executeQuery } from "../utils/helper";

export class commonModel {
  convertNullObjectToString(obj: any) {
    const newObj: any = {};

    for (const key in obj) {
      newObj[key] = obj[key] === null || obj[key] === undefined ? "" : obj[key];
    }

    return newObj;
  }

  async saveUpload(file: Express.MulterS3.File, category: string) {
    const query = `
    INSERT INTO media (pathname, org_name , file_url , file_type, file_size, mime_type)
    VALUES (?, ? , ?, ?, ? , ?)
  `;

    const result: any = await executeQuery(query, [
      file.key,
      file.originalname,
      `${process.env.CLOUDFRONT_URL}/${file.key}`,
      category,
      file.size,
      file.mimetype,
    ]);

    return result.insertId;
  }

  async getUploadFiles(ids: number[]) {
    const placeholders = ids.map(() => "?").join(",");

    const query = `
    SELECT id, pathname, file_url, file_type, file_size
    FROM media
    WHERE id IN (${placeholders})
  `;

    const result = await executeQuery(query, ids);

    return result;
  }
}
