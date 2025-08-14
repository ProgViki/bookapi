// src/routes/mail.routes.ts
import { Router } from 'express';
import MailService from '../services/mail.service';

const router = Router();

router.post('/send', async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    const result = await MailService.sendEmail({ to, subject, text, html });
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
