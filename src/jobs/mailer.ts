import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../config/logger';

function createTransport() {
  if (!env.SMTP_HOST) {
    return nodemailer.createTransport({ jsonTransport: true });
  }
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });
}

const transporter = createTransport();

export async function sendMail(payload: { to: string; subject: string; text: string }) {
  const info = await transporter.sendMail({
    from: env.MAIL_FROM,
    ...payload,
  });
  logger.info({ to: payload.to, messageId: info.messageId }, 'Mail sent (or logged in dev)');
}
