import { DEFAULT_FROM, transporter } from "../utils/mailer";

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    path?: string;   // path to file on disk
    content?: Buffer | string;
    contentType?: string;
  }>;
}

class MailService {
  async sendEmail(params: SendEmailParams) {
    const info = await transporter.sendMail({
      from: params.from || DEFAULT_FROM,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
      cc: params.cc,
      bcc: params.bcc,
      attachments: params.attachments,
    });
    return { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected };
  }
}

export default new MailService();
