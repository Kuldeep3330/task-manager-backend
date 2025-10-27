import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  description: { type: String },
  status: { type: String, enum: ["open","in_progress","completed","archived"], default: "open", index: true },
  priority: { type: String, enum: ["low","medium","high"], default: "medium" },
  dueDate: Date,
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attachment" }]
}, { timestamps: true });

taskSchema.index({ title: "text", description: "text" }); // for search

export default mongoose.model("Task", taskSchema);
