"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertNullToString = exports.fetchCountryName = exports.safeJSONParse = exports.generateStudentId = exports.generateTutorId = exports.generateUserId = exports.getOTPExpiry = exports.generateOTP = exports.validateRequest = exports.sendResponse = void 0;
exports.executeQuery = executeQuery;
const db_1 = __importDefault(require("../config/db"));
const nanoid_1 = require("nanoid");
const promises_1 = __importDefault(require("fs/promises"));
const sendResponse = (res, statusCode, success, data = [], message = "", error = []) => {
    return res.status(statusCode).json({
        success,
        data,
        message,
        error,
    });
};
exports.sendResponse = sendResponse;
async function executeQuery(sql, params = {}) {
    try {
        const [results] = await db_1.default.query(sql, params);
        return results;
    }
    catch (error) {
        throw error;
    }
}
const validateRequest = (data, schema) => {
    const { error, value } = schema.validate(data, {
        abortEarly: true,
        allowUnknown: true,
    });
    if (error) {
        const errorMessages = error.details.map((err) => err.message).join(", ");
        const errorObject = new Error("Validation Error");
        errorObject.status = 200;
        errorObject.errors = errorMessages;
        throw errorObject;
    }
    return value;
};
exports.validateRequest = validateRequest;
const generateOTP = () => {
    const otp = process.env.NODE_ENV === "development"
        ? "1234"
        : Math.floor(Math.random() * 9000).toString();
    return otp;
};
exports.generateOTP = generateOTP;
const getOTPExpiry = () => {
    const minutes = process.env.NODE_ENV === "development" ? 0.5 : 0.3;
    return new Date(Date.now() + minutes * 60 * 1000);
};
exports.getOTPExpiry = getOTPExpiry;
const generateUserId = () => {
    return `USER_${(0, nanoid_1.nanoid)(8)}`;
};
exports.generateUserId = generateUserId;
const generateTutorId = () => {
    return `TUTOR_${(0, nanoid_1.nanoid)(8)}`;
};
exports.generateTutorId = generateTutorId;
const generateStudentId = () => {
    return `STUDENT_${(0, nanoid_1.nanoid)(8)}`;
};
exports.generateStudentId = generateStudentId;
const safeJSONParse = (value) => {
    try {
        return value ? JSON.parse(value) : [];
    }
    catch {
        return [];
    }
};
exports.safeJSONParse = safeJSONParse;
const fetchCountryName = async (country_code) => {
    const file = await promises_1.default.readFile("./public/country.json", "utf8");
    const countries = JSON.parse(file);
    const country = countries.find((item) => item.dial_code.toString() === country_code.toString());
    return country ? country.name : null;
};
exports.fetchCountryName = fetchCountryName;
const convertNullToString = (data) => {
    if (Array.isArray(data)) {
        return data.map((item) => (0, exports.convertNullToString)(item));
    }
    if (data != null && typeof data === "object") {
        const result = {};
        Object.keys(data).forEach((key) => {
            const value = data[key];
            if (value === null) {
                result[key] = "";
            }
            else if (typeof value === "object") {
                result[key] = (0, exports.convertNullToString)(value);
            }
            else {
                result[key] = value;
            }
        });
        return result;
    }
    return data;
};
exports.convertNullToString = convertNullToString;
//# sourceMappingURL=helper.js.map