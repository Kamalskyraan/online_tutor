"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const doc = {
    info: {
        title: "Online Tutor",
        description: "Api Docs",
    },
    host: process.env.SWAGGER_HOST || "localhost:5001",
    schemes: [process.env.SWAGGER_SCHEME || "http"],
};
const outputFile = "./src/docs/swagger_output.json";
const endpointsFiles = ["../app.ts"];
(0, swagger_autogen_1.default)()(outputFile, endpointsFiles, doc);
//# sourceMappingURL=swagger.js.map