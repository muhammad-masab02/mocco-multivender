/**
 * Standalone admin seed entry point.
 * Run with: npm run seed:admin
 *
 * Requires in .env:
 *   ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, MONGODB_URI (or MONGO_URI)
 */
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import connectDB from "./src/db/index.js";
import seedAdmin from "./src/utils/seedAdmin.js";

(async () => {
  await connectDB();
  await seedAdmin();
  console.log("[seed:admin] Done.");
  process.exit(0);
})();
