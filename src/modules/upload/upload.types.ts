export type UploadResult = {
  url: string;
  provider: 'local' | 'cloudinary' | 's3';
  originalName: string;
  mimeType: string;
  size: number;
};
