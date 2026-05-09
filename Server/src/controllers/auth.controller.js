import User from "../models/User.js";
import { uploadResumeToCloudinary } from "../utils/cloudinary.js";
import { signToken } from "../utils/token.js";

export async function registerUser(req, res, next) {
  try {
    const { name, password, companyName } = req.body;
    const email = String(req.body.email || "").trim().toLowerCase();
    const role = req.body.role === "hr" ? "hr" : "student";
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      status: role === "hr" ? "pending" : "approved",
      companyProfile: role === "hr" ? { companyName } : undefined
    });

    res.status(201).json({
      token: signToken(user),
      user: user.toObject({
        versionKey: false,
        transform: (_doc, ret) => {
          delete ret.password;
          return ret;
        }
      })
    });
  } catch (error) {
    next(error);
  }
}

export async function loginUser(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const { password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = user.toObject();
    delete payload.password;

    res.json({ token: signToken(user), user: payload });
  } catch (error) {
    next(error);
  }
}

export function getCurrentUser(req, res) {
  res.json(req.user);
}

export async function updateProfile(req, res, next) {
  try {
    const updates = { ...req.body };
    const listFromText = (value) => String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (typeof updates.skills === "string") {
      updates["studentProfile.skills"] = listFromText(updates.skills);
      delete updates.skills;
    }

    if (typeof updates.softSkills === "string") {
      updates["studentProfile.softSkills"] = listFromText(updates.softSkills);
      delete updates.softSkills;
    }

    for (const field of [
      "experience",
      "education",
      "degree",
      "college",
      "passingYear",
      "cgpa",
      "internships",
      "partTimeJobs",
      "freelanceWork",
      "role",
      "companyName",
      "duration",
      "responsibilities",
      "linkedIn",
      "github",
      "portfolio"
    ]) {
      if (field in updates) {
        updates[`studentProfile.${field}`] = updates[field];
        delete updates[field];
      }
    }

    for (const field of ["companyName", "website", "industry", "description"]) {
      if (updates[field]) {
        updates[`companyProfile.${field}`] = updates[field];
        delete updates[field];
      }
    }

    if (req.file) {
      updates["studentProfile.resumeUrl"] = await uploadResumeToCloudinary(req.file);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select("-password");

    res.json(user);
  } catch (error) {
    next(error);
  }
}
