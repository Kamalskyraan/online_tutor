import dotenv from "dotenv";
import express, { Request, Response } from "express";
dotenv.config();
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./docs/swagger_output.json";
import router from "./routes";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api", router);
app.use("/uploads", express.static("uploads"));

// connectDB();
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/check", (req, res) => {
  res.send("hiii");
});

const data = JSON.parse(fs.readFileSync("./public/country.json", "utf8"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
