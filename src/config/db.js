import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export default async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set in env");
  await mongoose.connect(uri, { dbName: "taskmanager" });
  console.log("MongoDB connected");
}
