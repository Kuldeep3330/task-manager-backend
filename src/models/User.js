import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  avatarUrl: String,
  role: { type: String, enum: ["user","admin"], default: "user" },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }]
}, { timestamps: true });

// hash password before save if modified
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("User", userSchema);
