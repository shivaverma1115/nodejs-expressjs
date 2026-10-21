import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { env } from '../config/env';
import { StorageProvider, StoredFile } from './types';

export class LocalStorage implements StorageProvider {
  async upload(file: Express.Multer.File): Promise<StoredFile> {
    const dir = path.resolve(env.UPLOAD_DIR);
    await mkdir(dir, { recursive: true });
    const ext = path.extname(file.originalname) || '';
    const filename = `${randomUUID()}${ext}`;
    const fullPath = path.join(dir, filename);
    await writeFile(fullPath, file.buffer);
    return {
      url: `/uploads/${filename}`,
      provider: 'local',
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }
}
