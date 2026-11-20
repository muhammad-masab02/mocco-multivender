import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

async function run() {
    try {
        const { default: connectDB } = await import("./src/db/index.js");
        const { seedCategoriesInternal } = await import("./src/controllers/category.controller.js");

        await connectDB();
        const res = await seedCategoriesInternal(true);
        console.log("Categories Seed Result:", res);
        process.exit(0);
    } catch (err) {
        console.error("Categories Seed Error:", err);
        process.exit(1);
    }
}

run();
