import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../service/s3";
import path from "path";
import { Request } from "express";

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.BUCKET_NAME as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: any, key?: string) => void,
    ) => {
      let folder = "";

      if (file.mimetype.startsWith("image/")) {
        folder = "image";
      } else if (file.mimetype.startsWith("video/")) {
        folder = "video";
      } else if (file.mimetype === "application/pdf") {
        folder = "pdf";
      } else if (
        file.mimetype === "application/msword" ||
        file.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        folder = "docs";
      } else {
        return cb(new Error("Invalid file type"));
      }

      const uniqueName =
        folder +
        "/" +
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname);

      cb(null, uniqueName);
    },
  }),

  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});
