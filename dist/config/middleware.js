"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockCheckMiddleware = exports.authMiddleware = void 0;
const helper_1 = require("../utils/helper");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_model_1 = require("../models/auth.model");
dotenv_1.default.config();
var JWT_SECRET = process.env.JWT_SECRET || "abc@1234";
const authMdl = new auth_model_1.AuthModel();
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        // 1. Check header exists
        if (!authHeader) {
            return (0, helper_1.sendResponse)(res, 200, 3, {}, "Access denied. No token provided", []);
        }
        if (!authHeader.startsWith("Bearer ")) {
            return (0, helper_1.sendResponse)(res, 200, 3, {}, "Invalid token format", []);
        }
        const token = authHeader.split(" ")[1];
        // 3. Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // 4. Attach user
        req.user = {
            user_id: decoded.user_id,
            role: decoded.device_id,
        };
        next();
    }
    catch (err) {
        // Unknown error
        return (0, helper_1.sendResponse)(res, 500, 0, {}, "Internal Server Error", []);
    }
};
exports.authMiddleware = authMiddleware;
const blockCheckMiddleware = async (req, res, next) => {
    try {
        const user_id = req.user?.user_id;
        if (!user_id)
            return next();
        const result = await (0, helper_1.executeQuery)(`SELECT is_blocked FROM users WHERE user_id = ?`, [user_id]);
        if (result[0]?.is_blocked === 1) {
            return (0, helper_1.sendResponse)(res, 200, 2, [], "Your account is blocked. Please submit justification.", []);
        }
        next();
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", []);
    }
};
exports.blockCheckMiddleware = blockCheckMiddleware;
//# sourceMappingURL=middleware.js.map