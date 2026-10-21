import { Queue, Worker } from 'bullmq';
import { logger } from '../config/logger';
import { getRedis } from '../cache/redis';
import { sendMail } from './mailer';

export const QUEUE_NAMES = {
  EMAIL: 'email',
  IMAGE: 'image',
} as const;

type EmailJob = {
  to: string;
  subject: string;
  text: string;
};

type ImageJob = {
  url: string;
  originalName: string;
};

let emailQueue: Queue<EmailJob> | null = null;
let imageQueue: Queue<ImageJob> | null = null;
const workers: Worker[] = [];

export function getEmailQueue() {
  return emailQueue;
}

export function getImageQueue() {
  return imageQueue;
}

export async function startJobs() {
  const connection = getRedis();
  if (!connection) {
    logger.warn('BullMQ workers not started (Redis unavailable)');
    return;
  }

  emailQueue = new Queue<EmailJob>(QUEUE_NAMES.EMAIL, { connection });
  imageQueue = new Queue<ImageJob>(QUEUE_NAMES.IMAGE, { connection });

  const emailWorker = new Worker<EmailJob>(
    QUEUE_NAMES.EMAIL,
    async (job) => {
      await sendMail(job.data);
      logger.info({ jobId: job.id, to: job.data.to }, 'Email job completed');
    },
    { connection },
  );

  const imageWorker = new Worker<ImageJob>(
    QUEUE_NAMES.IMAGE,
    async (job) => {
      logger.info({ jobId: job.id, url: job.data.url }, 'Image processing stub completed');
    },
    { connection },
  );

  emailWorker.on('failed', (job, err) => logger.error({ err, jobId: job?.id }, 'Email job failed'));
  imageWorker.on('failed', (job, err) => logger.error({ err, jobId: job?.id }, 'Image job failed'));

  workers.push(emailWorker, imageWorker);
  logger.info('BullMQ workers started');
}

export async function enqueueEmail(data: EmailJob) {
  if (!emailQueue) {
    logger.warn({ to: data.to, subject: data.subject }, 'Email queue unavailable — logging payload only');
    logger.info({ email: data }, 'Email fallback');
    return;
  }
  await emailQueue.add('send', data);
}

export async function enqueueImage(data: ImageJob) {
  if (!imageQueue) {
    logger.info({ image: data }, 'Image job skipped (queue unavailable)');
    return;
  }
  await imageQueue.add('process', data);
}

export async function closeJobs() {
  await Promise.all(workers.map((worker) => worker.close()));
  await emailQueue?.close();
  await imageQueue?.close();
  workers.length = 0;
  emailQueue = null;
  imageQueue = null;
}
