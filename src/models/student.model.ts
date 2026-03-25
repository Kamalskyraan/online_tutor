import { Location, TutorLocation } from "../interface/interface";
import { executeQuery } from "../utils/helper";
import { EduModel } from "./education.model";

const eduMdl = new EduModel();
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
  async fetchStudentData(student_id?: string) {
    const student: any = await executeQuery(
      `SELECT student_id ,user_id ,  user_name ,user_id ,  stream_id , learn_course , req_course FROM tutor WHERE tutor_id = ? LIMIT 1`,
      [student_id],
    );

    if (!student.length) return null;
    const studentData = student[0];

    const { user_id, stream_id, learn_course, req_course } = studentData;

    const user: any = await executeQuery(
      `SELECT user_id , user_name , gender , pincode , area , district , state , self_about , address , lat , lng , is_form_filled as personal_form FROM users WHERE user_id = ? LIMIT 1`,
      [user_id],
    );

    const userData = user.length ? user[0] : {};

    let streams = {};
    if (stream_id) {
      streams = await eduMdl.fetchStreamsForAll(stream_id);
    }

    return{
      
    }
  }

  async fetchRequestedCoursesByIds(req_course: string) {
    if (!req_course) return [];

    const ids = req_course
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id));

    if (!ids.length) return [];

    const placeholders = ids.map(() => "?").join(",");

    const result: any = await executeQuery(
      `SELECT id, subject_name 
     FROM learn_course_request 
     WHERE id IN (${placeholders})`,
      ids,
    );

    return result;
  }

  async fetchSubjectsByIds(learn_course: string) {
    if (!learn_course) return [];

    const ids = learn_course
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id));

    if (!ids.length) return [];

    const placeholders = ids.map(() => "?").join(",");

    const result: any = await executeQuery(
      `SELECT id, subject_name 
     FROM subjects 
     WHERE id IN (${placeholders})`,
      ids,
    );

    return result;
  }
}
