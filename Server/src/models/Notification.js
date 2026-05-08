import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    body: String,
    type: { type: String, default: "info" },
    readAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
