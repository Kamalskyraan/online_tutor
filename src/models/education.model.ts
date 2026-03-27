import { EducationLevel, StreamLevel } from "../interface/interface";
import { convertNullToString, executeQuery } from "../utils/helper";

export class EduModel {
  async fetchEducationLvl(filter?: {
    id: number;
    name: string;
    status: string;
  }): Promise<EducationLevel[]> {
    let query = `SELECT id , name, board FROM education_level WHERE 1=1`;
    const params: any[] = [];

    if (filter?.id) {
      query += ` AND id = ?`;
      params.push(filter.id);
    }

    if (filter?.name) {
      query += ` AND name = ?`;
      params.push(filter.name);
    }
    if (filter?.status) {
      query += ` AND status = ?`;
      params.push(filter?.status);
    }
    const result: EducationLevel[] = await executeQuery(query, params);
    return result;
  }
  async fetchStreams(filter?: {
    id: string;
    status: string;
    name: string;
    edu_id: string;
  }) {
    let query = ` SELECT 
      es.id as stream_id,
      es.name,
      es.status,
      el.name as edu_name,
      el.id as edu_id,
      el.board
    FROM education_level el
    LEFT JOIN  
    education_stream es
      ON el.id = es.edu_id
    WHERE 1=1`;
    const params: any[] = [];
    if (filter?.id) {
      query += ` AND  es.id = ?`;
      params.push(filter?.id);
    }
    if (filter?.name) {
      query += ` AND es.name = ?`;
      params.push(filter?.name);
    }
    if (filter?.status) {
      query += ` AND es.status = ?`;
      params.push(filter?.status);
    }
    if (filter?.edu_id) {
      query += ` AND es.edu_id = ?`;
      params.push(filter?.edu_id);
    }
    const result: StreamLevel[] = await executeQuery(query, params);

    return result;
  }

  async fetchStreamsForAll(stream_id: string) {
    if (!stream_id) return [];

    const ids = stream_id
      .toString()
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id));

    if (!ids.length) return [];

    const placeholders = ids.map(() => "?").join(",");

    const result: any = await executeQuery(
      `SELECT 
        es.id as stream_id,
        es.name,
        es.status,
        el.name as edu_name,
        el.id as edu_id,
        el.board
     FROM education_level el
     LEFT JOIN education_stream es
       ON el.id = es.edu_id
     WHERE es.id IN (${placeholders})`,
      ids,
    );

    return convertNullToString(result);
  }
}
