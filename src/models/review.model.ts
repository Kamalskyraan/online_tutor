import { fetchReview, replyReview, Review } from "../interface/interface";
import { executeQuery, sendResponse } from "../utils/helper";

export class ReviewModel {
  async createReview(data: Review): Promise<number> {
    const { id, tutor_id, student_id, rating, review_text } = data;

    if (id) {
      await executeQuery(
        `UPDATE reviews 
       SET tutor_id = ?, student_id = ?, rating = ?, review_text = ? 
       WHERE id = ?`,
        [tutor_id, student_id, rating, review_text, id],
      );
      return id;
    } else {
      const result: any = await executeQuery(
        `INSERT INTO reviews (tutor_id, student_id, rating, review_text) 
       VALUES (?, ?, ?, ?)`,
        [tutor_id, student_id, rating, review_text],
      );

      return result.insertId;
    }
  }
  async fetchReviews(data: fetchReview) {
    const { id, tutor_id, student_id, rating, from_date, to_date } = data;

    let query = `SELECT r.id , r.tutor_id , r.student_id , r.rating , r.review_text,

      DATE_FORMAT(r.created_at, '%Y-%m-%d') AS created_at,
      DATE_FORMAT(r.updated_at, '%Y-%m-%d') AS updated_at,

      s.student_id ,
      u.user_name,
      u.user_id,
      u.user_role,
      u.profile_img,
      u.mobile,
      rr.review_id,
      rr.reply_text,
      DATE_FORMAT(rr.updated_at, '%Y-%m-%d') AS reply_date 

      FROM reviews r

      LEFT JOIN student s ON s.student_id = r.student_id
      LEFT JOIN users u ON u.user_id = s.user_id
     LEFT JOIN review_reply rr ON rr.review_id = r.id

      `;

    const conditions: string[] = [];
    const params: any[] = [];

    if (id) {
      conditions.push(`r.id = ?`);
      params.push(id);
    }

    if (tutor_id) {
      conditions.push(`r.tutor_id = ?`);
      params.push(tutor_id);
    }

    if (student_id) {
      conditions.push(`r.student_id = ?`);
      params.push(student_id);
    }

    if (rating) {
      conditions.push(`r.rating = ?`);
      params.push(rating);
    }
    if (from_date && to_date) {
      conditions.push(`r.created_at BETWEEN ? AND ?`);
      params.push(`${from_date} 00:00:00`, `${to_date} 23:59:59`);
    } else if (from_date) {
      conditions.push(`r.created_at BETWEEN ? AND ?`);
      params.push(`${from_date} 00:00:00`, `${from_date} 23:59:59`);
    }
    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    query += ` ORDER BY r.id DESC`;

    const reviews = await executeQuery(query, params);
    let summary: any = {};
    if (tutor_id) {
      summary = await this.getReviewSummary(tutor_id);
    }

    return {
      reviews,
      summary,
    };
  }

  async createUpdateReviewReply(data: replyReview) {
    const { id, review_id, tutor_id, student_id, reply_text } = data;

    if (id) {
      await executeQuery(
        `UPDATE review_reply 
       SET reply_text = ?, updated_at = NOW() 
       WHERE id = ?`,
        [reply_text, id],
      );

      return { message: "Reply updated successfully" };
    }

    await executeQuery(
      `INSERT INTO review_reply (review_id, tutor_id,  reply_text) 
     VALUES (?, ?, ?)`,
      [review_id, tutor_id, reply_text],
    );

    return { message: "Reply added successfully" };
  }

  async getReviewSummary(tutor_id: string) {
    const avgQuery = `
    SELECT 
      ROUND(AVG(rating),1) as average_rating,
      COUNT(*) as total_reviews
    FROM reviews
    WHERE tutor_id = ?
  `;

    const avgRes: any = await executeQuery(avgQuery, [tutor_id]);

    const countQuery = `
    SELECT 
      rating,
      COUNT(*) as count
    FROM reviews
    WHERE tutor_id = ?
    GROUP BY rating
  `;

    const countRes: any = await executeQuery(countQuery, [tutor_id]);

    const rating_breakdown: any = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    countRes.forEach((row: any) => {
      rating_breakdown[row.rating] = row.count;
    });

    return {
      average_rating: Math.floor(avgRes[0]?.average_rating) || 0,
      total_reviews: avgRes[0]?.total_reviews || 0,
      rating_breakdown,
    };
  }

