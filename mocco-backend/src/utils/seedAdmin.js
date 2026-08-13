import mongoose from "mongoose";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

/**
 * Seeds the initial admin user from environment variables.
 *
 * Required env vars:
 *   ADMIN_NAME     - Admin display name
 *   ADMIN_EMAIL    - Admin email (used for login)
 *   ADMIN_PASSWORD - Admin password (min 4 chars)
 *
 * The seed will:
 *   1. Check if any admin user already exists → skip if so.
 *   2. Create the user with role:"admin" and a default avatar.
 *   3. No email verification required — admin is created directly.
 *
 * Run via: npm run seed:admin
 */
const seedAdmin = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn(
      "[seedAdmin] ADMIN_EMAIL and ADMIN_PASSWORD are not set in .env — skipping admin seed."
    );
    return;
  }

  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    console.log(`[seedAdmin] Admin already exists (${existingAdmin.email}) — skipping.`);
    return;
  }

  const admin = await User.create({
    name: ADMIN_NAME || "Admin",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
    avatar: {
      public_id: "default-avatar",
      url: "https://dummyimage.com/200x200/e2e8f0/64748b.png&text=Admin",
    },
  });

  console.log(`[seedAdmin] Admin user created: ${admin.email}`);
};

export default seedAdmin;
