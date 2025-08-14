// src/routes/upload.routes.ts
import { Router } from 'express';
import { uploadArray, uploadSingle } from '../utils/upload';

const router = Router();

router.post('/single', uploadSingle('file'), (req, res) => {
  res.json({ file: req.file, url: `/uploads/${req.file?.filename}` });
});

router.post('/multi', uploadArray('files', 10), (req, res) => {
  res.json({
    count: (req.files as Express.Multer.File[]).length,
    files: (req.files as Express.Multer.File[]).map(f => ({ ...f, url: `/uploads/${f.filename}` })),
  });
});

export default router;
