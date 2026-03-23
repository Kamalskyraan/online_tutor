import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";
dotenv.config();
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

swaggerAutogen()(outputFile, endpointsFiles, doc);
