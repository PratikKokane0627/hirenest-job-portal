import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hr: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resumeUrl: String,
    coverLetter: String,
    status: {
      type: String,
      enum: ["applied", "shortlisted", "interview", "offered", "rejected"],
      default: "applied"
    },
    interview: {
      scheduledAt: Date,
      mode: String,
      link: String,
      notes: String
    },
    offerLetter: {
      title: String,
      body: String,
      sentAt: Date
    },
    offerLetterUrl: String
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, student: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
