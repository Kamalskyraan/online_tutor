"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModel = void 0;
const helper_1 = require("../utils/helper");
class StudentModel {
    async findNearbyTutors(location) {
        const { lat, lng, radius = 25 } = location;
        const query = `
      SELECT user_id , user_name  ,  lat , lng , state , pincode,
      (
        6371 * acos(
          cos(radians(?)) *
          cos(radians(lat)) *
          cos(radians(lng) - radians(?)) +
          sin(radians(?)) *
          sin(radians(lat))
        )
      ) AS distance
      FROM users
      HAVING distance < ?
      ORDER BY distance ASC
    `;
        const [rows] = await (0, helper_1.executeQuery)(query, [lat, lng, lat, radius]);
        return rows;
    }
}
exports.StudentModel = StudentModel;
//# sourceMappingURL=student.model.js.map