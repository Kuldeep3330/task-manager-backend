import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
  filename: String,
  mimetype: String,
  size: Number,
  url: String, ///uploads/...
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Attachment", attachmentSchema);

