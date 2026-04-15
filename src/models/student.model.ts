import { studentBookClass } from "../interface/interface";
import { convertNullToString, executeQuery } from "../utils/helper";
import { commonModel } from "./common.model";
import { EduModel } from "./education.model";
import { ReviewModel } from "./review.model";

const eduMdl = new EduModel();
const rvMdl = new ReviewModel();
const cmnMdl = new commonModel();
export class StudentModel {
  public async findNearbyTutors(location: any): Promise<any> {
    const {
      lat,
      lng,
      search_address,
      search_subject,
      page = 1,
      limit = 5,
      rating,
      gender,
      represent,
      min_fee,
      max_fee,
      tenure_type,
      class_mode,
      class_type,
      languages,
      student_id,
    } = location;

    const offset = (page - 1) * limit;

    let params: any[] = [];
    let where = `WHERE u.is_deleted = 0 AND ts.status = 'active'`;
    let having = "";
    let orderBy = "";
    let distanceField = "";

    if (lat && lng) {
      distanceField = `,
    (6371 * acos(
      cos(radians(?)) *
      cos(radians(u.lat)) *
      cos(radians(u.lng) - radians(?)) +
      sin(radians(?)) *
      sin(radians(u.lat))
    )) AS distance`;

      params.push(lat, lng, lat);
      where += ` AND u.lat IS NOT NULL AND u.lng IS NOT NULL`;
    }

    if (search_address) {
      const search = `%${search_address}%`;
      where += ` AND (u.state LIKE ? OR u.district LIKE ? OR u.area LIKE ? OR u.pincode LIKE ?)`;
      params.push(search, search, search, search);
    }

    if (search_subject) {
      const search = `%${search_subject}%`;
      where += ` AND (s.subject_name LIKE ? OR ts.subject_name LIKE ?)`;
      params.push(search, search);
    }

    if (gender) {
      where += ` AND u.gender = ?`;
      params.push(gender);
    }

    if (represent) {
      const reps = represent.split(",");
      where += ` AND t.represent IN (${reps.map(() => "?").join(",")})`;
      params.push(...reps);
    }

    if (min_fee) {
      where += ` AND ts.min_fee >= ?`;
      params.push(min_fee);
    }

    if (max_fee) {
      where += ` AND ts.max_fee <= ?`;
      params.push(max_fee);
    }

    if (tenure_type) {
      where += ` AND ts.tenure_type = ?`;
      params.push(tenure_type);
    }

    if (class_mode) {
      where += ` AND ts.class_mode = ?`;
      params.push(class_mode);
    }

    if (class_type) {
      where += ` AND ts.class_type = ?`;
      params.push(class_type);
    }

    if (languages?.length) {
      where += ` AND (${languages.map(() => `FIND_IN_SET(?, ts.teach_language)`).join(" OR ")})`;
      params.push(...languages);
    }

    if (rating !== undefined) {
      const ratingValue = Number(rating);

      having = `
      HAVING avg_rating >= ? AND avg_rating < ?
    `;
      params.push(ratingValue, ratingValue + 1);
    }

    orderBy = `
    ORDER BY 
      ${lat && lng ? "distance ASC," : ""}
      avg_rating DESC
  `;

    const query = `
    SELECT 
      u.user_id,
      u.user_name,
      u.lat,
      u.lng,
      u.gender,
      u.profile_img,
      u.state,
      u.district,
      u.area,
      u.pincode,
      u.self_about,

      t.tutor_id,
      t.represent,

     
      (
        SELECT AVG(r2.rating)
        FROM reviews r2
        WHERE r2.tutor_id = t.tutor_id
      ) AS avg_rating,

      CASE 
        WHEN EXISTS (
          SELECT 1 FROM tutor_leads tl2
          WHERE tl2.tutor_id = t.tutor_id
          AND tl2.student_id = ?
          AND tl2.lead_type = 'profile'
        ) THEN 0 ELSE 1
      END AS is_new,

      CASE 
        WHEN EXISTS (
          SELECT 1 FROM tutor_likes tl
          WHERE tl.tutor_id = t.tutor_id
          AND tl.student_id = ?
          AND tl.is_like = 1
        ) THEN 1 ELSE 0
      END AS is_like

      ${distanceField}

    FROM users u
    JOIN tutor t ON t.user_id = u.user_id
    JOIN tutor_subjects ts ON ts.tutor_id = t.tutor_id
    LEFT JOIN subjects s ON s.id = ts.subject_id

    ${where}

    GROUP BY t.tutor_id

    ${having}
    ${orderBy}

    LIMIT ? OFFSET ?
  `;

    const finalParams = [
      student_id || "",
      student_id || "",
      ...params,
      limit,
      offset,
    ];

    const rows: any = await executeQuery(query, finalParams);

    const uniqueMap = new Map();
    rows.forEach((r: any) => {
      if (!uniqueMap.has(r.tutor_id)) {
        uniqueMap.set(r.tutor_id, r);
      }
    });

    const uniqueRows = Array.from(uniqueMap.values());

    const data = await this.buildTutorFullData(uniqueRows, search_subject);

    return {
      data,
      pagination: {
        total: uniqueRows.length,
        page,
        limit,
        total_pages: Math.ceil(uniqueRows.length / limit),
      },
    };
  }

