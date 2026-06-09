"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
exports.s3 = new client_s3_1.S3Client({
    // ot name change
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.IO_ACCESS_KEY_ID,
        secretAccessKey: process.env.IO_SECRET_ACCESS_KEY,
    },
});
//# sourceMappingURL=s3.js.map