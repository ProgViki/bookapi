import nodemailer from 'nodemailer';

const {
  SMTP_HOST = 'smtp.gmail.com',
  SMTP_PORT = '587',
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE = 'false', // 'true' to force TLS
  SMTP_FROM,
} = process.env;

if (!SMTP_USER || !SMTP_PASS) {
  // You can still start the app; just log a warning.
  console.warn('[mailer] SMTP_USER/SMTP_PASS not set. Emails will fail.');
}

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_SECURE === 'true', // true for 465, false for 587/STARTTLS
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const DEFAULT_FROM = SMTP_FROM || `No-Reply <${SMTP_USER || 'noreply@example.com'}>`;
