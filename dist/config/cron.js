"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDeleteCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const helper_1 = require("../utils/helper");
const startDeleteCron = () => {
    node_cron_1.default.schedule("0 2 * * *", async () => {
        try {
            console.log("Running delete cleanup cron...");
            await (0, helper_1.executeQuery)(`
        UPDATE users
        SET is_deleted = 2
        WHERE is_deleted = 1
        AND deleted_at < NOW() - INTERVAL 30 DAY
      `);
            console.log("Delete cleanup completed");
        }
        catch (err) {
            console.error("Cron error:", err);
        }
    });
};
exports.startDeleteCron = startDeleteCron;
//# sourceMappingURL=cron.js.map