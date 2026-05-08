import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    industry: String,
    salary: String,
    category: {
      type: String,
      enum: ["Internship", "Part-time", "Full-time", "Freelance"],
      default: "Full-time"
    },
    skills: [String],
    expiryDate: Date,
    status: { type: String, enum: ["active", "expired", "closed"], default: "active" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", company: "text", skills: "text" });

export default mongoose.model("Job", jobSchema);
