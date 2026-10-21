import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import path from 'path';
import { env } from '../config/env';
import { AppError } from '../common/errors/AppError';
import { HttpStatus } from '../common/constants/httpStatus';
import { StorageProvider, StoredFile } from './types';

export class S3Storage implements StorageProvider {
  private client: S3Client;

  constructor() {
    if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.AWS_S3_BUCKET) {
      throw new AppError('AWS S3 is not configured', HttpStatus.SERVICE_UNAVAILABLE);
    }
    this.client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async upload(file: Express.Multer.File): Promise<StoredFile> {
    const key = `uploads/${randomUUID()}${path.extname(file.originalname)}`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    return {
      url: `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`,
      provider: 's3',
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }
}