  async fetchStudentData(student_id?: string) {
    const student: any = await executeQuery(
      `SELECT student_id, user_id, user_name, stream_id, learn_course, req_course 
     FROM student 
     WHERE student_id = ? 
     LIMIT 1`,
      [student_id],
    );

    if (!student.length) return null;

    const studentData = student[0];
    const { user_id, stream_id, learn_course, req_course } = studentData;

    const user: any = await executeQuery(
      `SELECT user_id, user_name, gender, pincode, area, district, state, 
            self_about, address, lat, lng, 
            is_form_filled as personal_form 
     FROM users 
     WHERE user_id = ? 
     LIMIT 1`,
      [user_id],
    );

    const userData = user.length ? user[0] : {};

    let streams = {};
    if (stream_id) {
      streams = await eduMdl.fetchStreamsForAll(stream_id);
    }

    let learnCourses: any[] = [];
    if (learn_course) {
      learnCourses = await this.fetchSubjectsByIds(learn_course);
    }

    let requestedCourses: any[] = [];
    if (req_course) {
      requestedCourses = await this.fetchRequestedCoursesByIds(req_course);
    }

    return {
      ...studentData,
      user: userData,
      streams,
      learn_courses: learnCourses,
      requested_courses: requestedCourses,
    };
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

  //

  async buildTutorFullData(rows: any[], search_subject?: string) {
    const safeParse = (data: any) => {
      try {
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    };

    //
    const allStreamIds = rows
      .map((r: any) => r.stream_id)
      .filter(Boolean)
      .join(",");

    const streams = await eduMdl.fetchStreamsForAll(allStreamIds);

    const streamMap = new Map();
    streams.forEach((s: any) => {
      streamMap.set(s.stream_id, s);
    });

    //
    const tutorIds = rows.map((r: any) => r.tutor_id).filter(Boolean);

    let subjectRows: any[] = [];
    if (tutorIds.length) {
      const placeholders = tutorIds.map(() => "?").join(",");
      subjectRows = await executeQuery(
        `
      SELECT ts.*, s.subject_name as db_subject_name 
      FROM tutor_subjects ts
      LEFT JOIN subjects s ON s.id = ts.subject_id
      WHERE ts.tutor_id IN (${placeholders})
      AND ts.status = 'active'
      `,
        tutorIds,
      );
    }

    const subjectMap = new Map();

    subjectRows.forEach((sub: any) => {
      if (!subjectMap.has(sub.tutor_id)) {
        subjectMap.set(sub.tutor_id, []);
      }

      subjectMap.get(sub.tutor_id).push({
        id: sub.id,
        sub: [
          {
            id: sub.subject_id || "",
            subject_name: sub.db_subject_name || sub.subject_name,
            covered_topics: safeParse(sub.covered_topics),
            min_fee: sub.min_fee,
            max_fee: sub.max_fee,
            tenure_type: sub.tenure_type,
            class_mode: sub.class_mode,
            class_type: sub.class_type,
          },
        ],
      });

      if (search_subject) {
        const search = search_subject.toLowerCase();

        subjectMap.forEach((subjects: any[]) => {
          subjects.sort((a, b) => {
            const aName = a.sub[0].subject_name?.toLowerCase() || "";
            const bName = b.sub[0].subject_name?.toLowerCase() || "";

            const aMatch = aName.includes(search) ? 1 : 0;
            const bMatch = bName.includes(search) ? 1 : 0;

            return bMatch - aMatch;
          });
        });
      }
    });

    //
    const ratingMap = new Map();
    await Promise.all(
      tutorIds.map(async (id: string) => {
        const rating = await rvMdl.getReviewSummary(id);
        ratingMap.set(id, rating);
      }),
    );

    let finalData = rows.map((row: any) => ({
      ...row,
      stream: row.stream_id
        ? streamMap.get(Number(row.stream_id)) || null
        : null,
      subjects: subjectMap.get(row.tutor_id) || [],
      ...(ratingMap.get(row.tutor_id) || {
        average_rating: 0,
        total_reviews: 0,
      }),
    }));

    const fileIds = finalData.map((r: any) => r.profile_img).filter(Boolean);

    let fileMap = new Map();

    if (fileIds.length) {
      const files = await cmnMdl.getUploadFiles(fileIds);

      files.forEach((file: any) => {
        fileMap.set(file.id, file);
      });
    }

    finalData = finalData.map((row: any) => {
      const file = fileMap.get(Number(row.profile_img));

      return {
        ...row,
        profile_img: file ? [file] : [],
      };
    });

    return convertNullToString(finalData);
  }

  async buildTutorFullDatasForId(rows: any[], student_id?: string) {
    const safeParse = (data: any) => {
      try {
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    };

    const allStreamIds = rows
      .map((r: any) => r.stream_id)
      .filter(Boolean)
      .join(",");

    const streams = await eduMdl.fetchStreamsForAll(allStreamIds);

    const streamMap = new Map();

    streams.forEach((s: any) => {
      streamMap.set(Number(s.stream_id), s);
    });

    const tutorIds = rows.map((r: any) => r.tutor_id).filter(Boolean);

    let subjectRows: any[] = [];

    if (tutorIds.length) {
      const placeholders = tutorIds.map(() => "?").join(",");
      const studentParam = student_id || 0;
      subjectRows = await executeQuery(
        `
      SELECT ts.*, s.subject_name as db_subject_name,
      IFNULL(tsr.id, 0) AS booking_id,

      CASE 
    WHEN tsr.id IS NULL THEN 'no_booking'
    ELSE tsr.status
   END AS booking_status
  
      FROM tutor_subjects ts

      LEFT JOIN subjects s ON s.id = ts.subject_id

      LEFT JOIN tutor_student_rel tsr 
  ON tsr.tutor_id = ts.tutor_id
  AND tsr.linked_sub = ts.id
  AND tsr.student_id = ?
   AND (tsr.status NOT IN ('cancelled', 'rejected') OR tsr.id IS NULL)

      WHERE ts.tutor_id IN (${placeholders})
      AND ts.status = 'active'
      `,
        [studentParam, ...tutorIds],
      );
    }

    const allSylabusIds = new Set<number>();
    const allLanguageIds = new Set<number>();
    const allSubjectStreamIds = new Set<number>();

    subjectRows.forEach((sub: any) => {
      if (sub.sylabus) {
        allSylabusIds.add(Number(sub.sylabus));
      }

      if (sub.teach_language) {
        sub.teach_language.split(",").forEach((id: string) => {
          if (id) allLanguageIds.add(Number(id));
        });
      }

      if (sub.stream_ids) {
        sub.stream_ids.split(",").forEach((id: string) => {
          if (id) allSubjectStreamIds.add(Number(id));
        });
      }
    });

    let sylabusData: any[] = [];
    if (allSylabusIds.size) {
      const ids = [...allSylabusIds];
      const placeholders = ids.map(() => "?").join(",");
      sylabusData = await executeQuery(
        `SELECT id, file_type, file_url, pathname, org_name 
       FROM media 
       WHERE id IN (${placeholders})`,
        ids,
      );
    }

    let languageData: any[] = [];
    if (allLanguageIds.size) {
      const ids = [...allLanguageIds];
      const placeholders = ids.map(() => "?").join(",");
      languageData = await executeQuery(
        `SELECT id, lang_name FROM languages WHERE id IN (${placeholders})`,
        ids,
      );
    }

    const subjectStreams = await eduMdl.fetchStreamsForAll(
      [...allSubjectStreamIds].join(","),
    );

    const sylabusMap = new Map();
    sylabusData.forEach((f: any) => {
      sylabusMap.set(Number(f.id), [
        {
          id: f.id || "",
          file_type: f.file_type || "",
          pathname: f.pathname || "",
          org_name: f.org_name || "",
          file_url: f.file_url ? f.file_url : [],
        },
      ]);
    });

    const languageMap = new Map();
    languageData.forEach((l: any) => {
      languageMap.set(Number(l.id), {
        id: l.id || "",
        lang_name: l.lang_name || "",
      });
    });

    const subjectStreamMap = new Map();
    subjectStreams.forEach((s: any) => {
      subjectStreamMap.set(Number(s.stream_id), s);
    });

    const subjectMap = new Map();

    subjectRows.forEach((sub: any) => {
      if (!subjectMap.has(sub.tutor_id)) {
        subjectMap.set(sub.tutor_id, []);
      }

      subjectMap.get(sub.tutor_id).push({
        id: sub.id || "",
        sub: [
          {
            id: sub.subject_id || "",
            subject_name: sub.db_subject_name || sub.subject_name || "",
            booking_status: sub.booking_status,
            booking_id: sub.booking_id,
            covered_topics: safeParse(sub.covered_topics),

            min_fee: sub.min_fee || "",
            max_fee: sub.max_fee || "",
            tenure_type: sub.tenure_type || "",
            class_mode: sub.class_mode || "",
            class_type: sub.class_type || "",

            sylabus: sub.sylabus
              ? sylabusMap.get(Number(sub.sylabus)) || []
              : [],

            teach_language: sub.teach_language
              ? sub.teach_language
                  .split(",")
                  .map((id: string) => languageMap.get(Number(id)) || [])
                  .filter((v: any) => Object.keys(v).length)
              : [],

            stream_ids: sub.stream_ids
              ? sub.stream_ids
                  .split(",")
                  .map((id: string) => subjectStreamMap.get(Number(id)) || [])
                  .filter((v: any) => Object.keys(v).length)
              : [],

            prior_exp: sub.prior_exp || "",
            exp_year: sub.exp_year || "",
            exp_month: sub.exp_month || "",
          },
        ],
      });
    });

    const ratingMap = new Map();

    await Promise.all(
      tutorIds.map(async (id: string) => {
        const rating = await rvMdl.getReviewSummary(id);
        ratingMap.set(id, rating);
      }),
    );

    let finalData = rows.map((row: any) => ({
      ...row,
      stream: row.stream_id ? streamMap.get(Number(row.stream_id)) || {} : {},

      subjects: subjectMap.get(row.tutor_id) || [],

      ...(ratingMap.get(row.tutor_id) || {
        average_rating: 0,
        total_reviews: 0,
      }),
    }));

    const fileIds = finalData.map((r: any) => r.profile_img).filter(Boolean);

    let fileData: any[] = [];

    if (fileIds.length) {
      const placeholders = fileIds.map(() => "?").join(",");
      fileData = await executeQuery(
        `SELECT id, file_type, file_url, pathname, org_name 
       FROM media 
       WHERE id IN (${placeholders})`,
        fileIds,
      );
    }

    const fileMap = new Map();

    fileData.forEach((file: any) => {
      fileMap.set(Number(file.id), {
        id: file.id || "",
        file_type: file.file_type || "",
        pathname: file.pathname || "",
        org_name: file.org_name || "",
        file_url: file.file_url ? `${file.file_url}` : "",
      });
    });

    finalData = finalData.map((row: any) => ({
      ...row,
      profile_img:
        Number(row.profile_img) > 0 && fileMap.get(Number(row.profile_img))
          ? [fileMap.get(Number(row.profile_img))]
          : [],
    }));

    return finalData;
  }

  //
  // async studentClassBooking(data: studentBookClass) {
  //   const { booking_id, student_id, tutor_id, linked_sub } = data;

  //   const subjectCheck: any = await executeQuery(
  //     `
  //   SELECT id, status
  //   FROM tutor_subjects
  //   WHERE id = ? AND tutor_id = ?
  //   `,
  //     [linked_sub, tutor_id],
  //   );

  //   if (!subjectCheck.length || subjectCheck[0].status !== "active") {
  //     return {
  //       status: "failed",
  //       message: "Tutor deleted this subject",
  //     };
  //   }

  //   const existing: any = await executeQuery(
  //     `
  //   SELECT id, status
  //   FROM tutor_student_rel
  //   WHERE student_id = ?
  //   AND tutor_id = ?
  //   AND linked_sub = ?
  //   ORDER BY id DESC
  //   LIMIT 1
  //   `,
  //     [student_id, tutor_id, linked_sub],
  //   );

  //   if (existing.length) {
  //     const current = existing[0];

  //     if (current.status === "approved") {
  //       return {
  //         status: "approved",
  //         message: "Already approved",
  //       };
  //     }

  //     if (current.status === "pending") {
  //       await executeQuery(
  //         `
  //       UPDATE tutor_student_rel
  //       SET status = 'cancelled'
  //       WHERE id = ?
  //       `,
  //         [current.id],
  //       );

  //       return {
  //         status: "cancelled",
  //         message: "Booking cancelled",
  //       };
  //     }
  //   }

  //   const result: any = await executeQuery(
  //     `
  //   INSERT INTO tutor_student_rel
  //   (student_id, tutor_id, linked_sub, status, requested_at)
  //   VALUES (?, ?, ?, 'pending', NOW())
  //   `,
  //     [student_id, tutor_id, linked_sub],
  //   );

  //   return {
  //     booking_id: result.insertId,
  //     status: "pending",
  //     message: "Request sent",
  //   };
  // }

  async studentClassBooking(data: studentBookClass) {
    const { booking_id, student_id, tutor_id, linked_sub } = data;

    // ✅ Check subject active
    const subjectCheck: any = await executeQuery(
      `
    SELECT id, status 
    FROM tutor_subjects 
    WHERE id = ? AND tutor_id = ?
    `,
      [linked_sub, tutor_id],
    );

    if (!subjectCheck.length || subjectCheck[0].status !== "active") {
      return {
        status: "failed",
        message: "Tutor deleted this subject",
      };
    }

    if (booking_id) {
      const updateResult: any = await executeQuery(
        `
      UPDATE tutor_student_rel
      SET 
        student_id = ?, 
        tutor_id = ?, 
        linked_sub = ?, 
        status = 'pending',
        requested_at = NOW(),
        updated_at = NOW()
      WHERE id = ?
      `,
        [student_id, tutor_id, linked_sub, booking_id],
      );

      if (updateResult.affectedRows > 0) {
        return {
          booking_id,
          status: "pending",
          message: "Booking updated & request sent",
        };
      } else {
        return {
          status: "failed",
          message: "Invalid booking_id",
        };
      }
    }

    // ✅ Existing check (same as before)
    const existing: any = await executeQuery(
      `
    SELECT id, status 
    FROM tutor_student_rel
    WHERE student_id = ? 
    AND tutor_id = ? 
    AND linked_sub = ?
    ORDER BY id DESC
    LIMIT 1
    `,
      [student_id, tutor_id, linked_sub],
    );

    if (existing.length) {
      const current = existing[0];

      if (current.status === "approved") {
        return {
          status: "approved",
          message: "Already approved",
        };
      }

      if (current.status === "pending") {
        await executeQuery(
          `
        UPDATE tutor_student_rel
        SET status = 'cancelled'
        WHERE id = ?
        `,
          [current.id],
        );

        return {
          status: "cancelled",
          message: "Booking cancelled",
        };
      }
    }

    // ✅ Insert new
    const result: any = await executeQuery(
      `
    INSERT INTO tutor_student_rel 
    (student_id, tutor_id, linked_sub, status, requested_at)
    VALUES (?, ?, ?, 'pending', NOW())
    `,
      [student_id, tutor_id, linked_sub],
    );

    return {
      booking_id: result.insertId,
      status: "pending",
      message: "Request sent",
    };
  }
  async getbookSessionStatus(session_id: number) {
    const data: any = await executeQuery(
      `SELECT status FROM tutor_student_rel WHERE id = ?`,
      [session_id],
    );

    return data.length > 0 ? data[0].status : "";
  }

  async fetchFees(
    subject_id?: number,
    subject_name?: string,
    tenure_type?: string,
    student_id?: string,
  ) {
    let where = `WHERE 1=1`;
    let params: any[] = [];

    if (student_id) {
      const student: any = await executeQuery(
        `SELECT learn_course FROM student WHERE student_id = ?`,
        [student_id],
      );

      if (student.length && student[0].learn_course) {
        const courseIds = student[0].learn_course
          .split(",")
          .map((id: string) => Number(id.trim()))
          .filter(Boolean);

        if (courseIds.length) {
          where += ` AND subject_id IN (${courseIds.map(() => "?").join(",")})`;
          params.push(...courseIds);
        }
      }
    }

    if (subject_id) {
      where += ` AND subject_id = ?`;
      params.push(subject_id);
    }

    if (subject_name) {
      where += ` AND subject_name LIKE ?`;
      params.push(`%${subject_name}%`);
    }

    if (tenure_type) {
      where += ` AND tenure_type = ?`;
      params.push(tenure_type);
    }

    const query = `
    SELECT 
      MIN(min_fee) as min_fee,
      MAX(max_fee) as max_fee
    FROM tutor_subjects
    ${where}
  `;

    const result: any = await executeQuery(query, params);

    return {
      min_fee: result[0]?.min_fee || 0,
      max_fee: result[0]?.max_fee || 0,
    };
  }

  async setViewMobileForTutorByid(student_id: string, tutor_id: string) {
    const result: any = await executeQuery(
      `
      UPDATE tutor_leads
      SET is_mobile_view = 1
      WHERE student_id = ? 
        AND tutor_id = ?
        AND is_mobile_view = 0
      `,
      [student_id, tutor_id],
    );

    return result;
  }

  async cancelBooking(booking_id?: number) {
    if (!booking_id) {
      throw new Error("booking_id is required");
    }

    const query = `
    UPDATE tutor_student_rel
    SET status = 'cancelled'
    WHERE id = ?
  `;

    const result: any = await executeQuery(query, [booking_id]);

    return result;
  }

  async fetchBookedClasses(data: any) {
    const { student_id, status, subject_name, page = 1, limit = 10 } = data;

    const offset = (page - 1) * limit;

    let baseParams: any[] = [student_id];

    let statusFilter = "";
    if (status) {
      statusFilter = `AND status = ? AND status != 'cancelled'`;
      baseParams.push(status);
    } else {
      statusFilter = `AND status != 'cancelled'`;
    }

    let query = `
    SELECT 
      bc.id AS booking_id,
      bc.status,
      bc.tutor_id,
      bc.student_id,
      DATE_FORMAT(bc.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,

      ts.id AS tutor_subject_id,
      ts.subject_id,

      COALESCE(s.subject_name, ts.subject_name) AS subject_name,

      t.tutor_id,
      t.user_id,

      u.user_name,
      u.email,
      u.mobile,
      u.profile_img,
      u.area,
      u.district,
      u.state, 
      u.country,
      u.self_about

    FROM (
      SELECT *
      FROM tutor_student_rel
      WHERE student_id = ?
      ${statusFilter}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    ) bc

    LEFT JOIN tutor_subjects ts 
      ON ts.id = bc.linked_sub   

    LEFT JOIN subjects s 
      ON s.id = ts.subject_id    

    LEFT JOIN tutor t 
      ON t.tutor_id = bc.tutor_id

    LEFT JOIN users u 
      ON u.user_id = t.user_id
  `;

    let dataParams: any[] = [...baseParams, Number(limit), Number(offset)];

    if (subject_name) {
      query += ` WHERE COALESCE(s.subject_name, ts.subject_name) LIKE ?`;
      dataParams.push(`%${subject_name}%`);
    }

    query += ` ORDER BY bc.created_at DESC`;

    const rows: any[] = await executeQuery(query, dataParams);

    const countQuery = `
    SELECT COUNT(*) as total
    FROM tutor_student_rel
    WHERE student_id = ?
    ${statusFilter}
  `;

    const countResult: any[] = await executeQuery(countQuery, baseParams);
    const total = countResult[0]?.total || 0;

    const fileIds = [
      ...new Set(rows.map((r) => Number(r.profile_img)).filter(Boolean)),
    ];

    let files: any[] = [];
    if (fileIds.length) {
      files = await cmnMdl.getUploadFiles(fileIds);
    }

    const fileMap = new Map();
    files.forEach((f: any) => {
      fileMap.set(Number(f.id), f);
    });

    const finalData = rows.map((r) => ({
      ...r,
      profile_img: r.profile_img
        ? [fileMap.get(Number(r.profile_img))].filter(Boolean)
        : [],
    }));

    return {
      data: finalData,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(total / limit),
      },
    };
  }
  async fetchConsumedSubjects(student_id: string) {
    const query = `
    SELECT 
      ts.subject_id,

      COALESCE(s.subject_name, ts.subject_name) AS subject_name

    FROM tutor_student_rel bc

    LEFT JOIN tutor_subjects ts 
      ON ts.id = bc.linked_sub

    LEFT JOIN subjects s 
      ON s.id = ts.subject_id

    WHERE bc.student_id = ?
      AND (ts.subject_id IS NOT NULL OR ts.subject_name IS NOT NULL)

    GROUP BY 
      ts.subject_id, 
      COALESCE(s.subject_name, ts.subject_name)

    ORDER BY subject_name ASC
  `;

    const rows: any[] = await executeQuery(query, [student_id]);

    return rows;
  }

  async fethFavouritesOfStudent(student_id: string, page: number = 1) {
    const limit = 10;
    const offset = (page - 1) * limit;

    const query = `
    SELECT 
      u.user_id,
      u.user_name,
      u.lat,
      u.lng,
      u.gender,
      u.profile_img,
      u.state,
      u.district,
      u.area,
      u.pincode,
      u.self_about,

      t.tutor_id,
      t.represent,
      t.stream_id,
      tl.is_like
    FROM tutor t

    LEFT JOIN tutor_likes tl 
      ON tl.tutor_id = t.tutor_id
      AND tl.student_id = ?
      AND tl.is_like = 1

    LEFT JOIN users u 
      ON u.user_id = t.user_id

    ORDER BY tl.id DESC
    LIMIT ? OFFSET ?
  `;

    const rows: any[] = await executeQuery(query, [student_id, limit, offset]);

    const data = await this.buildTutorFullData(rows);
    const final = data.map((r: any) => ({
      ...r,
      is_like: Number(r.is_like) || 0,
    }));

    const countQuery = `
    SELECT COUNT(*) as total
    FROM tutor_likes
    WHERE student_id = ?
      AND is_like = 1
  `;

    const countRes: any[] = await executeQuery(countQuery, [student_id]);
    const total = countRes[0]?.total || 0;

    return {
      data: final,
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }
}
