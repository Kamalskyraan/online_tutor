import { Request, Response, NextFunction } from "express";
import { executeQuery, sendResponse } from "../utils/helper";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthModel } from "../models/auth.model";
dotenv.config();

var JWT_SECRET = process.env.JWT_SECRET || "abc@1234";
const authMdl = new AuthModel();
export interface AuthRequest extends Request {
  user?: {
    user_id: string;
    role?: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check header exists
    if (!authHeader) {
      return sendResponse(
        res,
        200,
        3,
        {},
        "Access denied. No token provided",
        [],
      );
    }

    if (!authHeader.startsWith("Bearer ")) {
      return sendResponse(res, 200, 3, {}, "Invalid token format", []);
    }

    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 4. Attach user
    req.user = {
      user_id: decoded.user_id,
      role: decoded.device_id,
    };

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return sendResponse(res, 200, 3, [], "Token expired", []);
    }

    if (err.name === "JsonWebTokenError") {
      return sendResponse(res, 200, 3, [], "Invalid token", []);
    }
    return sendResponse(res, 500, 0, [], "Internal Server Error", []);
  }
};

export const blockCheckMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.user_id;

    if (!user_id) return next();

    const result: any = await executeQuery(
      `SELECT is_blocked FROM users WHERE user_id = ?`,
      [user_id],
    );

    if (result[0]?.is_blocked === 1) {
      return sendResponse(
        res,
        200,
        2,
        [],
        "Your account is blocked. Please submit justification.",
        [],
      );
    }

    next();
  } catch (err) {
    return sendResponse(res, 500, 0, [], "Internal Server Error", []);
  }
};
