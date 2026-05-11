import User from "../models/User.js";

export async function ensureAdminUser() {
  const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  const existing = await User.findOne({ email });

  if (!existing) {
    await User.create({
      name: "Portal Admin",
      email,
      password,
      role: "admin",
      status: "approved"
    });
    console.log(`Admin user created: ${email}`);
    return;
  }

  let changed = false;

  if (existing.role !== "admin") {
    existing.role = "admin";
    changed = true;
  }

  if (existing.status !== "approved") {
    existing.status = "approved";
    changed = true;
  }

  if (!(await existing.matchPassword(password))) {
    existing.password = password;
    changed = true;
  }

  if (changed) {
    await existing.save();
    console.log(`Admin user updated: ${email}`);
  }
}