  async toggleReviewLike(data: any) {
    const { review_id, student_id, tutor_id } = data;

    const isStudent = !!student_id;
    const userColumn = isStudent ? "student_id" : "tutor_id";
    const userValue = isStudent ? student_id : tutor_id;
    if (!userValue) {
      return {
        message: "Student ID or Tutor ID is required",
      };
    }

    const existing: any = await executeQuery(
      `SELECT id FROM review_likes 
     WHERE review_id = ? AND ${userColumn} = ?`,
      [review_id, userValue],
    );

    if (existing.length > 0) {
      await executeQuery(
        `DELETE FROM review_likes 
       WHERE review_id = ? AND ${userColumn} = ?`,
        [review_id, userValue],
      );

      return {
        action: "dislike",
        message: "Unliked successfully",
      };
    }

    await executeQuery(
      `INSERT INTO review_likes (review_id, ${userColumn})
     VALUES (?, ?)`,
      [review_id, userValue],
    );

    return {
      action: "like",
      message: "Liked successfully",
    };
  }
  async removeReview(data: any) {
    const { id, student_id } = data;
    const existing: any = await executeQuery(
      `SELECT id FROM reviews 
     WHERE id = ? AND student_id = ?`,
      [id, student_id],
    );
    if (existing.length === 0) {
      return {
        message: "Review not found or unauthorized student_id",
      };
    }
    await executeQuery(`DELETE FROM reviews WHERE id = ? AND student_id = ?`, [
      id,
      student_id,
    ]);
    return {
      message: "Review deleted successfully",
    };
  }

  async getActiveReportReasons() {
    const query = `
    SELECT id, reason
    FROM report_reasons
    WHERE status = 'active'

    UNION ALL
    SELECT -1 AS id, 'Other Reasons' AS reason_text
    ORDER BY 
      CASE WHEN id = -1 THEN 1 ELSE 0 END,
    id ASC
  `;

    const result = await executeQuery(query);
    return result;
  }

  async reportReview(data: any) {
    const { review_id, student_id, tutor_id, reason_id, other_reason } = data;

    const isStudent = !!student_id;

    const userValue = isStudent ? student_id : tutor_id;

    if (!userValue) {
      return {
        message: "Student or Tutor ID is required",
      };
    }

    const existing: any = await executeQuery(
      `SELECT id FROM review_reports 
     WHERE review_id = ? AND report_by = ?`,
      [review_id, userValue],
    );

    if (existing.length > 0) {
      return {
        message: "Already reported this review",
      };
    }

    const report = await executeQuery(
      `SELECT student_id FROM reviews WHERE id = ? `,
      [review_id],
    );

    if (report.length === 0) {
      return {
        message: "Review not foundd",
      };
    }

    const report_to = report[0].student_id;

    await executeQuery(
      `INSERT INTO review_reports
    (review_id, report_to , report_by, reason_id, other_reason)
    VALUES (?, ?, ?, ? , ?)`,
      [
        review_id,
        report_to,
        userValue,
        reason_id,
        reason_id == -1 ? other_reason : null,
      ],
    );

    const countRes: any = await executeQuery(
      `SELECT COUNT(*) as total 
     FROM review_reports 
     WHERE report_to = ?`,
      [report_to],
    );
    const totalReports = countRes[0].total;

    if (totalReports >= 5) {
      const studentData: any = await executeQuery(
        `SELECT user_id FROM student WHERE student_id = ?`,
        [report_to],
      );

      if (studentData.length === 0) {
        return {
          message: "Student not found",
        };
      }

      const user_id = studentData[0].user_id;
      await executeQuery(
        `UPDATE users 
       SET is_blocked = 1 
       WHERE user_id = ?`,
        [user_id],
      );

      return {
        message: "User blocked due to multiple reports",
        blocked: true,
      };
    }
    return {
      message: "Reported successfully",
      total_reports: totalReports,
    };
  }
}
