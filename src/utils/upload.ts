import path from 'path';
import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

// Ensure upload directory exists
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Configure storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '_').toLowerCase();
    const ext = path.extname(safeName);
    const base = path.basename(safeName, ext);
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

// Optional: restrict mime types (adjust to your needs)
const allowed = (process.env.UPLOAD_MIME_WHITELIST || 'image/jpeg,image/png,application/pdf')
  .split(',')
  .map((s) => s.trim());

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error(`Unsupported file type: ${file.mimetype}`));
};

// Limits (adjust as needed)
const limits: multer.Options['limits'] = {
  fileSize: Number(process.env.UPLOAD_MAX_BYTES || 5 * 1024 * 1024), // default 5MB
};

export const upload = multer({ storage, fileFilter, limits });

// Helpers for routes
export const uploadSingle = (field = 'file') => upload.single(field);
export const uploadArray = (field = 'files', maxCount = 5) => upload.array(field, maxCount);

export const UPLOADS_PUBLIC_PATH = UPLOAD_DIR;
