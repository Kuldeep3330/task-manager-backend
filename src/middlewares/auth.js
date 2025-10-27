import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
