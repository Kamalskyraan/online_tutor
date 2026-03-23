"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db = promise_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
const connectDB = async () => {
    try {
        const connection = await db.getConnection();
        console.log("Database connected successfully");
        connection.release();
    }
    catch (error) {
        console.error(" MySQL connection failed:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
exports.default = db;
//# sourceMappingURL=db.js.map