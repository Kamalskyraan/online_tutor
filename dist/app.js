"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const fs_1 = __importDefault(require("fs"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./docs/swagger_output.json"));
const routes_1 = __importDefault(require("./routes"));
const db_1 = require("./config/db");
const cron_1 = require("./config/cron");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
//  authMiddleware, blockCheckMiddleware,
app.use("/api", routes_1.default);
app.use("/uploads", express_1.default.static("uploads"));
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default));
app.get("/check", (req, res) => {
    res.send("hiii");
});
const data = JSON.parse(fs_1.default.readFileSync("./public/country.json", "utf8"));
(0, db_1.connectDB)();
(0, cron_1.startDeleteCron)();
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map