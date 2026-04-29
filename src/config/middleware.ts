import { Request, Response, NextFunction } from "express";
import { executeQuery, sendResponse } from "../utils/helper";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthModel } from "../models/auth.model";
dotenv.config();

var JWT_SECRET = process.env.JWT_SECRET || "abc@1234";
const authModel = new AuthModel();
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

    if (!authHeader) {
      return sendResponse(
        res,
        200,
        3,
        [],
        "Access denied. No token provided",
        [],
      );
    }

    if (!authHeader.startsWith("Bearer ")) {
      return sendResponse(res, 200, 3, [], "Invalid token format", []);
    }

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.verify(token, JWT_SECRET);

    const device = await authModel.findUserDevice({
      user_id: decoded.user_id,
      device_id: decoded.device_id,
    });

    if (!device) {
      return sendResponse(
        res,
        200,
        3,
        [],
        "Session expired. Please login again",
        [],
      );
    }
    req.user = {
      user_id: decoded.user_id,
      role: decoded.role,
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

export const deletedCheckMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.user_id;

    if (!user_id) return next();

    const result: any = await executeQuery(
      `SELECT is_deleted FROM users WHERE user_id = ?`,
      [user_id],
    );

    if (result[0]?.is_deleted === 1) {
      return sendResponse(
        res,
        200,
        4,
        [],
        "Your account has been deleted. Please contact support.",
        [],
      );
    }

    next();
  } catch (err) {
    return sendResponse(res, 500, 0, [], "Internal Server Error", []);
  }
};
