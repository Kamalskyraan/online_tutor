"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModel = exports.markOTPUsed = exports.getValiOTP = exports.createOTP = void 0;
const helper_1 = require("../utils/helper");
const createOTP = async (data) => {
    const { mobile, email, country_code, otp, expires_at } = data;
    if (!mobile && !email) {
        throw new Error("mobile  or email is required");
    }
    const query = `
    INSERT INTO otp 
    (mobile,  email, country_code, otp, expires_at, is_used)
    VALUES (?, ?,  ?, ?, ?, 0)
  `;
    const params = [mobile || null, email || null, country_code, otp, expires_at];
    return (0, helper_1.executeQuery)(query, params);
};
exports.createOTP = createOTP;
const getValiOTP = async (data) => {
    const { country_code, mobile, otp, email } = data;
    if (!otp)
        return { message: "invalid" };
    let query = `
    SELECT id, expires_at, is_used 
    FROM otp 
    WHERE otp = ?
  `;
    const params = [otp];
    if (mobile) {
        query += ` AND country_code = ? AND mobile = ?`;
        params.push(country_code, mobile);
    }
    else if (email) {
        query += ` AND email = ?`;
        params.push(email);
    }
    else {
        return { message: "invalid" };
    }
    query += ` ORDER BY id DESC LIMIT 1`;
    const rows = await (0, helper_1.executeQuery)(query, params);
    if (!rows || !rows.length) {
        return { message: "invalid" };
    }
    const otpRecord = rows[0];
    if (otpRecord.is_used === 1) {
        return { message: "used" };
    }
    const now = new Date();
    const expiresAt = new Date(otpRecord.expires_at);
    if (now > expiresAt) {
        return { message: "expired" };
    }
    return { message: "valid", id: otpRecord.id };
};
exports.getValiOTP = getValiOTP;
const markOTPUsed = async (id) => {
    const sql = `UPDATE otp  SET is_used = 1 WHERE id = ? AND is_used = 0`;
    await (0, helper_1.executeQuery)(sql, [id]);
};
exports.markOTPUsed = markOTPUsed;
// signup
class AuthModel {
    async createUser(user) {
        const { user_name, user_id, country_code, mobile, password_hash, countryy, email, } = user;
        const result = await (0, helper_1.executeQuery)(`INSERT INTO users (user_name , user_id , country_code , mobile , password  , primary_num , country , email) VALUES (?,?,?,?,? , ? , ? , ?)`, [
            user_name,
            user_id,
            country_code,
            mobile,
            password_hash,
            mobile,
            countryy,
            email,
        ]);
        return result.insertId;
    }
    async findUser(country_code, mobile) {
        let query = "";
        let params = [];
        query = `SELECT * FROM users WHERE country_code = ? AND mobile = ? OR add_mobile = ? LIMIT 1`;
        params = [country_code, mobile, mobile];
        const [rows] = await (0, helper_1.executeQuery)(query, params);
        return rows || null;
    }
    async addUserDevice(device) {
        const { user_id, device_id, device_token, device_type } = device;
        const result = await (0, helper_1.executeQuery)(`INSERT INTO user_devices (user_id , device_id , device_token  , device_type) VALUES (?,?,?,?)`, [user_id, device_id, device_token, device_type]);
        return result.insertId;
    }
    async updatePassword(country_code, mobile, hashedPassword) {
        const sql = `UPDATE users SET password = ? WHERE mobile = ? AND country_code = ?`;
        await (0, helper_1.executeQuery)(sql, [hashedPassword, mobile, country_code]);
    }
    async removeUserDevice(user_id, device_id, device_token, device_type) {
        const sql = `DELETE FROM user_devices WHERE user_id = ? AND device_id = ? AND device_type = ? AND device_token = ?`;
        await (0, helper_1.executeQuery)(sql, [user_id, device_id, device_type, device_token]);
    }
    async clearExistUserDevice(user_id) {
        const sql = `DELETE FROM user_devices WHERE user_id = ?`;
        await (0, helper_1.executeQuery)(sql, [user_id]);
    }
    async updatePasswordByUserId(user_id, password) {
        await (0, helper_1.executeQuery)(`UPDATE users SET password = ? WHERE user_id = ?`, [
            password,
            user_id,
        ]);
    }
    async fetchUserDataForReactive(user_id) {
        const rows = await (0, helper_1.executeQuery)(`SELECT * FROM users WHERE user_id = ?`, [user_id]);
        return Array.isArray(rows) ? rows[0] : rows;
    }
    //
    async checkAlreadySubmitted(user_id) {
        const rows = await (0, helper_1.executeQuery)(`SELECT id FROM user_justifications WHERE user_id = ? LIMIT 1`, [user_id]);
        return rows.length > 0;
    }
    async createJustification(data) {
        const { user_id, name, mobile, email, reason, attachments } = data;
        const result = await (0, helper_1.executeQuery)(`INSERT INTO user_justifications 
    (user_id, user_name, mobile, email, reason, evidence)
    VALUES (?, ?, ?, ?, ?, ?)`, [user_id, name, mobile, email, reason, attachments]);
        return result.insertId;
    }
    async findUserDevice(data) {
        const { user_id, device_id } = data;
        const result = await (0, helper_1.executeQuery)(`SELECT * FROM user_devices 
     WHERE user_id = ? 
     AND device_id = ? 
    `, [user_id, device_id]);
        return result[0];
    }
}
exports.AuthModel = AuthModel;
//# sourceMappingURL=auth.model.js.map