import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["student", "hr", "admin"], default: "student" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
    phone: String,
    location: String,
    studentProfile: {
      skills: [String],
      softSkills: [String],
      experience: String,
      education: String,
      degree: String,
      college: String,
      passingYear: String,
      cgpa: String,
      internships: String,
      partTimeJobs: String,
      freelanceWork: String,
      role: String,
      companyName: String,
      duration: String,
      responsibilities: String,
      linkedIn: String,
      github: String,
      portfolio: String,
      resumeUrl: String,
      savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }]
    },
    companyProfile: {
      companyName: String,
      website: String,
      industry: String,
      description: String
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function matchPassword(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
