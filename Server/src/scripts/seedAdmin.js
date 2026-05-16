import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const email = process.env.ADMIN_EMAIL || "admin@portal.com";
const password = process.env.ADMIN_PASSWORD || "HireNest@2026#Admin";

await connectDB();

const existing = await User.findOne({ email });

if (existing) {
  existing.name = existing.name || "Portal Admin";
  existing.role = "admin";
  existing.status = "approved";
  existing.password = password;
  await existing.save();
  console.log(`Admin updated: ${email}`);
  process.exit(0);
}

await User.create({
  name: "Portal Admin",
  email,
  password,
  role: "admin",
  status: "approved"
});

console.log(`Admin created: ${email}`);
process.exit(0);
