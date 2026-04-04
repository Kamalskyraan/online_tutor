import { exec } from "node:child_process";
import {
  createOtp,
  RequestOtps,
  userDevice,
  users,
} from "../interface/interface";
import { executeQuery } from "../utils/helper";

export const createOTP = async (data: createOtp) => {
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

  return executeQuery(query, params);
};

export const getValiOTP = async (data: RequestOtps) => {
  const { country_code, mobile, otp, email } = data;

  let query = `
    SELECT id, expires_at, is_used 
    FROM otp 
    WHERE otp = ?
  `;

  const params: any[] = [otp];

  if (mobile) {
    query += ` AND country_code = ? AND mobile = ?`;
    params.push(country_code, mobile);
  } else if (email) {
    query += ` AND email = ?`;
    params.push(email);
  } else {
    return { message: "invalid" };
  }

  query += ` ORDER BY id DESC LIMIT 1`;

  const [rows]: any = await executeQuery(query, params);

  if (!rows?.length) {
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

export const markOTPUsed = async (id: number) => {
  const sql = `UPDATE otp  SET is_used = 1 WHERE id = ? AND is_used = 0`;

  await executeQuery(sql, [id]);
};

// signup

export class AuthModel {
  async createUser(user: users): Promise<number> {
    const {
      user_name,
      user_id,
      country_code,
      mobile,
      password_hash,
      countryy,
      email,
    } = user;
    const result: any = await executeQuery(
      `INSERT INTO users (user_name , user_id , country_code , mobile , password  , primary_num , country , email) VALUES (?,?,?,?,? , ? , ? , ?)`,
      [
        user_name,
        user_id,
        country_code,
        mobile,
        password_hash,
        mobile,
        countryy,
        email,
      ],
    );
    return result.insertId;
  }

  async findUser(country_code: string, mobile?: string, add_mobile?: string) {
    let query = "";
    let params: any[] = [];

    if (mobile) {
      query = `SELECT * FROM users WHERE country_code = ? AND mobile = ?`;
      params = [country_code, mobile];
    } else if (add_mobile) {
      query = `SELECT * FROM users WHERE country_code = ? AND add_mobile = ?`;
      params = [country_code, add_mobile];
    } else {
      return null;
    }

    const [rows]: any = await executeQuery(query, params);

    return rows?.[0] || null;
  }

  async addUserDevice(device: userDevice): Promise<number> {
    const { user_id, device_id, device_token, device_type } = device;
    const result: any = await executeQuery(
      `INSERT INTO user_devices (user_id , device_id , device_token  , device_type) VALUES (?,?,?,?)`,
      [user_id, device_id, device_token, device_type],
    );
    return result.insertId;
  }
  async updatePassword(
    country_code: string,
    mobile: string,
    hashedPassword: string,
  ): Promise<void> {
    const sql = `UPDATE users SET password = ? WHERE mobile = ? AND country_code = ?`;
    await executeQuery(sql, [hashedPassword, mobile, country_code]);
  }
  async removeUserDevice(
    user_id: string,
    device_id: string,
    device_token: string,
    device_type: string,
  ): Promise<void> {
    const sql = `DELETE FROM user_devices WHERE user_id = ? AND device_id = ? AND device_type = ? AND device_token = ?`;
    await executeQuery(sql, [user_id, device_id, device_type, device_token]);
  }

  async clearExistUserDevice(user_id: string) {
    const sql = `DELETE FROM user_devices WHERE user_id = ?`;
    await executeQuery(sql, [user_id]);
  }

  async updatePasswordByUserId(user_id: string, password: string) {
    await executeQuery(`UPDATE users SET password = ? WHERE user_id = ?`, [
      password,
      user_id,
    ]);
  }
}
