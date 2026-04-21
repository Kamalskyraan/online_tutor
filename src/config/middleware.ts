import { Request, Response, NextFunction } from "express";
import { executeQuery, sendResponse } from "../utils/helper";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

var JWT_SECRET = process.env.JWT_SECRET || "abc@1234";

export interface AuthRequest extends Request {
  user?: {
    user_id: string;
    role?: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(200).json({
        status: 2,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.verify(token, JWT_SECRET);

    req.user = {
      user_id: decoded.user_id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(200).json({
      status: 0,
      message: "Invalid or expired token",
    });
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
        3,
        [],
        "Your account is blocked. Please submit justification.",
        [],
      );
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
