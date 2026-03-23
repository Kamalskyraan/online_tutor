import { Response } from "express";
import db from "../config/db";
import Joi from "joi";
import { nanoid } from "nanoid";
import fs from "fs/promises";
export const sendResponse = (
  res: Response,
  statusCode: number,
  success: number,
  data: any = [],
  message: string = "",
  error: any = [],
) => {
  return res.status(statusCode).json({
    success,
    data,
    message,
    error,
  });
};

export async function executeQuery(
  sql: string,
  params: Record<string, any> = {},
): Promise<any> {
  try {
    const [results] = await db.query(sql, params);
    return results;
  } catch (error) {
    throw error;
  }
}

interface ValidationError extends Error {
  status?: number;
  errors?: string;
}

export const validateRequest = (data: any, schema: Joi.ObjectSchema): any => {
  const { error, value } = schema.validate(data, {
    abortEarly: true,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((err) => err.message).join(", ");

    const errorObject: ValidationError = new Error("Validation Error");
    errorObject.status = 200;
    errorObject.errors = errorMessages;

    throw errorObject;
  }

  return value;
};

export const generateOTP = (): string => {
  const otp =
    process.env.NODE_ENV === "development"
      ? "1234"
      : Math.floor(Math.random() * 9000).toString();
  return otp;
};

export const getOTPExpiry = (): Date => {
  const minutes = process.env.NODE_ENV === "development" ? 0.5 : 0.3;
  return new Date(Date.now() + minutes * 60 * 1000);
};

export const generateUserId = (): string => {
  return `USER_${nanoid(8)}`;
};

export const generateTutorId = (): string => {
  return `TUTOR_${nanoid(8)}`;
};

export const generateStudentId = (): string => {
  return `STUDENT_${nanoid(8)}`;
};

export const safeJSONParse = (value: string | null): string[] => {
  try {
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};

export const fetchCountryName = async (country_code: string) => {
  const file = await fs.readFile("./public/country.json", "utf8");
  const countries = JSON.parse(file);

  const country = countries.find((item: any) => {
    item.dial_code == country_code;
  });

  return country ? country.name : null;
};

export const convertNullToString = <T>(data: T): T => {
  if (Array.isArray(data)) {
    return data.map((item) => convertNullToString(item)) as T;
  }
  if (data != null && typeof data === "object") {
    const result: any = {};
    Object.keys(data).forEach((key) => {
      const value = (data as any)[key];
      if (value === null) {
        result[key] = "";
      } else if (typeof value === "object") {
        result[key] = convertNullToString(value);
      } else {
        result[key] = value;
      }
    });
    return result;
  }
  return data;
};


