import path from "path";
import fs from "fs";
import multer from "multer";
import { Request } from "express";
import { ApiError } from "../utils/ApiError";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

function imageFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest("Only image files are allowed"));
  }
}

export const uploadImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
