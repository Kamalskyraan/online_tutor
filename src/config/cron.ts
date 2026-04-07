import cron from "node-cron";
import { executeQuery } from "../utils/helper";
export const startDeleteCron = () => {
  cron.schedule("0 2 * * *", async () => {
    try {
      console.log("Running delete cleanup cron...");

      await executeQuery(`
        UPDATE users
        SET is_deleted = 2
        WHERE is_deleted = 1
        AND deleted_at < NOW() - INTERVAL 30 DAY
      `);

      console.log("Delete cleanup completed");
    } catch (err) {
      console.error("Cron error:", err);
    }
  });
};
