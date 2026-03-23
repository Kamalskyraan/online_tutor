import { Request, Response } from "express";
import { sendResponse } from "../utils/helper";
import { nanoid } from "nanoid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../service/s3";
import fs from "fs/promises";
import { commonModel } from "../models/common.model";
import { Upload } from "@aws-sdk/lib-storage";

const cmnModel = new commonModel();

export class CommonController {
  static countryData = async (req: Request, res: Response) => {
    try {
      const file = await fs.readFile("./public/country.json", "utf8");
      const data = JSON.parse(file);
      let india: any = null;
      const others: any[] = [];

      data?.forEach((val: any) => {
        if (val.id === "0076") india = val;
        else others.push(val);
      });

      const finalData = india ? [india, ...others] : data;
      return sendResponse(
        res,
        200,
        1,
        finalData,
        "Country Data is fetched successfully",
        [],
      );
    } catch (err: any) {
      sendResponse(res, 500, 0, [], "Internal Server Error", []);
    }
  };
  static changeNumber = async (req: Request, res: Response) => {
    try {
      const { old_password, mobile } = req.body;
      if (!old_password) {
        return sendResponse(res, 200, 0, [], "Old Password is required", []);
      }
      // await
    } catch (err: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        "something went wrong",
        err.errors || err.message || err,
      );
    }
  };

  static uploadFile = async (req: Request, res: Response) => {
    try {
      const file = req.file as Express.MulterS3.File;

      if (!file) {
        return sendResponse(res, 200, 0, [], "file is required", []);
      }

      const uploadId = await cmnModel.saveUpload(file);

      return sendResponse(
        res,
        200,
        1,
        {
          id: uploadId,
          pathname: file.key,
          url: `${process.env.CLOUDFRONT_URL}/${file.key}`,
          org_name: file.originalname,
          file_size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
        },
        "Upload successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        "something went wrong",
        err.message || err,
      );
    }
  };

  static getUploadFiles = async (req: Request, res: Response) => {
    try {
      let { ids } = req.body;

      if (!ids) {
        return sendResponse(res, 200, 0, [], "Ids are required", []);
      }

      if (typeof ids === "string") {
        ids = ids.split(",").map((id: string) => Number(id.trim()));
      }

      if (typeof ids === "number") {
        ids = [ids];
      }

      ids = ids.map((id: any) => Number(id)).filter((id: number) => !isNaN(id));

      if (ids.length === 0) {
        return sendResponse(res, 200, 0, [], "Invalid ids", []);
      }

      const files = await cmnModel.getUploadFiles(ids);

      return sendResponse(
        res,
        200,
        1,
        files,
        "Assets are fetched successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        "Internal Server Error",
        err.errors || err.message || err,
      );
    }
  };
}
