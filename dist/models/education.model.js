"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EduModel = void 0;
const helper_1 = require("../utils/helper");
class EduModel {
    async fetchEducationLvl(filter) {
        let query = `SELECT id , name, board FROM education_level WHERE 1=1`;
        const params = [];
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
        const result = await (0, helper_1.executeQuery)(query, params);
        return result;
    }
    async fetchStreams(filter) {
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
        const params = [];
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
        const result = await (0, helper_1.executeQuery)(query, params);
        return result;
    }
    async fetchStreamsForAll(stream_id) {
        if (!stream_id)
            return [];
        const ids = stream_id
            .toString()
            .split(",")
            .map((id) => Number(id.trim()))
            .filter((id) => !isNaN(id));
        if (!ids.length)
            return [];
        const placeholders = ids.map(() => "?").join(",");
        const result = await (0, helper_1.executeQuery)(`SELECT 
        es.id as stream_id,
        es.name,
        es.status,
        el.name as edu_name,
        el.id as edu_id,
        el.board
     FROM education_level el
     LEFT JOIN education_stream es
       ON el.id = es.edu_id
     WHERE es.id IN (${placeholders})`, ids);
        return (0, helper_1.convertNullToString)(result);
    }
}
exports.EduModel = EduModel;
//# sourceMappingURL=education.model.js.map