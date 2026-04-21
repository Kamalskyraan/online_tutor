"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockCheckMiddleware = exports.authMiddleware = void 0;
const helper_1 = require("../utils/helper");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var JWT_SECRET = process.env.JWT_SECRET || "abc@1234";
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(200).json({
                status: 2,
                message: "Access denied. No token provided.",
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = {
            user_id: decoded.user_id,
            role: decoded.role,
        };
        next();
    }
    catch (err) {
        return res.status(200).json({
            status: 0,
            message: "Invalid or expired token",
        });
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
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.blockCheckMiddleware = blockCheckMiddleware;
//# sourceMappingURL=middleware.js.map