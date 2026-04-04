"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModel = void 0;
const helper_1 = require("../utils/helper");
const common_model_1 = require("./common.model");
const cmnMdl = new common_model_1.commonModel();
class ProfileModel {
    async fetchUserProfileData(user_id, user_role) {
        if (!user_role)
            return null;
        let row = null;
        if (user_role === "tutor") {
            const [rows] = await (0, helper_1.executeQuery)(`SELECT 
        u.user_id, u.user_name, u.profile_img, u.gender,
        u.country_code, u.mobile, u.email,
        u.district, u.state, u.pincode,
        
        u.add_mobile, u.primary_num,
        u.country, u.address, u.area, u.self_about,
        t.tutor_id, t.represent, t.stream_id, t.tutor_exp,
        cy.currency
      FROM users u
      LEFT JOIN tutor t ON t.user_id = u.user_id
      LEFT JOIN country cy ON cy.country = u.country
      WHERE u.user_id = ?`, [user_id]);
            row = rows || null;
        }
        else if (user_role === "student") {
            const [rows] = await (0, helper_1.executeQuery)(`SELECT 
        u.user_id, u.user_name, u.profile_img, u.gender,
        u.country_code, u.mobile, u.email,
        u.district, u.state, u.pincode,
        u.add_mobile, u.primary_num,
        u.country, u.address, u.area, u.self_about,

        s.student_id,
        s.stream_id as student_stream_id,
        s.learn_course,
        s.req_course,

        cy.currency,

        GROUP_CONCAT(DISTINCT sub.subject_name) as learn_course_names,
        GROUP_CONCAT(DISTINCT lcr.subject_name) as requested_course_names

      FROM users u
      LEFT JOIN student s ON s.user_id = u.user_id
      LEFT JOIN subjects sub ON FIND_IN_SET(sub.id, s.learn_course)
      LEFT JOIN learn_course_request lcr ON FIND_IN_SET(lcr.id, s.req_course)
      LEFT JOIN country cy ON cy.country = u.country

      WHERE u.user_id = ?
      GROUP BY u.user_id`, [user_id]);
            row = rows || null;
        }
        if (!row) {
            return { role: user_role, data: "" };
        }
        if (row.profile_img) {
            const images = await cmnMdl.getUploadFiles([row.profile_img]);
            if (Array.isArray(images)) {
                row.profile_img = images[0] || null;
            }
            else {
                row.profile_img = images?.[row.profile_img] || null;
            }
        }
        return {
            role: user_role,
            data: row,
        };
    }
    async fetchUserRole(user_id) {
        const [rows] = await (0, helper_1.executeQuery)(`SELECT user_role FROM users WHERE user_id = ?`, [user_id]);
        return rows.user_role;
    }
    async addUpdateProfileData(user_id, payload) {
        const userFields = [
            "user_name",
            "gender",
            "email",
            "mobile",
            "add_mobile",
            "primary_num",
            "country_code",
            "country",
            "pincode",
            "state",
            "district",
            "address",
            "area",
            "about_myself",
            "is_show_num",
            "profile_img",
        ];
        const userUpdateData = {};
        userFields.forEach((field) => {
            if (payload[field] !== undefined) {
                userUpdateData[field] = payload[field];
            }
        });
        if (Object.keys(userUpdateData).length > 0) {
            const setClause = Object.keys(userUpdateData)
                .map((key) => `${key} = ?`)
                .join(", ");
            await (0, helper_1.executeQuery)(`UPDATE users SET ${setClause} WHERE user_id = ?`, [
                ...Object.values(userUpdateData),
                user_id,
            ]);
        }
        const tutorUpdateData = {};
        if (payload.represent !== undefined)
            tutorUpdateData.represent = payload.represent;
        if (payload.tutor_exp !== undefined)
            tutorUpdateData.tutor_exp = payload.tutor_exp;
        if (payload.stream !== undefined)
            tutorUpdateData.stream_id = payload.stream;
        if (Object.keys(tutorUpdateData).length > 0) {
            const setClause = Object.keys(tutorUpdateData)
                .map((key) => `${key} = ?`)
                .join(", ");
            await (0, helper_1.executeQuery)(`UPDATE tutor SET ${setClause} WHERE user_id = ?`, [
                ...Object.values(tutorUpdateData),
                user_id,
            ]);
        }
    }
    async checkExistingPrimaryNumber(user_id) {
        const [rows] = await (0, helper_1.executeQuery)(`SELECT primary_num FROM users WHERE user_id = ?`, [user_id]);
        return rows;
    }
    async updatePrimaryNumber(user_id, mobile, country_code) {
        await (0, helper_1.executeQuery)(`UPDATE users 
     SET primary_num = ?, country_code = ?
     WHERE user_id = ?`, [mobile, country_code, user_id]);
        return true;
    }
    async updateAdditionalMobile(add_mobile, user_id) {
        await (0, helper_1.executeQuery)(`UPDATE users SET add_mobile = ? WHERE user_id = ?`, [
            add_mobile,
            user_id,
        ]);
        return true;
    }
    async checkOldPassword(user_id) {
        const [rows] = await (0, helper_1.executeQuery)(`SELECT password FROM users WHERE user_id = ?`, [user_id]);
        return rows;
    }
}
exports.ProfileModel = ProfileModel;
//# sourceMappingURL=profile.model.js.map