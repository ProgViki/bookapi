// src/routes/pdf.routes.ts
import { Router } from 'express';
import { htmlToPdf } from '../services/pdf.service';

const router = Router();

router.post('/from-html', async (req, res) => {
  try {
    const { html, fileName = 'document.pdf' } = req.body;
    const buffer = await htmlToPdf(html, { returnBuffer: true });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.send(buffer);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
