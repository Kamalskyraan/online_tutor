"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModel = exports.markOTPUsed = exports.getValiOTP = exports.createOTP = void 0;
const helper_1 = require("../utils/helper");
const createOTP = async (data) => {
    const { mobile, email, country_code, otp, expires_at } = data;
    const sql = `INSERT INTO otp (mobile , email, country_code , otp , expires_at , is_used ) VALUES (?,?,?,?,?,0)`;
    const params = [mobile, email, country_code, otp, expires_at];
    return (0, helper_1.executeQuery)(sql, params);
};
exports.createOTP = createOTP;
const getValiOTP = async (data) => {
    const { country_code, mobile, otp } = data;
    const sql = `SELECT id ,expires_at, is_used FROM otp WHERE mobile = ? AND country_code = ?  AND otp = ?   ORDER BY id DESC LIMIT 1`;
    const result = await (0, helper_1.executeQuery)(sql, [mobile, country_code, otp]);
    if (!result.length) {
        return { message: "invalid" };
    }
    const otpRecord = result[0];
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
        const result = await (0, helper_1.executeQuery)(`SELECT * FROM users WHERE country_code = ? AND mobile = ?`, [country_code, mobile]);
        return result.length ? result[0] : null;
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
}
exports.AuthModel = AuthModel;
//# sourceMappingURL=auth.model.js.map