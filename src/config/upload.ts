import { Request, Response } from "express";
import { s3 } from "../service/s3";
import { executeQuery, sendResponse } from "../utils/helper";
import { nanoid } from "nanoid";
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { StartUploadBody } from "../interface/interface";

type UploadCategory = "image" | "video" | "pdf";

const FOLDERS: Record<UploadCategory, string> = {
  image: "images",
  video: "videos",
  pdf: "pdfs",
};

export const startMultipartUpload = async (
  req: Request<{}, {}, StartUploadBody>,
  res: Response,
) => {
  const { fileType, category } = req.body;

  if (!category || !fileType) {
    return sendResponse(res, 200, 0, [], "Missing Fields", []);
  }

  const ext = fileType.split("/")[1];
  const key = `${FOLDERS[category]}/${nanoid(8)}.${ext}`;

  const command = new CreateMultipartUploadCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
  });

  const data = await s3.send(command);

  return sendResponse(
    res,
    200,
    1,
    [data.UploadId, key],
    "File Upload Successfully",
    [],
  );
};

export const getMultipartSignedUrl = async (req: Request, res: Response) => {
  const { uploadId, key, partNumber } = req.body;

  const command = new UploadPartCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
  });

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 60,
  });

  res.json({ signedUrl });
};

export const completeMultipartUpload = async (req: Request, res: Response) => {
  const { uploadId, key, parts } = req.body;

  const command = new CompleteMultipartUploadCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
  });

  await s3.send(command);

  res.json({ success: true });
};

export const getFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const [rows] = await executeQuery(`SELECT * FROM media WHERE id = ?`, [id]);
    const file = rows[0];
    const url = `${process.env.CLOUDFRONT_URL}/${file.s3_key}`;

    return sendResponse(
      res,
      200,
      1,
      [...file, url],
      "File fetched successfully",
      [],
    );
  } catch (err: any) {
    return sendResponse(
      res,
      500,
      0,
      [],
      "Something went wrong",
      err.errors || err.message || err,
    );
  }
};
