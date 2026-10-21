export type StoredFile = {
  url: string;
  provider: 'local' | 'cloudinary' | 's3';
  originalName: string;
  mimeType: string;
  size: number;
};

export interface StorageProvider {
  upload(file: Express.Multer.File): Promise<StoredFile>;
}
