"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = void 0;
const helper_1 = require("../utils/helper");
const common_model_1 = require("./common.model");
const cmnMdl = new common_model_1.commonModel();
class ReviewModel {
    async createReview(data) {
        const { id, tutor_id, student_id, rating, review_text } = data;
        let reviewId = id;
        if (id) {
            await (0, helper_1.executeQuery)(`UPDATE reviews 
       SET tutor_id = ?, student_id = ?, rating = ?, review_text = ? 
       WHERE id = ?`, [tutor_id, student_id, rating, review_text, id]);
        }
        else {
            const result = await (0, helper_1.executeQuery)(`INSERT INTO reviews (tutor_id, student_id, rating, review_text) 
       VALUES (?, ?, ?, ?)`, [tutor_id, student_id, rating, review_text]);
            reviewId = result.insertId;
        }
        const reviewData = await this.fetchReviews({
            id: reviewId,
            page: 1,
            limit: 1,
        });
        return (0, helper_1.convertNullToString)(reviewData.reviews[0]) || [];
    }
    //   async fetchReviews(data: fetchReview) {
    //     const {
    //       id,
    //       tutor_id,
    //       student_id,
    //       rating,
    //       from_date,
    //       to_date,
    //       page = 1,
    //       limit = 5,
    //     } = data;
    //     const offset = (page - 1) * limit;
    //     let baseQuery = `
    //     FROM reviews r
    //     LEFT JOIN student s ON s.student_id = r.student_id
    //     LEFT JOIN users u ON u.user_id = s.user_id
    //     LEFT JOIN review_reply rr ON rr.review_id = r.id
    //       LEFT JOIN review_likes rl
    //     ON rl.review_id = r.id
    //     AND rl.student_id = ?
    //   `;
    //     const conditions: string[] = [];
    //     const params: any[] = [];
    //     if (id) {
    //       conditions.push(`r.id = ?`);
    //       params.push(id);
    //     }
    //     if (tutor_id) {
    //       conditions.push(`r.tutor_id = ?`);
    //       params.push(tutor_id);
    //     }
    //     if (student_id && !tutor_id) {
    //       conditions.push(`r.student_id = ?`);
    //       params.push(student_id);
    //     }
    //     if (rating) {
    //       conditions.push(`FLOOR(r.rating) = ?`);
    //       params.push(rating);
    //     }
    //     if (from_date && to_date) {
    //       conditions.push(`r.created_at BETWEEN ? AND ?`);
    //       params.push(`${from_date} 00:00:00`, `${to_date} 23:59:59`);
    //     } else if (from_date) {
    //       conditions.push(`r.created_at BETWEEN ? AND ?`);
    //       params.push(`${from_date} 00:00:00`, `${from_date} 23:59:59`);
    //     }
    //     let whereClause = "";
    //     if (conditions.length > 0) {
    //       whereClause = ` WHERE ` + conditions.join(" AND ");
    //     }
    //     const dataQuery = `
    //     SELECT
    //       r.id, r.tutor_id, r.student_id, r.rating, r.review_text,
    //      DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    //   DATE_FORMAT(r.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
    //       u.user_name,
    //       u.user_id,
    //       u.user_role,
    //       u.profile_img,
    //       u.mobile,
    //      IFNULL(rr.id, 0) AS reply_id,
    //      IFNULL(rr.review_id, 0) AS review_id,
    //       rr.reply_text,
    //       DATE_FORMAT(rr.updated_at, '%Y-%m-%d %H:%i:%s') AS reply_date,
    //        (
    //     SELECT COUNT(*)
    //     FROM review_likes rl
    //     WHERE rl.review_id = r.id
    //   ) AS like_count,
    //     CASE
    //     WHEN rl.id IS NOT NULL THEN 1
    //     ELSE 0
    //   END AS is_liked
    //  ${baseQuery}
    //     ${whereClause}
    //    ORDER BY
    //   CASE
    //     WHEN r.student_id = ? THEN 0
    //     ELSE 1
    //   END,
    //   r.created_at DESC
    //     LIMIT ? OFFSET ?
    //   `;
    //     const safeStudentId = student_id ?? -1;
    //     const finalParams = [
    //       safeStudentId,
    //       ...params,
    //       safeStudentId,
    //       limit,
    //       offset,
    //     ];
    //     const reviews = await executeQuery(dataQuery, finalParams);
    //     console.log(reviews.is_liked);
    //     const imageIds = reviews
    //       .map((r: any) => Number(r.profile_img))
    //       .filter(Boolean);
    //     let fileMap = new Map();
    //     if (imageIds.length > 0) {
    //       const files = await cmnMdl.getUploadFiles(imageIds);
    //       files.forEach((f: any) => {
    //         fileMap.set(Number(f.id), f);
    //       });
    //     }
    //     const updatedReviews = reviews.map((r: any) => {
    //       const img = fileMap.get(Number(r.profile_img));
    //       return {
    //         ...r,
    //         profile_img: img ? [img] : [],
    //       };
    //     });
    //     const finalReviews = updatedReviews.map((r: any) => ({
    //       ...r,
    //       has_reply: r.reply_id ? 1 : 0,
    //     }));
    //     const countQuery = `
    //     SELECT COUNT(*) as total
    //     ${baseQuery}
    //     ${whereClause}
    //   `;
    //     const countResult: any = await executeQuery(countQuery, [
    //       safeStudentId,
    //       ...params,
    //     ]);
    //     const total = countResult[0]?.total || 0;
    //     let summary: any = {};
    //     if (tutor_id) {
    //       summary = await this.getReviewSummary(tutor_id);
    //     }
    //     return {
    //       reviews: finalReviews,
    //       summary,
    //       pagination: {
    //         total,
    //         page,
    //         limit,
    //         total_pages: Math.ceil(total / limit),
    //       },
    //     };
    //   }
    async fetchReviews(data) {
        const { id, tutor_id, student_id, rating, from_date, to_date, page = 1, limit = 5, } = data;
        const offset = (page - 1) * limit;
        const safeStudentId = student_id ?? -1;
        const safeTutorId = tutor_id ?? -1;
        let baseQuery = `
    FROM reviews r
    LEFT JOIN student s ON s.student_id = r.student_id
    LEFT JOIN users u ON u.user_id = s.user_id
    LEFT JOIN review_reply rr ON rr.review_id = r.id
  `;
        const conditions = [];
        const params = [];
        if (id) {
            conditions.push(`r.id = ?`);
            params.push(id);
        }
        if (tutor_id) {
            conditions.push(`r.tutor_id = ?`);
            params.push(tutor_id);
        }
        if (student_id && !tutor_id) {
            conditions.push(`r.student_id = ?`);
            params.push(student_id);
        }
        if (rating) {
            conditions.push(`FLOOR(r.rating) = ?`);
            params.push(rating);
        }
        if (from_date && to_date) {
            conditions.push(`r.created_at BETWEEN ? AND ?`);
            params.push(`${from_date} 00:00:00`, `${to_date} 23:59:59`);
        }
        else if (from_date) {
            conditions.push(`r.created_at BETWEEN ? AND ?`);
            params.push(`${from_date} 00:00:00`, `${from_date} 23:59:59`);
        }
        let whereClause = "";
        if (conditions.length > 0) {
            whereClause = ` WHERE ` + conditions.join(" AND ");
        }
        const dataQuery = `
    SELECT 
      r.id, r.tutor_id, r.student_id, r.rating, r.review_text,

      DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
      DATE_FORMAT(r.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,

      u.user_name,
      u.user_id,
      u.user_role,
      u.profile_img,
      u.mobile,

      IFNULL(rr.id, 0) AS reply_id,
      IFNULL(rr.review_id, 0) AS review_id,
      rr.reply_text,
      DATE_FORMAT(rr.updated_at, '%Y-%m-%d %H:%i:%s') AS reply_date,

      (
        SELECT COUNT(*) 
        FROM review_likes rl 
        WHERE rl.review_id = r.id
      ) AS like_count,


     CASE 
  WHEN EXISTS (
    SELECT 1 
    FROM review_likes rl 
    WHERE rl.review_id = r.id 
    AND (
      rl.student_id = ? 
      OR rl.tutor_id = ?
    )
  ) THEN 1
  ELSE 0
END AS is_liked


      END AS is_liked

    ${baseQuery}
    ${whereClause}

    ORDER BY 
      CASE 
        WHEN r.student_id = ? THEN 0
        ELSE 1
      END,
      r.created_at DESC

    LIMIT ? OFFSET ?
  `;
        const finalParams = [
            safeStudentId,
            safeTutorId,
            ...params,
            safeStudentId,
            limit,
            offset,
        ];
        const reviews = await (0, helper_1.executeQuery)(dataQuery, finalParams);
        const imageIds = reviews
            .map((r) => Number(r.profile_img))
            .filter(Boolean);
        let fileMap = new Map();
        if (imageIds.length > 0) {
            const files = await cmnMdl.getUploadFiles(imageIds);
            files.forEach((f) => {
                fileMap.set(Number(f.id), f);
            });
        }
        const updatedReviews = reviews.map((r) => {
            const img = fileMap.get(Number(r.profile_img));
            return {
                ...r,
                profile_img: img ? [img] : [],
            };
        });
        const finalReviews = updatedReviews.map((r) => ({
            ...r,
            has_reply: r.reply_id ? 1 : 0,
        }));
        // 🔽 Count Query
        const countQuery = `
    SELECT COUNT(*) as total
    ${baseQuery}
    ${whereClause}
  `;
        const countResult = await (0, helper_1.executeQuery)(countQuery, [...params]);
        const total = countResult[0]?.total || 0;
        let summary = {};
        if (tutor_id) {
            summary = await this.getReviewSummary(tutor_id);
        }
        return {
            reviews: finalReviews,
            summary,
            pagination: {
                total,
                page,
                limit,
                total_pages: Math.ceil(total / limit),
            },
        };
    }
    async fetchReviewsForTutorById(tutor_id) {
        let query = `
    SELECT 
      r.id, r.tutor_id, r.student_id, r.rating, r.review_text,

      DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
      DATE_FORMAT(r.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,

      s.student_id,
      u.user_name,
      u.user_id,
      u.user_role,
      u.profile_img,
      u.mobile,

      rr.review_id,
      rr.reply_text,
       COUNT(DISTINCT rl.id) AS total_likes,
      DATE_FORMAT(rr.updated_at, '%Y-%m-%d %H:%i:%s') AS reply_date 

    FROM reviews r

    LEFT JOIN student s ON s.student_id = r.student_id
    LEFT JOIN users u ON u.user_id = s.user_id
    LEFT JOIN review_reply rr ON rr.review_id = r.id
    LEFT JOIN review_likes rl ON rl.review_id = r.id
    WHERE r.tutor_id = ?
    GROUP BY r.id
    ORDER BY r.id DESC
  `;
        const reviews = await (0, helper_1.executeQuery)(query, [tutor_id]);
        const profileIds = [
            ...new Set(reviews.map((r) => r.profile_img).filter(Boolean)),
        ];
        let mediaData = [];
        if (profileIds.length) {
            const placeholders = profileIds.map(() => "?").join(",");
            mediaData = await (0, helper_1.executeQuery)(`SELECT id, file_type, file_url, pathname, org_name 
       FROM media 
       WHERE id IN (${placeholders})`, profileIds);
        }
        const mediaMap = new Map();
        mediaData.forEach((file) => {
            mediaMap.set(Number(file.id), {
                id: file.id || "",
                file_type: file.file_type || "",
                pathname: file.pathname || "",
                org_name: file.org_name || "",
                file_url: file.file_url
                    ? file.file_url.startsWith("http")
                        ? file.file_url
                        : `https://${file.file_url}`
                    : "",
            });
        });
        const finalReviews = reviews.map((r) => ({
            ...r,
            profile_img: r.profile_img
                ? mediaMap.get(Number(r.profile_img)) || {}
                : {},
        }));
        return {
            reviews: (0, helper_1.convertNullToString)(finalReviews),
        };
    }
    async createUpdateReviewReply(data) {
        const { id, review_id, tutor_id, reply_text } = data;
        let replyId = id;
        if (id) {
            await (0, helper_1.executeQuery)(`UPDATE review_reply 
       SET reply_text = ?, updated_at = NOW() 
       WHERE id = ?`, [reply_text, id]);
        }
        else {
            const result = await (0, helper_1.executeQuery)(`INSERT INTO review_reply (review_id, tutor_id, reply_text) 
       VALUES (?, ?, ?)`, [review_id, tutor_id, reply_text]);
            replyId = result.insertId;
        }
        const replyData = await (0, helper_1.executeQuery)(`SELECT 
      id,
      review_id,
      tutor_id,
      reply_text,
      DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at
     FROM review_reply
     WHERE id = ?`, [replyId]);
        return replyData[0] || [];
    }
    async getReviewSummary(tutor_id) {
        const avgQuery = `
    SELECT 
      ROUND(AVG(rating),1) as average_rating,
      COUNT(*) as total_reviews
    FROM reviews
    WHERE tutor_id = ?
  `;
        const avgRes = await (0, helper_1.executeQuery)(avgQuery, [tutor_id]);
        const countQuery = `
    SELECT 
      rating,
      COUNT(*) as count
    FROM reviews
    WHERE tutor_id = ?
    GROUP BY rating
  `;
        const countRes = await (0, helper_1.executeQuery)(countQuery, [tutor_id]);
        const rating_breakdown = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        };
        countRes.forEach((row) => {
            rating_breakdown[row.rating] = row.count;
        });
        return {
            average_rating: Math.floor(avgRes[0]?.average_rating) || 0,
            total_reviews: avgRes[0]?.total_reviews || 0,
            rating_breakdown,
        };
    }
    async toggleReviewLike(data) {
        const { review_id, student_id, tutor_id } = data;
        const isStudent = !!student_id;
        const userColumn = isStudent ? "student_id" : "tutor_id";
        const userValue = isStudent ? student_id : tutor_id;
        if (!userValue) {
            return {
                message: "Student ID or Tutor ID is required",
            };
        }
        const existing = await (0, helper_1.executeQuery)(`SELECT id FROM review_likes 
     WHERE review_id = ? AND ${userColumn} = ?`, [review_id, userValue]);
        let action = "";
        if (existing.length > 0) {
            await (0, helper_1.executeQuery)(`DELETE FROM review_likes 
       WHERE review_id = ? AND ${userColumn} = ?`, [review_id, userValue]);
            action = "dislike";
        }
        else {
            await (0, helper_1.executeQuery)(`INSERT INTO review_likes (review_id, ${userColumn})
       VALUES (?, ?)`, [review_id, userValue]);
            action = "like";
        }
        const countResult = await (0, helper_1.executeQuery)(`SELECT COUNT(*) as total_likes 
     FROM review_likes 
     WHERE review_id = ?`, [review_id]);
        const total_likes = countResult[0]?.total_likes || 0;
        return {
            action,
            total_likes,
            message: action === "like" ? "Liked successfully" : "Unliked successfully",
        };
    }
    async removeReview(data) {
        const { id, student_id } = data;
        const existing = await (0, helper_1.executeQuery)(`SELECT id FROM reviews 
     WHERE id = ? AND student_id = ?`, [id, student_id]);
        if (existing.length === 0) {
            return {
                message: "Review not found or unauthorized student_id",
            };
        }
        await (0, helper_1.executeQuery)(`DELETE FROM reviews WHERE id = ? AND student_id = ?`, [
            id,
            student_id,
        ]);
        return {
            message: "Review deleted successfully",
        };
    }
    async removeReviewReply(data) {
        const { id, tutor_id } = data;
        const existing = await (0, helper_1.executeQuery)(`SELECT id FROM review_reply
     WHERE id = ? AND tutor_id = ?`, [id, tutor_id]);
        if (existing.length === 0) {
            return {
                message: "Review not found or unauthorized student_id",
            };
        }
        await (0, helper_1.executeQuery)(`DELETE FROM review_reply WHERE id = ? AND tutor_id = ?`, [id, tutor_id]);
        return {
            message: "Review Reply deleted successfully",
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
        const result = await (0, helper_1.executeQuery)(query);
        return result;
    }
    async reportReview(data) {
        const { review_id, student_id, tutor_id, reason_id, other_reason } = data;
        const isStudent = !!student_id;
        const userValue = isStudent ? student_id : tutor_id;
        if (!userValue) {
            return {
                message: "Student or Tutor ID is required",
            };
        }
        const existing = await (0, helper_1.executeQuery)(`SELECT id FROM review_reports 
     WHERE review_id = ? AND report_by = ?`, [review_id, userValue]);
        if (existing.length > 0) {
            return {
                message: "Already reported this review",
            };
        }
        const report = await (0, helper_1.executeQuery)(`SELECT student_id FROM reviews WHERE id = ? `, [review_id]);
        if (report.length === 0) {
            return {
                message: "Review not foundd",
            };
        }
        const report_to = report[0].student_id;
        await (0, helper_1.executeQuery)(`INSERT INTO review_reports
    (review_id, report_to , report_by, reason_id, other_reason)
    VALUES (?, ?, ?, ? , ?)`, [
            review_id,
            report_to,
            userValue,
            reason_id,
            reason_id == -1 ? other_reason : null,
        ]);
        const countRes = await (0, helper_1.executeQuery)(`SELECT COUNT(*) as total 
     FROM review_reports 
     WHERE report_to = ?`, [report_to]);
        const totalReports = countRes[0].total;
        if (totalReports >= 5) {
            const studentData = await (0, helper_1.executeQuery)(`SELECT user_id FROM student WHERE student_id = ?`, [report_to]);
            if (studentData.length === 0) {
                return {
                    message: "Student not found",
                };
            }
            const user_id = studentData[0].user_id;
            await (0, helper_1.executeQuery)(`UPDATE users 
       SET is_blocked = 1 
       WHERE user_id = ?`, [user_id]);
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
exports.ReviewModel = ReviewModel;
//# sourceMappingURL=review.model.js.map