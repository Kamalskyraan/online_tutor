import { Location, TutorLocation } from "../interface/interface";
import { executeQuery } from "../utils/helper";

export class StudentModel {
  public async findNearbyTutors(location: Location): Promise<TutorLocation[]> {
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

    const [rows] = await executeQuery(query, [lat, lng, lat, radius]);
    return rows as TutorLocation[];
  }
}
