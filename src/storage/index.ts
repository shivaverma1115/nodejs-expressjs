import { env } from '../config/env';
import { CloudinaryStorage } from './cloudinary';
import { LocalStorage } from './local';
import { S3Storage } from './s3';
import { StorageProvider } from './types';

export function getStorageProvider(): StorageProvider {
  switch (env.STORAGE_PROVIDER) {
    case 'cloudinary':
      return new CloudinaryStorage();
    case 's3':
      return new S3Storage();
    default:
      return new LocalStorage();
  }
}
