import dotenv from "dotenv";
import express, { Request, Response } from "express";
dotenv.config();
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./docs/swagger_output.json";
import router from "./routes";
import db, { connectDB } from "./config/db";
import { startDeleteCron } from "./config/cron";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors());

app.use("/api", router);

app.use("/uploads", express.static("uploads"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
const data = JSON.parse(fs.readFileSync("./public/country.json", "utf8"));

connectDB();
startDeleteCron();
app.listen(PORT, () => {
  console.log(`Server swimming on port ${PORT}`);
});
