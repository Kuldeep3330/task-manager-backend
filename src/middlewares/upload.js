import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random()*1e9);
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});
export const upload = multer({ storage });

