"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFile = exports.completeMultipartUpload = exports.getMultipartSignedUrl = exports.startMultipartUpload = void 0;
const s3_1 = require("../service/s3");
const helper_1 = require("../utils/helper");
const nanoid_1 = require("nanoid");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const FOLDERS = {
    image: "images",
    video: "videos",
    pdf: "pdfs",
};
const startMultipartUpload = async (req, res) => {
    const { fileType, category } = req.body;
    if (!category || !fileType) {
        return (0, helper_1.sendResponse)(res, 200, 0, [], "Missing Fields", []);
    }
    const ext = fileType.split("/")[1];
    const key = `${FOLDERS[category]}/${(0, nanoid_1.nanoid)(8)}.${ext}`;
    const command = new client_s3_1.CreateMultipartUploadCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        ContentType: fileType,
    });
    const data = await s3_1.s3.send(command);
    return (0, helper_1.sendResponse)(res, 200, 1, [data.UploadId, key], "File Upload Successfully", []);
};
exports.startMultipartUpload = startMultipartUpload;
const getMultipartSignedUrl = async (req, res) => {
    const { uploadId, key, partNumber } = req.body;
    const command = new client_s3_1.UploadPartCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
    });
    const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3_1.s3, command, {
        expiresIn: 60,
    });
    res.json({ signedUrl });
};
exports.getMultipartSignedUrl = getMultipartSignedUrl;
const completeMultipartUpload = async (req, res) => {
    const { uploadId, key, parts } = req.body;
    const command = new client_s3_1.CompleteMultipartUploadCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: { Parts: parts },
    });
    await s3_1.s3.send(command);
    res.json({ success: true });
};
exports.completeMultipartUpload = completeMultipartUpload;
const getFile = async (req, res) => {
    try {
        const { id } = req.body;
        const [rows] = await (0, helper_1.executeQuery)(`SELECT * FROM media WHERE id = ?`, [id]);
        const file = rows[0];
        const url = `${process.env.CLOUDFRONT_URL}/${file.s3_key}`;
        return (0, helper_1.sendResponse)(res, 200, 1, [...file, url], "File fetched successfully", []);
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Something went wrong", err.errors || err.message || err);
    }
};
exports.getFile = getFile;
//# sourceMappingURL=upload.js.map