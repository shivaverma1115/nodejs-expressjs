import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';
import { AppError } from '../common/errors/AppError';
import { HttpStatus } from '../common/constants/httpStatus';
import { StorageProvider, StoredFile } from './types';

export class CloudinaryStorage implements StorageProvider {
  constructor() {
    if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
      throw new AppError('Cloudinary is not configured', HttpStatus.SERVICE_UNAVAILABLE);
    }
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }

  async upload(file: Express.Multer.File): Promise<StoredFile> {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'interview-api' }, (error, uploaded) => {
        if (error || !uploaded) {
          reject(error ?? new Error('Cloudinary upload failed'));
          return;
        }
        resolve(uploaded);
      });
      stream.end(file.buffer);
    });

    return {
      url: result.secure_url,
      provider: 'cloudinary',
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }
}
