import mongoose from "mongoose";

export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is missing");
    }

    await mongoose.connect(uri);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}